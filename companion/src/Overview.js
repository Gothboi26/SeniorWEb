import React, { useEffect, useState, useCallback } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import "./Overview.css";
import editIcon from "./assets/edit.png";
import deleteIcon from "./assets/delete.png";
import bellIcon from "./assets/notif.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.defaults.devicePixelRatio = 2;

const Overview = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentsByDate, setAppointmentsByDate] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userRegistrationData, setUserRegistrationData] = useState({});
  const [ageDistribution, setAgeDistribution] = useState({});
  const [chapters, setChapters] = useState({});
  const [appointmentStatusData, setAppointmentStatusData] = useState({});
  const [appointmentsPerService, setAppointmentsPerService] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationDetails, setShowNotificationDetails] = useState(false);
  const [accommodatedPerDay, setAccommodatedPerDay] = useState({});
  const [accommodatedPerServicePerMonth, setAccommodatedPerServicePerMonth] = useState({});
  const [selectedChart, setSelectedChart] = useState("appointmentsByStatus");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [genderDistribution, setGenderDistribution] = useState({ male: 0, female: 0 });

  const formatDate = (date) => new Date(date).toISOString().split("T")[0];

  const filterAppointmentsByDate = useCallback((date) => {
    const filtered = appointments.filter((a) => a.date === formatDate(date));
    setAppointmentsByDate(filtered);
  }, [appointments]);

  const fetchAppointmentsData = useCallback(() => {
    fetch("http://localhost/php/appointments.php")
      .then((res) => res.json())
      .then((data) => {
        const apps = Array.isArray(data) ? data : data.data || [];
        setAppointments(apps);
        setLoading(false);
      });
  }, []);

const [dataView, setDataView] = useState("day");

