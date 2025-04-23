import React, { useEffect, useState, useRef } from "react";
import MapSelector from "./MapSelector";
import "./EmergenciesAdmin.css";
import alert from "./assets/alert.png";


const EmergenciesAdmin = () => {
  const [data, setData] = useState([]);
  const [unacknowledgedEmergencies, setUnacknowledgedEmergencies] = useState([]);
  const [acknowledgedIds, setAcknowledgedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [loadingStatusIndex, setLoadingStatusIndex] = useState(null);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: null, lng: null, address: "" });
  const [showLogs, setShowLogs] = useState(false);

  const audioRef = useRef(null);
  const audioTimeoutRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/sos.mp3");
    audioRef.current.loop = false;
  }, []);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const response = await fetch("https://backend-production-4629.up.railway.app/php/fetch_emergencies.php", {
          credentials: "include",
        });
        const result = await response.json();

        const isToday = (dateStr) => {
          const today = new Date();
          const date = new Date(dateStr);
          return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
          );
        };

        const newAlerts = result.filter(
          (e) =>
            (e.status === "Pending" || e.status === "On the way") &&
            isToday(e.date) &&
            !acknowledgedIds.includes(e.id)
        );

        setData(result);
        setUnacknowledgedEmergencies(newAlerts);

        if (newAlerts.length > 0) {
          if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play().catch((err) => console.error("Audio play error", err));
            audioTimeoutRef.current = setTimeout(() => {
              if (audioRef.current && !audioRef.current.paused) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
              }
            }, 5000);
          }
        } else {
          stopSound();
        }
      } catch (error) {
        console.error("Error fetching emergencies:", error);
      }
    };

    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 5000);
    return () => clearInterval(interval);
  }, [acknowledgedIds]);

  const stopSound = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
    }
  };

  const acknowledgeSingle = (id) => {
    setAcknowledgedIds((prev) => [...prev, id]);
    setUnacknowledgedEmergencies((prev) => prev.filter((e) => e.id !== id));
    stopSound();
  };

  const isPastDate = (dateString) => {
    const today = new Date();
    const emergencyDate = new Date(dateString);
    emergencyDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return emergencyDate < today;
  };

  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contact_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.emergency_contact_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const logsData = filteredData.filter((item) => isPastDate(item.date));
  const mainData = filteredData.filter((item) => !isPastDate(item.date));

  const sortedData = [...(showLogs ? logsData : mainData)];
  if (sortConfig !== null) {
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }

  const requestSort = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const handleDropdownChange = (event) => {
    const [key, direction] = event.target.value.split(":");
    requestSort(key, direction);
  };

  const handleStatusChange = async (index, newStatus) => {
    const currentStatus = sortedData[index].status;
    if (newStatus === currentStatus) return;

    const confirmChange = window.confirm(`Change status to '${newStatus}'?`);
    if (!confirmChange) return;

    setLoadingStatusIndex(index);
    const updatedItem = sortedData[index];
    const updatedData = [...data];
    const originalIndex = data.findIndex((d) => d.id === updatedItem.id);
    updatedData[originalIndex].status = newStatus;
    setData(updatedData);

    try {
      await fetch("https://backend-production-4629.up.railway.app/php/update_emergency_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: updatedItem.id, status: newStatus }),
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setLoadingStatusIndex(null);
    }
  };

  const openMap = async (item) => {
    if (item.latitude && item.longitude) {
      setMapCoords({
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude),
        address: item.location || ""
      });
      setMapModalVisible(true);
    } else {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(item.location)}&limit=1&countrycodes=ph`);
        const result = await response.json();
        if (result.length > 0) {
          setMapCoords({
            lat: parseFloat(result[0].lat),
            lng: parseFloat(result[0].lon),
            address: result[0].display_name
          });
          setMapModalVisible(true);
        } else {
          alert("Location not found.");
        }
      } catch (err) {
        console.error("Geocode error", err);
      }
    }
  };

  return (
    <div className="emergency-table-container">
      <div className="header-container">
        <h2 className="emergency-left">Emergencies</h2>
        <div className="filter-right">
          <input
            className="filter-sort"
            type="text"
            placeholder="Search anything..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="sort-dropdown" onChange={handleDropdownChange}>
            <option value="name:ascending">Sort by Name (A-Z)</option>
            <option value="name:descending">Sort by Name (Z-A)</option>
            <option value="status:ascending">Sort by Status (A-Z)</option>
            <option value="status:descending">Sort by Status (Z-A)</option>
            <option value="date:descending">Sort by Date (Newest)</option>
            <option value="date:ascending">Sort by Date (Oldest)</option>
          </select>
          <button className="view-logs-button" onClick={() => setShowLogs((prev) => !prev)}>
            {showLogs ? "Back to Active" : "View Logs"}
          </button>
        </div>
      </div>

      {unacknowledgedEmergencies.map((item) => (
        <div key={item.id} className="popup-emergency">
          <div className="popup-header">
            <img src={alert} alt="Popup-Logo" className="popup-alert-logo"/>
            <strong className="alert">Emergency Alert</strong>
          </div>
          <div className="popup-details">
            <p><b>Name:</b> {item.name}</p>
            <p><b>Type:</b> {item.type}</p>
            <p><b>Status:</b> <span className={`status-${item.status.toLowerCase().replace(/\s/g, '-')}`}>{item.status}</span></p>
            <p><b>Location:</b> {item.location}</p>
            <p><b>User #:</b> {item.contact_number}</p>
            <button onClick={() => acknowledgeSingle(item.id)} className="acknowledge-btn">Acknowledge</button>
          </div>
          
        </div>
      ))}
      <div className="table-wrapper"> 
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Location</th>
              <th>User #</th>
              <th>Emergency Contact</th>
              <th>Contact #</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>{item.type}</td>
                  <td>
                    <span
                      className="map-link"
                      style={{ color: "#b02a37", cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => openMap(item)}
                    >
                      {item.location}
                    </span>
                  </td>
                  <td>{item.contact_number}</td>
                  <td>{item.emergency_contact_name}</td>
                  <td>{item.emergency_contact_number}</td>
                  <td className={`status-${item.status.toLowerCase().replace(/\s/g, '-')}`}>{item.status}</td>
                  <td>
                    {item.status === "Resolved" ? (
                      <span style={{ fontStyle: "italic", color: "#666" }}>—</span>
                    ) : loadingStatusIndex === index ? (
                      <span className="loading-text">Updating...</span>
                    ) : (
                      <select
                        className="status-action"
                        value={item.status}
                        onChange={(e) => handleStatusChange(index, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="On the way">On the way</option>
                        <option value="Arrived">Arrived</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10}>No {showLogs ? "past" : "upcoming"} emergencies found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      

      {mapModalVisible && mapCoords.lat && mapCoords.lng && (
        <MapSelector
          onClose={() => setMapModalVisible(false)}
          initialPosition={mapCoords}
          onSelect={() => {}}
        />
      )}
    </div>
  );
};

export default EmergenciesAdmin;
