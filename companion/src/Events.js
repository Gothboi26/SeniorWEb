import React, { useState } from "react";
import Modal from "react-modal";
import "./Events.css";

const Events = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEventTitle("");
    setEventTime("");
  };

  const addEvent = () => {
    const newEvent = {
      id: Date.now(),
      title: eventTitle,
      date: date.toDateString(),
      time: eventTime,
    };
    setEvents([...events, newEvent]);
    closeModal();
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  return (
    <>
      <div className="events-header">
        <h2>All Events</h2>
        <button onClick={openModal} className="add-event-button">
          Add Event
        </button>
      </div>
      <table className="events-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Event Title</th>
            <th>Date and Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr key={event.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{event.title}</td>
                <td>
                  {event.date} - {event.time}
                </td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => alert("Edit functionality not implemented")}
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
              <td colSpan="4" className="no-events">
                No events available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <h2>Add Event</h2>
        <input
          type="text"
          placeholder="Event Title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        <input
          type="time"
          placeholder="Event Time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        />
        <input
          type="date"
          value={date.toISOString().split("T")[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
        />
        <button onClick={addEvent} className="save-button">
          Save Event
        </button>
        <button onClick={closeModal} className="cancel-button">
          Cancel
        </button>
      </Modal>
    </>
  );
};

export default Events;
