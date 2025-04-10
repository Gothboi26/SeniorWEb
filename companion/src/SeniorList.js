import React, { useState, useEffect } from "react";
import "./SeniorList.css";

const SeniorList = () => {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    barangay_id: "",
    group_chapter: "",
    email_address: "",
    number: "", // phone number
    age: "",
    sex: "",
    address: "",
    health_issues: [],
  });

  const healthIssueOptions = [
    "Heart Disease", "Arthritis", "Diabetes", "Dementia/Alzheimer's Disease",
    "Cancer", "COPD", "Osteoporosis"
  ];

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost/php/get_users.php");
        const result = await response.json();
        if (result.status === "success") {
          const clientsOnly = result.data.filter(user => user.role === "client");
          setPatients(clientsOnly);
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
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
    } else if (name === "number") {
      if (/^\d{0,11}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddSenior = async () => {
    const {
      username, password, barangay_id, group_chapter,
      email_address, number, age, sex, address, health_issues
    } = formData;

    if (
      !username || !password || !barangay_id || !group_chapter ||
      !email_address || !number || !age || !sex || !address || health_issues.length === 0
    ) {
      alert("All fields are required!");
      return;
    }

    if (!/^\d{5}$/.test(barangay_id)) {
      alert("Barangay ID must be exactly 5 digits.");
      return;
    }

    if (!/^\d{11}$/.test(number)) {
      alert("Phone number must be exactly 11 digits.");
      return;
    }

    if (parseInt(age) < 60) {
      alert("Age must be 60 or older.");
      return;
    }

    const payload = {
      ...formData,
      health_issue: health_issues.join(",")
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
        setPatients([...patients, { ...payload, role: "client" }]);
        setShowModal(false);
        resetForm();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error adding senior:", error);
    }
  };

  const handleEdit = (patient) => {
    setFormData({
      username: patient.username,
      password: "",
      barangay_id: patient.barangay_id,
      group_chapter: patient.group_chapter,
      email_address: patient.email_address,
      number: patient.number || "",
      age: patient.age,
      sex: patient.sex,
      address: patient.address,
      health_issues: patient.health_issue?.split(",") || []
    });
    setEditingId(patient.id);
    setShowModal(true);
  };

  const handleUpdateSenior = async () => {
    const payload = {
      ...formData,
      health_issue: formData.health_issues.join(","),
      id: editingId
    };

    try {
      const response = await fetch("http://localhost/php/update_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Senior updated successfully");
        setPatients(prev =>
          prev.map(p => (p.id === editingId ? { ...payload, role: "client" } : p))
        );
        setShowModal(false);
        setEditingId(null);
        resetForm();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error updating senior:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch("http://localhost/php/delete_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      const result = await response.json();
      if (result.status === "success") {
        setPatients(prev => prev.filter(p => p.id !== id));
        alert("Deleted successfully");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error deleting senior:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      barangay_id: "",
      group_chapter: "",
      email_address: "",
      number: "",
      age: "",
      sex: "",
      address: "",
      health_issues: [],
    });
  };

  return (
    <div className="senior-list-container">
      <div className="table-header">
        <h2>All Clients</h2>
        <button className="add-senior-button" onClick={() => {
          setShowModal(true);
          setEditingId(null);
          resetForm();
        }}>
          Add Senior
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Barangay ID</th>
            <th>Chapter</th>
            <th>Email</th>
            <th>Number (Phone)</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Address</th>
            <th>Health Issues</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={index}>
              <td>{patient.username}</td>
              <td>{patient.barangay_id}</td>
              <td>{patient.group_chapter}</td>
              <td>{patient.email_address}</td>
              <td>{patient.number}</td>
              <td>{patient.age}</td>
              <td>{patient.sex}</td>
              <td>{patient.address}</td>
              <td>{patient.health_issue?.split(",").join(", ")}</td>
              <td className="action-icons">
                <button className="edit-button" onClick={() => handleEdit(patient)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(patient.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="senior-modal-overlay">
          <div className="senior-modal">
            <h2>{editingId ? "Edit Senior" : "Add Senior"}</h2>

            <input name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} />
            {!editingId && (
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
            )}
            <input name="barangay_id" placeholder="Barangay ID (5 digits)" value={formData.barangay_id} onChange={handleInputChange} maxLength="5" />
            <select name="group_chapter" value={formData.group_chapter} onChange={handleInputChange}>
              <option value="">Select Chapter</option>
              <option value="TAMARAW">TAMARAW</option>
              <option value="GUMAMELA">GUMAMELA</option>
              <option value="AZICATE">AZICATE</option>
              <option value="FISCA">FISCA</option>
              <option value="EL GRANDE">EL GRANDE</option>
              <option value="TANADA">TANADA</option>
              <option value="UPPER TIBANGAN">UPPER TIBANGAN</option>
              <option value="POLICARPIO">POLICARPIO</option>
              <option value="VICTORIA">VICTORIA</option>
              <option value="BAHAY PARI">BAHAY PARI</option>
              <option value="RMS">RMS</option>
              <option value="SANTIAGO">SANTIAGO</option>
              <option value="SITIO SANTOLAN">SITIO SANTOLAN</option>
              <option value="DE GULA/PEREZ">DE GULA/PEREZ</option>
              <option value="ANGELES SENIOR CITIZENS ALLIANCE">ANGELES SENIOR CITIZENS ALLIANCE</option>
            </select>
            <input type="email" name="email_address" placeholder="Email Address" value={formData.email_address} onChange={handleInputChange} />
            <input type="text" name="number" placeholder="Phone (11 digits)" value={formData.number} onChange={handleInputChange} maxLength="11" />
            <input type="number" name="age" placeholder="Age (60+)" value={formData.age} onChange={handleInputChange} />
            <select name="sex" value={formData.sex} onChange={handleInputChange}>
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} />

            <label>Health Issues (max 3)</label>
            <div className="selected-tags">
              {formData.health_issues.map((issue, i) => (
                <span key={i} className="tag">
                  {issue}
                  <button onClick={() => {
                    const updated = [...formData.health_issues];
                    updated.splice(i, 1);
                    setFormData({ ...formData, health_issues: updated });
                  }}>×</button>
                </span>
              ))}
            </div>
            <select onChange={(e) => {
              const val = e.target.value;
              if (val && !formData.health_issues.includes(val) && formData.health_issues.length < 3) {
                setFormData({ ...formData, health_issues: [...formData.health_issues, val] });
              }
            }}>
              <option value="">Select Health Issue</option>
              {healthIssueOptions.map((issue, i) => (
                <option key={i} value={issue}>{issue}</option>
              ))}
            </select>

            <div className="senior-modal-buttons">
              {editingId ? (
                <button onClick={handleUpdateSenior}>Update</button>
              ) : (
                <button onClick={handleAddSenior}>Submit</button>
              )}
              <button onClick={() => {
                setShowModal(false);
                resetForm();
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeniorList;
