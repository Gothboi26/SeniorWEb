import React, { useEffect, useState } from "react";
import "./Appointments.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [remarksInput, setRemarksInput] = useState({});

  useEffect(() => {
    fetchAppointments();

    window.addEventListener("slotsUpdated", fetchAppointments);
    window.addEventListener("storage", handleStorageSync);

    return () => {
      window.removeEventListener("slotsUpdated", fetchAppointments);
      window.removeEventListener("storage", handleStorageSync);
    };
  }, []);

  const handleStorageSync = (e) => {
    if (e.key === "slotsUpdatedAt") {
      fetchAppointments();
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost/php/get_appointment.php", {
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
    const appointment = appointments.find((a) => a.id === appointmentId);
    const remark = remarksInput[appointmentId] || "";

    try {
      const response = await fetch("http://localhost/php/get_appointment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          appointment_id: appointmentId,
          status,
          remarks: remark,
          service: appointment?.service,
          date: appointment?.date,
          time: appointment?.time,
          adjust_slot: status === "approved"
        }),
      });

      const result = await response.json();
      if (result.success) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === appointmentId ? { ...a, status, remarks: remark } : a
          )
        );
        setStatusMessage("Status updated successfully.");
        setRemarksInput((prev) => ({ ...prev, [appointmentId]: "" }));

        // Trigger real-time slot sync
        window.dispatchEvent(new Event("slotsUpdated"));
        localStorage.setItem("slotsUpdatedAt", Date.now());
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setStatusMessage("Failed to update status.");
    }
  };

  const formatDateReadable = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatTimeAMPM = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(h);
    date.setMinutes(m);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
  };

  const filteredAppointments = appointments.filter(
    (app) => (app.status || "pending").toLowerCase() === activeTab
  );

  return (
    <div className="appointment-table-container">
      <div className="admin-appoint-header">
        <h2>Appointment Management</h2>
        <div className="appoint-tabs">
          {["pending", "approved", "reject"].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {statusMessage && <div className="status-message">{statusMessage}</div>}

      {loading ? (
        <div>Loading appointments...</div>
      ) : (
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Type</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Remarks</th>
              {activeTab === "pending" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((app) => (
              <tr key={app.id}>
                <td>{app.username}</td>
                <td>{app.service}</td>
                <td>{formatDateReadable(app.date)}</td>
                <td>{formatTimeAMPM(app.time)}</td>
                <td>
                  <span className={`status ${app.status}`}>{app.status}</span>
                </td>
                <td>
                  {app.status === "pending" ? (
                    <input
                      type="text"
                      className="remarks-input"
                      placeholder="Enter remarks..."
                      value={remarksInput[app.id] || ""}
                      onChange={(e) =>
                        setRemarksInput((prev) => ({
                          ...prev,
                          [app.id]: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    app.remarks || "-"
                  )}
                </td>
                {activeTab === "pending" && (
                  <td className="action-icons">
                    <button
                      className="approve-button"
                      onClick={() => updateStatus(app.id, "approved")}
                    >
                      ✔
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => updateStatus(app.id, "reject")}
                    >
                      ✖
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Appointments;
