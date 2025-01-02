import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Login } from "./AuthComponents";
import AdminDashboard from "./AdminDashboard";
import ClientDashboard from "./ClientDashboard";
import logo from "./logo.png"; // For login page
import Emergency from "./Emergency";
import Chat from "./Chat";
import SeniorCare from "./SeniorCare";
import Profile from "./Profile";
import "./App.css";
import SeniorList from "./SeniorList";

function App() {
  const [role, setRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState("");

  // Update the date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(now);
      setDateTime(formattedDate);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    } else if (location.pathname === "/") {
      setRole(null);
    }
  }, [location]);

  const handleLogin = (role) => {
    localStorage.setItem("role", role);
    setRole(role);
    navigate("/calendar");
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    setRole(null);
    navigate("/");
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/profile" element={<Profile role={role} />} />
        <Route path="/senior-list" element={<SeniorList />} />
        <Route path="/senior-care" element={<SeniorCare role={role} />} />
        <Route path="/emergency" element={<Emergency role={role} />} />
        <Route path="/chat" element={<Chat role={role} />} />
      </Routes>

      {!location.pathname.includes("/profile") &&
        !location.pathname.includes("/senior-list") &&
        !location.pathname.includes("/senior-care") &&
        !location.pathname.includes("/emergency") &&
        !location.pathname.includes("/chat") && (
          <>
            {role === "client" && (
              <Navbar handleLogout={handleLogout} role={role} />
            )}
            {role && <header className="App-header"></header>}
            <main className="App-content">
              {!role ? (
                <div className="login-page">
                  <div className="header"></div>
                  <div className="logo-container">
                    <h1>Barangay Tiburcio De Leon</h1>
                    <div className="app-logo-container">
                      <img src={logo} alt="Logo" className="app-logo" />
                    </div>
                    <div className="date-time-container">{dateTime}</div>
                  </div>

                  <div className="login-container">
                    <h1>Welcome to Barangay Tiburcio De Leon Health Portal!</h1>
                    <p className="description">
                      This platform is designed to make health services more
                      accessible and convenient for everyone. Here, you can
                      manage patient records, schedule appointments, and send
                      inquiries directly to our health center. Your health and
                      well-being are our priority!
                    </p>
                    <div className="form-container">
                      <label htmlFor="username">Email</label>
                      <input
                        type="text"
                        id="username"
                        placeholder="Juan"
                      />
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        placeholder="Juan123"
                      />
                      <p className="forgot-password">Forgot Password?</p>
                      <button onClick={() => handleLogin("client")}>
                        Login
                      </button>
                      
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {role === "admin" && <AdminDashboard />}
                  {role === "client" && <ClientDashboard />}
                </>
              )}
            </main>
            <footer className="App-footer">
              <h1>Barangay General Tiburcio De Leon</h1>
              <div className="footer-text1">
                <p>
                  For any inquiries, please contact us. <br></br>
                  Email:             gentdeleonbarangay@gmail.com <br></br>
                  Contact Number:    091234567890 
                </p>
              </div>
              <div className="footer-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <img src={fb} alt="Facebook-Logo" className="fb-logo" />
                  
                </a>
                <a href="mailto:gentdeleonbarangay@gmail.com">
                  <img src={email} alt="Email-Logo" className="email-logo" />
                  
                </a>
              </div>
            </footer>
          </>
        )}
    </div>
  );
}

export default App;
