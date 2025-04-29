import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "./assets/logo.png";
import senior from "./assets/senior.png";
import chats from "./assets/chatinq.png";
import home from "./assets/home.png";
import logout from "./assets/logout.png";
import profile from "./assets/profile.png";

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
      <div className={`BodySlideContainer ${isSlideOpen ? "open" : ""}`}>
        <button className="close-slide" onClick={() => setIsSlideOpen(false)}>
          ×
        </button>
        <div className="BodySlideContent">
          <div className="slide-sidebar-logo">
            <img src={logo} alt="Logo" className="slide-logo-img" />
            <span className="slide-logo-text">Brgy. Gen. T. De Leon</span>
          </div>
          <hr className="slide-sidebar-divider" />
          <ul className="slide-sidebar-links">
            <li
              className="slide-sidebar-item"
              onClick={() => setIsSlideOpen(false)}
            >
              <Link to="/">
                <img src={home} alt="Home" className="slide-icon-home" />
                Home
              </Link>
            </li>
            <hr className="slide-sidebar-divider" />
            <li
              className="slide-sidebar-item"
              onClick={() => setIsSlideOpen(false)}
            >
              <Link to="/senior-care">
                <img src={senior} alt="Senior" className="slide-icon-senior" />
                Senior Care
              </Link>
            </li>
            <hr className="slide-sidebar-divider" />
            <li
              className="slide-sidebar-item"
              onClick={() => setIsSlideOpen(false)}
            >
              <Link to="/emergency">
                <img
                  src="/icons/emergency.png"
                  alt="Emergency"
                  className="slide-icon-emergency"
                />
                Emergency Services
              </Link>
            </li>
            <hr className="slide-sidebar-divider" />
            <li
              className="slide-sidebar-item"
              onClick={() => setIsSlideOpen(false)}
            >
              <Link to="/chat">
                <img src={chats} alt="Chat" className="slide-icon-chat" />
                Chat Assistance
              </Link>
            </li>
            <hr className="slide-sidebar-divider" />
            <li
              className="slide-sidebar-item"
              onClick={() => setIsSlideOpen(false)}
            >
              <Link to="/profile">
                <img
                  src={profile}
                  alt="Profile"
                  className="slide-icon-profile"
                />
                Profile
              </Link>
            </li>
            <hr className="slide-sidebar-divider" />
            <li className="slide-sidebar-item">
              <button className="slide-logout-button" onClick={handleLogout}>
                <img src={logout} alt="Logout" className="slide-icon-logout" />
                Logout
              </button>
            </li>
          </ul>
          <hr className="slide-sidebar-divider" />
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
