import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import Overview from "./Overview";
import SeniorList from "./SeniorList";
import Appointments from "./Appointments";
import ChatInquiries from "./ChatInquiries";
import Events from "./Events";
import "./Sidebar.css";
import logo from "./logo.png";
import appoint from "./appoint.png"; // For Senior Care logo
import emergency from "./emergency.png"; // For Emergency Services logo
import chat from "./chat.png"; // For Chat Assistance logo

Modal.setAppElement("#root");

const RectangleSection = ({ role }) => {
  return (
    <div className="choices">
      <div className="rectangle21">
      {role === "client" && (
        <div className="rectangle23 paalala1">
          <h2>PAALALA:</h2>
          <p>
            Ang doktor ay available lamang sa Barangay General Tiburcio De Leon Health
            Center tuwing LUNES (Monday) at MIYERKULES (Wednesday) simula
            8AM-6PM lamang. <br></br><br></br>
            Para sa detalye, makipag-ugnayan sa health center.
          
          </p>
          
        </div>
      )}

      {role === "client" && (
        <div className="rectangle23 seniorcare">
          <Link to="/senior-care" className="link-container">
            <div className="senior-care-content">
              <div className="SeniorCare-Title">
                <h2>Senior Care</h2>
                <img src={appoint} alt="Senior Care-Logo" className="appoint-logo" />
              </div>
              <p>
              Seniors can book appointments for priority check-ups and health services, reducing wait times and ensuring timely care.
              </p>
              <button className="senior-care-button">
                
                <span className="senior-care-button-text">Book</span>
              </button>
            </div>
          </Link>
        </div>
      )}
      
      {role === "admin" && (
        <div className="rectangle23 seniorlist">
          <Link to="/senior-list" className="link-container">
            <div className="homepage-senior-list-content">
              <h2>Senior List</h2>
              <p>Manage and review the senior care list efficiently.</p>
              <button className="senior-list-button">
               
                <span className="senior-list-button-text">Seniors</span>
              </button>
            </div>
          </Link>
        </div>
      )}
      

      <div className="rectangle23 emergencyservices">
        <Link to="/emergency" className="link-container">
          <div className="emergency-services-content">
            <div className="Emergency-Title">
                <h2>Emergency Services</h2>
                <img src={emergency} alt="Emergency-Logo" className="emergency-logo" />
            </div>
            
            <p>Easily call an ambulance, police, or notify family during emergencies with a single tap.</p>
            <button className="emergency-services-button">
              
              <span className="emergency-services-button-text">Call</span>
            </button>
          </div>
        </Link>
      </div>

      <div className="rectangle23 chatassistance">
        <Link to="/chat" className="link-container">
          <div className="chat-assistance-content">
            <div className="Chat-Title">
                <h2>Chat Assistance</h2>
                <img src={chat} alt="Chat-Logo" className="chat-logo" />
            </div>
            
            <p>Communicate with barangay officials for support and inquiries through in-app chat.</p>
            <button className="chat-assistance-button">
             
              <span className="chat-assistance-button-text">Chat</span>
            </button>
          </div>
        </Link>
        </div>
      </div>
    </div>
    
  );
};

