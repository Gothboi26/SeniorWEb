import React, { useState } from "react";
import "./Emergency.css"; // Link to the updated CSS file
import Navbar from "./Navbar"; // Import the Navbar component

const Emergency = ({ role, handleLogout }) => {
  const [modal, setModal] = useState(null);
  const [ambulanceData, setAmbulanceData] = useState({
    location: "",
    condition: "",
    contact: "",
  });
  const [policeData, setPoliceData] = useState({
    location: "",
    report: "",
    contact: "",
  });
  const [submittedData, setSubmittedData] = useState({
    ambulance: [],
    police: [],
  });
  const [viewSubmittedModal, setViewSubmittedModal] = useState(false);

  const openModal = (modalType) => {
    setModal(modalType);
  };

  const closeModal = () => {
    setModal(null);
    setAmbulanceData({ location: "", condition: "", contact: "" });
    setPoliceData({ location: "", report: "", contact: "" });
  };

  const handleAmbulanceChange = (e) => {
    const { name, value } = e.target;
    setAmbulanceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePoliceChange = (e) => {
    const { name, value } = e.target;
    setPoliceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAmbulanceSubmit = (e) => {
    e.preventDefault();
    setSubmittedData((prevData) => ({
      ...prevData,
      ambulance: [...prevData.ambulance, ambulanceData],
    }));
    closeModal();
  };

  const handlePoliceSubmit = (e) => {
    e.preventDefault();
    setSubmittedData((prevData) => ({
      ...prevData,
      police: [...prevData.police, policeData],
    }));
    closeModal();
  };

  const showSubmittedData = () => {
    setViewSubmittedModal(true);
  };

  const closeViewSubmittedModal = () => {
    setViewSubmittedModal(false);
  };

  return (
    <div className="emergency-container">
      <Navbar role={role} handleLogout={handleLogout} />
      <h4 className="section-title">EMERGENCY SERVICES</h4>
      <h2 className="section-call">Need Help? Call someone </h2>
      <p className="emergency-instructions">
        Paalaala: Sa oras ng emergency, pindutin ang tamang button para sa nais
        tawagan: <br />- Barangay Hotline <br />- Health Center <br />- Pulis o
        Bumbero <br />
        Siguraduhing ibigay ang tamang detalye tulad ng lokasyon, uri ng
        emergency, at contact number.
        <br />
        Laging unahin ang kaligtasan!
      </p>

      {/* Emergency Buttons */}
      <div className="button-container-column">
        <button
          className="emergency-button"
          onClick={() => openModal("ambulance")}
        >
          <span className="icon">🚑</span>
          Ambulance
        </button>
        <button
          className="emergency-button"
          onClick={() => openModal("police")}
        >
          <span className="icon">🚓</span>
          Police Department
        </button>
        <button className="emergency-button" onClick={() => openModal("fire")}>
          <span className="icon">🚒</span>
          Fire Department
        </button>
      </div>

      {/* Rectangular Buttons */}
      <div className="button-container-row">
        <button
          className="rectangular-button"
          onClick={() => openModal("contacts")}
        >
          📞 Emergency Contacts
        </button>
        <button
          className="rectangular-button"
          onClick={() => openModal("hotlines")}
        >
          ☎️ Emergency Hotlines
        </button>
        <button className="rectangular-button" onClick={showSubmittedData}>
          📋 View Submitted Data
        </button>
      </div>

      <a className="back-link" href="/">
        Back to Home
      </a>

      {/* View Submitted Data Modal */}
      {viewSubmittedModal && (
        <div className="overlay">
          <div className="modal">
            <h2>Submitted Data</h2>
            <h3>Ambulance Data:</h3>
            {submittedData.ambulance.length > 0 ? (
              <ul>
                {submittedData.ambulance.map((data, index) => (
                  <li key={index}>
                    <strong>Location:</strong> {data.location},{" "}
                    <strong>Condition:</strong> {data.condition},{" "}
                    <strong>Contact:</strong> {data.contact}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No ambulance data submitted yet.</p>
            )}
            <h3>Police Data:</h3>
            {submittedData.police.length > 0 ? (
              <ul>
                {submittedData.police.map((data, index) => (
                  <li key={index}>
                    <strong>Location:</strong> {data.location},{" "}
                    <strong>Report:</strong> {data.report},{" "}
                    <strong>Contact:</strong> {data.contact}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No police data submitted yet.</p>
            )}
            <button
              type="button"
              className="modal-close-button"
              onClick={closeViewSubmittedModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Call an Ambulance Modal */}
      {modal === "ambulance" && (
        <div className="overlay">
          <div className="modal">
            <h2>Call an Ambulance</h2>
            <form onSubmit={handleAmbulanceSubmit}>
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={ambulanceData.location}
                  onChange={handleAmbulanceChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="condition">Condition:</label>
                <textarea
                  id="condition"
                  name="condition"
                  value={ambulanceData.condition}
                  onChange={handleAmbulanceChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="contact">Contact Number:</label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={ambulanceData.contact}
                  onChange={handleAmbulanceChange}
                  required
                />
              </div>
              <button type="submit" className="modal-submit-button">
                Submit
              </button>
              <button
                type="button"
                className="modal-close-button"
                onClick={closeModal}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Call a Police Modal */}
      {modal === "police" && (
        <div className="overlay">
          <div className="modal">
            <h2>Call the Police</h2>
            <form onSubmit={handlePoliceSubmit}>
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={policeData.location}
                  onChange={handlePoliceChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="report">Report:</label>
                <textarea
                  id="report"
                  name="report"
                  value={policeData.report}
                  onChange={handlePoliceChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="contact">Contact Number:</label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={policeData.contact}
                  onChange={handlePoliceChange}
                  required
                />
              </div>
              <button type="submit" className="modal-submit-button">
                Submit
              </button>
              <button
                type="button"
                className="modal-close-button"
                onClick={closeModal}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emergency;
