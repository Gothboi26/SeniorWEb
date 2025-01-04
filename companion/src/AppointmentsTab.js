import React from "react";
import "./AppointmentsTab.css";

const AppointmentsTab = () => {
  return (
    <div className="appointments-tab">
      <form className="appointments-form">
        <h4>Maximum Appointments Per Day:</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Categories</label>
            <input type="text" defaultValue="Health Check-up" />
          </div>
          <div className="form-group">
            <label>Number (e.g. 100)</label>
            <input type="number" defaultValue="100" />
          </div>
        </div>
        <button className="update-btn" type="button">
          Update Appointment Details
        </button>
        <div className="auto-approval">
          <label>Appointment Auto Approval</label>
          <input type="checkbox" className="toggle-switch" defaultChecked />
        </div>
      </form>
    </div>
  );
};

export default AppointmentsTab;
