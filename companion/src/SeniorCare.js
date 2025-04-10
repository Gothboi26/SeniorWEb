// ✅ Revised SeniorCare.jsx with correct service mapping and slot handling
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./SeniorCare.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToHome from "./BackToHome";

const formatDateToReadable = (dateStr) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
};

const formatTimeAMPM = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(h);
  date.setMinutes(m);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};

const SeniorCare = ({ role, handleLogout }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [serviceSlots, setServiceSlots] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const services = [
    "Health Check-up",
    "Free Medicine",
    "Massage Therapy",
    "Dental Check-up",
    "Eye Check-up",
  ];

  useEffect(() => {
    fetch("http://localhost/php/get_service_slots.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setServiceSlots(data))
      .catch((err) => console.error("Failed to load slots", err));

    const fetchAppointments = async () => {
      try {
        const res = await fetch("http://localhost/php/appointments.php", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        const today = new Date().toISOString().split("T")[0];
        setUpcomingAppointments(data.filter((a) => a.date >= today));
        setPastAppointments(data.filter((a) => a.date < today));
      } catch (err) {
        console.error("Error loading appointments:", err);
      }
    };

    if (role === "client") fetchAppointments();
  }, [role]);

  const openModal = (type) => {
    setModalContent(type);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent("");
    setSelectedService("");
    setSelectedDate("");
    setSelectedTime("");
  };

  const getValidDatesForService = (service) => {
    return [...new Set(serviceSlots.filter(slot => slot.service_name === service).map(slot => slot.date))];
  };

  const getTimesForServiceAndDate = (service, date) => {
    return serviceSlots
      .filter(slot => slot.service_name === service && slot.date === date)
      .map(slot => {
        const used = upcomingAppointments.filter(
          appt => appt.service === service && appt.date === date && appt.time === slot.time && appt.status.toLowerCase() === "approved"
        ).length;
        const remaining = slot.max_slots - used;
        return { time: slot.time, remaining };
      });
  };

  const handleServiceChange = (e) => {
    const service = e.target.value;
    setSelectedService(service);
    setSelectedDate("");
    setSelectedTime("");
    setAvailableTimes([]);
  };

  const handleCalendarSelect = (dateObj) => {
    const formatted = dateObj.toISOString().split("T")[0];
    const validDates = getValidDatesForService(selectedService);
    if (!validDates.includes(formatted)) {
      alert("No available slots on this date.");
      return;
    }
    setSelectedDate(formatted);
    setAvailableTimes(getTimesForServiceAndDate(selectedService, formatted));
    setSelectedTime("");
  };

  const handleReservation = async () => {
    const payload = {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      status: "pending",
    };

    try {
      const res = await fetch("http://localhost/php/appointments.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        alert("Your reservation was submitted and is pending approval.");
        closeModal();
      } else {
        alert("Failed: " + (result.error || "Unknown issue"));
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const renderAppointmentsTable = (appointments, showRemarks = false) => (
    <table className="appointments-table">
      <thead>
        <tr>
          <th>Service</th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
          {showRemarks && <th>Remarks</th>}
        </tr>
      </thead>
      <tbody>
        {appointments.map((a, i) => (
          <tr key={i}>
            <td>{a.service}</td>
            <td>{formatDateToReadable(a.date)}</td>
            <td>{formatTimeAMPM(a.time)}</td>
            <td>{a.status}</td>
            {showRemarks && <td>{a.remarks || "-"}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="senior-care-container">
      <Navbar role={role} handleLogout={handleLogout} />

      <div className="senior-title-container">
        <h1 className="senior-title">Senior Care</h1>
      </div>

      <div className="senior-details-container">
        <p className="senior-title-p">
          Mga Hakbang sa Pag-book ng Appointment Gamit ang Aplikasyon para sa Serbisyong Pangkalusugan at Iba Pa para sa mga Nakatatanda
        </p>
        <div className="instruction-container">
          <div className="instruction-desc">
            <ol className="instruction-list">
              <li><strong>Piliin ang Serbisyong Kailangan:</strong><p>Hanapin ang mga serbisyong pangkalusugan tulad ng health check-up, masahe, libreng gamot, dental check-up, o eye check-up. Pindutin ang serbisyong nais n'yo i-book.</p></li>
              <li><strong>Pumili ng Araw at Oras ng Appointment:</strong><p>Pagkatapos piliin ang serbisyo, lilitaw ang kalendaryo o listahan ng mga available na oras. <strong>Ang mga petsang may serbisyo ay makikita sa date picker.</strong></p></li>
              <li><strong>Kumpirmahin ang Appointment:</strong><p>Kapag nakapili na ng araw at oras, pindutin ang "Kumpirmahin" o "Book Appointment". Lalabas ang detalye ng inyong appointment.</p></li>
              <li><strong>Tandaan ang Detalye:</strong><p>Tingnan ang confirmation message. Tandaan ang petsa at oras.</p></li>
              <li><strong>Dumating sa Takdang Oras:</strong><p>Siguraduhing dumating 10-15 minuto bago ang schedule.</p></li>
            </ol>
          </div>
        </div>
        <div className="senior-paalala">
          <p className="senior-p"><strong>Paalala: </strong>Sa pamamagitan ng pag-book ng appointment, kayo ay bibigyan ng prayoridad sa clinic o health center.</p>
        </div>
      </div>

      <div className="button-wrapper">
        <button className="secondary-button" onClick={() => openModal("reserveSlot")}>Reserve a Slot</button>
        <button className="secondary-button" onClick={() => openModal("viewReservedSlot")}>View Reserved Slots</button>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <h2>{modalContent === "reserveSlot" ? "Reserve a Slot" : "Your Appointments"}</h2>

        {modalContent === "reserveSlot" && (
          <>
            <label>Choose a service:</label>
            <select value={selectedService} onChange={handleServiceChange} className="input-field">
              <option value="">Select a service</option>
              {services.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>

            {selectedService && (
              <>
                <label>Choose a date:</label>
                <Calendar
                  onClickDay={handleCalendarSelect}
                  value={selectedDate ? new Date(selectedDate) : null}
                  tileDisabled={({ date }) => {
                    const formatted = date.toISOString().split("T")[0];
                    return !getValidDatesForService(selectedService).includes(formatted);
                  }}
                  tileClassName={({ date }) => {
                    const formatted = date.toISOString().split("T")[0];
                    return getValidDatesForService(selectedService).includes(formatted)
                      ? "highlighted"
                      : null;
                  }}
                />
              </>
            )}

            {availableTimes.length > 0 && (
              <>
                <label>Choose a time:</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a time</option>
                  {availableTimes.map((t, i) => (
                    <option key={i} value={t.time}>{formatTimeAMPM(t.time)} ({t.remaining} slots left)</option>
                  ))}
                </select>
              </>
            )}

            <div className="modal-buttons">
              <button className="secondary-button" disabled={!selectedService || !selectedDate || !selectedTime} onClick={handleReservation}>
                Confirm Reservation
              </button>
              <button className="secondary-button gray-button" onClick={closeModal}>Close</button>
            </div>
          </>
        )}

        {modalContent === "viewReservedSlot" && (
          <>
            <h3>Pending Appointments</h3>
            {upcomingAppointments.filter((a) => a.status === "pending").length > 0
              ? renderAppointmentsTable(upcomingAppointments.filter((a) => a.status === "pending"))
              : <p>No pending appointments.</p>}

            <h3 style={{ marginTop: "20px" }}>Upcoming Appointments</h3>
            {upcomingAppointments.filter((a) => a.status !== "pending").length > 0
              ? renderAppointmentsTable(upcomingAppointments.filter((a) => a.status !== "pending"), true)
              : <p>No upcoming approved/rejected appointments.</p>}

            <h3 style={{ marginTop: "20px" }}>Past Appointments</h3>
            {pastAppointments.length > 0
              ? renderAppointmentsTable(pastAppointments, true)
              : <p>No past appointments.</p>}
          </>
        )}
      </Modal>
      <BackToHome role={role} />
      <Footer role={role} />
    </div>
  );
};

export default SeniorCare;
