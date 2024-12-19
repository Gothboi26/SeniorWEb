import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import Slideshow from "./Slideshow";
import { Link } from "react-router-dom";
import "./CalendarComponent.css";
import "react-calendar/dist/Calendar.css";
import "./Emergency.css";
import "./Chat.css";
import "./SeniorCare.css";
import "./Profile.css";
import "./SeniorList.css";

Modal.setAppElement("#root");

// Role-based section component
const RectangleSection = ({ role }) => {
  return (
    <div className="rectangle21">
      {role === "client" && <div className="rectangle23 paalala1">PAALALA</div>}

      {role === "client" && (
        <div className="rectangle23 seniorcare">
          <Link to="/senior-care" className="link-container">
            <div className="senior-care-content">
              <h2>Senior Care</h2>
              <p>
                Provide specialized care and services for seniors with
                compassion and expertise.
              </p>
              <button className="homepage-senior-care-button">
                <span className="homepage-senior-care-button-icon">📅</span>
                <span className="homepage-senior-care-button-text">Book</span>
              </button>
            </div>
          </Link>
        </div>
      )}

      <div className="rectangle23 emergencyservices">
        <Link to="/emergency" className="link-container">
          <div className="emergency-services-content">
            <h2>Emergency Services</h2>
            <p>Ensure quick and reliable assistance during emergencies.</p>
            <button className="emergency-services-button">
              <span className="emergency-services-button-icon">📞</span>
              <span className="emergency-services-button-text">Call</span>
            </button>
          </div>
        </Link>
      </div>

      <div className="rectangle23 chatassistance">
        <Link to="/chat" className="link-container">
          <div className="chat-assistance-content">
            <h2>Chat Assistance</h2>
            <p>Get prompt responses to your inquiries and support needs.</p>
            <button className="chat-assistance-button">
              <span className="chat-assistance-button-icon">💬</span>
              <span className="chat-assistance-button-text">Chat</span>
            </button>
          </div>
        </Link>
      </div>

      {role === "admin" && (
        <div className="rectangle23 seniorlist">
          <Link to="/seniorlist" className="link-container">
            <div className="senior-list-content">
              <h2>Senior List</h2>
              <p>Manage and review the senior care list efficiently.</p>
              <button className="senior-list-button">
                <span className="senior-list-button-icon">📋</span>
                <span className="senior-list-button-text">Seniors</span>
              </button>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

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

  const openModal = () => setModalIsOpen(true);
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
      <div className="CalendarLetter">
        <h2>companiON</h2>
        <h1 className="big-header1">Senior Care Services</h1>
      </div>
      <div className="calendar-container">
        <div className="calendar">
          <Calendar onChange={onDateChange} value={date} locale="en-US" />
        </div>

        <div className="events-slideshow-container">
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

          {role === "client" && (
            <div className="slideshow-container">
              <Slideshow />
            </div>
          )}
        </div>
      </div>

      <RectangleSection role={role} />

      {/* Add Event Modal */}
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