const getWeekKey = (date) => {
  const monday = new Date(date);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return `${monday.toLocaleDateString("en-US", { month: "short", day: "2-digit" })} - ${sunday.toLocaleDateString("en-US", { month: "short", day: "2-digit" })}`;
};


  useEffect(() => { fetchAppointmentsData(); }, [fetchAppointmentsData]);
  useEffect(() => { if (appointments.length) filterAppointmentsByDate(selectedDate); }, [appointments, selectedDate, filterAppointmentsByDate]);
  useEffect(() => { console.log(genderDistribution);}, [genderDistribution]);
  


  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "chat" && msg.sender === "client") {
        const newNotif = { type: "chat", message: "New chat message received", timestamp: new Date().toISOString() };
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    };
    return () => ws.close();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost/php/check_notifications.php", {
        method: "GET",
        credentials: "include", // ✅ IMPORTANT! include credentials to send cookies
      })
        .then((res) => res.json())
        .then((data) => {
          const newNotifs = [];
          if (Array.isArray(data.emergencies)) {
            data.emergencies.forEach(e =>
              newNotifs.push({ type: "emergency", ...e, timestamp: e.timestamp || new Date().toISOString() })
            );
          }
          if (Array.isArray(data.appointments)) {
            data.appointments.forEach(a =>
              newNotifs.push({ type: "appointment", ...a, timestamp: a.timestamp || new Date().toISOString() })
            );
          }
  
          if (newNotifs.length > 0) {
            newNotifs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
            setNotifications((prev) => [...newNotifs, ...prev]);
            setUnreadCount((prev) => prev + newNotifs.length);
          }
        })
        .catch((err) => console.error("Notification fetch failed", err));
    }, 10000);
  
    return () => clearInterval(interval);
  }, []);
  

  const handleNotificationClick = (item) => {
    if (item.type === "emergency") navigate("/emergencies");
    if (item.type === "appointment") navigate("/appointments");
    setShowNotificationDetails(false);
  };

  const handleEdit = (a) => { setEditMode(true); setCurrentAppointment(a); };
  const handleDelete = (id) => {
    if (window.confirm("Delete this appointment?")) {
      fetch(`http://localhost/php/appointments.php?id=${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => setAppointments((prev) => prev.filter((a) => a.id !== id)));
    }
  };

  const handleSaveEdit = (updated) => {
    if (isSaving) return;
    setIsSaving(true);
    fetch("http://localhost/php/appointments.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then((res) => res.json())
      .then((data) => {
        setAppointments((prev) => prev.map((a) => (a.id === data.id ? data : a)));
        setEditMode(false);
        setCurrentAppointment(null);
      })
      .finally(() => setIsSaving(false));
  };

  const fetchUsers = useCallback(() => {
    fetch("http://localhost/php/get_users.php")
      .then((res) => res.json())
      .then((data) => {
        const users = data.data || [];
        const ageDist = {}, chapterDist = {}, reg = {}, genderDist = { male: 0, female: 0 };
  
        users
          .filter((u) => {
            if (!startDate || !endDate) return true;
  
            const createdDate = new Date(u.created_at);
            const start = new Date(startDate);
            const end = new Date(endDate);
  
            // Normalize all dates to avoid partial-day issues
            createdDate.setHours(0, 0, 0, 0);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
  
            return createdDate >= start && createdDate <= end;
          })
          .forEach((u) => {
            // Age distribution
            const age = parseInt(u.age, 10);
            const ageGroup = Math.floor(age / 10) * 10;
            if (age >= 60) {
              const label = `${ageGroup}-${ageGroup + 9}`;
              ageDist[label] = (ageDist[label] || 0) + 1;
            }
  
            // Chapter distribution
            if (u.group_chapter) {
              chapterDist[u.group_chapter] = (chapterDist[u.group_chapter] || 0) + 1;
            }
  
            // Registration over time
            if (u.role !== "admin") {
              const date = new Date(u.created_at);
              const key =
                dataView === "week"
                  ? getWeekKey(date)
                  : date.toLocaleString("en-US", { month: "long", year: "numeric" });
              reg[key] = (reg[key] || 0) + 1;
            }
  
            if (u.gender) {
              if (u.gender.toLowerCase() === "male") {
                genderDist.male++;
              } else if (u.gender.toLowerCase() === "female") {
                genderDist.female++;
              }
            }
          });
  
        setAgeDistribution(ageDist);
        setChapters(chapterDist);
        setUserRegistrationData(reg);
        setGenderDistribution(genderDist);
      });
  }, [dataView, startDate, endDate]);
  

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    const status = { Approved: 0, Rejected: 0, Pending: 0 };
    const perService = {};
    const dailyAccommodated = {};
    const monthlyServiceCounts = {};
  
    const filtered = appointments.filter((a) => {
      if (!startDate || !endDate) return true;
      return (!startDate || a.date >= startDate) && (!endDate || a.date <= endDate);
    });
  
    filtered.forEach((a) => {
      const stat = a.status?.toLowerCase();
      const dateKey = new Date(a.date).toISOString().split("T")[0];
      const dateObj = new Date(a.date);
      const fullDateKey = dateObj.toISOString().split("T")[0];
      const service = a.service?.trim() || "Unknown";
  
      if (stat === "approved") {
        status.Approved++;
        dailyAccommodated[dateKey] = (dailyAccommodated[dateKey] || 0) + 1;
  
        if (!monthlyServiceCounts[service]) {
          monthlyServiceCounts[service] = {};
        }
        monthlyServiceCounts[service][fullDateKey] = (monthlyServiceCounts[service][fullDateKey] || 0) + 1;
      } else if (stat === "reject") {
        status.Rejected++;
      } else {
        status.Pending++;
      }
  
      perService[service] = (perService[service] || 0) + 1;
    });
  
    setAppointmentStatusData(status);
    setAppointmentsPerService(perService);
    setAccommodatedPerDay(dailyAccommodated);
    setAccommodatedPerServicePerMonth(monthlyServiceCounts);
  }, [appointments, startDate, endDate]);
  

const generateServiceMonthChartData = (serviceData) => {
  const colors = [
    "#C31C1C", // red
    "#3e95cd", // blue
    "#8e44ad", // purple
    "#27ae60", // green
    "#f39c12", // orange
  ];

  const allKeys = new Set();
  const grouped = {};

  Object.entries(serviceData).forEach(([service, data]) => {
    Object.entries(data).forEach(([date, count]) => {
      const key = dataView === "week"
        ? getWeekKey(new Date(date))
        : new Date(date).toLocaleString("default", { month: "long", year: "numeric" });
      if (!grouped[service]) grouped[service] = {};
      grouped[service][key] = (grouped[service][key] || 0) + count;
      allKeys.add(key);
    });
  });

  const sortedKeys = Array.from(allKeys).sort((a, b) => {
    const aDate = new Date(a.split(" - ")[0] || a);
    const bDate = new Date(b.split(" - ")[0] || b);
    return aDate - bDate;
  });

  const datasets = Object.entries(grouped).map(([service, values], index) => ({
    label: service,
    data: sortedKeys.map((k) => values[k] || 0),
    fill: false,
    borderWidth: 2,
    backgroundColor: colors[index % colors.length],
    borderColor: colors[index % colors.length],
    tension: 0.3
  }));

  return {
    labels: sortedKeys,
    datasets,
  };
};

const chartConfig = (labels, data, options) => ({
  labels,
  datasets: [{ data, ...options }],
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: {
            weight: "bold",
            size: 14
          }
        }
      },
      tooltip: {
        bodyFont: {
          size: 16, // 
          weight: "bold" // 
        },
        titleFont: {
          size: 15,
          weight: "bold"
        },
        padding: 12, // 
        backgroundColor: "#333", 
        titleColor: "#fff", 
        bodyColor: "#fff" 
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            weight: "bold",
            size: 14,
            family: "Roboto"
          }
        }
      },
      y: {
        ticks: {
          font: {
            weight: "bold",
            size: 14,
            family: "Roboto"
          }
        }
      }
    }
  }
  });

  const genderChartData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [genderDistribution.male, genderDistribution.female],
        backgroundColor: ["#3498db", "#e74c3c"], // Custom colors
      }
    ]
  }; 
  
  const generateAccommodatedPerDayData = () => {
  const grouped = {};

  Object.entries(accommodatedPerDay).forEach(([date, count]) => {
    const dateObj = new Date(date);
    let key = formatDate(dateObj);

    if (dataView === "week") {
      key = getWeekKey(dateObj);
    } else if (dataView === "month") {
      key = dateObj.toLocaleString("default", { month: "long", year: "numeric" });
    }

    grouped[key] = (grouped[key] || 0) + count;
  });

  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const aDate = new Date(a.split(" - ")[0] || a);
    const bDate = new Date(b.split(" - ")[0] || b);
    return aDate - bDate;
  });

  return chartConfig(
    sortedKeys,
    sortedKeys.map(k => grouped[k]),
    { label: "Approved Seniors", backgroundColor: "#FF7043" }
  );
};

const chartViews = {
  appointmentsByStatus: (
    <Pie data={chartConfig(
      Object.keys(appointmentStatusData),
      Object.values(appointmentStatusData),
      { backgroundColor: ["#F9ED69", "#6A2C70", "#F08A5D"] }
    )} />
  ),
  appointmentsPerService: (
    <Line data={chartConfig(
      Object.keys(appointmentsPerService),
      Object.values(appointmentsPerService),
      { label: "Appointments", borderColor: "#3e95cd", fill: false }
    )} />
  ),
  seniorsPerChapter: (
    <Line data={chartConfig(
      Object.keys(chapters),
      Object.values(chapters),
      { label: "Seniors", borderColor: "#8e44ad", fill: false }
    )} />
  ),
  registeredSeniors: (
    <Line data={chartConfig(
      Object.keys(userRegistrationData),
      Object.values(userRegistrationData),
      { label: "Registrations", borderColor: "#C31C1C", fill: false }
    )} />
  ),
  ageGroup: (
    <Bar data={chartConfig(
      Object.keys(ageDistribution),
      Object.values(ageDistribution),
      { label: "Senior", backgroundColor: "#C31C1C" }
    )} />
  ),
  accommodatedPerDay: (
    <Bar data={generateAccommodatedPerDayData()} />
  ),
  accommodatedPerService: (
    <Line data={generateServiceMonthChartData(accommodatedPerServicePerMonth)} />
  ),
  genderDistribution: (
    <Pie
      data={genderChartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      }}
    />
  )
};

const chartTitles = {
  appointmentsByStatus: "Appointments by Status",
  appointmentsPerService: "Appointments per Service",
  seniorsPerChapter: "Seniors per Chapter",
  registeredSeniors: "Registered Seniors",
  ageGroup: "Senior Age Group",
  accommodatedPerDay: "Seniors Accommodated",
  accommodatedPerService: "Seniors Accommodated per Service",
  genderDistribution: "Gender Distribution",
};


  return (
    <div className="overview-container">
      <div className="notification-bell" onClick={() => {
              setShowNotificationDetails(!showNotificationDetails);
              setUnreadCount(0); // Just reset counter
            }}>
              <img src={bellIcon} alt="Notifications" />
              {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
              {showNotificationDetails && (
                <div className="notification-dropdown">
                  {notifications.length === 0 ? <p>No new notifications</p> :
                    notifications.map((item, idx) => (
                      <div key={idx} onClick={() => handleNotificationClick(item)} className="notification-item">
                        <strong>{item.type === "emergency" ? "🚨 Emergency" : item.type === "appointment" ? "📅 Appointment" : "💬 Chat"}</strong><br />
                        {item.date && <span>{item.date}</span>}<br />
                        {item.type === "emergency" && <span>Type: {item.emergency_type}</span>}
                        {item.type === "appointment" && <span>Service: {item.service}</span>}
                        {item.type === "chat" && <span>{item.message}</span>}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>

{/* 🔽 Dropdown Container Styled like Statistics */}
<div className="statistics">
  <select
    value={selectedChart}
    onChange={(e) => setSelectedChart(e.target.value)}
  >
    <option value="appointmentsByStatus">Appointments by Status</option>
    <option value="appointmentsPerService">Appointments per Service</option>
    <option value="seniorsPerChapter">Seniors per Chapter</option>
    <option value="registeredSeniors">Registered Seniors</option>
    <option value="ageGroup">Senior Age Group</option>
    <option value="accommodatedPerDay">Seniors Accommodated</option>
    <option value="accommodatedPerService">Seniors Accommodated per Service</option>
    <option value="genderDistribution">Senior Gender Group</option>
  </select>
</div>

<div className="date-filter">
  <label>Start Date:</label>
  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
  />
  <label>End Date:</label>
  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
  />
</div>


<div className="statistics">
  <h3 style={{ marginBottom: "10px" }}>{chartTitles[selectedChart]}</h3>
{["registeredSeniors", "accommodatedPerDay", "accommodatedPerService"].includes(selectedChart) && (
  <div className="view-buttons" style={{ marginBottom: "15px" }}>
    {selectedChart === "accommodatedPerDay" && (
      <button
        className={dataView === "day" ? "active" : ""}
        style={{
          backgroundColor: dataView === "day" ? "#c31c1c" : "#fff",
          color: dataView === "day" ? "#fff" : "#c31c1c",
          border: "1px solid #c31c1c",
          marginRight: "5px"
        }}
        onClick={() => setDataView("day")}
      >
        Day
      </button>
    )}
    <button
      className={dataView === "week" ? "active" : ""}
      style={{
        backgroundColor: dataView === "week" ? "#c31c1c" : "#fff",
        color: dataView === "week" ? "#fff" : "#c31c1c",
        border: "1px solid #c31c1c",
        marginRight: "5px"
      }}
      onClick={() => setDataView("week")}
    >
      Week
    </button>
    <button
      className={dataView === "month" ? "active" : ""}
      style={{
        backgroundColor: dataView === "month" ? "#c31c1c" : "#fff",
        color: dataView === "month" ? "#fff" : "#c31c1c",
        border: "1px solid #c31c1c"
      }}
      onClick={() => setDataView("month")}
    >
      Month
    </button>
  </div>
)}
<div className="stats-chart">
  {selectedChart === "appointmentsByStatus" || selectedChart === "genderDistribution" ? (
    <div className="pie-chart-container">{chartViews[selectedChart]}</div>
  ) : (
    chartViews[selectedChart]
  )}
</div>

</div>

      <div className="appointment-summary">
        <h3>Appointments</h3>

        <div className="appointment-nav">
          <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}>&lt;</button>
          <span>{selectedDate.toLocaleString("en-US", { month: "long", year: "numeric" })}</span>
          <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}>&gt;</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : appointmentsByDate.length === 0 ? (
          <p>No appointments</p>
        ) : (
          <ul>
            {appointmentsByDate.map((a) => (
              <li key={a.id} className="appointment-item">
                <p>{a.details}</p>
                <div className="action-icons">
                  <img src={editIcon} alt="Edit" onClick={() => handleEdit(a)} />
                  <img src={deleteIcon} alt="Delete" onClick={() => handleDelete(a.id)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>


      {editMode && currentAppointment && (
        <div className="edit-modal">
          <h3>Edit Appointment</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(currentAppointment); }}>
            {["service", "status", "time"].map((field) => (
              <input
                key={field}
                type="text"
                value={currentAppointment[field]}
                onChange={(e) => setCurrentAppointment({ ...currentAppointment, [field]: e.target.value })}
              />
            ))}
            <button type="submit">{isSaving ? "Saving..." : "Save"}</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Overview;