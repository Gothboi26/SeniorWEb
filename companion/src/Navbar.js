import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="Navbar">
      <div className="Navbar-logo">companiON</div>
      <ul className="Navbar-links">
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#services">Services</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
