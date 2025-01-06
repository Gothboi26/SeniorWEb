import React from "react";
import "./NotificationsTab.css";

const NotificationsTab = () => {
  const notifications = [
    "New Appointment Requests",
    "Cancellations/Reschedules",
    "System Updates or Warnings",
    "Urgent Alerts for Emergencies",
  ];

  return (
    <div className="tab-content">
      <h4>Notifications</h4>
      <p>Here you can manage notifications.</p>
      <div className="notifications-list">
        {notifications.map((notification, index) => (
          <div key={index} className="notification-item">
            <span>{notification}</span>
            <label className="toggle-container">
              <input type="checkbox" className="toggle-switch" />
              <span className="slider"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsTab;
