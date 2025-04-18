import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapSelector.css";

// 📍 Custom maroon marker icon
const customIcon = new L.Icon({
  iconUrl: "/icons/marker-maroon.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

// 🗺️ Bounding box for Valenzuela
const valenzuelaBounds = [
  [14.6500, 120.9000], // Southwest
  [14.7700, 121.0300], // Northeast
];

const MapSelector = ({ onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [markerPosition, setMarkerPosition] = useState(null);
  const mapRef = useRef(null);

  const tryGeocode = async (query) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=ph`
    );
    return await res.json();
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) return setSuggestions([]);

    const cleaned = query
      .replace(/St\./gi, "Street")
      .replace(/\d{4,}/g, "") // remove zip
      .replace(/[^a-zA-Z0-9\s,]/g, "") // remove special chars
      .trim();

    const baseQuery = cleaned.split(",")[0];
    let fullQuery = `${cleaned} Valenzuela City`;
    let fallbackQuery = `${baseQuery} Barangay General Tiburcio De Leon, Valenzuela City`;

    try {
      let result = await tryGeocode(fullQuery);
      if (!result.length) result = await tryGeocode(fallbackQuery);
      if (!result.length) result = await tryGeocode("Barangay General Tiburcio De Leon, Valenzuela City");

      setSuggestions(result);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Search failed. Check your internet connection.");
    }
  };

  const selectLocation = (lat, lng, display_name) => {
    const newPos = [lat, lng];
    setMarkerPosition(newPos);
    setSearchQuery(display_name);
    setSuggestions([]);
    mapRef.current?.flyTo(newPos, 17);
    onSelect({ lat, lng, address: display_name });
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
          onSelect({ lat, lng, address: data.display_name });
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
              alert("Please select a location within Valenzuela.");
            }
          })
          .catch(err => {
            console.error("Map click error", err);
            alert("Map click failed.");
          });
      }
    });
    return null;
  };

  return (
    <div className="map-modal-overlay">
      <div className="map-modal">
        <button className="close-map-btn" onClick={onClose}>×</button>

        <input
          className="search-bar"
          type="text"
          placeholder="Search address in Valenzuela"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {suggestions.length > 0 && (
          <ul className="search-results">
            {suggestions.map((s, i) => (
              <li key={i} onClick={() => handleSuggestionClick(s)}>{s.display_name}</li>
            ))}
          </ul>
        )}

        <div className="map-container">
          <MapContainer
            center={[14.7000, 120.9500]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            maxBounds={valenzuelaBounds}
            maxBoundsViscosity={1.0}
            whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <MapClickHandler />
            {markerPosition && (
              <Marker
                position={markerPosition}
                icon={customIcon}
                draggable
                eventHandlers={{ dragend: handleMarkerDrag }}
              />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapSelector;
