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
import EmergenciesAdmin from "./EmergenciesAdmin";
import ChatInquiries from "./ChatInquiries";
import Events from "./Events";
import Settings from "./Setting";
import "./Sidebar.css";
import logo from "./logo.png";
import appoint from "./appoint.png"; // For Senior Care logo
import emergency from "./emergency.png"; // For Emergency Services logo
import chat from "./chat.png"; // For Chat Assistance logo
import doctor from "./doctor.png";
import arrow from "./arrow.png";
import person from "./person.jpg";

Modal.setAppElement("#root");

// Array of Health Services
const services = [
  {
    name: "Health Check Up",
    description:
      "Health check-ups are routine medical examinations aimed at evaluating overall well-being, identifying potential health issues early, and managing any existing conditions effectively. These assessments often include physical evaluations, diagnostic tests, and consultations to ensure proper preventive care and treatment planning.",
    image: doctor,
  },
  {
    name: "Medicine",
    description:
      "Medicine encompasses the diagnosis, treatment, and prevention of diseases through prescribed medications tailored to manage specific health conditions. This involves careful assessment, appropriate drug selection, and patient education to ensure effective outcomes and minimize side effects, promoting overall health and recovery.",
    image: emergency,
  },
  {
    name: "Eye Check Up",
    description:
      "Eye checkups are specialized evaluations focused on assessing vision and detecting eyerelated issues, such as refractive errors or diseases like glaucoma. These examinations include vision tests, eye pressure checks, and consultations to ensure optimal eye health and corrective solutions if necessary.",
    image: chat,
  },
  {
    name: "Dental Check Up",
    description:
      "Dental checkups are comprehensive oral health assessments designed to maintain healthy teeth and gums, prevent cavities, and identify dental problems early. These visits typically include cleaning, examinations, and advice on oral hygiene practices to ensure long-term dental care.",
    image: chat,
  },
  {
    name: "Xray Examination",
    description:
      "Xray checkups are diagnostic imaging procedures that provide detailed views of bones and internal organs to detect injuries, fractures, or underlying health conditions. This noninvasive process aids in accurate diagnosis and treatment planning for a wide range of medical concerns.",
    image: chat,
  },
  {
    name: "Massage Therapy",
    description:
      "Massage therapy is a therapeutic practice aimed at relieving muscle tension, reducing stress, and improving circulation through targeted manipulation of soft tissues. This treatment fosters relaxation, alleviates discomfort, and supports physical and mental wellbeing in a holistic manner.",
    image: chat,
  },
];

