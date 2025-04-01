import React, { useState } from "react";
import "./Footer.css";
import fb from "./assets/fb.png"; // Facebook logo
import email from "./assets/email.png"; // Email logo

function Footer() {
  // State to track if the modal is open and its content
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // Function to open the modal with specific content
  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  return (
    <>
      <footer className="App-footer">
        <div className="footer-section">
          <h1>Barangay General Tiburcio De Leon</h1>
          <div className="footer-content">
            <div className="footer-text1">
              <p>
                <strong>For any inquiries, please contact us.</strong>
                <br />
                <strong>Email:</strong> gentdeleonbarangay@gmail.com <br />
                <strong>Contact Number:</strong> 091234567890
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
                {/* Updated Links to open Modal */}
                <button className="footer-link"
                  onClick={() => openModal(
                      `<h2>Terms of Service</h2>
                      <h3>1. Introduction</h3>
                      <p>Welcome to Barangay General Tiburcio De Leon’s official website. By accessing or using our website, you agree to comply with these Terms of Service (TOS). If you do not agree with any part of these terms, please do not use our website.</p>

                      <h3>2. Use of the Website</h3>
                      <p>This website is intended for informational and community services only.</p>
                      <ul>
                        <li>You agree not to use this site for any illegal or fraudulent activities.</li>
                        <li>You must not upload, share, or distribute harmful, offensive, or malicious content.</li>
                        <li>The barangay reserves the right to modify or terminate access to this website at any time.</li>
                      </ul>

                      <h3>3. User Accounts & Authentication</h3>
                      <ul>
                        <li>If registration is required, you must provide accurate and complete information.</li>
                        <li>You are responsible for maintaining the security of your login credentials.</li>
                        <li>Unauthorized access to other users’ accounts is strictly prohibited.</li>
                      </ul>

                      <h3>4. Content Ownership & Intellectual Property</h3>
                      <p>All logos, text, images, and information on this website are the property of Barangay General Tiburcio De Leon unless otherwise stated.</p>
                      <p>You may not copy, reproduce, or distribute any content without prior written consent from the barangay office.</p>

                      <h3>5. Limitation of Liability</h3>
                      <p>The barangay is not liable for any technical errors, security breaches, or interruptions in the website’s services.</p>
                      <p>We do not guarantee that all information on this site is always accurate and up-to-date.</p>

                      <h3>6. Modification of Terms</h3>
                      <p>The barangay reserves the right to update these Terms of Service at any time.</p>
                      <p>Users will be notified of any changes, and continued use of the website signifies acceptance of the updated terms.</p>

                      <h3>7. Contact Information</h3>
                      <p>If you have any concerns regarding these Terms of Service, you may contact us:</p>
                      <p><strong>Email: </strong>gentdeleonbarangay@gmail.com</p>
                      <p><strong>Phone: </strong>091234567890</p>
                      `
                    )
                  }
                >
                  TERMS OF SERVICE
                </button>

                <button className="footer-link"
                  onClick={() => openModal(
                      `<h2>Privacy Policy</h2>
                      
                      <h3>1. Introduction</h3>
                      <p>Barangay General Tiburcio De Leon values your privacy and is committed to protecting your personal data in compliance with the Data Privacy Act of 2012 (Republic Act No. 10173) of the Philippines.</p>
                      <p>This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit our website.</p>

                      <h3>2. Personal Data We Collect</h3>
                      <p>We may collect the following personal data:</p>
                      <ul>
                        <li>Name</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>IP address and browsing activity</li>
                      </ul>

                      <h3>3. How We Use Your Data</h3>
                      <p>We collect your data for the following purposes:</p>
                      <ul>
                        <li>Communication: To respond to inquiries and provide barangay-related information.</li>
                        <li>Security & Monitoring: To ensure the safety and integrity of our website.</li>
                        <li>Feedback & Surveys: To improve barangay services based on user input.</li>
                      </ul>

                      <h3>4. Data Protection & Security</h3>
                      <p>Your data is stored securely using encryption and access controls.</p>
                      <p>We do not sell or share your personal data with third parties unless required by law.</p>
                      <p>We comply with the Data Privacy Act of 2012 to ensure your information is protected.</p>

                      <h3>5. Your Rights Under the Data Privacy Act</h3>
                      <p>As a user, you have the right to:</p>
                      <ul>
                        <li>Access your personal data stored in our system.</li>
                        <li>Correct or update any incorrect or incomplete information.</li>
                        <li>Request deletion of your data unless legally required to keep it.</li>
                        <li>Withdraw consent to data collection at any time.</li>
                      </ul>

                      <h3>6. Third-Party Links & External Services</h3>
                      <p>Our website may contain links to external websites (e.g., Facebook, Email).</p>
                      <p>We do not control these third-party sites and are not responsible for their privacy practices.</p>

                      <h3>7. Cookies & Tracking Technologies</h3>
                      <p>We may use cookies to enhance user experience and analyze website traffic.</p>
                      <p>Users can disable cookies through their browser settings.</p>

                      <h3>8. Updates to Privacy Policy</h3>
                      <p>We may update this Privacy Policy from time to time to reflect new regulations or changes in our services.</p>
                      <p>Users will be notified of any significant updates.</p>

                      <h3>9. Contact Information</h3>
                      <p>For concerns or questions regarding your privacy, you may contact:</p>
                      <p><strong>Email: </strong>gentdeleonbarangay@gmail.com</p>
                      <p><strong>Phone: </strong>091234567890</p>
                      `
                    )
                  }
                >
                  PRIVACY POLICY
                </button>

              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <div dangerouslySetInnerHTML={{ __html: modalContent }} />
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
