import React, { useState } from "react";

function Login({ setRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch("https://backend-production-4629.up.railway.app/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.status === "success") {
        if (result.force_change) {
          alert("⚠️ You are still using the default password. Please change it before proceeding.");
          setShowModal(true);
        } else {
          alert(`✅ Logged in as ${result.role}`);
          setRole(result.role);
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Login error", error);
      alert("Login failed. Please check your server.");
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("https://backend-production-4629.up.railway.app/change_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, newPassword }),
      });

      const result = await res.json();
      if (result.status === "success") {
        alert("🔐 Password updated. You may now proceed.");
        setShowModal(false);
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setRole("client");
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Failed to change password.");
      console.error(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (showModal) {
        handleChangePassword();
      } else {
        handleLogin();
      }
    }
  };

  return (
    <div className="form-container">
      <h2>LOGIN</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleLogin}>Login</button>

      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 999
        }}>
          <div style={{
            background: "#fff", padding: "25px", borderRadius: "12px",
            width: "320px", boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            display: "flex", flexDirection: "column", gap: "12px"
          }}>
            <h3 style={{ marginBottom: "5px", textAlign: "center" }}>Change Default Password</h3>
            <p style={{ fontSize: "14px", marginBottom: "5px", textAlign: "center" }}>
              Change your default password to continue.
            </p>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                padding: "8px", borderRadius: "6px", border: "1px solid #ccc", width: "100%"
              }}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                padding: "8px", borderRadius: "6px", border: "1px solid #ccc", width: "100%"
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <button
                style={{
                  background: "#2e7d32", color: "white", padding: "8px 16px",
                  borderRadius: "6px", border: "none"
                }}
                onClick={handleChangePassword}
              >
                Submit
              </button>
              <button
                style={{
                  background: "#c62828", color: "white", padding: "8px 16px",
                  borderRadius: "6px", border: "none"
                }}
                onClick={() => {
                  setShowModal(false);
                  alert("⚠️ You must change your password to continue.");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Login };
  