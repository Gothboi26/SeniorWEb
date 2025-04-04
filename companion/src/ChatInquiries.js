import React, { useState, useEffect } from "react";
import "./ChatInquiries.css";
import sendIcon from "./assets/send.png";

const ChatInquiries = () => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [username] = useState("admin"); // Default username as "admin"
  const [currentRecipient, setCurrentRecipient] = useState("");

  // Step 1: Establish WebSocket connection
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "register",
          content: { role: "admin", username: "admin" },
        })
      );
    };

    socket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);

      if (messageData.type === "notification") {
        setNotifications((prev) => [...prev, messageData.content]);
        return;
      }

      // Handle incoming message
      setMessages((prev) => [...prev, messageData]);

      // Track sender as currentRecipient (if not self)
      if (messageData.from && messageData.from !== username) {
        setCurrentRecipient(messageData.from);
      }
    };

    setWs(socket);
    return () => socket.close();
  }, []);

  // Step 2: Send message to currentRecipient
  const handleSendMessage = () => {
    const trimmed = newMessage.trim();
    if (!trimmed || !currentRecipient) return;

    const message = {
      type: "message",
      from: username,
      to: currentRecipient,
      content: trimmed,
    };

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      setNewMessage("");
    } else {
      console.warn("WebSocket not connected.");
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">Chat Inquiries</header>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications">
          <h4>Notifications</h4>
          <ul>
            {notifications.map((note, index) => (
              <li key={index} className="notification-item">{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Chat Window */}
      <div className="chat-window">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.from === username ? "outgoing" : "incoming"
            }`}
          >
            <strong>{message.from}:</strong> {message.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="chat-input"
        />
        <button onClick={handleSendMessage} className="send-button">
          <img src={sendIcon} alt="Send" />
        </button>
      </div>
    </div>
  );
};

export default ChatInquiries;
