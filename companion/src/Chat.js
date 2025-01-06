import React from "react";
import Navbar from "./Navbar"; // Import Navbar component

function Chat({ role, handleLogout }) {
  return (
    <div>
      <Navbar role={role} handleLogout={handleLogout} /> {/* Add Navbar */}
      <div className="chat-assistance">
        <h2>Chat Assistance, </h2>
        <h1>Need Help? Chat Us!</h1>
        <p>Paalala sa Paggamit ng Chat Assistance:</p>
        <ul>
          <li>Magpakilala - Ibigay ang iyong buong pangalan at dahilan ng pag-chat.</li>
          <li>Maging malinaw - Ipaliwanag nang maayos ang iyong tanong o concern.</li>
          <li>Hintayin ang tugon - Maghintay nang ilang saglit habang sinusuri ng admin ang iyong mensahe.</li>
          <li>Iwasan ang spam - Huwag magpadala ng paulit-ulit na mensahe.</li>
        </ul>
        <p>Ang Chat Assistance ay para sa mabilis at maayos na komunikasyon. Salamat sa iyong pakikiisa!</p>
        <div className="chat-window">
          <div className="chat-bubble user">Hello, I need help with my issue.</div>
          <div className="chat-bubble bot">Sure! Can you please provide more details?</div>
          <div className="chat-bubble user">I am feeling unwell and need medical advice.</div>
          <div className="chat-bubble bot">Understood. Let me connect you to a medical professional.</div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
