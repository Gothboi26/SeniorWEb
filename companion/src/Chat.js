import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Chat.css";

function Chat({ role, handleLogout }) {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("ClientUser"); // Replace with dynamic username if needed

  const faqs = [
    { question: "What are your operating hours?", answer: "Our operating hours are from 8:00 AM to 5:00 PM, Monday to Friday." },
    { question: "How can I book an appointment?", answer: "You can book an appointment through our website or by calling our hotline." },
    { question: "What services do you offer?", answer: "We offer a variety of services including general check-ups, consultations, and more." },
  ];

  useEffect(() => {
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
      const messageData = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    };

    setWs(socket);

    return () => socket.close();
  }, [username]);

  const handleSendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = { from: username, to: "admin", content: newMessage };
      ws.send(JSON.stringify({ type: "message", ...message }));
      setNewMessage("");
      setMessages((prevMessages) => [...prevMessages, message]);
    } else {
      console.warn("WebSocket is not open yet. Please try again.");
    }
  };

  const handleFAQClick = (faq) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { from: "bot", content: faq.answer },
    ]);
  };

  const handleTalkToAdmin = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { from: "bot", content: "Connecting you to an admin..." },
    ]);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "notify-admin",
          from: username,
        })
      );
    } else {
      console.warn("WebSocket is not open yet. Please try again.");
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
          <div className="chat-description">
            <p className="chat-desc-title">
              <strong>Paalala: </strong>
              Ang Chat Assistance ay idinisenyo upang magbigay ng agarang kasagutan sa inyong mga katanungan.
            </p>
          </div>

          {/* FAQ Section */}
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
                    message.from === username ? "user" : "bot"
                  }`}
                >
                  <strong>{message.from}:</strong> {message.content}
                </div>
              ))}
            </div>

            <div className="chat-input-container">
              <div className="chat-input">
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
      </div>
      <Footer role={role} />
    </div>
  );
}

export default Chat;