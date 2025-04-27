import React, { useState, useEffect } from "react";
import "./ChatInquiries.css";
import sendIcon from "./assets/send.png";

const ChatInquiries = () => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: "register",
        content: { role: "admin", username: "admin" }
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "notification") {
        const from = data.from;
        const message = `${from}: ${data.content}`;
        setNotifications((prev) => [...prev, message]);
        addToUserList({ username: from, profilePicture: null });
        return;
      }

      if (data.type === "message") {
        const { from, to, content } = data;
        const otherUser = from === "admin" ? to : from;

        saveMessageToDatabase(from, otherUser, content);

        setMessages((prev) => ({
          ...prev,
          [otherUser]: [...(prev[otherUser] || []), { from, content }]
        }));

        addToUserList({ username: otherUser, profilePicture: null });
      }
    };

    setWs(socket);
    return () => socket.close();
  }, []);

  const handleSendMessage = () => {
    const trimmed = newMessage.trim();
    if (!trimmed || !ws || ws.readyState !== WebSocket.OPEN || !selectedUser) return;

    const message = {
      type: "message",
      from: "admin",
      to: selectedUser,
      content: trimmed
    };

    ws.send(JSON.stringify(message));
    setNewMessage("");
  };

  const saveMessageToDatabase = (sender, receiver, content) => {
    fetch("https://websocket-production-b0d9.up.railway.app/save_message.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender, receiver, content }),
    });
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user.username);

    try {
      const res = await fetch(`https://backend-production-4629.up.railway.app/get_messages.php?sender=admin&receiver=${user.username}`);
      const result = await res.json();

      const history = result.messages || [];
      const profilePicture = result.profile_picture || null;

      // ✅ Only add history if it's not already loaded
      setMessages((prev) => {
        if (prev[user.username]) return prev;

        return {
          ...prev,
          [user.username]: history.map((msg) => ({
            from: msg.sender,
            content: msg.content,
            timestamp: msg.timestamp,
          }))
        };
      });

      // ✅ Always update profile picture
      setUserList((prev) =>
        prev.map((u) =>
          u.username === user.username ? { ...u, profilePicture } : u
        )
      );
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  const addToUserList = (newUser) => {
    setUserList((prev) => {
      const exists = prev.some((u) => u.username === newUser.username);
      return exists ? prev : [...prev, newUser];
    });
  };

  return (
    <div className="chat-inquiries-container">
      <div className="chat-inquiries">

        {/* Sidebar */}
        <div className="recent-chats">
          <h2>Recent Chats</h2>
          <div className="chat-list">
            {userList.map((user, idx) => (
              <div
                key={idx}
                className={`chat-item ${selectedUser === user.username ? "active" : ""}`}
                onClick={() => handleSelectUser(user)}
              >
                <img src={user.profilePicture || "/default-profile.png"} alt="User" />
                <span>{user.username}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          <div className="chat-header">
            {selectedUser ? `Chat with ${selectedUser}` : "Select a user to chat"}
          </div>

          {notifications.length > 0 && (
            <div className="notifications">
              <h4>Notifications</h4>
              {notifications.map((note, idx) => (
                <div key={idx} className="notification-item">{note}</div>
              ))}
            </div>
          )}

          <div className="chat-messages">
            {selectedUser &&
              messages[selectedUser]?.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${msg.from === "admin" ? "outgoing" : "incoming"}`}
                >
                  {msg.content}
                </div>
              ))}
          </div>

          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!selectedUser}
            />
            <button
              onClick={handleSendMessage}
              className="send-button"
              disabled={!selectedUser}
            >
              <img src={sendIcon} alt="Send" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInquiries;
