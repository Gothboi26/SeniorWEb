import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "./logo.png";

function Navbar({ handleLogout, role }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Render Navbar only if the role is "client"
  if (role !== "client") {
    return null;
  }

  return (
    <nav className="Navbar">
      <div className="Navbar-logo-container">
        <img src={logo} alt="Logo" />
        <div className="Navbar-logo">Brgy. Gen. T. De Leon</div>
      </div>

      <div className="Navbar-hamburger" onClick={toggleSidebar}>
        <div className="Navbar-hamburger-icon"></div>
        <div className="Navbar-hamburger-icon"></div>
        <div className="Navbar-hamburger-icon"></div>
      </div>

      <div className={`Sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul className="Sidebar-links">
          <li>
            <Link to="/">Home</Link> {/* Navigate to the main page */}
          </li>
          <li>
            <Link to="/senior-care">Senior Care</Link>
          </li>

          <li>
            <Link
              onClick={handleLogout}
              className="Navbar-links-a"
              to="#logout"
            >
              Logout
            </Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </div>

      <ul className="Navbar-links">
        <li>
          <Link to="/" className="Navbar-links-b">
            Home
          </Link>{" "}
          {/* Navigate to the main page */}
        </li>
        <li>
          <Link to="/senior-care" className="Navbar-links-b">
            Appointment
          </Link>
        </li>
        <li>
          <Link to="/emergency" className="Navbar-links-b">
            Contact List
          </Link>
        </li>
        <li>
          <Link to="/chat" className="Navbar-links-b">
            Chat
          </Link>
        </li>
        <li>
          <Link onClick={handleLogout} className="Navbar-links-a" to="#logout">
            Logout
          </Link>
        </li>
      </ul>

      <div className="Navbar-edit-profile">
        <button className="Navbar-profile-button">
          <Link to="/profile" className="profile-link">
            Profile
          </Link>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
