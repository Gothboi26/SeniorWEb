import React from "react";
import "./Appointments.css"; // Ensure this CSS file contains the styles

const Appointments = () => {
  return (
    <div className="table-container">
      <h2>Appointment Request</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Date</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jan Ashley Tinao</td>
            <td>Checkup</td>
            <td>02-02-2024</td>
            <td className="time-text">1:00 PM</td>
            <td className="action-icons">
              <button className="approve-button">✔</button>
              <button className="reject-button">✖</button>
            </td>
          </tr>
          <tr>
            <td>Christine Joy Galicia</td>
            <td>Checkup</td>
            <td>02-02-2024</td>
            <td className="time-text">3:00 PM</td>
            <td className="action-icons">
              <button className="approve-button">✔</button>
              <button className="reject-button">✖</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Appointments;
