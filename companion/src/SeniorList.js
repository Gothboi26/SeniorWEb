import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import MapSelector from "./MapSelector";
import "./SeniorList.css";

const SeniorList = () => {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterChapter, setFilterChapter] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    barangay_id: "",
    group_chapter: "",
    email_address: "",
    number: "",
    age: "",
    sex: "",
    address: "",
    lat: "",
    lng: "",
    health_issue: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    extension: "N/A",
    birthday: "",
    civil_status: "",
    emergency_contact_person: "",
    emergency_contact_number: "",
    emergency_contact_relationship: "",
  });

  const chapterOptions = [
    "NONE", "TAMARAW", "GUMAMELA", "AZICATE", "FISCA", "EL GRANDE", "TANADA",
    "UPPER TIBANGAN", "POLICARPIO", "VICTORIA", "BAHAY PARI", "RMS",
    "SANTIAGO", "SITIO SANTOLAN", "DE GULA/PEREZ", "ANGELES SENIOR CITIZENS ALLIANCE"
  ];

  const extensionOptions = ["N/A", "Jr.", "Sr.", "II", "III", "IV"];
  const healthIssueOptions = [
    "Heart Disease", "Arthritis", "Diabetes", "Dementia/Alzheimer's Disease",
    "COPD", "Osteoporosis"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if ((name === "barangay_id" || name === "number" || name === "emergency_contact_number") && !/^[0-9]*$/.test(value)) return;
    if (name === "barangay_id" && value.length > 5) return;
    if ((name === "number" || name === "emergency_contact_number") && value.length > 11) return;

    if (name === "birthday") {
      const today = new Date();
      const bday = new Date(value);
      let age = today.getFullYear() - bday.getFullYear();
      const m = today.getMonth() - bday.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < bday.getDate())) age--;
      setFormData(prev => ({ ...prev, birthday: value, age: age < 0 ? "" : age.toString() }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      "username", "number", "age", "sex", "address", "lat", "lng", "health_issue",
      "email_address", "barangay_id", "group_chapter", "first_name", "last_name",
      "birthday", "civil_status", "emergency_contact_person", "emergency_contact_number",
      "emergency_contact_relationship"
    ];

    for (let field of requiredFields) {
      const value = formData[field];
      if (typeof value === 'string' && value.trim() === "") {
        alert(`"${field.replace(/_/g, " ")}" is required.`);
        return false;
      }
    }

    if (formData.barangay_id.length !== 5) {
      alert("Barangay ID must be exactly 5 digits.");
      return false;
    }
    if (formData.number.length !== 11 || formData.emergency_contact_number.length !== 11) {
      alert("Contact numbers must be exactly 11 digits.");
      return false;
    }
    if (parseInt(formData.age) < 60) {
      alert("Age must be 60 or older.");
      return false;
    }

    return true;
  };

  const handleAddSenior = async () => {
    if (!validateForm()) return;
    try {
      const res = await fetch("https://backend-production-4629.up.railway.app/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, password: "client123" }),
      });
      const result = await res.json();
      if (result.status === "success") {
        alert("Senior added successfully.");
        setPatients([...patients, { ...formData, role: "client" }]);
        resetForm();
        setShowModal(false);
        setStep(1);
      } else alert(result.message);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSenior = async () => {
    if (!validateForm()) return;
    const payload = { ...formData, id: editingId };
    try {
      const res = await fetch("https://backend-production-4629.up.railway.app/update_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.status === "success") {
        alert("Senior updated successfully.");
        setPatients(prev => prev.map(p => p.id === editingId ? { ...payload, role: "client" } : p));
        setShowModal(false);
        resetForm();
        setEditingId(null);
        setStep(1);
      } else alert(result.message);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (data) => {
    setFormData({ ...data });
    setEditingId(data.id);
    setStep(1);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const res = await fetch("https://backend-production-4629.up.railway.app/delete_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const result = await res.json();
      if (result.status === "success") {
        setPatients(prev => prev.filter(p => p.id !== id));
        alert("Deleted successfully.");
      } else alert(result.message);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      barangay_id: "",
      group_chapter: "",
      email_address: "",
      number: "",
      age: "",
      sex: "",
      address: "",
      lat: "",
      lng: "",
      health_issue: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      extension: "N/A",
      birthday: "",
      civil_status: "",
      emergency_contact_person: "",
      emergency_contact_number: "",
      emergency_contact_relationship: "",
    });
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("https://backend-production-4629.up.railway.app/get_users.php");
        const data = await res.json();
        if (data.status === "success") {
          setPatients(data.data.filter(user => user.role === "client"));
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = () =>
    patients.filter(p =>
      (!filterChapter || p.group_chapter === filterChapter) &&
      Object.values(p).some(val =>
        val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  const handleExportExcel = () => {
    const filtered = filteredPatients();
    const worksheet = XLSX.utils.json_to_sheet(filtered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Seniors");
    const data = new Blob([XLSX.write(workbook, { bookType: "xlsx", type: "array" })], { type: "application/octet-stream" });
    saveAs(data, "seniors.xlsx");
  };

  return (
    <div className="senior-list-container">
      {/* Header and filter */}
      <div className="table-header">
        <h2>All Clients</h2>
        <div className="buttons-right">
          <div className="filter-bar">
            <input className="search-input" type="text" placeholder="Search seniors..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <select value={filterChapter} onChange={(e) => setFilterChapter(e.target.value)} className="chapter-filter">
              <option value="">All Chapters</option>
              {chapterOptions.map((chapter, idx) => <option key={idx} value={chapter}>{chapter}</option>)}
            </select>
          </div>
          <button className="add-senior-button" onClick={() => { resetForm(); setEditingId(null); setShowModal(true); }}>Add Senior</button>
          <button className="export-excel" onClick={handleExportExcel}>Export Excel</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Barangay ID</th>
              <th>Chapter</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Birthday</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Civil Status</th>
              <th>Address</th>
              <th>Health Issue</th>
              <th>Emergency Contact</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients().map((p, i) => (
              <tr key={i}>
                <td>{p.username}</td>
                <td>{[p.first_name, p.middle_name, p.last_name, p.extension].filter(Boolean).join(" ")}</td>
                <td>{p.barangay_id}</td>
                <td>{p.group_chapter}</td>
                <td>{p.email_address}</td>
                <td>{p.number}</td>
                <td>{p.birthday}</td>
                <td>{p.age}</td>
                <td>{p.sex}</td>
                <td>{p.civil_status}</td>
                <td>{p.address}</td>
                <td>{p.health_issue}</td>
                <td>{p.emergency_contact_person} ({p.emergency_contact_relationship}) - {p.emergency_contact_number}</td>
                <td>
                  <button onClick={() => handleEdit(p)} className="edit-button">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Registration Steps */}
      {showModal && (
        <div className="senior-modal-overlay">
          <div className="senior-modal">
            {step === 1 ? (
              <>
                <h2>Step 1: Personal Information</h2>
                <input name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} />
                <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleInputChange} />
                <input name="middle_name" placeholder="Middle Name" value={formData.middle_name} onChange={handleInputChange} />
                <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleInputChange} />
                <select name="extension" value={formData.extension} onChange={handleInputChange}>
                  {extensionOptions.map((ext, i) => <option key={i} value={ext}>{ext}</option>)}
                </select>
                <input type="date" name="birthday" value={formData.birthday} onChange={handleInputChange} />
                <input name="age" value={formData.age} readOnly style={{ backgroundColor: "#f0f0f0" }} />
                <select name="civil_status" value={formData.civil_status} onChange={handleInputChange}>
                  <option value="">Select Civil Status</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Widowed</option>
                  <option>Separated</option>
                </select>
                <div className="senior-modal-buttons">
                  <button onClick={() => setShowModal(false)}>Cancel</button>
                  <button onClick={() => setStep(2)}>Next</button>
                </div>
              </>
            ) : (
              <>
                <h2>Step 2: Contact & Emergency Info</h2>
                <input name="barangay_id" placeholder="Barangay ID" value={formData.barangay_id} onChange={handleInputChange} />
                <select name="group_chapter" value={formData.group_chapter} onChange={handleInputChange}>
                  <option value="">Select Chapter</option>
                  {chapterOptions.map((chapter, i) => <option key={i} value={chapter}>{chapter}</option>)}
                </select>
                <input type="email" name="email_address" placeholder="Email" value={formData.email_address} onChange={handleInputChange} />
                <input name="number" placeholder="Phone Number" value={formData.number} onChange={handleInputChange} />
                <select name="sex" value={formData.sex} onChange={handleInputChange}>
                  <option value="">Select Sex</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
                <input name="address" placeholder="Click to select address" value={formData.address} onClick={() => setShowMap(true)} readOnly style={{ cursor: "pointer", backgroundColor: "#f9f9f9" }} />
                <button onClick={() => setShowMap(true)}>📍 Select Location on Map</button>
                <input name="emergency_contact_person" placeholder="Emergency Contact Person" value={formData.emergency_contact_person} onChange={handleInputChange} />
                <input name="emergency_contact_number" placeholder="Emergency Contact Number" value={formData.emergency_contact_number} onChange={handleInputChange} />
                <input name="emergency_contact_relationship" placeholder="Relationship" value={formData.emergency_contact_relationship} onChange={handleInputChange} />
                <select name="health_issue" value={formData.health_issue} onChange={handleInputChange}>
                  <option value="">Select Health Issue</option>
                  {healthIssueOptions.map((h, i) => <option key={i} value={h}>{h}</option>)}
                </select>
                <div className="senior-modal-buttons">
                  <button onClick={() => setStep(1)}>Back</button>
                  {editingId ? <button onClick={handleUpdateSenior}>Update</button> : <button onClick={handleAddSenior}>Submit</button>}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MapSelector modal */}
      {showMap && (
        <MapSelector
          onClose={() => setShowMap(false)}
          onSelect={(coords) => {
            setFormData(prev => ({
              ...prev,
              address: coords.address || `Lat: ${coords.lat}, Lng: ${coords.lng}`,
              lat: coords.lat,
              lng: coords.lng
            }));
            setShowMap(false);
          }}
        />
      )}
    </div>
  );
};

export default SeniorList;
