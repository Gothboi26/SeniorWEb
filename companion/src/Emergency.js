import React, { useState } from "react";
import "./Emergency.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToHome from "./BackToHome";
import police from "./assets/police.png";
import ambulance from "./assets/ambulance.png";
import firetruck from "./assets/firetruck.png";
import family from "./assets/family.png";

const Emergency = ({ role, handleLogout }) => {
  const [selectedType, setSelectedType] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [notes, setNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const emergencyHotlines = [
    { name: "Police Station", number: "911" },
    { name: "Fire Department", number: "112" },
    { name: "Ambulance Services", number: "108" },
  ];

  const emergencyContacts = [
    { name: "Barangay Captain", number: "0917-123-4567" },
    { name: "Barangay Office", number: "0918-987-6543" },
    { name: "Neighborhood Watch", number: "0916-456-7890" },
  ];

  const emergencyOptions = [
    { type: "Police", icon: police },
    { type: "Ambulance", icon: ambulance },
    { type: "Fire Truck", icon: firetruck },
    { type: "Family", icon: family },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedType || !location || !contactNumber || !fullName) {
      alert("Please complete all required fields.");
      return;
    }

    const payload = {
      type: selectedType,
      location,
      contact_number: contactNumber,
      full_name: fullName,
      notes,
    };

    try {
      const response = await fetch("http://localhost/php/submit_emergency.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage("Emergency submitted successfully.");
        setLocation("");
        setContactNumber("");
        setFullName("");
        setNotes("");
        setSelectedType("");
        setShowForm(false);
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        alert("Error: " + (data.error || "Submission failed."));
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Network error. Please check CORS or server availability.");
    }
  };

  return (
    <div className="emergency-container">
      <Navbar role={role} handleLogout={handleLogout} />
      <div className="emergency-content">
        <div className="emergency-title-container">
          <h1 className="emergency-title">Emergency Services</h1>
        </div>

        <div className="emergency-description">
          <p><strong>Paalala:</strong> Ang Emergency Assistance ay idinisenyo upang magbigay ng mabilis at maaasahang tulong sa oras ng pangangailangan.</p>
          <ul>
            <li>Pindutin ang tamang button para sa nais na serbisyo.</li>
            <li>Ibigay ang tamang detalye tulad ng lokasyon, uri ng emergency, at contact number.</li>
          </ul>
        </div>

        <div className="buttons-container">
          {emergencyOptions.map(({ type, icon }) => (
            <button
              key={type}
              className={`emergency-button ${selectedType === type ? "selected" : ""}`}
              onClick={() => {
                setSelectedType(type);
                setShowForm(true);
              }}
            >
              <img src={icon} alt={type} className="emergency-icon" />
              <span>{type}</span>
            </button>
          ))}
        </div>

        {showForm && (
          <div className="emergency-popup">
            <div className="emergency-popup-inner">
              <button className="close-popup" onClick={() => setShowForm(false)}>×</button>
              <form className="emergency-form" onSubmit={handleSubmit}>
                <h3><span role="img" aria-label="alert">🚨</span> Emergency Alert</h3>

                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Emergency Type</option>
                  <option value="Police">Police</option>
                  <option value="Ambulance">Ambulance</option>
                  <option value="Fire Truck">Fire Truck</option>
                  <option value="Family">Family</option>
                </select>

                <input
                  type="text"
                  placeholder="Contact Number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />

                <textarea
                  placeholder="Additional Notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>

                <button type="submit">✅ Submit</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ backgroundColor: "#a00000" }}>
                  ❌ Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="emergency-popup">
            <div className="emergency-popup-inner">
              <button className="close-popup" onClick={() => setSuccessMessage("")}>×</button>
              <p className="success-message">{successMessage}</p>
            </div>
          </div>
        )}

        <div className="hotlines-container">
          <div className="hotlines">
            <p className="hotlines-title">Emergency Hotlines</p>
            <table className="contacts-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Contact Number</th>
                </tr>
              </thead>
              <tbody>
                {emergencyHotlines.map((hotline, index) => (
                  <tr key={index}>
                    <td>{hotline.name}</td>
                    <td>{hotline.number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="contacts">
            <p className="contacts-title">Emergency Contacts</p>
            <table className="contacts-table">
              <thead>
                <tr>
                  <th>Contact Person</th>
                  <th>Contact Number</th>
                </tr>
              </thead>
              <tbody>
                {emergencyContacts.map((contact, index) => (
                  <tr key={index}>
                    <td>{contact.name}</td>
                    <td>{contact.number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <BackToHome role={role} />
        <Footer role={role} />
      </div>
    </div>
  );
};

export default Emergency;
