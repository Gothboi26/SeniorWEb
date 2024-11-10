// AdminDashboard.js
import React from "react";
import CalendarComponent from "./CalendarComponent";

function AdminDashboard() {
  return (
    <div>
      <h2>Welcome, Admin! You have full access.</h2>
      <CalendarComponent role="admin" />
    </div>
  );
}

export default AdminDashboard;
