import React, { useState } from "react";
import "./Setting.css";
import AccountTab from "./AccountTab";
import AppointmentsTab from "./AppointmentsTab";
import ServicesTab from "./ServicesTab";
import NotificationsTab from "./NotificationsTab";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("Account");

  return (
    <div className="setting-container">
      <div className="setting-sidebar">
        <ul>
          <li
            className={activeTab === "Account" ? "active" : ""}
            onClick={() => setActiveTab("Account")}
          >
            Account
          </li>
          <li
            className={activeTab === "Appointments" ? "active" : ""}
            onClick={() => setActiveTab("Appointments")}
          >
            Appointments
          </li>
          <li
            className={activeTab === "Services" ? "active" : ""}
            onClick={() => setActiveTab("Services")}
          >
            Services
          </li>
          <li
            className={activeTab === "Notifications" ? "active" : ""}
            onClick={() => setActiveTab("Notifications")}
          >
            Notifications
          </li>
        </ul>
      </div>
      <div className="setting-content">
        {activeTab === "Account" && <AccountTab />}
        {activeTab === "Appointments" && <AppointmentsTab />}
        {activeTab === "Services" && <ServicesTab />}
        {activeTab === "Notifications" && <NotificationsTab />}
      </div>
    </div>
  );
};

export default Setting;
