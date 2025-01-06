import React from "react";
import "./ChatInquiries.css";
import womanIcon from "./woman.png"; // Importing the avatar image
import manIcon from "./man.png"; // Importing the send button icon
import sendIcon from "./send.png"; // Importing the send button icon

const ChatInquiries = () => {
  return (
    <div className="chat-inquiries-container">
      <section className="chat-inquiries">
        <div className="recent-chats">
          <h2>Recent Chat</h2>
          <div className="chat-list">
            <div className="chat-item active">
              <img src={womanIcon} alt="Avatar" /> {/* Icon for the user */}
              <p>Carlos Sainz Jr.</p>
            </div>
            <div className="chat-item">
              <img src={womanIcon} alt="Avatar" /> {/* Icon for the user */}
              <p>Another User</p>
            </div>
            <div className="chat-item">
              <img src={manIcon} alt="Avatar" /> {/* Icon for the user */}
              <p>Another User</p>
            </div>
            <div className="chat-item">
              <img src={manIcon} alt="Avatar" /> {/* Icon for the user */}
              <p>Another User</p>
            </div>  
            {/* Add more chat items as needed */}
          </div>
        </div>

        <div className="chat-window">
          <header className="chat-header">
            <h3>Carlos Sainz Jr.</h3>
            <p>09123456789 | 666 Batumbakal St.</p>
            <p>Emergency Contact: Carlos Sainz</p>
          </header>
          <div className="chat-messages">
            <div className="message incoming">
            <img src={manIcon} alt="Avatar" /> {/* Icon for the user */}
              <p>I need help. Blah, blah, blah, blah...</p>
            </div>
            <div className="message outgoing">
            <img src={womanIcon} alt="Avatar" /> {/* Icon for the user */}
              <p>Hello! How can I help you?</p>
              
            </div>
            
          </div>
          <footer className="chat-footer">
            <input type="text" placeholder="Type a message..." />
            <button className="send-button">
              <img src={sendIcon} alt="Send Icon" /> {/* Icon for the send button */}
            </button>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default ChatInquiries;
