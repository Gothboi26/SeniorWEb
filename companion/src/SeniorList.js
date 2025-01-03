import React, { useState } from "react";
import "./SeniorList.css";
import editIcon from "./edit.png";
import deleteIcon from "./delete.png";

const SeniorList = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("client"); // Default role for seniors

  const handleRegister = async () => {
    const newUsername = prompt("Enter username for the new senior:", "");
    const newPassword = prompt("Enter password for the new senior:", "");

    if (!newUsername || !newPassword) {
      alert("Username and password are required!");
      return;
    }

    setUsername(newUsername);
    setPassword(newPassword);

    const response = await fetch("http://localhost/php/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername, password: newPassword, role }),
    });
    const result = await response.json();

    if (result.status === "success") {
      alert("Senior added successfully");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>All Patients</h2>
        <button className="add-senior-button" onClick={handleRegister}>Add Senior</button>
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
