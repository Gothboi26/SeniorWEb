import React from "react";
import "./SeniorList.css";
import editIcon from "./edit.png";
import deleteIcon from "./delete.png";

const SeniorList = () => {
  return (
    <div className="table-container">
      <div className="table-header">
        <h2>All Patients</h2>
        <button className="add-senior-button">Add Senior</button>
      </div>
      <table className="table">
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
  );
};

export default SeniorList;
