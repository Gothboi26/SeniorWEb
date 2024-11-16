import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Login, Register } from "./AuthComponents";
import AdminDashboard from "./AdminDashboard";
import ClientDashboard from "./ClientDashboard";
import logo from "./logo.png"; // For login page
import appheader from "./bgval.jpg"; // For header after login
import Emergency from "./Emergency";
import Chat from "./Chat";
import SeniorCare from "./SeniorCare";
import "./App.css";

function App() {
  const [role, setRole] = useState(null);
  const location = useLocation(); // Hook to get the current path
  const navigate = useNavigate(); // To navigate programmatically

  // Load role from localStorage on page load
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole); // Set role if it exists in localStorage
    } else if (location.pathname === "/") {
      setRole(null); // Reset role if on login page
    }
  }, [location]);

  const handleLogin = (role) => {
    localStorage.setItem("role", role); // Save role in localStorage
    setRole(role); // Set role in the app state
    navigate("/calendar"); // Navigate to the calendar page after login
  };

  const handleLogout = () => {
    localStorage.removeItem("role"); // Remove role from localStorage
    setRole(null); // Reset role in the app state
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/senior-care" element={<SeniorCare />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/chat" element={<Chat />} /> {/* Add route for Chat Assistance */}
        {/* Add other routes here */}
      </Routes>

      {/* Render Navbar and other content when not on /emergency or /chat routes */}
      {!location.pathname.includes("/senior-care") && 
        !location.pathname.includes("/emergency") &&
        !location.pathname.includes("/chat") && (
          <>
            {role && <Navbar handleLogout={handleLogout} />} {/* Pass handleLogout to Navbar */}

            {/* Only show this header when the user is logged in */}
            {role && (
              <header className="App-header">
                <a
                  href="https://www.facebook.com/profile.php?id=61550950657692"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={appheader}
                    alt="companiON Header"
                    className="App-header-image"
                  />
                </a>
              </header>
            )}

            <main className="App-content">
              {!role ? (
                <div className="login-container">
                  <img src={logo} alt="Logo" className="App-logo" />
                  <h1>Welcome to companiON!</h1>
                  <p className="description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Aenean ullamcorper sit amet nibh ac tincidunt. Vivamus
                    efficitur metus.
                  </p>
                  <Login setRole={handleLogin} />
                  <Register />
                </div>
              ) : (
                <>
                  {role === "admin" && <AdminDashboard />}
                  {role === "client" && <ClientDashboard />}
                </>
              )}
            </main>

            {role && (
              <footer className="App-footer">
                <p>&copy; 2024</p>
              </footer>
            )}
          </>
        )}
    </div>
  );
}

export default App;
