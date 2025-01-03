import React, { useState, useEffect } from "react";
import "./SeniorList.css";
import editIcon from "./edit.png";
import deleteIcon from "./delete.png";

const SeniorList = () => {
  const [patients, setPatients] = useState([]); // State to hold the list of registered users

  // Fetch all registered users
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost/php/get_users.php"); // Update with the correct URL
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        if (result.status === "success") {
          setPatients(result.data); // Update state with fetched users
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error("Error fetching patients:", error.message);
      }
    };

    fetchPatients();
  }, []);

  // Handle Add Senior
  const handleAddSenior = async () => {
    const username = prompt("Enter username for the new senior:", "");
    const password = prompt("Enter password for the new senior:", "");
    const age = prompt("Enter age:", "");
    const sex = prompt("Enter sex (Male/Female):", "");
    const address = prompt("Enter address:", "");
    const health_issue = prompt("Enter health issue:", "");

    if (!username || !password || !age || !sex || !address || !health_issue) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost/php/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          age,
          sex,
          address,
          health_issue,
          role: "client",
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Senior added successfully");
        setPatients((prev) => [
          ...prev,
          { username, age, sex, address, health_issue, role: "client" },
        ]); // Update state with new senior
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error adding senior:", error.message);
    }
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>All Patients</h2>
        <button className="add-senior-button" onClick={handleAddSenior}>
          Add Senior
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Username</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Address</th>
            <th>Health Issue</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={index}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{patient.username}</td>
              <td>{patient.age}</td>
              <td>{patient.sex}</td>
              <td>{patient.address}</td>
              <td>{patient.health_issue}</td>
              <td>{patient.role}</td>
              <td className="action-icons">
                <img src={editIcon} alt="Edit" />
                <img src={deleteIcon} alt="Delete" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SeniorList;
