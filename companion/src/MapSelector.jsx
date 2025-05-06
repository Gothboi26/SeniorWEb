// ✅ Full revised MapSelector.jsx with dynamic nearest station by emergency type
import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "./MapSelector.css";
import logo from "./assets/logo.png";

const customIcon = new L.Icon({
  iconUrl: "/icons/marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

const valenzuelaBounds = [
  [14.6500, 120.9000],
  [14.7700, 121.0300]
];

const barangayHallCoords = [14.6861, 120.9955];

const STATIONS = {
  fire: [
    { name: "Valenzuela Fire Station", coords: [14.6885, 120.9928] },
    { name: "Fire Substation – Malinta", coords: [14.7173, 121.0001] }
  ],
  police: [
    { name: "Valenzuela Police Station", coords: [14.7012, 120.9815] },
    { name: "Police Substation – Gen. T. De Leon", coords: [14.7161, 121.0134] }
  ],
  health: [
    { name: "Barangay Health Center", coords: [14.6890, 120.9950] },
    { name: "Valenzuela City Health Office", coords: [14.7055, 120.9875] }
  ]
};

const getNearestStation = (type, targetCoords) => {
  const stations = STATIONS[type] || [];
  let minDist = Infinity;
  let nearest = null;
  for (const station of stations) {
    const dist = Math.sqrt(
      Math.pow(station.coords[0] - targetCoords[0], 2) +
      Math.pow(station.coords[1] - targetCoords[1], 2)
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = station;
    }
  }
  return nearest;
};

const Routing = ({ origin, destination }) => {
  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {
    if (!origin || !destination) return;

    if (routingRef.current) {
      try {
        routingRef.current.getPlan()?.setWaypoints([]);
        map.removeControl(routingRef.current);
      } catch (err) {
        console.warn("Error removing old route:", err);
      }
      routingRef.current = null;
    }

    document.querySelectorAll(".leaflet-routing-container").forEach(el => el.remove());

    const control = L.Routing.control({
      waypoints: [L.latLng(origin), L.latLng(destination)],
      lineOptions: { styles: [{ color: "maroon", weight: 6 }] },
      showAlternatives: false,
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      createMarker: () => null
    }).addTo(map);

    routingRef.current = control;

    return () => {
      try {
        if (routingRef.current && map.hasLayer(routingRef.current)) {
          map.removeControl(routingRef.current);
        }
      } catch (err) {
        console.warn("Cleanup failed:", err);
      }
      routingRef.current = null;
    };
  }, [origin, destination, map]);

  return null;
};

const MapSelector = ({ onClose, onSelect, initialPosition = null, emergencyType = "fire" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [routeOrigin, setRouteOrigin] = useState(barangayHallCoords);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const mapRef = useRef(null);

  useEffect(() => {
    if (initialPosition) {
      setMarkerPosition([initialPosition.lat, initialPosition.lng]);
      setSelectedAddress(initialPosition.address || "Selected Location");
    }
  }, [initialPosition]);

  useEffect(() => {
    if (mapRef.current) {
      if (markerPosition) {
        mapRef.current.setView(markerPosition, 17);
      } else {
        mapRef.current.setView(barangayHallCoords, 17);
      }
    }
  }, [markerPosition]);

  const tryGeocode = async (query) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=ph`);
    return await res.json();
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) return setSuggestions([]);

    const cleaned = query
      .replace(/St\./gi, "Street")
      .replace(/\d{4,}/g, "")
      .replace(/[^a-zA-Z0-9\s,]/g, "")
      .trim();

    const baseQuery = cleaned.split(",")[0];
    const fullQuery = `${cleaned} Valenzuela City`;
    const fallbackQuery = `${baseQuery} Barangay General Tiburcio De Leon, Valenzuela City`;

    try {
      let result = await tryGeocode(fullQuery);
      if (!result.length) result = await tryGeocode(fallbackQuery);
      if (!result.length) result = await tryGeocode("Barangay General Tiburcio De Leon, Valenzuela City");
      setSuggestions(result);
    } catch (err) {
      alert("Search failed. Please check internet.");
    }
  };

  const selectLocation = (lat, lng, address) => {
    const pos = [lat, lng];
    setMarkerPosition(pos);
    setSearchQuery(address);
    setSuggestions([]);
    mapRef.current?.flyTo(pos, 17);
    setPendingSelection({ lat, lng, address });
    setSelectedAddress(address);

    const nearestStation = getNearestStation(emergencyType, pos);
    if (nearestStation) {
      setRouteOrigin(nearestStation.coords);
    }
  };

  const handleSuggestionClick = (place) => {
    selectLocation(parseFloat(place.lat), parseFloat(place.lon), place.display_name);
  };

  const handleMarkerDrag = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setMarkerPosition([lat, lng]);

    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(data => {
        if (data?.address?.city === "Valenzuela") {
          selectLocation(lat, lng, data.display_name);
        } else {
          alert("Only Valenzuela locations allowed.");
        }
      });
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
          .then(res => res.json())
          .then(data => {
            if (data?.address?.city === "Valenzuela") {
              selectLocation(lat, lng, data.display_name);
            } else {
              alert("Only Valenzuela locations allowed.");
            }
          });
      }
    });
    return null;
  };

  const handleConfirm = () => {
    if (pendingSelection) {
      onSelect(pendingSelection);
      setPendingSelection(null);
    }
  };

  const handleCancel = () => {
    setPendingSelection(null);
    setMarkerPosition(null);
    setSelectedAddress("");
  };

  return (
    <div className="map-modal-overlay">
      <div className="map-modal">
        <div className="map-modal-header">
          <h3>Emergency Location</h3>
          <button className="close-map-btn" onClick={onClose}>×</button>
        </div>

        {!initialPosition && (
          <input
            className="search-bar"
            type="text"
            placeholder="Search in Valenzuela"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        )}

        {suggestions.length > 0 && (
          <ul className="search-results">
            {suggestions.map((s, i) => (
              <li key={i} onClick={() => handleSuggestionClick(s)}>
                {s.display_name}
              </li>
            ))}
          </ul>
        )}

        <div className="map-container">
          <MapContainer
            center={barangayHallCoords}
            zoom={17}
            style={{ height: "100%", width: "100%" }}
            maxBounds={valenzuelaBounds}
            maxBoundsViscosity={1.0}
            whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {!initialPosition && <MapClickHandler />}

            <Marker position={barangayHallCoords}>
              <Popup>
                <strong>Barangay Tiburcio De Leon Hall</strong>
              </Popup>
            </Marker>

            {markerPosition && (
              <>
                <Marker
                  position={markerPosition}
                  icon={customIcon}
                  draggable={!initialPosition}
                  eventHandlers={!initialPosition ? { dragend: handleMarkerDrag } : {}}
                >
                  <Popup>{pendingSelection?.address || selectedAddress || "Selected Location"}</Popup>
                </Marker>
                <Routing origin={routeOrigin} destination={markerPosition} />
              </>
            )}
          </MapContainer>
        </div>

        {pendingSelection && (
          <div className="toast-notification">
            <div>
              <strong>📍 Use this location?</strong>
              <div className="location-name">{pendingSelection.address}</div>
            </div>
            <div>
              <button onClick={handleConfirm}>✅ Confirm</button>
              <button onClick={handleCancel}>❌ Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSelector;
