import React, { useState, useEffect } from "react";
import "./ServicesTab.css";

const ServicesTab = () => {
  const servicesList = [
    "Health Check-up",
    "Free Medicine",
    "Massage Therapy",
    "Dental Check-up",
    "Eye Check-up",
  ];

  const times = {
    "Health Check-up": ["9:00 AM", "1:00 PM", "3:00 PM"],
    "Free Medicine": ["10:00 AM", "2:00 PM", "4:00 PM"],
    "Massage Therapy": ["11:00 AM", "2:30 PM", "5:00 PM"],
    "Dental Check-up": ["9:30 AM", "12:00 PM", "3:30 PM"],
    "Eye Check-up": ["10:30 AM", "1:30 PM", "4:30 PM"],
  };

  const [services, setServices] = useState([]);
  const [pastServices, setPastServices] = useState([]);
  const [newService, setNewService] = useState({ id: null, name: "", date: "", time: "", availableSlot: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [filter, setFilter] = useState("All");
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    const fetchSlots = () => {
      fetch("https://backend-production-4629.up.railway.app/get_service_slots.php", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          const upcoming = (data.upcoming || []).map(item => ({
            id: item.id,
            name: item.serviceName || "",
            date: item.date || "",
            time: item.time || "",
            availableSlot: parseInt(item.availableSlot ?? 0),
          }));

          const past = (data.past || []).map(item => ({
            id: item.id,
            name: item.serviceName || "",
            date: item.date || "",
            time: item.time || "",
            availableSlot: parseInt(item.availableSlot ?? 0),
          }));

          setServices(upcoming.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)));
          setPastServices(past.sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)));
        })
        .catch((err) => {
          console.error("Failed to fetch service slots:", err);
        });
    };

    fetchSlots();
    window.addEventListener("slotsUpdated", fetchSlots);
    return () => window.removeEventListener("slotsUpdated", fetchSlots);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
    if (name === "name") {
      setNewService((prev) => ({ ...prev, time: "" }));
    }
  };

  const handleAddOrUpdate = () => {
    const { name, date, time, id, availableSlot } = newService;
    const formattedTime = convertTo24Hour(time);

    if (!name || !date || !time || availableSlot < 1) {
      alert("Please fill out all fields properly.");
      return;
    }

    const isDuplicate = services.some(
      (s, i) =>
        s.name === name &&
        s.date === date &&
        s.time === formattedTime &&
        (!isEditing || s.id !== id)
    );

    if (isDuplicate) {
      alert("This service already exists for the selected date and time.");
      return;
    }

    const entry = { id, serviceName: name, date, time: formattedTime, availableSlot: parseInt(availableSlot) };

    fetch("https://backend-production-4629.up.railway.app/save_service_slot.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(entry),
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          window.dispatchEvent(new Event("slotsUpdated"));
          resetForm();
          alert(isEditing ? "Service successfully updated!" : "Service successfully added!");
        } else {
          alert(data.message || "Failed to save service.");
        }
      })
      .catch(err => {
        console.error("Error saving service:", err);
        alert("Network error.");
      });
  };

  const handleRemove = async (index) => {
    const target = filteredServices[index];
    try {
      const res = await fetch("https://backend-production-4629.up.railway.app/delete_service_slot.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: target.id }),
      });

      const result = await res.json();
      if (result.status === "success") {
        window.dispatchEvent(new Event("slotsUpdated"));
        alert("Service successfully deleted!");
      } else {
        alert(result.message || "Failed to delete.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Error connecting to backend.");
    }
  };

  const handleEdit = (index) => {
    const target = filteredServices[index];
    setNewService({
      id: target.id,
      name: target.name,
      date: target.date,
      time: formatToAmPm(target.time),
      availableSlot: target.availableSlot,
    });
    setIsEditing(true);
    setEditingIndex(index);
  };

  const resetForm = () => {
    setNewService({ id: null, name: "", date: "", time: "", availableSlot: "" });
    setIsEditing(false);
    setEditingIndex(null);
  };

  const convertTo24Hour = (timeStr) => {
    const [hourMin, meridian] = timeStr.split(" ");
    const [hoursStr, minutesStr] = hourMin.split(":");
    let hours = parseInt(hoursStr);
    if (meridian === "PM" && hours !== 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutesStr}:00`;
  };

  const formatToAmPm = (mysqlTime) => {
    const [hourStr, minuteStr] = mysqlTime.split(":");
    let hour = parseInt(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minuteStr} ${ampm}`;
  };

  const filteredServices = filter === "All"
    ? services
    : services.filter((s) => s.name === filter);

  return (
    <div className="services-tab">
      <h4>{isEditing ? "Edit Service" : "Add/Remove Services"}</h4>

      <div className="service-form">
        <label>
          Choose a Service:
          <select name="name" value={newService.name} onChange={handleChange}>
            <option value="" disabled>Select a service</option>
            {servicesList.map((service, i) => (
              <option key={i} value={service}>{service}</option>
            ))}
          </select>
        </label>
        <label>
          Choose a date:
          <input type="date" name="date" value={newService.date} onChange={handleChange} />
        </label>
        <label>
          Choose a time:
          <select name="time" value={newService.time} onChange={handleChange} disabled={!newService.name}>
            <option value="" disabled>Select a time</option>
            {newService.name && times[newService.name]?.map((time, i) => (
              <option key={i} value={time}>{time}</option>
            ))}
          </select>
        </label>
        <label>
          Available Slots:
          <input
            type="number"
            name="availableSlot"
            min="1"
            value={newService.availableSlot}
            onChange={handleChange}
            disabled={!newService.name}
          />
        </label>
        <div className="buttons">
          <button
            onClick={handleAddOrUpdate}
            className="add-btn"
            disabled={!newService.name || !newService.date || !newService.time || !newService.availableSlot}
          >
            {isEditing ? "Save Changes" : "Add"}
          </button>
          {isEditing && (
            <button className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="filter-logs-right">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-dropdown">
          <option value="All">All Services</option>
          {servicesList.map((service, i) => (
            <option key={i} value={service}>{service}</option>
          ))}
        </select>
        <button className="view-logs-button" onClick={() => setShowLogs(!showLogs)}>
          {showLogs ? "Hide Logs" : "View Logs"}
        </button>
      </div>

      <h5>Currently Active Services:</h5>
      <table className="services-table">
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Available Slots</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.length > 0 ? (
            filteredServices.map((service, i) => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{service.date}</td>
                <td>{formatToAmPm(service.time)}</td>
                <td>{service.availableSlot}</td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEdit(i)}>Edit</button>
                    <button className="remove-btn" onClick={() => handleRemove(i)}>Remove</button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>No services found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showLogs && (
        <>
          <h5 style={{ marginTop: "30px" }}>Past Service Slots (View Logs):</h5>
          {pastServices.length > 0 ? (
            <div className="log-list">
              {pastServices.map((log, i) => (
                <div className="log-entry" key={i}>
                  <p><strong>Service:</strong> {log.name}</p>
                  <p><strong>Date:</strong> {log.date}</p>
                  <p><strong>Time:</strong> {formatToAmPm(log.time)}</p>
                  <p><strong>Available Slots:</strong> {log.availableSlot}</p>
                  <hr />
                </div>
              ))}
            </div>
          ) : (
            <p>No past services found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ServicesTab;
