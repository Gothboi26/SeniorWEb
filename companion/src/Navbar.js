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
            <Link to="#events">Events</Link>
          </li>
          <li>
            <Link to="#contact">Contact</Link>
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
            <Link to="/profile">Edit Profile</Link>
          </li>
        </ul>
      </div>

      <ul className="Navbar-links">
        <li>
          <Link to="/">Home</Link> {/* Navigate to the main page */}
        </li>
        <li>
          <Link to="/senior-care">Senior Care</Link>
        </li>
        <li>
          <Link to="#events">Events</Link>
        </li>
        <li>
          <Link to="#contact">Contact</Link>
        </li>
        <li>
          <Link onClick={handleLogout} className="Navbar-links-a" to="#logout">
            Logout
          </Link>
        </li>
      </ul>

      <div className="Navbar-edit-profile">
        <Link to="/profile">Edit Profile</Link>
      </div>
    </nav>
  );
}

export default Navbar;
