import React, { useState } from "react";

function Login({ setRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await fetch("http://localhost/php/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();

    if (result.status === "success") {
      setRole(result.role);
      alert(`Logged in as ${result.role}`);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="form-container">
      <label htmlFor="username">Email</label>
      <input
        type="text"
        id="username"
        placeholder="Juan"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        placeholder="Juan123"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
    const response = await fetch("http://localhost/php/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });
    const result = await response.json();

    if (result.status === "success") {
      alert("Registration successful");
    } else {
      alert(result.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="client">Client</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export { Login, Register };
