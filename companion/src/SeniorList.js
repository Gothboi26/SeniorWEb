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
    health_issues: [], // now an array
    email_address: "",
    barangay_id: "",
    group_chapter: ""
  });

  const healthIssueOptions = [
    "Heart Disease",
    "Arthritis",
    "Diabetes",
    "Dementia/Alzheimer's Disease",
    "Cancer",
    "COPD",
    "Osteoporosis"
  ];

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
    const { name, value } = e.target;

    if (name === "barangay_id") {
      if (/^\d{0,5}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddSenior = async () => {
    const {
      username,
      password,
      age,
      sex,
      address,
      health_issues,
      email_address,
      barangay_id,
      group_chapter
    } = formData;

    if (
      !username || !password || !age || !sex || !address ||
      health_issues.length === 0 || !email_address || !barangay_id || !group_chapter
    ) {
      alert("All fields are required!");
      return;
    }

    if (!/^\d{1,5}$/.test(barangay_id)) {
      alert("Barangay ID must be a number with up to 5 digits.");
      return;
    }

    const payload = {
      ...formData,
      health_issue: health_issues.join(",") // send as comma-separated string
    };

    try {
      const response = await fetch("http://localhost/php/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Senior added successfully");
        setPatients([...patients, payload]);
        setShowModal(false);
        setFormData({
          username: "",
          password: "",
          age: "",
          sex: "",
          address: "",
          health_issues: [],
          email_address: "",
          barangay_id: "",
          group_chapter: ""
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
        <button className="add-senior-button" onClick={() => setShowModal(true)}>
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
            <th>Email</th>
            <th>Barangay ID</th>
            <th>Group Chapter</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              <td>{patient.username}</td>
              <td>{patient.age}</td>
              <td>{patient.sex}</td>
              <td>{patient.address}</td>
              <td>{patient.health_issue?.split(",").join(", ")}</td>
              <td>{patient.email_address}</td>
              <td>{patient.barangay_id}</td>
              <td>{patient.group_chapter}</td>
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
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
            <input type="email" name="email_address" placeholder="Email Address" value={formData.email_address} onChange={handleInputChange} />
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} />
            <select name="sex" value={formData.sex} onChange={handleInputChange}>
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} />

            {/* Multi-select health issues with custom entry */}
            <label>Health Issues (max 3)</label>
            <div className="selected-tags">
              {formData.health_issues.map((issue, index) => (
                <span key={index} className="tag">
                  {issue}
                  <button type="button" onClick={() =>
                    setFormData({
                      ...formData,
                      health_issues: formData.health_issues.filter((_, i) => i !== index)
                    })
                  }>×</button>
                </span>
              ))}
            </div>

            <select onChange={(e) => {
              const value = e.target.value;
              if (
                value &&
                !formData.health_issues.includes(value) &&
                formData.health_issues.length < 3
              ) {
                setFormData({ ...formData, health_issues: [...formData.health_issues, value] });
              }
            }}>
              <option value="">Select Health Issue</option>
              {healthIssueOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>

           

            <input type="text" name="barangay_id" placeholder="Barangay ID (max 5 digits)" value={formData.barangay_id} onChange={handleInputChange} maxLength="5" />
            <select name="group_chapter" value={formData.group_chapter} onChange={handleInputChange}>
              <option value="">Select Barangay Chapter</option>
              <option value="Chapter 1">TAMARAW</option>
              <option value="Chapter 2">GUMAMELA</option>
              <option value="Chapter 3">AZICATE</option>
              <option value="Chapter 4">FISCA</option>
              <option value="Chapter 5">EL GRANDE</option>
              <option value="Chapter 6">TANADA</option>
              <option value="Chapter 7">UPPER TIBANGAN</option>
              <option value="Chapter 8">POLICARPIO</option>
              <option value="Chapter 9">VICTORIA</option>
              <option value="Chapter 10">BAHAY PARI</option>
              <option value="Chapter 11">RMS</option>
              <option value="Chapter 12">SANTIAGO</option>
              <option value="Chapter 13">SITIO SANTOLAN</option>
              <option value="Chapter 14">DE GULA/PEREZ</option>
              <option value="Chapter 15">ANGELES SENIOR CITIZENS ALLIANCE</option>
            </select>

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
