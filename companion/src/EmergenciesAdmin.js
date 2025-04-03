import React, { useEffect, useState, useRef } from "react";
import "./EmergenciesAdmin.css";

const EmergenciesAdmin = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStatusIndex, setLoadingStatusIndex] = useState(null);
  const previousDataRef = useRef([]);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const response = await fetch("http://localhost/php/fetch_emergencies.php", {
          credentials: "include",
        });
        const result = await response.json();

        const previousData = previousDataRef.current;

        if (previousData.length > 0 && result.length > previousData.length) {
          const newCount = result.length - previousData.length;
          setPopupMessage(`🔔 ${newCount} new emergency report${newCount > 1 ? "s" : ""} received!`);
          setTimeout(() => setPopupMessage(""), 4000);
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
  }, []);

  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contact_number?.toLowerCase().includes(searchTerm.toLowerCase())
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

    const confirmChange = window.confirm(`Are you sure you want to change status to '${newStatus}'?`);
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
    <div className="table-container">
      <div className="header-container">
        <h2 className="left-aligned">Emergencies</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search by name, type, status, location, or contact"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
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

      {popupMessage && (
        <div className="popup-notification">
          <p>{popupMessage}</p>
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Type</th>
            <th>Location</th>
            <th>Contact Number</th>
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
                <td className={`status-${item.status.toLowerCase()}`}>{item.status}</td>
                <td>
                  {loadingStatusIndex === index ? (
                    <span className="loading-text">Updating...</span>
                  ) : (
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(index, e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No emergency reports found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmergenciesAdmin;
