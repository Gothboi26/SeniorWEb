import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "./assets/logo.png";

function Navbar({ handleLogout, role }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = currentTime.toLocaleTimeString();

  // Render Navbar only if the role is "client"
  if (role !== "client") {
    return null;
  }

  return (
    <>
      {/* Top Header (Date | companION | Time) */}
      <div className="TopHeader">
        <span className="TopHeader-date">{formattedDate}</span>
        <span className="TopHeader-title">companiON</span>
        <span className="TopHeader-time">{formattedTime}</span>
      </div>

      {/* Main Navbar */}
      <nav className="Navbar">
        <div className="Navbar-logo-container">
          <img src={logo} alt="Logo" />
          <div className="Navbar-logo">Brgy. Gen. T. De Leon</div>
        </div>

        <div
          className="Navbar-hamburger"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <div className="Navbar-hamburger-icon"></div>
          <div className="Navbar-hamburger-icon"></div>
          <div className="Navbar-hamburger-icon"></div>
        </div>

        {/* Sidebar for mobile */}
        <div className={`Sidebar ${isSidebarOpen ? "open" : ""}`}>
          <ul className="Sidebar-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/senior-care">Senior Care</Link>
            </li>
            <li>
              <Link onClick={handleLogout} to="#logout">
                Logout
              </Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </div>

        {/* Centered Navigation Links */}
        <div className="Navbar-links-container">
          <ul className="Navbar-links">
            <li>
              <Link to="/" className="Navbar-links-b">
                Home
              </Link>
            </li>
            <li>
              <Link to="/senior-care" className="Navbar-links-b">
                Appointments
              </Link>
            </li>
            <li>
              <Link to="/emergency" className="Navbar-links-b">
                Emergency Contacts
              </Link>
            </li>
            <li>
              <Link to="/chat" className="Navbar-links-b">
                Chat Assistance
              </Link>
            </li>
          </ul>
        </div>

        {/* Right-aligned Logout & Profile */}
        <div className="Navbar-right">
          <Link to="/profile" className="profile-link">
            Profile
          </Link>
          <Link onClick={handleLogout} className="Navbar-links-a" to="#logout">
            Logout
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
