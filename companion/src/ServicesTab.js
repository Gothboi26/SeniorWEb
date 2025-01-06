import React, { useState } from "react";
import "./ServicesTab.css";

const ServicesTab = () => {
  // Mock data for services, available times, and maximum slots
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

  const initialMaxSlots = {
    "Health Check-up": 5,
    "Free Medicine": 5,
    "Massage Therapy": 3,
    "Dental Check-up": 4,
    "Eye Check-up": 3,
  };

  const [services, setServices] = useState([]); // Dynamically added services
  const [maxSlots, setMaxSlots] = useState({ ...initialMaxSlots }); // Editable maximum slots
  const [newService, setNewService] = useState({
    name: "",
    date: "",
    time: "",
  });

  const handleAdd = () => {
    const { name, date, time } = newService;
    if (name && date && time) {
      setServices([...services, newService]);
      setNewService({ name: "", date: "", time: "" });
    }
  };

  const handleRemove = (indexToRemove) => {
    setServices(services.filter((_, index) => index !== indexToRemove));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });

    // Reset time if the service is changed
    if (name === "name") {
      setNewService((prev) => ({ ...prev, time: "" }));
    }
  };

  const handleMaxSlotChange = (e) => {
    const { value } = e.target;
    const newMaxSlots = parseInt(value, 10) || 0;

    if (newService.name) {
      setMaxSlots({ ...maxSlots, [newService.name]: newMaxSlots });
    }
  };

  return (
    <div className="services-tab">
      <h4>Add/Remove Services</h4>
      <div className="service-form">
        <label>
          Choose a Service:
          <select name="name" value={newService.name} onChange={handleChange}>
            <option value="" disabled>
              Select a service
            </option>
            {servicesList.map((service, index) => (
              <option key={index} value={service}>
                {service}
              </option>
            ))}
          </select>
        </label>
        <label>
          Choose a date:
          <input
            type="date"
            name="date"
            value={newService.date}
            onChange={handleChange}
          />
        </label>
        <label>
          Choose a time:
          <select
            name="time"
            value={newService.time}
            onChange={handleChange}
            disabled={!newService.name}
          >
            <option value="" disabled>
              Select a time
            </option>
            {newService.name &&
              times[newService.name]?.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
          </select>
        </label>
        <label>
          Max Reservation Slots:
          <input
            type="number"
            min="1"
            name="maxSlots"
            value={newService.name ? maxSlots[newService.name] : ""}
            onChange={handleMaxSlotChange}
            disabled={!newService.name}
          />
        </label>
        <div className="buttons">
          <button
            onClick={handleAdd}
            className="add-btn"
            disabled={!newService.name || !newService.date || !newService.time}
          >
            Add
          </button>
        </div>
      </div>
      <h5>Currently Active Services:</h5>
      <table className="services-table">
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Max Slots</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {services.length > 0 ? (
            services.map((service, index) => (
              <tr key={index}>
                <td>{service.name}</td>
                <td>{service.date}</td>
                <td>{service.time}</td>
                <td>{maxSlots[service.name]}</td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No services added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesTab;
