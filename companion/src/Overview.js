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

const Overview = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentsByDate, setAppointmentsByDate] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userRegistrationView, setUserRegistrationView] = useState("month");
  const [userRegistrationData, setUserRegistrationData] = useState({});
  const [ageDistribution, setAgeDistribution] = useState({});
  const [chapters, setChapters] = useState({});
  const [appointmentStatusData, setAppointmentStatusData] = useState({});
  const [appointmentsPerService, setAppointmentsPerService] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationDetails, setShowNotificationDetails] = useState(false);

  const formatDate = (date) => new Date(date).toISOString().split("T")[0];

  const filterAppointmentsByDate = useCallback((date) => {
    const filtered = appointments.filter((a) => a.date === formatDate(date));
    setAppointmentsByDate(filtered);
  }, [appointments]);

  const fetchAppointmentsData = useCallback(() => {
    fetch("https://backend-production-4629.up.railway.app/php/appointments.php", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const apps = Array.isArray(data) ? data : data.data || [];
        setAppointments(apps);
        setLoading(false);
      });
  }, []);

  useEffect(() => { fetchAppointmentsData(); }, [fetchAppointmentsData]);
  useEffect(() => { if (appointments.length) filterAppointmentsByDate(selectedDate); }, [appointments, selectedDate, filterAppointmentsByDate]);

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
      fetch("https://backend-production-4629.up.railway.app/php/check_notifications.php")
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
      fetch(`https://backend-production-4629.up.railway.app/php/appointments.php?id=${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => setAppointments((prev) => prev.filter((a) => a.id !== id)));
    }
  };

  const handleSaveEdit = (updated) => {
    if (isSaving) return;
    setIsSaving(true);
    fetch("https://backend-production-4629.up.railway.app/php/appointments.php", {
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
    fetch("https://backend-production-4629.up.railway.app/php/get_users.php")
      .then((res) => res.json())
      .then((data) => {
        const users = data.data || [];
        const ageDist = {}, chapterDist = {}, reg = {};
        users.forEach((u) => {
          const age = parseInt(u.age, 10);
          const ageGroup = Math.floor(age / 10) * 10;
          if (age >= 60) ageDist[`${ageGroup}-${ageGroup + 9}`] = (ageDist[`${ageGroup}-${ageGroup + 9}`] || 0) + 1;
          if (u.group_chapter) chapterDist[u.group_chapter] = (chapterDist[u.group_chapter] || 0) + 1;

          if (u.role !== "admin") {
            const date = new Date(u.created_at);
            const key = userRegistrationView === "year" ? date.getFullYear() : date.toLocaleString("en-US", { month: "long", year: "numeric" });
            reg[key] = (reg[key] || 0) + 1;
          }
        });
        setAgeDistribution(ageDist);
        setChapters(chapterDist);
        setUserRegistrationData(reg);
      });
  }, [userRegistrationView]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    const status = { Approved: 0, Rejected: 0, Pending: 0 };
    const perService = {};
    appointments.forEach((a) => {
      const stat = a.status?.toLowerCase();
      if (stat === "approved") status.Approved++;
      else if (stat === "reject") status.Rejected++;
      else status.Pending++;
      const service = a.service?.trim() || "Unknown";
      perService[service] = (perService[service] || 0) + 1;
    });
    setAppointmentStatusData(status);
    setAppointmentsPerService(perService);
  }, [appointments]);

  const chartConfig = (labels, data, options) => ({ labels, datasets: [{ data, ...options }] });

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

      <div className="summary-cards">
        <div className="card card-light">
          <h3>Appointments by Status</h3>
          <Pie data={chartConfig(Object.keys(appointmentStatusData), Object.values(appointmentStatusData), { backgroundColor: ["#F9ED69", "#6A2C70", "#F08A5D"] })} />
        </div>
        <div className="card card-light">
          <h3>Appointments per Service</h3>
          <Line data={chartConfig(Object.keys(appointmentsPerService), Object.values(appointmentsPerService), { label: "Appointments", fontColor: "white",  borderColor: "#3e95cd", fill: false })} />
        </div>
        <div className="card card-light">
          <h3>Seniors per Chapter</h3>
          <Pie data={chartConfig(Object.keys(chapters), Object.values(chapters), { backgroundColor: ["#3cb44b", "#e6194B", "#4363d8", "#f58231"] })} />
        </div>
      </div>

      <div className="statistics-section">
        <div className="statistics">
          <h3>Registered Seniors</h3>
          <div className="statistics-button">
            <button onClick={() => setUserRegistrationView("month")}>Month</button>
            <button onClick={() => setUserRegistrationView("year")}>Year</button>
          </div>
          
          <Line data={chartConfig(Object.keys(userRegistrationData), Object.values(userRegistrationData), { label: "Registrations", borderColor: "#C31C1C", fill: false })} />
        </div>
        <div className="age-summary">
          <h3>Senior Age Group</h3>
          <Bar data={chartConfig(Object.keys(ageDistribution), Object.values(ageDistribution), { backgroundColor: "#C31C1C" })} />
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
