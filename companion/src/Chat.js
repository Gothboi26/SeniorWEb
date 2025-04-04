import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Chat.css";

function Chat({ role, handleLogout }) {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");

  const faqs = [
    {
      question: "What are your operating hours?",
      answer: "Our operating hours are from 8:00 AM to 5:00 PM, Monday to Friday.",
    },
    {
      question: "How can I book an appointment?",
      answer: "You can book an appointment through our website or by calling our hotline.",
    },
    {
      question: "What services do you offer?",
      answer: "We offer a variety of services including general check-ups, consultations, and more.",
    },
  ];

  // Step 1: Fetch the username from the PHP session
  useEffect(() => {
    fetch("http://localhost/php/get_username.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.username) {
          setUsername(data.username);
        } else {
          console.warn("No username found in session.");
        }
      })
      .catch((err) => console.error("Error fetching username:", err));
  }, []);

  // Step 2: Connect to WebSocket when username is ready
  useEffect(() => {
    if (!username) return;

    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "register",
          content: { role: "client", username },
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    setWs(socket);
    return () => socket.close();
  }, [username]);

  // Handle sending a message
  const handleSendMessage = () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || !ws || ws.readyState !== WebSocket.OPEN) return;

    const message = {
      type: "message",
      from: username,
      to: "admin",
      content: trimmedMessage,
    };

    ws.send(JSON.stringify(message));
    setNewMessage("");
  };

  // Handle FAQ selection
  const handleFAQClick = (faq) => {
    setMessages((prev) => [...prev, { from: "bot", content: faq.answer }]);
  };

  // Handle "Talk to Admin"
  const handleTalkToAdmin = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "notify-admin",
          from: username,
        })
      );
      setMessages((prev) => [
        ...prev,
        { from: "bot", content: "Connecting you to an admin..." },
      ]);
    }
  };

  return (
    <div>
      <Navbar role={role} handleLogout={handleLogout} />

      <div className="chat-assistance">
        <div className="chat-header-container">
          <h1 className="chat-title">Chat Assistance</h1>
        </div>

        <div className="chat-details-container">
          {/* Notice */}
          <div className="chat-description">
            <p className="chat-desc-title">
              <strong>Paalala:</strong> Ang Chat Assistance ay idinisenyo upang magbigay ng agarang kasagutan sa inyong mga katanungan.
            </p>
          </div>

          {/* FAQs */}
          <div className="faq-section">
            <h3>Frequently Asked Questions</h3>
            <ul>
              {faqs.map((faq, index) => (
                <li key={index}>
                  <button onClick={() => handleFAQClick(faq)}>{faq.question}</button>
                </li>
              ))}
            </ul>
            <button onClick={handleTalkToAdmin} className="talk-to-admin-button">
              Talk to Admin
            </button>
          </div>

          {/* Chat Window */}
          <div className="chat-window-container">
            <div className="chat-window-box">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-bubble ${
                    message.from === username ? "user" : message.from === "bot" ? "bot" : "admin"
                  }`}
                >
                  <strong>{message.from}:</strong> {message.content}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="chat-input-container">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="chat-input-text"
              />
              <button onClick={handleSendMessage} className="chat-send-button">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer role={role} />
    </div>
  );
}

export default Chat;
