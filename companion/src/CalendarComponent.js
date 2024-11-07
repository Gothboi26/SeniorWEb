import React, { useState } from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import "./CalendarComponent.css";
import "react-calendar/dist/Calendar.css";

// Setting up modal styles
Modal.setAppElement("#root");

function CalendarComponent() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventText, setEventText] = useState("");

  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEventText("");
  };

  const addEvent = () => {
    const dateString = date.toDateString();
    const newEvents = { ...events };

    if (newEvents[dateString]) {
      newEvents[dateString].push(eventText);
    } else {
      newEvents[dateString] = [eventText];
    }

    setEvents(newEvents);
    closeModal();
  };

  return (
    <div className="CalendarComponent">
      <h2>Event Calendar</h2>
      <Calendar onChange={onDateChange} value={date} />
      <button onClick={openModal}>Add Event</button>

      <div className="events-list">
        <h3>Events on {date.toDateString()}</h3>
        <ul>
          {events[date.toDateString()] ? (
            events[date.toDateString()].map((event, index) => (
              <li key={index}>{event}</li>
            ))
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
