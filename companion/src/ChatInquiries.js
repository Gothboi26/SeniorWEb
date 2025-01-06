import React, { useState, useEffect } from "react";
import "./ChatInquiries.css";
import sendIcon from "./send.png"; // Importing the send button icon

const ChatInquiries = () => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'register', content: { role: 'admin' } }));
    };

    socket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    };

    setWs(socket);

    return () => socket.close();
  }, []);

  const handleSendMessage = () => {
    if (ws.readyState === WebSocket.OPEN) {
      const message = { from: 'admin', to: 'client', content: newMessage };
      ws.send(JSON.stringify({ type: 'message', ...message }));
      setNewMessage("");
      setMessages(prevMessages => [...prevMessages, message]);
    } else {
      console.warn("WebSocket is not open yet. Please try again.");
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">Chat Inquiries</header>
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.from === 'admin' ? 'outgoing' : 'incoming'}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="chat-input"
        />
        <button onClick={handleSendMessage} className="send-button">
          <img src={sendIcon} alt="Send Icon" />
        </button>
      </div>
    </div>
  );
};

export default ChatInquiries;
