import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import Slideshow from "./Slideshow"; // Import the Slideshow component
import "./CalendarComponent.css";
import "react-calendar/dist/Calendar.css";

Modal.setAppElement("#root");

function CalendarComponent({ role }) {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventText, setEventText] = useState("");
  const [eventTitle, setEventTitle] = useState("");

  useEffect(() => {
    fetchEvents(date);
  }, [date]);

  const fetchEvents = async (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    try {
      const response = await fetch(
        `http://localhost/php/get_events.php?date=${formattedDate}`
      );
      const data = await response.json();
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
    setEventTitle("");
  };

  const addEvent = async () => {
    const formattedDate = date.toISOString().split("T")[0];
    try {
      const response = await fetch("http://localhost/php/add_events.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formattedDate,
          title: eventTitle,
          description: eventText,
        }),
      });
      const result = await response.json();

      if (result.status === "success") {
        fetchEvents(date);
        closeModal();
      } else {
        console.error("Error adding event:", result.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost/php/delete_events.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId }),
      });
      const result = await response.json();

      if (result.status === "success") {
        fetchEvents(date);
      } else {
        console.error("Error deleting event:", result.message);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="CalendarComponent">
      <h2>Event Calendar</h2>
      <div className="calendar-container">
        {/* Calendar container */}
        <div className="calendar">
          <Calendar onChange={onDateChange} value={date} locale="en-US" />
        </div>

        {/* Container for Events List and Slideshow */}
        <div className="events-slideshow-container">
          {/* Events list container */}
          <div className="events-list">
            <h3>Events on {date.toDateString()}</h3>
            <ul>
              {events.length > 0 ? (
                events.map((event) => (
                  <li key={event.id}>
                    <strong>{event.event_title}</strong>:{" "}
                    {event.event_description}
                    {role === "admin" && (
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="delete-event-button"
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))
              ) : (
                <p>No events for this date.</p>
              )}
            </ul>
            {role === "admin" && (
              <button onClick={openModal} className="add-event-button">
                Add Event
              </button>
            )}
          </div>

          {/* Slideshow container */}
          <div className="slideshow-container">
            <Slideshow />
          </div>
        </div>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <h2>Add Event for {date.toDateString()}</h2>
        <input
          type="text"
          placeholder="Event title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Event description"
          value={eventText}
          onChange={(e) => setEventText(e.target.value)}
        />
        <button onClick={addEvent}>Save Event</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
}

export default CalendarComponent;