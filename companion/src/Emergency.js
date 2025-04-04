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
  const [successMessage, setSuccessMessage] = useState("");

  const emergencyOptions = [
    { type: "Police", icon: police },
    { type: "Ambulance", icon: ambulance },
    { type: "Fire Truck", icon: firetruck },
    { type: "Family", icon: family },
  ];

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

  const handleEmergencyClick = async (type) => {
    console.log("Sending emergency type:", type);

    try {
      const res = await fetch("http://localhost/php/submit_emergency.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ type }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage(`✅ ${type} emergency submitted successfully.`);
        setTimeout(() => setSuccessMessage(""), 4000);
      } else if (data.error === "missing_profile") {
        const goToProfile = window.confirm(
          "❌ Your profile is incomplete. Would you like to complete it now?"
        );
        if (goToProfile) {
          window.location.href = "/profile"; // or use navigate("/profile") if using React Router
        }
      } else {
        alert("❌ Error: " + (data.error || "Submission failed."));
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("❌ Network or backend error.");
    }
  };

  return (
    <div className="emergency-container">
      <Navbar role={role} handleLogout={handleLogout} />
      <div className="emergency-content">
        <div className="emergency-title-container">
          <h1 className="emergency-title">Emergency Services</h1>
        </div>
          
        <div className="emergency-details-container">
          <div className="emergency-description">
            <p className="emergency-desc-title">
              <strong>Paalala:</strong> I-click ang button ng emergency na kailangan mo. Ang iyong profile data ay awtomatikong gagamitin.
            </p>
          </div>
          

            <div className="buttons-container">
              {emergencyOptions.map(({ type, icon }) => (
                <button
                  key={type}
                  className="emergency-button"
                  onClick={() => handleEmergencyClick(type)}
                >
                  <img src={icon} alt={type} className="emergency-icon" />
                  <span>{type}</span>
                </button>
              ))}
            </div>

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
                  <tr><th>Service</th><th>Number</th></tr>
                </thead>
                <tbody>
                  {emergencyHotlines.map((h, i) => (
                    <tr key={i}><td>{h.name}</td><td>{h.number}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="contacts">
              <p className="contacts-title">Emergency Contacts</p>
              <table className="contacts-table">
                <thead>
                  <tr><th>Contact</th><th>Number</th></tr>
                </thead>
                <tbody>
                  {emergencyContacts.map((c, i) => (
                    <tr key={i}><td>{c.name}</td><td>{c.number}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <BackToHome role={role} />
        <Footer role={role} />
      </div>
    </div>
  );
};

export default Emergency;