function CalendarComponent() {
  const [role, setRole] = useState(null); // Declare state for role
  const location = useLocation(); // Hook to get the current path
  const navigate = useNavigate(); // To navigate programmatically
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]); // Initialize events as an empty array
  const [selectedOption, setSelectedOption] = useState("overview");
  const [eventDates, setEventDates] = useState(new Set()); // To store dates with events

  useEffect(() => {
    fetchEvents(date);
  }, [date]);

  const fetchEvents = async (selectedDate) => {
    // Adjust the date to your local timezone
    const localDate = new Date(selectedDate);
    const formattedDate = localDate.toLocaleDateString("en-CA"); // Use "en-CA" to get the YYYY-MM-DD format

    try {
      const response = await fetch(
        `http://localhost/php/get_events.php?date=${formattedDate}`
      );
      const data = await response.json();
      setEvents(data.events || []); // Ensure events is always an array

      // Set event dates based on fetched events
      const datesWithEvents = new Set(
        data.events.map((event) => event.event_date)
      );
      setEventDates(datesWithEvents); // Update event dates
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]); // Ensure events is an empty array if error occurs
    }
  };

  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole); // Set role if it exists in localStorage
    } else if (location.pathname === "/") {
      setRole(null); // Reset role if on login page
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("role"); // Remove role from localStorage
    setRole(null); // Reset role in the app state
    navigate("/"); // Redirect to login page after logout
  };

  // Function to highlight dates with events
  const tileClassName = ({ date }) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format the date
    return eventDates.has(formattedDate) ? "highlight-event" : null; // Add class if the date has events
  };

  if (role === "admin") {
    return (
      <div className="admin-layout">
        <div className="sidebar">
          <div className="sidebar-logo">
            <img src={logo} alt="Logo" className="sidebar-logo-img" />
            <span className="sidebar-logo-text">Brgy. Gen. T. De Leon</span>
          </div>

          <ul>
            <li onClick={() => setSelectedOption("overview")} className="sidebar1-item">
              <img
                src="/icons/overview.png"
                alt="Logo"
                className="sidebar1-logo-img"
              />
              Overview
            </li>
            <li onClick={() => setSelectedOption("seniors")} className="sidebar1-item">
              <img
                src="/icons/seniors.png"
                alt="Logo"
                className="sidebar1-logo-img"
              />
              Seniors
            </li>
            <li onClick={() => setSelectedOption("events")} className="sidebar1-item">
              <img
                src="/icons/events.png"
                alt="Logo"
                className="sidebar1-logo-img"
              />
              Events
            </li>
            <li onClick={() => setSelectedOption("appointments")} className="sidebar1-item">
              <img
                src="/icons/app.png"
                alt="Logo"
                className="sidebar1-logo-img"
              />
              Appointments
            </li>
            <li onClick={() => setSelectedOption("chat")} className="sidebar1-item">
              <img
                src="/icons/chat.png"
                alt="Logo"
                className="sidebar1-logo-img"
              />
              Chat Inquiries
            </li>
          </ul>

          <hr className="sidebar-divider" />

          <ul>
            <li onClick={() => setSelectedOption("settings")} className="sidebar1-item">
              <img
                src="/icons/settings.png"
                alt="Logo"
                className="sidebar1-logo-img"
              />
              Settings
            </li>
            <li onClick={() => setSelectedOption("help")} className="sidebar1-item">
              <img
                src="/icons/help.png"
                alt="Logo"
                className="sidebar1-logo-img"
              />
              Help & Support
            </li>
          </ul>

          <div className="sidebar-logout" onClick={handleLogout}>
            Admin Name
            <img
              src="/icons/logout.png"
              alt="Logout"
              className="sidebar-logout-icon"
            />
          </div>
        </div>

        <div className="main-content">
          <div className="header1">
          <div className="greeting">
            <h1>Hello, ADMIN NAME</h1>
            <p>Good morning!</p>
            </div>
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search for anything"
                  className="search-bar"
                />
              </div>
          </div>

          <div className="content">
            {selectedOption === "overview" && <Overview />}
            {selectedOption === "seniors" && <SeniorList />}
            {selectedOption === "events" && <Events />}
            {selectedOption === "appointments" && <Appointments />}
            {selectedOption === "chat" && (
              <div>
                <h2>Chat Inquiries</h2>
                <ChatInquiries />
              </div>
            )}
            {selectedOption === "settings" && (
              <div>
                <h2>Settings</h2>
              </div>
            )}
            {selectedOption === "help" && (
              <div>
                <h2>Help & Support</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="CalendarComponent">
      <div className="CalendarLetter">
        <h2>companiON</h2>
        <h1 className="big-header1">Senior Care Services</h1>
      </div>
      <div className="calendar-container">
        <div className="calendar">
          <Calendar onChange={onDateChange} value={date} locale="en-US" tileClassName={tileClassName} />
        </div>

        <div className="events-slideshow-container">
          <div className="events-list">
            <h3>Events on {date.toDateString()}</h3>
            <ul>
              {events && events.length > 0 ? (
                events.map((event) => (
                  <li key={event.id}>
                    <strong>{event.event_title}</strong>Event Name: {event.event_description}
                  </li>
                ))
              ) : (
                <p>No events for this date. You can still click on other dates.</p>
              )}
            </ul>
          </div>

          {role === "client" && (
            <div className="slideshow-container">
              <Slideshow />
            </div>
          )}
        </div>
      </div>

      {role === "client" && <RectangleSection role={role} />}
    </div>
  );
}

export default CalendarComponent;
