// Overview.js
import React from 'react';
import './Overview.css';
import editIcon from "./edit.png";
import deleteIcon from "./delete.png";

const Overview = () => {
  return (
    <div className="overview-container">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card total-patients">
          <h3>Total Patients</h3>
          <p className="count">15,000</p>
          <p className="change">20% Last Month</p>
        </div>
        <div className="card card-light">
          <h3>Total Appointments</h3>
          <p className="count">1,000</p>
          <p className="change">20% Last Month</p>
        </div>
        <div className="card card-light">
          <h3>Total Inquiries</h3>
          <p className="count">500</p>
          <p className="change">20% Last Month</p>
        </div>
      </div>

      {/* Statistics and Appointments */}
      <div className="statistics-section">
        <div className="statistics">
          <h3>Patient's Statistics</h3>
          <div className="stats-chart">
            {/* Placeholder for chart */}
          </div>
          <div className="stats-toggle">
            <button>Week</button>
            <button>Month</button>
            <button>Year</button>
          </div>
        </div>

        <div className="appointments">
          <h3>Appointments</h3>
          <div className="appointment-nav">
            <button>&lt;</button>
            <p className="appointment-date">December 2024</p>
            <button>&gt;</button>
          </div>
        </div>
        </div>

        <div className="patients-table-container">
        <div className="patients-table-header">
            <h2>All Patients</h2>
            <button className="see-all-button">See All</button>
        </div>
        <table className="patients-table">
            <thead>
            <tr>
                <th></th>
                <th>Patient Name</th>
                <th>Gender</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>
                <input type="checkbox" />
                </td>
                <td>Jan Ashley Tinao</td>
                <td>Male</td>
                <td>Brain rot</td>
                <td className="status-confirmed">Confirmed</td>
                <td className="action-icons">
                <img src={editIcon} alt="Edit" />
                <img src={deleteIcon} alt="Delete" />
                </td>
            </tr>
            <tr>
                <td>
                <input type="checkbox" />
                </td>
                <td>Christine Galicia</td>
                <td>Female</td>
                <td>Brain rot</td>
                <td className="status-pending">Pending</td>
                <td className="action-icons">
                <img src={editIcon} alt="Edit" />
                <img src={deleteIcon} alt="Delete" />
                </td>
            </tr>
            </tbody>
        </table>
        </div>
      </div>
  );
};

export default Overview;