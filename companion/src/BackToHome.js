import React from "react";
import { Link } from "react-router-dom";
import "./BackToHome.css";
import leftArrowIcon from "./assets/leftarrow.png"; // Import the image

function BackToHome() {
  return (
    <div className="back-home-container">
      <Link to="/" className="back-link">
        <img src={leftArrowIcon} alt="Back Arrow" className="arrow-icon" />
        Back to Home
      </Link>
    </div>
  );
}

export default BackToHome;
