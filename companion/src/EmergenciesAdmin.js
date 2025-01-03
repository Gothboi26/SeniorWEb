import React, { useState } from "react";
import "./EmergenciesAdmin.css"; // Ensure this CSS file contains the styles

const EmergenciesAdmin = () => {
  const [sortConfig, setSortConfig] = useState(null);

  const data = [
    {
      name: "Jan Ashley Tinao",
      date: "02-02-2024",
      time: "1:00 PM",
      type: "Medical",
      location: "Community Hall",
      status: "Ongoing",
    },
    {
      name: "Christine Joy Galicia",
      date: "02-02-2024",
      time: "3:00 PM",
      type: "Fire",
      location: "Room 202",
      status: "Completed",
    },
    // Add more data here
  ];

  const sortedData = [...data];

  if (sortConfig !== null) {
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
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

  return (
    <div className="table-container">
      <div className="header-container">
        <h2 className="left-aligned">Emergencies</h2>
        <select className="sort-dropdown" onChange={handleDropdownChange}>
          <option value="name:ascending">Sort by Name (A-Z)</option>
          <option value="name:descending">Sort by Name (Z-A)</option>
          <option value="status:ascending">Sort by Status (Completed)</option>
          <option value="status:descending">Sort by Status (Ongoing)</option>
        </select>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Time Reported</th>
            <th>Type of Emergency</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.date}</td>
              <td>{item.time}</td>
              <td>{item.type}</td>
              <td>{item.location}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmergenciesAdmin;
