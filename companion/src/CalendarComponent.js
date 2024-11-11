import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import "./CalendarComponent.css";
import "react-calendar/dist/Calendar.css";

Modal.setAppElement("#root");

function CalendarComponent({ role }) {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventText, setEventText] = useState("");
  const [eventTitle, setEventTitle] = useState(""); // Event Title state

  useEffect(() => {
    fetchEvents(date);
  }, [date]);

  const fetchEvents = async (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    try {
      const response = await fetch(
        `http://localhost/php/get_events.php?date=${formattedDate}`
      );
      const data = await response.json();
      console.log("Fetched events:", data); // Log fetched data
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEventText("");
    setEventTitle(""); // Reset event title on modal close
  };

  const addEvent = async () => {
    const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    try {
      const response = await fetch("http://localhost/php/add_events.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formattedDate,
          title: eventTitle, // Send title
          description: eventText, // Send description
        }),
      });
      const result = await response.json();

      if (result.status === "success") {
        fetchEvents(date); // Refresh the event list after adding
        closeModal();
      } else {
        console.error("Error adding event:", result.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="CalendarComponent">
      <h2>Event Calendar</h2>
      <div className="calendar-events-container">
        <Calendar
          onChange={onDateChange}
          value={date}
          locale="en-US" // Ensure starting with Sunday
        />
        <div className="events-list">
          <h3>Events on {date.toDateString()}</h3>
          <ul>
            {events.length > 0 ? (
              events.map((event) => (
                <li key={event.id}>
                  <strong>{event.event_title}</strong>:{" "}
                  {event.event_description}
                </li>
              ))
            ) : (
              <p>No events for this date.</p>
            )}
          </ul>
        </div>
      </div>

      {/* Show Add Event button only if role is "admin" */}
      {role === "admin" && (
        <button onClick={openModal} className="add-event-button">
          Add Event
        </button>
      )}

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <h2>Add Event for {date.toDateString()}</h2>
        <input
          type="text"
          placeholder="Event title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)} // Update event title
        />
        <input
          type="text"
          placeholder="Event description"
          value={eventText}
          onChange={(e) => setEventText(e.target.value)} // Event description now uses input
        />
        <button onClick={addEvent}>Save Event</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
}

export default CalendarComponent;
