import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./Events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showLogs, setShowLogs] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });

  useEffect(() => {
    let url = `https://backend-production-4629.up.railway.app/get_events.php?sortOrder=${sortOrder}`;
    url += showLogs ? `&logs=past` : ``;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.events)) {
          const filtered = data.events.filter((event) => {
            const eventDate = new Date(event.date_time);
            const now = new Date();
            if (showLogs) {
              return eventDate < now;
            } else {
              return (
                eventDate.toDateString() === now.toDateString() ||
                eventDate > now
              );
            }
          });
          setEvents(filtered);
        } else {
          setEvents([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while loading events.");
      });
  }, [sortOrder, showLogs]);

  useEffect(() => {
    const filtered = events.filter((event) =>
      [event.event_title, event.organizer, event.location, event.event_description]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const openModal = (event = null) => {
    setModalIsOpen(true);
    if (event) {
      setEventTitle(event.event_title);
      setEventDescription(event.event_description);
      setOrganizer(event.organizer || "");
      setLocation(event.location || "");
      setDateTime(new Date(event.date_time));
      setEditingEventId(event.id);
    } else {
      setEventTitle("");
      setEventDescription("");
      setOrganizer("");
      setLocation("");
      setDateTime(new Date());
      setEditingEventId(null);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEventTitle("");
    setEventDescription("");
    setOrganizer("");
    setLocation("");
    setEditingEventId(null);
  };

  const validateInputs = () => {
    return eventTitle && eventDescription && dateTime && organizer && location;
  };

  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  };

  const saveEvent = () => {
    if (!validateInputs()) {
      alert("Please fill out all fields.");
      return;
    }

    setLoading(true);
    const formattedDateTime = dateTime.toISOString().slice(0, 19).replace("T", " ");

    const newEvent = {
      id: editingEventId,
      organizer,
      location,
      date_time: formattedDateTime,
      event_title: eventTitle,
      event_description: eventDescription,
    };

    fetch("https://backend-production-4629.up.railway.app/add_events.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setEvents((prevEvents) =>
            editingEventId
              ? prevEvents.map((event) =>
                  event.id === editingEventId ? { ...newEvent, id: data.id } : event
                )
              : [...prevEvents, { ...newEvent, id: data.id }]
          );
          closeModal();
          showToast(editingEventId ? "Event updated successfully!" : "Event added successfully!");
        } else {
          alert("Failed to save event: " + data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while saving the event.");
        setLoading(false);
      });
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  return (
    <div className="events-admin-container">
      <div className="events-header">
        <h2>Events</h2>
        <div className="events-controls">
          <input
            className="search-event"
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="events-button" onClick={() => openModal()}>
            Add Event
          </button>
          <div className="filters-group" style={{ display: "flex", gap: "10px" }}>
            <select
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
              className="sort-select"
            >
              <option value="asc">⬆ Ascending</option>
              <option value="desc">⬇ Descending</option>
            </select>
            <button className="events-button" onClick={() => setShowLogs((prev) => !prev)}>
              {showLogs ? "Back to Events" : "View Logs"}
            </button>
          </div>
        </div>
      </div>

      <h3 className="events-section-label">
        {showLogs ? "Past Event Logs" : "Upcoming and Today’s Events"}
      </h3>

      <div className="events-table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Organizer</th>
              <th>Location</th>
              <th>Date and Time</th>
              <th>Description</th>
              {!showLogs && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.event_title}</td>
                  <td>{event.organizer}</td>
                  <td>{event.location}</td>
                  <td>
                    {formatDate(event.date_time)}
                    {!showLogs && new Date(event.date_time) < new Date() && (
                      <span className="badge-warning">Expired</span>
                    )}
                  </td>
                  <td>{event.event_description}</td>
                  {!showLogs && (
                    <td>
                      <div className="action-icons">
                        <button className="edit-button" onClick={() => openModal(event)}>
                          Edit
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={showLogs ? 5 : 6} className="no-events">
                  {showLogs ? "No logs found" : "No events available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="events-modal">
        <h2 className="event-modal-text">{editingEventId ? "Edit Event" : "Add Event"}</h2>
        <input
          type="text"
          placeholder="Event Title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Organizer"
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="datetime-local"
          value={dateTime.toISOString().slice(0, 16)}
          onChange={(e) => setDateTime(new Date(e.target.value))}
        />
        <textarea
          placeholder="Event Description"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          rows="3"
        ></textarea>
        <button onClick={saveEvent} className="save-button" disabled={loading}>
          {loading ? "Saving..." : "Save Event"}
        </button>
        <button onClick={closeModal} className="cancel-button">
          Cancel
        </button>
      </Modal>

      {toast.visible && <div className="toast">{toast.message}</div>}
    </div>
  );
};

export default Events;
