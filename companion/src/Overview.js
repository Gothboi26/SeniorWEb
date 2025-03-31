import React, { useEffect, useState, useCallback } from "react";
import "./Overview.css";
import editIcon from "./assets/edit.png";
import deleteIcon from "./assets/delete.png";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);


const Overview = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentsByDate, setAppointmentsByDate] = useState([]);
  const [appointmentsByService, setAppointmentsByService] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const formatLocalDate = (date) => {
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const filterAppointmentsByDate = useCallback((date) => {
    const formattedDate = formatLocalDate(date);
    const filteredAppointments = appointments.filter(
      (appointment) => appointment.date === formattedDate
    );
    setAppointmentsByDate(filteredAppointments);
  }, [appointments]);

  const fetchAppointmentsData = useCallback(() => {
    fetch("http://localhost/php/appointments.php")
      .then((response) => response.json())
      .then((data) => {
        setAppointments(data);
        processAppointmentsByService(data);
        setLoading(false); // <-- Add this line
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setLoading(false); // <-- Also add here to stop loading even if an error occurs
      });
  }, []);

  useEffect(() => {
    fetchAppointmentsData();
  }, [fetchAppointmentsData]); // Fetch data once when the component mounts

  useEffect(() => {
    if (appointments.length > 0) {
      filterAppointmentsByDate(selectedDate);
    }
  }, [selectedDate, appointments, filterAppointmentsByDate]); // Runs when appointments or selectedDate changes


  const handlePrevDate = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextDate = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  
const [ageDistribution, setAgeDistribution] = useState({
  "60-65": 0,
  "66-70": 0,
  "71-75": 0,
  "76-80": 0,
});

const [totalPatients, setTotalPatients] = useState(0);

const fetchAgeDistribution = useCallback(() => {
  fetch("http://localhost/php/get_users.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const ageData = { "60-65": 0, "66-70": 0, "71-75": 0, "76-80": 0 };
        setTotalPatients(data.data.length); // Count total patients

        data.data.forEach((user) => {
          const age = parseInt(user.age, 10);
          if (age >= 60 && age <= 65) ageData["60-65"]++;
          else if (age >= 66 && age <= 70) ageData["66-70"]++;
          else if (age >= 71 && age <= 75) ageData["71-75"]++;
          else if (age >= 76 && age <= 80) ageData["76-80"]++;
        });

        setAgeDistribution(ageData);
      } else {
        console.error("Failed to fetch users:", data.message);
      }
    })
    .catch((error) => console.error("Error fetching user data:", error));
}, []);

useEffect(() => {
  fetchAgeDistribution();
}, [fetchAgeDistribution]);

const maxYValue = Math.max(...Object.values(ageDistribution)) + 2; // Add extra line above highest bar

const chartOptions = {
  responsive: true,
  plugins: {
    title: { display: true, text: "Age Distribution of Senior Patients" }
  },
  scales: {
    x: { title: { display: true, text: "Senior Age Group" } }, 
    y: { 
      title: { display: true, text: "Number of Senior Patients" }, 
      beginAtZero: true,
      suggestedMax: maxYValue // Ensures extra space above highest bar
    }
  }
};

const getChartData = () => ({
  labels: Object.keys(ageDistribution),
  datasets: [
    {
      label: "Number of Senior Patients",
      data: Object.values(ageDistribution),
      backgroundColor: "#4A90E2",
    },
  ],
});

  const processAppointmentsByService = (data) => {
    const serviceCount = {};

    data.forEach((appointment) => {
      const service = appointment.service || "Unknown";
      serviceCount[service] = (serviceCount[service] || 0) + 1;
    });

    setAppointmentsByService(serviceCount);
  };

    // Prepare Data for Pie Chart
  const getPieChartData = () => ({
    labels: Object.keys(appointmentsByService),
    datasets: [
      {
        data: Object.values(appointmentsByService),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800", "#9C27B0",
        ],
      },
    ],
  });
  
  const handleEdit = (appointment) => {
    setEditMode(true);
    setCurrentAppointment(appointment);
  };

  const handleDelete = (appointmentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmDelete) return;

    fetch(`http://localhost/php/appointments.php?id=${appointmentId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setAppointments((prevAppointments) =>
          prevAppointments.filter((app) => app.id !== appointmentId)
        );
        alert("Appointment deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting appointment:", error);
      });
  };

  const handleSaveEdit = (updatedAppointment) => {
    if (isSaving) return;

    setIsSaving(true);
    fetch("http://localhost/php/appointments.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAppointment),
    })
      .then((response) => response.json())
      .then((data) => {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === data.id ? data : appointment
          )
        );
        setEditMode(false);
        setCurrentAppointment(null);
        alert("Appointment updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating appointment:", error);
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="overview-container">
      <div className="summary-cards">
        <div className="card total-patients">
          <h3>Total Patients</h3>
          <p className="count">{totalPatients}</p>
        </div>
        <div className="card card-light">
          <h3>Total Appointments</h3>
            {Object.keys(appointmentsByService).length > 0 ? (
              <Pie data={getPieChartData()} />
            ) : (
              <p className="no-appointments">No appointment data available.</p>
            )}
        </div>
        <div className="card card-light">
          <h3>Seniors per Chapter</h3>
          <p className="count">500</p>
        </div>
      </div>

      <div className="statistics-section">
        <div className="statistics">
          <h3>Patient's Statistics</h3>
          
          {/* Bar Chart */}
          <div className="stats-chart">
            <Bar data={getChartData()} options={chartOptions} />
          </div>
        </div>

        <div className="appointments">
          <h3>Appointments</h3>
          <div className="appointment-nav">
              <button onClick={handlePrevDate}>&lt;</button>
              <span>
                {selectedDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
              </span>
              <button onClick={handleNextDate}>&gt;</button>
          </div>
            {loading ? (
              <p>Loading...</p>
            ) : appointmentsByDate.length === 0 ? (
              <p>No appointments available.</p>
            ) : (
              <ul>
                {appointmentsByDate.map((appointment) => (
                  <li key={appointment.id} className="appointment-item">
                    <p>{appointment.details}</p>
                    <img src={editIcon} alt="Edit" onClick={() => setEditMode(true)} />
                    <img src={deleteIcon} alt="Delete" onClick={() => handleDelete(appointment.id)} />
                  </li>
                ))}
              </ul>
            )}
        </div>
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
              onChange={(e) =>
                setCurrentAppointment({
                  ...currentAppointment,
                  service: e.target.value,
                })
              }
            />
            <label>Status:</label>
            <input
              type="text"
              value={currentAppointment.status}
              onChange={(e) =>
                setCurrentAppointment({
                  ...currentAppointment,
                  status: e.target.value,
                })
              }
            />
            <label>Time:</label>
            <input
              type="text"
              value={currentAppointment.time}
              onChange={(e) =>
                setCurrentAppointment({
                  ...currentAppointment,
                  time: e.target.value,
                })
              }
            />
            <button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => setEditMode(false)}>
              Cancel
            </button>
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
              <th>Patients Name</th>
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
                <td>{appointment.sex}</td>{" "}
                {/* Display the gender (sex) of the patient */}
                <td>{appointment.service}</td>
                <td className={appointment.status.toLowerCase()}>
                  {appointment.status}
                </td>
                <td className="action-icons">
                  <img
                    src={editIcon}
                    alt="Edit"
                    onClick={() => handleEdit(appointment)}
                  />
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    onClick={() => handleDelete(appointment.id)}
                  />
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