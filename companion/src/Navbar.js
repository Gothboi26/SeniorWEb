import React, { useState } from "react";
import "./Navbar.css";

function Navbar({ handleLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className="Navbar">
      <div className="Navbar-logo">Brgy. Gen. T. De Leon</div>

      {/* Hamburger icon for small screens */}
      <div className="Navbar-hamburger" onClick={toggleSidebar}>
        <div className="Navbar-hamburger-icon"></div>
        <div className="Navbar-hamburger-icon"></div>
        <div className="Navbar-hamburger-icon"></div>
      </div>

      {/* Sidebar */}
      <div className={`Sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul className="Sidebar-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#seniorcare">Senior Care</a>
          </li>
          <li>
            <a href="#events">Events</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li>
            <a onClick={handleLogout} className="Navbar-links-a" href="#logout">
              Logout
            </a>
          </li>
        </ul>
      </div>

      {/* Main content area that adjusts to show Sidebar */}
      <ul className="Navbar-links">
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="#seniorcare">Senior Care</a>
        </li>
        <li>
          <a href="#events">Events</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
        <li>
          <a onClick={handleLogout} className="Navbar-links-a" href="#logout">
            Logout
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