const RectangleSection = ({ role }) => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  const handleNextService = () => {
    setCurrentServiceIndex((prevIndex) => (prevIndex + 1) % services.length);
  };
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]); // Initialize events as an empty array
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

  // Function to highlight dates with events
  const tileClassName = ({ date }) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format the date
    return eventDates.has(formattedDate) ? "highlight-event" : null; // Add class if the date has events
  };

  return (
    <div className="Dashboard">
      <div className="choices">
        <div className="rectangle21">
          {role === "client" && (
            <div className="rectangle23 paalala1">
              <h2>PAALALA:</h2>
              <p>
                Ang doktor ay available lamang sa Barangay General Tiburcio De
                Leon Health Center tuwing LUNES (Monday) at MIYERKULES
                (Wednesday) simula 8AM-6PM lamang. <br></br>
                <br></br>
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
                    <img
                      src={appoint}
                      alt="Senior Care-Logo"
                      className="appoint-logo"
                    />
                  </div>
                  <p>
                    Seniors can book appointments for priority check-ups and
                    health services, reducing wait times and ensuring timely
                    care.
                  </p>
                  <button className="senior-care-button">
                    <span className="senior-care-button-text">Appointment</span>
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
                  <img
                    src={emergency}
                    alt="Emergency-Logo"
                    className="emergency-logo"
                  />
                </div>

                <p>
                  Easily call an ambulance, police, or notify family during
                  emergencies with a single tap.
                </p>
                <button className="emergency-services-button">
                  <span className="emergency-services-button-text">
                    Contact List
                  </span>
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

                <p>
                  Communicate with barangay officials for support and inquiries
                  through in-app chat.
                </p>
                <button className="chat-assistance-button">
                  <span className="chat-assistance-button-text">Chat</span>
                </button>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="Service-Section">
        <div className="Service-Header">
          <p className="Service-Subheader">SERVICE</p>
          <h1 className="Service-Title">Our Medical Services</h1>
        </div>
        <div className="Service-Content" key={currentServiceIndex}>
          <div className="Service-Image">
            <img src={doctor} alt="Doctor" />
          </div>
          <div className="Service-Details">
            <div className="Service-Texts">
              <div className="Service-Name-Wrapper">
                <h2 className="Service-Name">
                  {services[currentServiceIndex].name}
                </h2>
                <button className="Service-Icon" onClick={handleNextService}>
                  <img src={arrow} alt="Arrow Icon" />
                </button>
              </div>
              <p className="Service-Description">
                {services[currentServiceIndex].description}
              </p>
            </div>

            <div className="Service-Actions">
              <button className="Service-Book-Button">
                <Link to="/senior-care" className="book-link">
                  Book
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="Events">
        <div className="Events-Header">
          <p className="Events-Subheader">EVENTS</p>
          <h1 className="Events-Title">Our Important Events</h1>
        </div>
        <div className="events-container">
          <div className="calendar-container">
            <Calendar
              onChange={onDateChange}
              value={date}
              locale="en-US"
              tileClassName={tileClassName}
            />
          </div>
          <div className="events-list">
            <h3>Events on {date.toDateString()}</h3>
            <ul>
              {events && events.length > 0 ? (
                events.map((event) => (
                  <li key={event.id}>
                    <strong>{event.event_title}</strong> Event Name:{" "}
                    {event.event_description}
                  </li>
                ))
              ) : (
                <p>
                  No events for this date. You can still click on other dates.
                </p>
              )}
            </ul>
          </div>
          <div className="slideshow-container">
            <Slideshow />
          </div>
        </div>
      </div>

      <div className="barangay-health-officials">
        <div className="officials-header">
          <p className="officials-subheader">OFFICIALS</p>
          <h1 className="officials-title">Our Barangay Officials</h1>
        </div>
        <div class="officials-grid">
          <div class="official-card">
            <img src={person} alt="brgy-official" class="official-image" />
            <p class="official-name">Ferrer, Rizalino </p>
            <p class="official-position">Punong Barangay</p>
          </div>
          <div class="official-card">
            <img src={person} alt="brgy-official" class="official-image" />
            <p class="official-name">Matos, Rica</p>
            <p class="official-position">Kagawad</p>
          </div>
          <div class="official-card">
            <img src={person} alt="brgy-official" class="official-image" />
            <p class="official-name">De Gula, Susan</p>
            <p class="official-position">Kagawad</p>
          </div>
          <div class="official-card">
            <img src={person} alt="brgy-official" class="official-image" />
            <p class="official-name">Dela Cruz, Zella</p>
            <p class="official-position">Kagawad</p>
          </div>
          <div class="official-card">
            <img src={person} alt="brgy-official" class="official-image" />
            <p class="official-name">Moises Beltran</p>
            <p class="official-position">Kagawad</p>
          </div>
          <div class="official-card">
            <img src={person} alt="brgy-official" class="official-image" />
            <p class="official-name">Bernardino, Bogie</p>
            <p class="official-position">Kagawad</p>
          </div>
          <div class="official-card">
            <img src={person} alt="brgy-official" class="official-image" />
            <p class="official-name">Edgardo, Dizon</p>
            <p class="official-position">Kagawad</p>
          </div>
          <div class="official-card">
            <img src={person} alt="brgy-official" class="official-image" />
            <p class="official-name">Colibao, Shennel</p>
            <p class="official-position">Kagawad</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function CalendarComponent() {
  const [role, setRole] = useState(null); // Declare state for role
  const location = useLocation(); // Hook to get the current path
  const navigate = useNavigate(); // To navigate programmatically
  const [selectedOption, setSelectedOption] = useState("overview");

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

  if (role === "admin") {
    return (
      <div className="admin-layout">
        <div className="sidebar">
          <div className="sidebar-logo">
            <img src={logo} alt="Logo" className="sidebar-logo-img" />
            <span className="sidebar-logo-text">Brgy. Gen. T. De Leon</span>
          </div>

          <ul>
            <li
              onClick={() => setSelectedOption("overview")}
              className="sidebar1-item"
            >
              <img
                src="/icons/overview.png"
                alt="Logo"
                className="sidebar1-logo-img"
              />
              Overview
            </li>
            <li
              onClick={() => setSelectedOption("seniors")}
              className="sidebar1-item"
            >
              <img
                src="/icons/seniors.png"
                alt="Logo"
                className="sidebar1-logo-img"
              />
              Seniors
            </li>
            <li
              onClick={() => setSelectedOption("events")}
              className="sidebar1-item"
            >
              <img
                src="/icons/events.png"
                alt="Logo"
                className="sidebar1-logo-img"
              />
              Events
            </li>
            <li
              onClick={() => setSelectedOption("appointments")}
              className="sidebar1-item"
            >
              <img
                src="/icons/app.png"
                alt="Logo"
                className="sidebar1-logo-img"
              />
              Appointments
            </li>
            <li
              onClick={() => setSelectedOption("emergenciesadmin")}
              className="sidebar1-item"
            >
              <img
                src="/icons/emergency.png"
                alt="Logo"
                className="sidebar1-logo-img"
              />
              Emergencies
            </li>
            <li
              onClick={() => setSelectedOption("chat")}
              className="sidebar1-item"
            >
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
            <li
              onClick={() => setSelectedOption("settings")}
              className="sidebar1-item"
            >
              <img
                src="/icons/settings.png"
                alt="Logo"
                className="sidebar1-logo-img"
              />
              Settings
            </li>
            <li
              onClick={() => setSelectedOption("help")}
              className="sidebar1-item"
            >
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
            {selectedOption === "emergenciesadmin" && <EmergenciesAdmin />}
            {selectedOption === "chat" && (
              <div>
                <h2>Chat Inquiries</h2>
                <ChatInquiries />
              </div>
            )}
            {selectedOption === "settings" && <Settings />}
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
      <div className="homepage">
        <div className="home-contents">
          <div className="home-header">
            <p className="home-subheader">companiON</p>
            <h1 className="home-title">Senior Care Services</h1>
            <p className="home-description">
              Maalaga, makatao, at angkop na serbisyo upang matulungan ang
              nakatatanda na mamuhay nang komportable, ligtas, at may dignidad.
            </p>
          </div>

          <div className="facebook-box">
            <div className="facebook-page">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FBarangay-Gen-T-De-Leon-61550950657692&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                width="500"
                height="500"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      {role === "client" && <RectangleSection role={role} />}
    </div>
  );
}

export default CalendarComponent;
