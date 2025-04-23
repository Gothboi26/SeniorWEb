import React, { useEffect, useRef, useState } from "react";
import "./Emergency.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToHome from "./BackToHome";
import police from "./assets/police.png";
import ambulance from "./assets/ambulance.png";
import firetruck from "./assets/firetruck.png";
/* import family from "./assets/family.png"; */

const Emergency = ({ role, handleLogout }) => {
  const [toast, setToast] = useState({ message: "", visible: false, type: "" });
  const lastStatus = useRef(null);

  const emergencyOptions = [
    { type: "Police", icon: police },
    { type: "Ambulance", icon: ambulance },
    { type: "Fire Truck", icon: firetruck }
    /* { type: "Family", icon: family }, */
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

  const showToast = (message, type = "info") => {
    setToast({ message, visible: true, type });
    setTimeout(() => {
      setToast({ message: "", visible: false, type: "" });
    }, 7000);
  };

  const handleEmergencyClick = async (type) => {
    const confirmSend = window.confirm(
      `Are you sure you want to report a ${type} emergency?\nYour profile information will be sent automatically.`
    );
    if (!confirmSend) return;

    try {
      const res = await fetch("https://backend-production-4629.up.railway.app/submit_emergency.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type }),
      });

      const data = await res.json();

      if (data.success) {
        const statusText = data.status || "Pending";
        lastStatus.current = statusText;
        showToast(`✅ ${type} emergency reported. Status: ${statusText}`, "pending");
      } else if (data.error === "missing_profile") {
        const goToProfile = window.confirm(
          "❌ Your profile is incomplete. Would you like to complete it now?"
        );
        if (goToProfile) window.location.href = "/profile";
      } else {
        showToast(`❌ Error: ${data.error || "Submission failed."}`, "error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      showToast("❌ Network or server error occurred.", "error");
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("https://backend-production-4629.up.railway.app/get_latest_emergency_status.php", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.success && data.status) {
          if (!lastStatus.current) {
            lastStatus.current = data.status;
          } else if (data.status !== lastStatus.current) {
            let message = "";
            let toastType = "info";

            switch (data.status) {
              case "Pending":
                message = "✅ Emergency submitted. Status: Pending";
                toastType = "pending";
                break;
              case "On the way":
                message = "🚑 Emergency team is on the way!";
                toastType = "alert";
                break;
              case "Arrived":
                message = "🆘 Help has arrived!";
                toastType = "arrived";
                break;
              case "Resolved":
                message = "✔️ Emergency has been resolved.";
                toastType = "resolved";
                break;
              default:
                message = `ℹ️ Status updated to: ${data.status}`;
                toastType = "info";
            }

            showToast(message, toastType);
            lastStatus.current = data.status;
          }
        }
      } catch (err) {
        console.error("Status fetch error:", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, []);

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
              <strong>Paalala: </strong>
              Ang Emergency Assistance ay idinisenyo upang magbigay ng mabilis at maaasahang tulong sa oras ng pangangailangan. Layunin nitong maghatid ng malinaw, tiyak, at agarang impormasyon upang matiyak ang tamang aksyon at solusyon sa anumang uri ng emergency.
            </p>
            <ul className="emergency-desc">
              <li>Sa oras ng emergency, pindutin ang tamang button para sa nais tawagan:</li>
              <li>Siguraduhing ibigay ang tamang detalye tulad ng lokasyon, uri ng emergency, at contact number.</li>
              <li><strong>Pangalan</strong></li>
              <li><strong>Address</strong></li>
              <li><strong>Contact Number</strong></li>
            </ul>
          
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

          {toast.visible && (
            <div className={`toast-notification ${toast.type}`}>
              <p>{toast.message}</p>
              <button
                className="toast-close-btn"
                onClick={() => setToast({ message: "", visible: false, type: "" })}
              >
                OK
              </button>
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
            /* 
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
