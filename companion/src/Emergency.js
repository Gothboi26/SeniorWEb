import React from "react";
import "./Emergency.css"; // Ensure styles are updated to center content
import Navbar from "./Navbar"; // Import the Navbar component
import Footer from "./Footer";
import police from "./assets/police.png";
import ambulance from "./assets/ambulance.png";
import firetruck from "./assets/firetruck.png";
import family from "./assets/family.png";

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
              <li>
              Sa oras ng emergency, pindutin ang tamang button para sa nais tawagan:
              </li>
              <li>
              Siguraduhing ibigay ang tamang detalye tulad ng lokasyon, uri ng emergency, at contact number.
              </li>
              <li>
                <strong>Pangalan</strong>
              </li>
              <li>
                <strong>Address</strong>
              </li>
              <li>
                <strong>Contact Number</strong>
              </li>
            </ul>
          </div>

          <div className="buttons-container">
            <div className="police-container">
              <button>
                  <img src={police} className="police-icon" alt="police"></img>
                  <span className="police-title">Police Patrol</span>
              </button>
            </div>
            <div className="ambulance-container">
              <button>
                  <img src={ambulance} className="ambulance-icon"alt="ambulance"></img>
                  <span className="ambulance-title">Ambulance</span>
              </button>
            </div>
            <div className="firetruck-container">
              <button>
                  <img src={firetruck} className="firetruck-icon"alt="firetruck"></img>
                  <span className="firetruck-title">Fire Truck</span>
              </button>
            </div>
            <div className="family-container">
              <button>
                  <img src={family} className="family-icon" alt="family"></img>
                  <span className="family-title">Family</span>
              </button>
            </div>
          </div>




        </div>
        
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

        <div className="emergency-contacts">
          <h3>Emergency Hotlines</h3>
          
        </div>

        <div className="emergency-contacts">
          <h3>Emergency Contacts</h3>
          
        </div>

        <a className="back-link" href="/">
          Back to Home
        </a>

        <Footer role={role} />
      </div>
    </div>
  );
};

export default Emergency;
