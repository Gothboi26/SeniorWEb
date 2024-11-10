// ClientDashboard.js
import React from "react";
import CalendarComponent from "./CalendarComponent";

function ClientDashboard() {
  return (
    <div>
      <h2>Welcome, Client! Limited access is granted.</h2>
      <CalendarComponent role="client" />
    </div>
  );
}

export default ClientDashboard;
