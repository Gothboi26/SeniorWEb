import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./Events.css";

const Events = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const formattedDate = filterDate || dateTime.toISOString().split("T")[0];
    const url = `http://localhost/php/get_events.php?date=${
      showAllEvents ? "" : formattedDate
    }&sortOrder=${sortOrder}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.events)) {
          setEvents(data.events);
        } else {
          console.error(
            "Failed to load events:",
            data.message || "No events found"
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while loading events.");
      });
  }, [dateTime, sortOrder, showAllEvents, filterDate]);

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
    if (!eventTitle || !eventDescription || !dateTime || !organizer || !location) {
      alert("Please fill out all fields.");
      return false;
    }
    return true;
  };

  const saveEvent = () => {
    if (!validateInputs()) return;

    setLoading(true);

    const formattedDateTime = dateTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const newEvent = {
      id: editingEventId,
      organizer,
      location,
      date_time: formattedDateTime,
      event_title: eventTitle,
      event_description: eventDescription,
    };

    fetch("http://localhost/php/add_events.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setEvents((prevEvents) =>
            editingEventId
              ? prevEvents.map((event) =>
                  event.id === editingEventId
                    ? { ...newEvent, id: data.id }
                    : event
                )
              : [...prevEvents, { ...newEvent, id: data.id }]
          );
          closeModal();
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

  const deleteEvent = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setLoading(true);
      fetch(`http://localhost/php/get_events.php?id=${id}`, {
        method: "POST",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            setEvents((prevEvents) =>
              prevEvents.filter((event) => event.id !== id)
            );
          } else {
            alert("Failed to delete event: " + data.message);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred while deleting the event.");
          setLoading(false);
        });
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  return (
    <div className="events-admin-container">
      <div className="events-header">
        <h2>Events</h2>
        <div className="events-controls">
          <button className="events-button" onClick={() => openModal()} className="add-event-button">
            Add Event
          </button>
          <div className="filters">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          <div className="sort-options">
            <select
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
            >
              <option value="asc">Sort Ascending</option>
              <option value="desc">Sort Descending</option>
            </select>
            <button
              className="toggle-events-button"
              onClick={() => setShowAllEvents((prevState) => !prevState)}
            >
              {showAllEvents ? "Show Events for Today" : "Show All Events"}
            </button>
          </div>
        </div>
      </div>

      <div className="events-table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Organizer</th>
              <th>Location</th>
              <th>Date and Time</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id}>
                  <td>{event.event_title}</td>
                  <td>{event.organizer}</td>
                  <td>{event.location}</td>
                  <td>{formatDate(event.date_time)}</td>
                  <td>{event.event_description}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => openModal(event)}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deleteEvent(event.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-events">
                  No events available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <h2>{editingEventId ? "Edit Event" : "Add Event"}</h2>
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
    </div>
  );
};

export default Events;
