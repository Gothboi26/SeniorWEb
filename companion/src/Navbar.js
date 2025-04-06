import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "./assets/logo.png";

function Navbar({ role }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate(); // ← Needed for redirect

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString();

  // 🚨 If not client, don't show navbar
  if (role !== "client") return null;

  // ✅ Logout function inside Navbar
  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/"); // Redirect to login page
  };

  return (
    <>
      {/* Top Header */}
      <div className={`TopHeader ${isSidebarOpen ? "hide-topheader" : ""}`}>
        <span className="TopHeader-date">{formattedDate}</span>
        <span className="TopHeader-time">{formattedTime}</span>
      </div>

      {/* Main Navbar */}
      <nav className={`Navbar ${isSidebarOpen ? "hide-navbar" : ""}`}>
        <div className="Navbar-logo-container">
          <img src={logo} alt="Logo" />
        </div>

        {/* Hamburger for mobile */}
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
              <Link to="/" onClick={() => setIsSidebarOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/senior-care" onClick={() => setIsSidebarOpen(false)}>
                Senior Care
              </Link>
            </li>
            <li>
              <Link to="/emergency" onClick={() => setIsSidebarOpen(false)}>
                Emergency Contacts
              </Link>
            </li>
            <li>
              <Link to="/chat" onClick={() => setIsSidebarOpen(false)}>
                Chat Assistance
              </Link>
            </li>
            <li>
              <Link to="/profile" onClick={() => setIsSidebarOpen(false)}>
                Profile
              </Link>
            </li>
            <li>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Main Nav Links */}
        <div className="Navbar-links-container">
          <ul className="Navbar-links">
            <li>
              <Link to="/" className="Navbar-links-b">
                Home
              </Link>
            </li>

            {/* Senior Care Dropdown */}
            <li className="dropdown">
              <Link to="/senior-care" className="Navbar-links-b">
                Senior Care
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    to="/senior-care"
                    state={{ service: "Health Check-up" }}
                  >
                    Health Check-up
                  </Link>
                </li>
                <li>
                  <Link to="/senior-care" state={{ service: "Free Medicine" }}>
                    Free Medicine
                  </Link>
                </li>
                <li>
                  <Link to="/senior-care" state={{ service: "Massage" }}>
                    Massage
                  </Link>
                </li>
                <li>
                  <Link
                    to="/senior-care"
                    state={{ service: "Dental Check-up" }}
                  >
                    Dental Check-up
                  </Link>
                </li>
                <li>
                  <Link to="/senior-care" state={{ service: "Eye Check-up" }}>
                    Eye Check-up
                  </Link>
                </li>
              </ul>
            </li>

            {/* Emergency Contacts Dropdown */}
            <li className="dropdown">
              <Link to="/emergency" className="Navbar-links-b">
                Emergency Contacts
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/emergency/police">Police</Link>
                </li>
                <li>
                  <Link to="/emergency/ambulance">Ambulance</Link>
                </li>
                <li>
                  <Link to="/emergency/firetruck">Firetruck</Link>
                </li>
                <li>
                  <Link to="/emergency/family">Family</Link>
                </li>
              </ul>
            </li>

            {/* Chat Assistance Dropdown */}
            <li className="dropdown">
              <Link to="/chat" className="Navbar-links-b">
                Chat Assistance
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/chat/hours">Operating Hours</Link>
                </li>
                <li>
                  <Link to="/chat/services">Services Offered</Link>
                </li>
                <li>
                  <Link to="/chat/talk-to-admin">Talk to Admin</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Profile and Logout on right */}
        <div className="Navbar-right">
          <Link to="/profile" className="profile-link">
            Profile
          </Link>
          <button className="logout-link" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
