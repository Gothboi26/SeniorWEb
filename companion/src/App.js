import React, { useState } from "react";
import Navbar from "./Navbar";
import { Login, Register } from "./AuthComponents";
import CalendarComponent from "./CalendarComponent";
import "./App.css";

function App() {
  const [role, setRole] = useState(null);

  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        <h1>companiON</h1>
      </header>

      <main className="App-content">
        {/* If no role is set, show the login and register components */}
        {!role ? (
          <div>
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

      <footer className="App-footer">
        <p>&copy; 2024 </p>
      </footer>
    </div>
  );
}

export default App;
