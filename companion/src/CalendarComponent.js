import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import "./CalendarComponent.css";
import "react-calendar/dist/Calendar.css";

Modal.setAppElement("#root");

function CalendarComponent() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventText, setEventText] = useState("");

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
  };

  const addEvent = async () => {
    const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    try {
      const response = await fetch("http://localhost/php/add_event.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: formattedDate, event: eventText }), // Send as JSON
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

  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="CalendarComponent">
      <h2>Event Calendar</h2>
      <Calendar onChange={onDateChange} value={date} />
      <button onClick={openModal}>Add Event</button>

      <div className="events-list">
        <h3>Events on {date.toDateString()}</h3>
        <ul>
          {events.length > 0 ? (
            events.map((event) => <li key={event.id}>{event.event}</li>)
          ) : (
            <p>No events for this date.</p>
          )}
        </ul>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <h2>Add Event for {date.toDateString()}</h2>
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
