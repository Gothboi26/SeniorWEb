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

// 📍 Custom icon
const customIcon = new L.Icon({
  iconUrl: "/icons/marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

// 📍 Bounds for Valenzuela
const valenzuelaBounds = [
  [14.6500, 120.9000],
  [14.7700, 121.0300]
];

const barangayHallCoords = [14.6861, 120.9955];

const Routing = ({ destination }) => {
  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {
    if (!destination) return;

    if (routingRef.current) {
      try {
        if (routingRef.current.getPlan) {
          routingRef.current.getPlan().setWaypoints([]);
        }
        if (map.hasLayer(routingRef.current)) {
          map.removeControl(routingRef.current);
        }
      } catch (err) {
        console.warn("Error removing old route:", err);
      }
      routingRef.current = null;
    }

    document.querySelectorAll(".leaflet-routing-container").forEach(el => el.remove());

    const control = L.Routing.control({
      waypoints: [L.latLng(barangayHallCoords), L.latLng(destination)],
      lineOptions: {
        styles: [{ color: "maroon", weight: 6 }]
      },
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
  }, [destination, map]);

  return null;
};

const MapSelector = ({ onClose, onSelect, initialPosition = null }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [markerPosition, setMarkerPosition] = useState(null);
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
      console.error("Geocode error:", err);
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
          setPendingSelection({ lat, lng, address: data.display_name });
          setSelectedAddress(data.display_name);
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
          })
          .catch(err => {
            console.error("Map click failed:", err);
            alert("Click error.");
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
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {!initialPosition && <MapClickHandler />}

            {/* Barangay Hall Marker */}
            <Marker position={barangayHallCoords}>
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <h4>Barangay Tiburcio De Leon Hall</h4>
                  <img
                    src={logo}
                    alt="Barangay Hall"
                    style={{
                      width: "100%",
                      maxWidth: "200px",
                      borderRadius: "8px"
                    }}
                  />
                </div>
              </Popup>
            </Marker>

            {/* 🚓 Police Stations */}
            <Marker position={[14.7012, 120.9815]}>
              <Popup><strong>Valenzuela Police Station</strong><br />MacArthur Highway</Popup>
            </Marker>
            <Marker position={[14.7161, 121.0134]}>
              <Popup><strong>Police Substation – Gen. T. De Leon</strong><br />Paso de Blas</Popup>
            </Marker>

            {/* 🚑 Health Centers */}
            <Marker position={[14.6890, 120.9950]}>
              <Popup><strong>Barangay Health Center</strong><br />Gen. T. De Leon</Popup>
            </Marker>
            <Marker position={[14.7055, 120.9875]}>
              <Popup><strong>Valenzuela City Health Office</strong><br />Karuhatan</Popup>
            </Marker>

            {/* 🚒 Fire Stations */}
            <Marker position={[14.6885, 120.9928]}>
              <Popup><strong>Valenzuela Fire Station</strong><br />Maysan Road</Popup>
            </Marker>
            <Marker position={[14.7173, 121.0001]}>
              <Popup><strong>Fire Substation – Malinta</strong><br />MacArthur Highway</Popup>
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
                <Routing destination={markerPosition} />
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
