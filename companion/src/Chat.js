import React from "react";
import Navbar from "./Navbar"; // Import the Navbar component

const Chat = ({ role, handleLogout }) => {
  return (
    <div>
      <Navbar role={role} handleLogout={handleLogout} />
      <h2>Chat Assistance</h2>
      <p>Hi, and thanks for reaching out to companiON!</p>
      <a href="/">Back to Home</a>
    </div>
  );
};

export default Chat;
