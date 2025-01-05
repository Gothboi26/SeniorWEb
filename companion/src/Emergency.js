import React from "react";
import "./Emergency.css"; // Ensure styles are updated to center content
import Navbar from "./Navbar"; // Import the Navbar component

const Emergency = ({ role, handleLogout }) => {
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

  return (
    <div className="emergency-container">
      <Navbar role={role} handleLogout={handleLogout} />
      <div className="emergency-content">
        <h4 className="section-title">EMERGENCY SERVICES</h4>
        <h2 className="section-call">Need Help? Contact Below</h2>
        <p className="emergency-instructions">
          In case of an emergency, please refer to the contact details below.
          Always prioritize your safety and provide accurate details when
          calling for help!
        </p>

        <div className="emergency-contacts">
          <h3>Emergency Hotlines</h3>
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

        <div className="emergency-contacts">
          <h3>Emergency Contacts</h3>
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

        <a className="back-link" href="/">
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default Emergency;
