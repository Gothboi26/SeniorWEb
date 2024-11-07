import React from "react";
import Navbar from "./Navbar";
import CalendarComponent from "./CalendarComponent";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        <h1>companiON</h1>
      </header>
      <main className="App-content">
        <CalendarComponent />
      </main>
      <footer className="App-footer">
        <p>&copy; 2024 </p>
      </footer>
    </div>
  );
}

export default App;
