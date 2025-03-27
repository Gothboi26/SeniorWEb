import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import fb from "./assets/fb.png"; // Facebook logo
import email from "./assets/email.png"; // Email logo

function Footer() {
  return (
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
                <img src={email} alt="Email-Logo" className="icon email-logo" />
              </a>
            </div>
            <div className="vertical-line"></div>
            <div className="footer-links">
              <Link to="/terms" className="footer-link">
                TERMS OF SERVICE
              </Link>
              <Link to="/privacy" className="footer-link">
                PRIVACY POLICY
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
