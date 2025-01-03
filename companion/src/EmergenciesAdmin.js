import React from "react";
import "./EmergenciesAdmin.css"; // Ensure this CSS file contains the styles

const EmergenciesAdmin = () => {
  return (
    <div className="table-container">
      <h2>Emergencies</h2>
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
          <tr>
            <td>Jan Ashley Tinao</td>
            <td>02-02-2024</td>
            <td>1:00 PM</td>
            <td>Medical</td>
            <td>Community Hall</td>
            <td>Ongoing</td>
          </tr>
          <tr>
            <td>Christine Joy Galicia</td>
            <td>02-02-2024</td>
            <td>3:00 PM</td>
            <td>Fire</td>
            <td>Room 202</td>
            <td>Completed</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmergenciesAdmin;
