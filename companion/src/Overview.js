import React, { useEffect, useState } from 'react';
import './Overview.css';
import editIcon from "./edit.png";
import deleteIcon from "./delete.png";
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';  // Import Calendar styles

const Overview = () => {
  const [appointments, setAppointments] = useState([]);
 
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
  const [appointmentsByDate, setAppointmentsByDate] = useState([]); // Appointments for the selected date
  const [editMode, setEditMode] = useState(false); // State to toggle edit mode
  const [currentAppointment, setCurrentAppointment] = useState(null); // State for the appointment being edited
  const [isSaving, setIsSaving] = useState(false); // To track if an appointment is being saved
  const [loading, setLoading] = useState(true); // Loading state for fetching data

  // Fetch appointments data on mount
  useEffect(() => {
    fetchAppointmentsData();
  }, []);

  const fetchAppointmentsData = () => {
    setLoading(true);
    fetch('http://localhost/php/appointments.php')
      .then(response => response.json())
      .then(data => {
        setAppointments(data);
       
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
      })
      .finally(() => setLoading(false));
  };

  // Handle date selection from the calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterAppointmentsByDate(date);
  };

  // Filter appointments based on selected date
  const filterAppointmentsByDate = (date) => {
    const formattedDate = formatLocalDate(date); // Get date in local timezone format
    const filteredAppointments = appointments.filter(appointment => appointment.date === formattedDate);
    setAppointmentsByDate(filteredAppointments);
  };

  // Helper function to convert a Date object to a local 'YYYY-MM-DD' format
  const formatLocalDate = (date) => {
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle Edit Button click
  const handleEdit = (appointment) => {
    setEditMode(true);
    setCurrentAppointment(appointment);
  };

  // Handle Delete Button click
  const handleDelete = (appointmentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmDelete) return;

    fetch(`http://localhost/php/appointments.php?id=${appointmentId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        setAppointments(prevAppointments => prevAppointments.filter(app => app.id !== appointmentId));
        alert('Appointment deleted successfully.');
      })
      .catch(error => {
        console.error('Error deleting appointment:', error);
      });
  };

  // Handle save (edit appointment)
  const handleSaveEdit = (updatedAppointment) => {
    if (isSaving) return; // Prevent multiple submissions

    setIsSaving(true);
    fetch('http://localhost/php/appointments.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedAppointment),
    })
      .then(response => response.json())
      .then(data => {
        setAppointments(prevAppointments => {
          return prevAppointments.map(appointment =>
            appointment.id === data.id ? data : appointment
          );
        });
        setEditMode(false);
        setCurrentAppointment(null);
        alert('Appointment updated successfully.');
      })
      .catch(error => {
        console.error('Error updating appointment:', error);
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="overview-container">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card total-patients">
          <h3>Total Patients</h3>
          <p className="count">15,000</p>
          <p className="change">20% Last Month</p>
        </div>
        <div className="card card-light">
          <h3>Total Appointments</h3>
          <p className="count">1.000</p>
          <p className="change">20% Last Month</p>
        </div>
        <div className="card card-light">
          <h3>Total Inquiries</h3>
          <p className="count">500</p> {/* Display the number of inquiries */}
          <p className="change">20% Last Month</p>
        </div>
      </div>

      {/* Statistics and Appointments */}
      <div className="statistics-section">
        <div className="statistics">
          <h3>Patient's Statistics</h3>
          <div className="stats-chart">
            {/* Placeholder for chart */}
          </div>
          <div className="stats-toggle">
            <button>Week</button>
            <button>Month</button>
            <button>Year</button>
          </div>
        </div>

        <div className="appointments">
          <h3>Appointments</h3>
          <div className="appointment-nav">
            {/* Additional navigation can be added here */}
          </div>

          {/* Calendar */}
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileClassName={({ date, view }) => {
              // Highlight dates with appointments
              const formattedDate = formatLocalDate(date);
              return appointments.some(app => app.date === formattedDate) ? 'highlight' : null;
            }}
          />
        </div>
      </div>

      {/* Display appointments for selected date */}
      <div className="appointments-for-date">
        <h3>Appointments on {selectedDate.toLocaleDateString()}</h3>
        {loading ? (
          <p>Loading appointments...</p>
        ) : appointmentsByDate.length === 0 ? (
          <p>No appointments on this date.</p>
        ) : (
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Service</th>
               
                <th>Time</th> {/* Added Time column */}
              </tr>
            </thead>
            <tbody>
              {appointmentsByDate.map(appointment => (
                <tr key={appointment.id}>
                  <td>{appointment.service}</td>
                  
                  <td>{appointment.time}</td> {/* Display Time */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Appointment Modal or Form */}
      {editMode && currentAppointment && (
        <div className="edit-modal">
          <h3>Edit Appointment</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit(currentAppointment);
            }}
          >
            <label>Service:</label>
            <input
              type="text"
              value={currentAppointment.service}
              onChange={(e) => setCurrentAppointment({ ...currentAppointment, service: e.target.value })}
            />
            <label>Status:</label>
            <input
              type="text"
              value={currentAppointment.status}
              onChange={(e) => setCurrentAppointment({ ...currentAppointment, status: e.target.value })}
            />
            <label>Time:</label>
            <input
              type="text"
              value={currentAppointment.time}
              onChange={(e) => setCurrentAppointment({ ...currentAppointment, time: e.target.value })}
            />
            <button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
          </form>
        </div>
      )}

      {/* Patients Table */}
      <div className="patients-table-container">
        <div className="patients-table-header">
          <h2>All Patients</h2>
          <button className="see-all-button">See All</button>
        </div>
        <table className="patients-table">
          <thead>
            <tr>
              <th></th>
              <th>Gender</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{appointment.sex}</td> {/* Display the gender (sex) of the patient */}
                <td>{appointment.service}</td>
                <td className={appointment.status.toLowerCase()}>{appointment.status}</td>
                <td className="action-icons">
                  <img src={editIcon} alt="Edit" onClick={() => handleEdit(appointment)} />
                  <img src={deleteIcon} alt="Delete" onClick={() => handleDelete(appointment.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Overview;
