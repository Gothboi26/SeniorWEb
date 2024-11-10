import React, { useState } from "react";
import Navbar from "./Navbar";
import { Login, Register } from "./AuthComponents";
import CalendarComponent from "./CalendarComponent";
import logo from "./logo.png"; // Ensure this path points to your logo image
import "./App.css"; // Your updated CSS styles

function App() {
  const [role, setRole] = useState(null);

  return (
    <div className="App">
      {/* Show Navbar only if user is logged in (role is not null) */}
      {role && <Navbar />}

      {/* Show header only if user is logged in */}
      {role && (
        <header className="App-header">
          <h1>companiON</h1>
        </header>
      )}

      <main className="App-content">
        {/* If no role is set, show the login and register components */}
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
          // Show different content based on the user's role
          <>
            {role === "admin" && (
              <div>
                <h2>Welcome, Admin! You have full access.</h2>
                <CalendarComponent />
              </div>
            )}
            {role === "client" && (
              <div>
                <h2>Welcome, Client! Limited access is granted.</h2>
                <CalendarComponent />
              </div>
            )}
          </>
        )}
      </main>

      {/* Show footer only if user is logged in */}
      {role && (
        <footer className="App-footer">
          <p>&copy; 2024 </p>
        </footer>
      )}
    </div>
  );
}

export default App;