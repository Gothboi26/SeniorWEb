import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import './Chat.css';
import fb from "./fb.png"; // For fb logo
import email from "./email.png"; // For email logo

function Chat({ role, handleLogout }) {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("ClientUser"); // Replace with dynamic username if needed

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'register', content: { role: 'client', username } }));
    };
    
    socket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    };

    setWs(socket);

    return () => socket.close();
  }, [username]);

  const handleSendMessage = () => {
    if (ws.readyState === WebSocket.OPEN) {
      const message = { from: username, to: 'admin', content: newMessage };
      ws.send(JSON.stringify({ type: 'message', ...message }));
      setNewMessage("");
      setMessages(prevMessages => [...prevMessages, message]);
    } else {
      console.warn("WebSocket is not open yet. Please try again.");
    }
  };

  return (
    <div>
      <Navbar role={role} handleLogout={handleLogout} />
      <div className="chat-assistance">
        <div className="chat-header">
          <h2>Chat Assistance</h2>
          <h1>Need Help? Chat Us!</h1>
        </div>
        <div className="chat-description">
          <p>Paalala sa Paggamit ng Chat Assistance:</p>
          <ul>
            <li>Magpakilala - Ibigay ang iyong buong pangalan at dahilan ng pag-chat.</li>
            <li>Maging malinaw - Ipaliwanag nang maayos ang iyong tanong o concern.</li>
            <li>Hintayin ang tugon - Maghintay nang ilang saglit habang sinusuri ng admin ang iyong mensahe.</li>
            <li>Iwasan ang spam - Huwag magpadala ng paulit-ulit na mensahe.</li>
          </ul>
          <p>Ang Chat Assistance ay para sa mabilis at maayos na komunikasyon. Salamat sa iyong pakikiisa!</p>
        </div>
        
        <div className="chat-window">
          {messages.map((message, index) => (
            <div key={index} className={`chat-bubble ${message.from === username ? 'user' : 'bot'}`}>
              <strong>{message.from}:</strong> {message.content}
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
          />
          <button onClick={handleSendMessage} className="chat-send-button">Send</button>
        </div>
      </div>
      <footer className="App-footer">
                <div className="footer-section">
                  <h1>Barangay General Tiburcio De Leon</h1>
                  <div className="footer-content">
                    <div className="footer-text1">
                      <p>
                        For any inquiries, please contact us. <br />
                        Email: gentdeleonbarangay@gmail.com <br />
                        Contact Number: 091234567890
                      </p>
                    </div>
                    <div className="footer-icons-and-links">
                      <div className="footer-icons">
                        <a
                          href="https://facebook.com"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={fb}
                            alt="Facebook-Logo"
                            className="icon fb-logo"
                          />
                        </a>
                        <a href="mailto:gentdeleonbarangay@gmail.com">
                          <img
                            src={email}
                            alt="Email-Logo"
                            className="icon email-logo"
                          />
                        </a>
                      </div>
                      <div className="vertical-line"></div>
                      <div className="footer-links">
                        <a href="/terms" className="footer-link">
                          TERMS OF SERVICE
                        </a>
                        <a href="/privacy" className="footer-link">
                          PRIVACY POLICY
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>

    </div>
  );
}

export default Chat;
