import React, { useState, useEffect } from "react";
import "./SeniorList.css";
import editIcon from "./assets/edit.png";
import deleteIcon from "./assets/delete.png";

const SeniorList = () => {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    age: "",
    sex: "",
    address: "",
    health_issue: "",
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost/php/get_users.php");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        if (result.status === "success") setPatients(result.data);
        else alert(result.message);
      } catch (error) {
        console.error("Error fetching patients:", error.message);
      }
    };

    fetchPatients();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSenior = async () => {
    if (
      !formData.username ||
      !formData.password ||
      !formData.age ||
      !formData.sex ||
      !formData.address ||
      !formData.health_issue
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost/php/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "client" }),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Senior added successfully");
        setPatients([...patients, { ...formData, role: "client" }]);
        setShowModal(false);
        setFormData({
          username: "",
          password: "",
          age: "",
          sex: "",
          address: "",
          health_issue: "",
        });
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
        <button
          className="add-senior-button"
          onClick={() => setShowModal(true)}
        >
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Senior</h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleInputChange}
            />
            <select
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="health_issue"
              placeholder="Health Issue"
              value={formData.health_issue}
              onChange={handleInputChange}
            />
            <div className="modal-buttons">
              <button onClick={handleAddSenior}>Submit</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeniorList;
