import React, { useState } from "react";
import Navbar from "./Navbar";
import { Login, Register } from "./AuthComponents";
import AdminDashboard from "./AdminDashboard";
import ClientDashboard from "./ClientDashboard";
import logo from "./logo.png"; // For login page
import appheader from "./bgval.jpg"; // For header after login
import "./App.css";

function App() {
  const [role, setRole] = useState(null);

  return (
    <div className="App">
      {/* Show Navbar only if user is logged in */}
      {role && <Navbar />}

      {/* Show clickable header image only if user is logged in */}
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
        {/* Show login and register components if no role is set */}
        {!role ? (
          <div className="login-container">
            <img src={logo} alt="Logo" className="App-logo" />
            <h1>Welcome to companiON!</h1>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              ullamcorper sit amet nibh ac tincidunt. Vivamus efficitur metus.
            </p>
            <Login setRole={setRole} />
            <Register />
          </div>
        ) : (
          // Show dashboard based on the user's role
          <>
            {role === "admin" && <AdminDashboard />}
            {role === "client" && <ClientDashboard />}
          </>
        )}
      </main>

      {/* Show footer only if user is logged in */}
      {role && (
        <footer className="App-footer">
          <p>&copy; 2024</p>
        </footer>
      )}
    </div>
  );
}

export default App;
