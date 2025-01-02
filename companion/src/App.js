import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Login } from "./AuthComponents";
import AdminDashboard from "./AdminDashboard";
import ClientDashboard from "./ClientDashboard";
import Emergency from "./Emergency";
import Chat from "./Chat";
import SeniorCare from "./SeniorCare";
import Profile from "./Profile";
import SeniorList from "./SeniorList";
import logo from "./logo.png"; // For login page
import fb from "./fb.png"; // Facebook logo
import email from "./email.png"; // Email logo
import "./App.css";

function App() {
  const [role, setRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState("");

  // Update the date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDateTime(
        new Intl.DateTimeFormat("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }).format(now)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check role in localStorage on page load
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
      navigate(storedRole === "admin" ? "/admin-dashboard" : "/client-dashboard");
    }
  }, [navigate]);

  const handleLogin = (userRole) => {
    localStorage.setItem("role", userRole);
    setRole(userRole);
    navigate(userRole === "admin" ? "/admin-dashboard" : "/client-dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    setRole(null);
    navigate("/");
  };

  const showFooter = role === "client" || location.pathname === "/";

  return (
    <div className="App">
      {/* Navbar only visible after login */}
      {role && <Navbar handleLogout={handleLogout} />}

      <Routes>
        {/* Role-based dashboards */}
        <Route path="/admin-dashboard" element={role === "admin" ? <AdminDashboard /> : null} />
        <Route path="/client-dashboard" element={role === "client" ? <ClientDashboard /> : null} />

        {/* Additional routes */}
        <Route path="/profile" element={<Profile role={role} />} />
        <Route path="/senior-list" element={<SeniorList />} />
        <Route path="/senior-care" element={<SeniorCare role={role} />} />
        <Route path="/emergency" element={<Emergency role={role} />} />
        <Route path="/chat" element={<Chat role={role} />} />

        {/* Default login page */}
        <Route
          path="/"
          element={
            !role ? (
              <div className="login-page">
                <div className="logo-container">
                  <h1>Barangay General Tiburcio De Leon</h1>
                  <img src={logo} alt="Logo" className="app-logo" />
                  <div className="date-time-container">{dateTime}</div>
                </div>
                <div className="login-container">
                  <h1>Welcome to Barangay General Tiburcio De Leon Health Portal</h1>
                  <p className="description">
                    This platform is designed to make health services more accessible. Manage
                    records, schedule appointments, and more.
                  </p>
                  <div className="form-container">
                    <label htmlFor="username">Email</label>
                    <input type="text" id="username" placeholder="Juan" />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Juan123" />
                    <p className="forgot-password">Forgot Password?</p>
                    <button onClick={() => handleLogin("client")}>Login as Client</button>
                    <button onClick={() => handleLogin("admin")}>Login as Admin</button>
                  </div>
                </div>
              </div>
            ) : null
          }
        />
      </Routes>

      {/* Footer visible for login and client */}
      {showFooter && (
        <footer className="App-footer">
          <div className="footer-section">
            <h1>Barangay General Tiburcio De Leon</h1>
            <div className="footer-content">
              <p>
                For inquiries: <br />
                Email: gentdeleonbarangay@gmail.com <br />
                Contact: 091234567890
              </p>
              <div className="footer-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <img src={fb} alt="Facebook-Logo" />
                </a>
                <a href="mailto:gentdeleonbarangay@gmail.com">
                  <img src={email} alt="Email-Logo" />
                </a>
              </div>
              <div className="footer-links">
                <a href="/terms">Terms of Service</a>
                <a href="/privacy">Privacy Policy</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
