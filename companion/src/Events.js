import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./Events.css";
import editIcon from "./edit.png";
import deleteIcon from "./delete.png";

const Events = () => {
  const [dateTime, setDateTime] = useState(new Date()); // Combined date and time state
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // New state for sorting
  const [showAllEvents, setShowAllEvents] = useState(false); // State to show all events or events for specific date
  const [filterDate, setFilterDate] = useState(""); // New state to handle filtered date

  // Fetch events (either for the selected date or all events)
  useEffect(() => {
    const formattedDate = filterDate || dateTime.toISOString().split("T")[0]; // Use filterDate if provided, otherwise use dateTime
    const url = `http://localhost/php/get_events.php?date=${
      showAllEvents ? "" : formattedDate
    }&sortOrder=${sortOrder}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.events)) {
          setEvents(data.events); // Ensure data.events is an array
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
  }, [dateTime, sortOrder, showAllEvents, filterDate]); // Add filterDate as a dependency to refetch events when it changes

  // Open modal for adding new event or editing existing one
  const openModal = (event = null) => {
    setModalIsOpen(true);
    if (event) {
      setEventTitle(event.event_title);
      setEventDescription(event.event_description);
      setDateTime(new Date(event.date_time));
      setEditingEventId(event.id);
    } else {
      setEventTitle("");
      setEventDescription("");
      setDateTime(new Date());
      setEditingEventId(null);
    }
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setEventTitle("");
    setEventDescription("");
    setEditingEventId(null);
  };

  // Validate inputs
  const validateInputs = () => {
    if (!eventTitle || !eventDescription || !dateTime) {
      alert("Please fill out all fields.");
      return false;
    }
    return true;
  };

  // Save event
  const saveEvent = () => {
    if (!validateInputs()) return;

    setLoading(true);

    const formattedDateTime = dateTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const newEvent = {
      id: editingEventId,
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

  // Delete event
  const deleteEvent = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setLoading(true);
      fetch(`http://localhost/php/delete_events.php?id=${id}`, {
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

  // Function to format date into a more readable format (e.g., "Monday, January 1, 2025")
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
    <div className="events-tab">
      <h2>Events</h2>

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

        <button onClick={() => setShowAllEvents(!showAllEvents)}>
          {showAllEvents ? "Show Events for Today" : "Show All Events"}
        </button>
        <button className="event-modal" onClick={() => openModal()}>Add Event</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Event Title</th>
            <th>Date and Time</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr key={event.id}>
                <td>{event.event_title}</td>
                <td>{formatDate(event.date_time)}</td>
                <td>{event.event_description}</td>
                <td className="action-icons">
                  <img src={editIcon} alt="Edit" />
                  <img src={deleteIcon} alt="Delete" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No events available</td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}
      className="ReactModal__Content"
      overlayclassName="ReactModal__Overlay">
        <h2>{editingEventId ? "Edit Event" : "Add Event"}</h2>
        <input
          type="text"
          placeholder="Event Title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
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
        ></textarea>
        <button className="save-event" onClick={saveEvent} disabled={loading}>
          {loading ? "Saving..." : "Save Event"}
        </button>
        <button className="cancel-event" onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
};

export default Events;
