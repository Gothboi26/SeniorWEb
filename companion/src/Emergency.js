import React from "react";
import "./Emergency.css"; // Ensure styles are updated to center content
import Navbar from "./Navbar"; // Import the Navbar component
import fb from "./fb.png"; // For fb logo
import email from "./email.png"; // For email logo

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

<<<<<<< HEAD
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
>>>>>>> parent of e09adf0 (I updated the files.)
        <div className="bhome-b">
          <button className="bhome-button">
            <a href="/" className="bhome-link">Back to Home</a>
          </button>
        </div>
        
        <footer className="App-footer">
                <div className="footer-section">
                  <h1>Barangay General Tiburcio De Leon</h1>
                  <div className="footer-content">
                    <div className="footer-text1">
                      <p>
                        For any inquiries, please contact us. <br />
                        Email: gentdeleonbarangay@gmail.com <br />
                        Contact Number: 091234567890
                      </p>
                    </div>
                    <div className="footer-icons-and-links">
                      <div className="footer-icons">
                        <a
                          href="https://facebook.com"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={fb}
                            alt="Facebook-Logo"
                            className="icon fb-logo"
                          />
                        </a>
                        <a href="mailto:gentdeleonbarangay@gmail.com">
                          <img
                            src={email}
                            alt="Email-Logo"
                            className="icon email-logo"
                          />
                        </a>
                      </div>
                      <div className="vertical-line"></div>
                      <div className="footer-links">
                        <a href="/terms" className="footer-link">
                          TERMS OF SERVICE
                        </a>
                        <a href="/privacy" className="footer-link">
                          PRIVACY POLICY
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>

<<<<<<< HEAD
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      <div className="bhome-b">
        <button className="bhome-button">
          <a href="/" className="bhome-link">
            Back to Home
          </a>
        </button>
      </div>

        <footer className="App-footer">
        <div className="footer-section">
          <h1>Barangay General Tiburcio De Leon</h1>
          <div className="footer-content">
            <div className="footer-text1">
              <p>
                For any inquiries, please contact us. <br />
                Email: gentdeleonbarangay@gmail.com <br />
                Contact Number: 091234567890
              </p>
            </div>
            <div className="footer-icons-and-links">
              <div className="footer-icons">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={fb} alt="Facebook-Logo" className="icon fb-logo" />
                </a>
                <a href="mailto:gentdeleonbarangay@gmail.com">
                  <img
                    src={email}
                    alt="Email-Logo"
                    className="icon email-logo"
                  />
                </a>
              </div>
              <div className="vertical-line"></div>
              <div className="footer-links">
                <a href="/terms" className="footer-link">
                  TERMS OF SERVICE
                </a>
                <a href="/privacy" className="footer-link">
                  PRIVACY POLICY
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> parent of e09adf0 (I updated the files.)
      </div>
    </div>
  );
};

export default Emergency;
