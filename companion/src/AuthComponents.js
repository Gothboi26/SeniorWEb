import React, { useState } from "react";

function Login({ setRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("companionbackend-production.up.railway.app/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setRole(result.role);
        alert(`Logged in as ${result.role}`);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Check server connection.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="form-container">
      <h2>LOGIN</h2>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        id="username"
        placeholder="Juan"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        placeholder="Juan123"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <p className="forgot-password">Forgot Password?</p>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");

  const handleRegister = async () => {
    try {
      const response = await fetch("companionbackend-production.up.railway.app/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password, role }),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Registration successful");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Check server connection.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>

      <label htmlFor="register-username">Username</label>
      <input
        type="text"
        id="register-username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter username"
      />

      <label htmlFor="register-password">Password</label>
      <input
        type="password"
        id="register-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter password"
      />

      <label htmlFor="role">Select Role</label>
      <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="client">Client</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export { Login, Register };
