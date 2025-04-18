import React, { useEffect, useState, useRef } from "react";
import "./EmergenciesAdmin.css";

const EmergenciesAdmin = () => {
  const [data, setData] = useState([]);
  const [unacknowledgedEmergencies, setUnacknowledgedEmergencies] = useState([]);
  const [acknowledgedIds, setAcknowledgedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [loadingStatusIndex, setLoadingStatusIndex] = useState(null);
  const previousDataRef = useRef([]);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/sos.mp3");
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const response = await fetch("http://localhost/php/fetch_emergencies.php", {
          credentials: "include",
        });
        const result = await response.json();

        const newAlerts = result.filter(
          (e) =>
            (e.status === "Pending" || e.status === "On the way") &&
            !acknowledgedIds.includes(e.id)
        );

        if (newAlerts.length > 0) {
          setUnacknowledgedEmergencies(newAlerts);

          if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play().catch(err => console.error("Audio play error", err));
          }
        } else {
          setUnacknowledgedEmergencies([]);
          if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }

        previousDataRef.current = result;
        setData(result);
      } catch (error) {
        console.error("Error fetching emergencies:", error);
      }
    };

    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 5000);
    return () => clearInterval(interval);
  }, [acknowledgedIds]);

  const acknowledgeSingle = (id) => {
    setAcknowledgedIds((prev) => [...prev, id]);
    setUnacknowledgedEmergencies((prev) => prev.filter((e) => e.id !== id));

    if (unacknowledgedEmergencies.length === 1) {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contact_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.emergency_contact_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData];
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
    const currentStatus = data[index].status;
    if (newStatus === currentStatus) return;

    const confirmChange = window.confirm(`Change status to '${newStatus}'?`);
    if (!confirmChange) return;

    setLoadingStatusIndex(index);

    const updatedData = [...data];
    updatedData[index].status = newStatus;
    setData(updatedData);

    try {
      await fetch("http://localhost/php/update_emergency_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: updatedData[index].id, status: newStatus }),
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setLoadingStatusIndex(null);
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
        </div>
      </div>

      {/* 🚨 Popup Alerts for New Emergencies */}
      {unacknowledgedEmergencies.map((item) => (
        <div key={item.id} className="popup-emergency">
          <strong>🚨 Emergency Alert!</strong>
          <p><b>Name:</b> {item.name}</p>
          <p><b>Type:</b> {item.type}</p>
          <p><b>Status:</b> <span className={`status-${item.status.toLowerCase().replace(/\s/g, '-')}`}>{item.status}</span></p>
          <p><b>Location:</b> {item.location}</p>
          <p><b>User #:</b> {item.contact_number}</p>
          <button onClick={() => acknowledgeSingle(item.id)} className="acknowledge-btn">
            Acknowledge
          </button>
        </div>
      ))}

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
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
                <td>{item.type}</td>
                <td>{item.location}</td>
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
              <td colSpan={10}>No emergency reports found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmergenciesAdmin;
