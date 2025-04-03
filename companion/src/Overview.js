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
    fetch("http://localhost/php/appointments.php", {
      credentials: "include", // Ensures session cookies are sent
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data); // Debugging
  
        if (data.status === "success" && Array.isArray(data.data)) {
          setAppointments(data.data);
        } else {
          console.error("Unexpected API response format:", data);
          setAppointments([]); // Ensure it's an empty array to prevent errors
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setLoading(false);
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
  "60-70": 0,
  "71-80": 0,
  "81-90": 0,
  "91-100": 0,
  "101-110": 0,
  "111-120": 0,
  "121-130": 0,
});


const [totalPatients, setTotalPatients] = useState(0);

const fetchAgeDistribution = useCallback(() => {
  fetch("http://localhost/php/get_users.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const ageData = { "60-70": 0, "71-80": 0, "81-90": 0, "91-100": 0, "101-110": 0, "111-120": 0, "121-130": 0 };
        setTotalPatients(data.data.length); // Count total patients

        data.data.forEach((user) => {
          const age = parseInt(user.age, 10);
          if (age >= 60 && age <= 70) ageData["60-70"]++;
          else if (age >= 71 && age <= 80) ageData["71-80"]++;
          else if (age >= 81 && age <= 90) ageData["81-90"]++;
          else if (age >= 91 && age <= 100) ageData["91-100"]++;
          else if (age >= 101 && age <= 110) ageData["101-110"]++;
          else if (age >= 111 && age <= 120) ageData["111-120"]++;
          else if (age >= 121 && age <= 130) ageData["121-130"]++;
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
  indexAxis: 'y',  // This will make the bars horizontal
  scales: {
    x: { 
      title: { display: true, text: "Number of Senior Patients" }, 
      beginAtZero: true,
      suggestedMax: maxYValue // Ensures extra space above highest bar
    },
    y: { 
      title: { display: true, text: "Senior Age Group" }
    }
  }
};

const getChartData = () => ({
  labels: Object.keys(ageDistribution),
  datasets: [
    {
      label: "Number of Senior Patients",
      data: Object.values(ageDistribution),
      backgroundColor: "#C31C1C",
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

  /*Seniors Per Chapter Pie Chart */
const [chapters, setChapters] = useState({});

const fetchChapterDistribution = useCallback(() => {
  fetch("http://localhost/php/get_users.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const chapterData = {};
        
        // Count number of seniors in each chapter
        data.data.forEach((user) => {
          const chapter = user.group_chapter || "Unknown"; // Handle missing chapter
          chapterData[chapter] = (chapterData[chapter] || 0) + 1;
        });

        setChapters(chapterData); // Save chapter data for pie chart
      } else {
        console.error("Failed to fetch users:", data.message);
      }
    })
    .catch((error) => console.error("Error fetching user data:", error));
}, []);

useEffect(() => {
  fetchChapterDistribution(); // Fetch chapter data when component mounts
}, [fetchChapterDistribution]);

const pieChartOptions = {
  responsive: true,
  plugins: {
    title: { display: true, text: "Seniors per Chapter" },
    legend: {
      position: 'bottom',  // This moves the legend to the right side
    },
  },
};


// Prepare Data for Pie Chart (Seniors per Chapter)
const getChaptersPieChartData = () => ({
  labels: Object.keys(chapters),
  datasets: [
    {
      data: Object.values(chapters),
      backgroundColor: [
        "#3cb44b", "#9A6324", "#469990", "#a9a9a9", "#bfef45", "#911eb4", "#dcbeff", "#e6194B",
        "#ffd8b1", "#4363d8", "#aaffc3", "#fffac8", "#f032e6", "#000075", "#800000", 
      ],
    },
  ],
});

  return (
    <div className="overview-container">
      <div className="summary-cards">
        
        <div className="card total-patients">
          <h3>Total of Registered Seniors</h3>
          <p className="count">{totalPatients}</p>
        </div>
        
        <div className="card card-light">
          <h3>Seniors per Chapter</h3>
          {Object.keys(chapters).length > 0 ? (
            <Pie data={getChaptersPieChartData()} options={pieChartOptions} />
          ) : (
            <p className="no-appointments">No chapter data available.</p>
          )}
        </div>

    
        <div className="appointment-summary">
          <h3>Total Number of Appointments</h3>
          
        </div>
      </div>

      <div className="statistics-section">
        
        <div className="statistics">
          <h3>Summary of Total Registered Seniors</h3>
          <div className="stats-chart">
          <Bar data={getChartData()} options={chartOptions} />
          </div>
        </div>

        <div className="age-summary">
          <h3>Senior Age Group</h3>
          <Bar data={getChartData()} options={chartOptions} />
        </div>

      </div>


    <div className="appointment-table">
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

    </div>
  );
};

export default Overview;