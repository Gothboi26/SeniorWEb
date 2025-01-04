import React, { useEffect, useState } from "react";
import "./Appointments.css"; // Ensure this CSS file contains the styles

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(""); // To display success/error messages

  // Fetch appointments from the backend when the component mounts
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost/php/appointments.php"); // Fetch all appointments
        const data = await response.json();

        // Update the state with the fetched data
        if (data && Array.isArray(data)) {
          setAppointments(data);
        } else {
          console.error("Invalid response from backend:", data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Function to handle approve or reject action
  const handleAction = async (appointmentId, status) => {
    setStatusMessage(""); // Reset previous status message
    try {
      const response = await fetch("http://localhost/php/update_appointment.php", { // Update PHP file path
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment_id: appointmentId,
          status: status, // approved or rejected
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update the appointment status in the state after action is performed
        setAppointments((prevAppointments) =>
          prevAppointments.map((app) =>
            app.id === appointmentId ? { ...app, status: status } : app
          )
        );
        setStatusMessage("Appointment status updated successfully.");
      } else {
        setStatusMessage("Failed to update appointment status.");
        console.error("Failed to update appointment status", result.error);
      }
    } catch (error) {
      console.error("Error handling action:", error);
      setStatusMessage("An error occurred while updating the status.");
    }
  };

  // Show a loading message if data is being fetched
  if (loading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div className="table-container">
      <h2>Appointment Request</h2>
      {/* Display success/error message */}
      {statusMessage && <div className="status-message">{statusMessage}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.username}</td> {/* Display username from users table */}
              <td>{appointment.service}</td>
              <td>{appointment.date}</td>
              <td className="time-text">{appointment.time}</td>
              <td>
                <span className={`status ${appointment.status.toLowerCase()}`}>
                  {appointment.status} {/* Display current status */}
                </span>
              </td>
              <td className="action-icons">
                <button
                  className="approve-button"
                  onClick={() => handleAction(appointment.id, "approved")}
                  disabled={appointment.status === "approved"} // Disable button if already approved
                >
                  ✔
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleAction(appointment.id, "rejected")}
                  disabled={appointment.status === "rejected"} // Disable button if already rejected
                >
                  ✖
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Appointments;
