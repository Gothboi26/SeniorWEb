import React, { useEffect, useState } from "react";
import "./Appointments.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("https://companionbackend-production.up.railway.app/get_appointment.php", {
        credentials: "include",
      });
      const data = await response.json();
      const normalizedData = data.map((a) => ({
        ...a,
        status: a.status ? a.status.toLowerCase() : "pending",
      }));
      setAppointments(normalizedData);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, status) => {
    try {
      const response = await fetch("https://companionbackend-production.up.railway.app/get_appointment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ appointment_id: appointmentId, status }),
      });
      const result = await response.json();
      if (result.success) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === appointmentId ? { ...a, status } : a))
        );
        setStatusMessage("Status updated successfully.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setStatusMessage("Failed to update status.");
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch("https://companionbackend-production.up.railway.app/get_appointment.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ appointment_id: appointmentId }),
      });
      const result = await response.json();
      if (result.success) {
        setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
        setStatusMessage("Appointment deleted successfully.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      setStatusMessage("Failed to delete appointment.");
    }
  };

  const saveEdit = async () => {
    try {
      const response = await fetch("https://companionbackend-production.up.railway.app/get_appointment.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editing),
      });
      const result = await response.json();
      if (result.success) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === editing.appointment_id ? { ...a, ...editing } : a))
        );
        setStatusMessage("Appointment updated successfully.");
        setEditing(null);
      }
    } catch (error) {
      console.error("Update error:", error);
      setStatusMessage("Failed to update appointment.");
    }
  };

  const filteredAppointments = appointments.filter(
    (app) => (app.status || "pending").toLowerCase() === activeTab
  );

  return (
    <div className="table-container">
      <h2>Appointment Management</h2>

      <div className="tabs">
        {["pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {statusMessage && <div className="status-message">{statusMessage}</div>}

      {loading ? (
        <div>Loading appointments...</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Type</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((app) => (
              <tr key={app.id}>
                <td>{app.username}</td>
                <td>
                  {editing?.appointment_id === app.id ? (
                    <input
                      value={editing.service}
                      onChange={(e) => setEditing({ ...editing, service: e.target.value })}
                    />
                  ) : (
                    app.service
                  )}
                </td>
                <td>
                  {editing?.appointment_id === app.id ? (
                    <input
                      type="date"
                      value={editing.date}
                      onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                    />
                  ) : (
                    app.date
                  )}
                </td>
                <td>
                  {editing?.appointment_id === app.id ? (
                    <input
                      value={editing.time}
                      onChange={(e) => setEditing({ ...editing, time: e.target.value })}
                    />
                  ) : (
                    app.time
                  )}
                </td>
                <td>
                  <span className={`status ${app.status}`}>{app.status}</span>
                </td>
                <td className="action-icons">
                  {activeTab === "pending" ? (
                    <>
                      <button
                        className="approve-button"
                        onClick={() => updateStatus(app.id, "approved")}
                      >
                        ✔
                      </button>
                      <button
                        className="reject-button"
                        onClick={() => updateStatus(app.id, "rejected")}
                      >
                        ✖
                      </button>
                    </>
                  ) : (
                    <span className="no-actions">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Appointments;
  