import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./EventHomepage.css";
import "./OfficialsHomepage.css";
import "./ServicesHomepage.css";
import "./ChoicesHomepage.css";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import "./CalendarComponent.css";
import "./Emergency.css";
import "./Chat.css";
import "./SeniorCare.css";
import "./Profile.css";
import "./ChoicesHomepage.css"; // Make sure ito ang last na import
import Overview from "./Overview";
import SeniorList from "./SeniorList";
import Appointments from "./Appointments";
import EmergenciesAdmin from "./EmergenciesAdmin";
import ChatInquiries from "./ChatInquiries";
import Events from "./Events";
import Settings from "./Setting";
import Officials from "./Officials";
import "./Sidebar.css";
import logo from "./assets/logo.png";
import appoint from "./assets/appoint.png"; // For Senior Care logo
import emergency from "./assets/emergency.png"; // For Emergency Services logo
import chat from "./assets/chat.png"; // For Chat Assistance logo
import doctor from "./assets/doctor.png";
import arrow from "./assets/arrow.png";
import senior from "./assets/senior.png";
import chats from "./assets/chatinq.png";

Modal.setAppElement("#root");
// Array of Health Services
const services = [
  {
    name: "Health Check Up",
    description:
      "Mahalaga ang regular na pagsusuri ng kalusugan upang matukoy at maagapan ang posibleng sakit. Kasama rito ang pisikal na eksaminasyon, iba't ibang diagnostic tests, at konsultasyon upang masiguro ang tamang pangangalaga. Layunin nito ang maagang pagtuklas ng kondisyon para sa mas mabilis at epektibong paggamot.",
  },
  {
    name: "Medicine",
    description:
      "Mahalaga ang gamot sa paggamot at pag-iwas sa sakit. Iniinom ito ayon sa tamang pagsusuri at rekomendasyon ng doktor upang maging epektibo at maiwasan ang side effects. May libreng o murang gamot mula sa gobyerno at ilang organisasyon para sa mga nangangailangan.",
  },
  {
    name: "Eye Check Up",
    description:
      "Ang eye check-up ay mahalaga upang masuri ang kalusugan ng mata at matukoy ang mga problema sa paningin gaya ng astigmatism, katarata, o glaucoma. Kasama rito ang pagsusuri sa paningin, pagsukat ng eye pressure, at konsultasyon para sa tamang pangangalaga at solusyon sa mata.",
  },
  {
    name: "Dental Check Up",
    description:
      "Mahalaga ang dental check-up upang mapanatili ang malusog na ngipin at gilagid. Kasama rito ang regular na paglilinis, masusing pagsusuri, at payo sa tamang pangangalaga. Nakakatulong ito sa pag-iwas sa pagkabulok ng ngipin, sakit sa gilagid, at iba pang oral health issues para sa pangmatagalang kalusugan ng bibig.",
  },
  {
    name: "Xray Examination",
    description:
      "Isang mahalagang diagnostic procedure na gumagamit ng imaging upang masuri ang kondisyon ng buto at mga laman-loob. Nakakatulong ito sa pagtukoy ng bali, pinsala, o anumang sakit na maaaring makaapekto sa kalusugan. Ginagamit ito bilang batayan sa tamang diagnosis at epektibong gamutan.",
  },
  {
    name: "Massage Therapy",
    description:
      "Isang epektibong paraan ng pagpapahinga at pagpapagaan ng tensyon sa kalamnan. Nakakatulong ito sa pagbawas ng stress, pagpapabuti ng daloy ng dugo, at pagpapalakas ng pangkalahatang kaginhawaan ng katawan at isip. Ang regular na masahe ay maaaring makatulong sa pagbawi mula sa pagod at pananatili ng balanse sa kalusugan.",
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
        `https://backend-production-4629.up.railway.app/get_events.php?date=${formattedDate}`
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
              <h2>🔔 PAALALA: 🔔</h2>
              <p>
                Ang doktor ay available lamang sa Barangay General Tiburcio De
                Leon Health Center tuwing LUNES (Monday) hanggang BIYERNES
                (Friday) simula 8AM-6PM lamang. <br></br>
                <br></br>
                Para sa ibang mga detalye, maaaring makipag-unayan sa health center.
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
                  <p>Maayos na serbisyong medikal para sa regular na check up sa kalusugan ng mga senior citizens upang mapanatili ang kanilang maayos na kondisyon.</p>
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

                <p>Madaling humingi ng tulong sa pulis, ambulansya, o bumbero sa oras ng emergency gamit ang isang pindot sa button.</p>
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

                <p>Direktang pakikipag-usap sa opisyal ng health center para sa suporta, gabay, at pagsagot sa mga katanungan.</p>
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
          <div className="Events-Subheader">
            <p className="Events-sub">EVENTS</p>
          </div>
          
          <h1 className="Events-Title">Calendar of Activities</h1>
        </div>

        <div className="events-container">
          <Calendar
            onChange={onDateChange}
            value={date}
            locale="en-US"
            tileClassName={tileClassName}
          />

          <div className="events-list">
            <h3 className="Events-listheader">
              Events on {date.toDateString()}
            </h3>

            {events && events.length > 0 ? (
              <div className="event-list-container">
                {events.map((event) => (
                  <div key={event.id} className="event-item">
                    <h4 className="event-title">
                      📝 <strong>Event Title:</strong>{" "}
                      {event.event_title || "Untitled Event"}
                    </h4>

                    <p className="event-description">
                      📄 <strong>Event Description:</strong>{" "}
                      {event.event_description || "No description available."}
                    </p>

                    <div className="event-meta">
                      <span className="location">
                        {event.location || "Location not specified"}
                      </span>
                      <span className="organizer">
                        {event.organizer || "Organizer unknown"}
                      </span>
                      <span className="datetime">
                        {event.date_time
                          ? new Date(event.date_time).toLocaleString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "Time not available"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                No events for this date. You can still click on other dates.
              </p>
            )}
          </div>
        </div>
      </div>

      <Officials></Officials>
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

          <hr className="sidebar-divider" />

          <ul>
            <li
              onClick={() => setSelectedOption("overview")}
              className="sidebar1-item"
            >
              <img
                src="/icons/dashboard.png"
                alt="Logo"
                className="sidebar1-logo-img"
              />
              Dashboard
            </li>
            <li
              onClick={() => setSelectedOption("seniors")}
              className="sidebar1-item"
            >
              <img src={senior} alt="Senior" className="sidebar1-logo-img" />
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
                src="/icons/appoint.png"
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
              <img src={chats} alt="Logo" className="sidebar1-logo-img" />
              Chat Inquiries
            </li>
          </ul>

          <hr className="sidebar-divider" />

          <div className="settings">
            <ul>
              <li
                onClick={() => setSelectedOption("settings")}
                className="settings-item"
              >
                <img
                  src="/icons/settings.png"
                  alt="Logo"
                  className="sidebar1-logo-img"
                />
                Settings
              </li>
            </ul>
          </div>
        </div>

        <div className="main-content">
          <div className="header1">
            <button className="logout-link-admin" onClick={handleLogout}>
              Logout
            </button>
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
            <h1 className="home-title">Barangay General Tiburcio De Leon</h1>
            <p className="home-description">
              Maalaga at angkop na serbisyo upang matulungan ang nakatatanda na
              mamuhay nang komportable, ligtas, at walang pag-aalinlangan.
            </p>
          </div>
        </div>
      </div>
      {role === "client" && <RectangleSection role={role} />}
    </div>
  );
}

export default CalendarComponent;
