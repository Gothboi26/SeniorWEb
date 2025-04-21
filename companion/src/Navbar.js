import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "./assets/logo.png";

function Navbar({ role }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSlideOpen, setIsSlideOpen] = useState(false); // 👈 added for slide toggle
  const navigate = useNavigate();

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

  if (role !== "client") return null;

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      {/* Top Header */}
      <div className="TopHeader">
        <span className="TopHeader-date">{formattedDate}</span>
        <span className="TopHeader-time">{formattedTime}</span>
      </div>

      {/* ✅ Body Slide Container */}
      <div className={`BodySlideContainer ${isSlideOpen ? "open" : ""}`}>
        <button className="close-slide" onClick={() => setIsSlideOpen(false)}>
          ×
        </button>
        <div className="BodySlideContent">
          <ul className="Sidebar-links">
            <li>
              <Link to="/" onClick={() => setIsSlideOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/senior-care" onClick={() => setIsSlideOpen(false)}>
                Senior Care
              </Link>
            </li>
            <li>
              <Link to="/emergency" onClick={() => setIsSlideOpen(false)}>
                Emergency Services
              </Link>
            </li>
            <li>
              <Link to="/chat" onClick={() => setIsSlideOpen(false)}>
                Chat Assistance
              </Link>
            </li>
            <li>
              <Link to="/profile" onClick={() => setIsSlideOpen(false)}>
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
      </div>

      {/* Main Navbar */}
      <nav className="Navbar">
        <div className="Navbar-logo-container">
          <img src={logo} alt="Logo" />
        </div>

        {/* ✅ Hamburger Menu */}
        <div className="Navbar-hamburger" onClick={() => setIsSlideOpen(true)}>
          <div className="Navbar-hamburger-icon"></div>
          <div className="Navbar-hamburger-icon"></div>
          <div className="Navbar-hamburger-icon"></div>
        </div>

        {/* Main Nav Links */}
        <div className="Navbar-links-container">
          <ul className="Navbar-links">
            {/* ...existing nav links... */}
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
                Emergency Services
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/emergency">Police</Link>
                </li>
                <li>
                  <Link to="/emergency">Ambulance</Link>
                </li>
                <li>
                  <Link to="/emergency">Firetruck</Link>
                </li>
                <li>
                  <Link to="/emergency">Family</Link>
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
                  <Link to="/chat">Operating Hours</Link>
                </li>
                <li>
                  <Link to="/chat">Services Offered</Link>
                </li>
                <li>
                  <Link to="/chat">Talk to Admin</Link>
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
