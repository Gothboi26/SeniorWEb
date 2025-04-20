import React, { useState, useEffect, useRef } from "react";
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

const getDateOnly = (d) => {
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().split("T")[0];
};

const SeniorCare = ({ role, handleLogout }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("upcoming");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [serviceSlots, setServiceSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const notificationShownRef = useRef(false);

  const services = [
    "Health Check-up",
    "Free Medicine",
    "Massage Therapy",
    "Dental Check-up",
    "Eye Check-up",
  ];

  const fetchAllData = async () => {
    try {
      const res = await fetch("http://localhost/php/appointments.php", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setAppointments(data);

      const slotRes = await fetch("http://localhost/php/get_service_slots.php", {
        credentials: "include",
      });
      const slotData = await slotRes.json();
      setServiceSlots(slotData);
    } catch (err) {
      console.error("Error reloading data:", err);
    }
  };

  useEffect(() => {
    if (role === "client") {
      fetchAllData();
      const interval = setInterval(fetchAllData, 10000);
      return () => clearInterval(interval);
    }
  }, [role]);

  useEffect(() => {
    if (!notificationShownRef.current) {
      const approved = appointments.find((a) => a.status.toLowerCase() === "approved");
      if (approved) {
        setShowNotification(true);
        notificationShownRef.current = true;
      }
    }
  }, [appointments]);

  const openModal = (type) => {
    setModalContent(type);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent("upcoming");
    setSelectedService("");
    setSelectedDate("");
    setSelectedTime("");
  };

  const getValidDatesForService = (service) => {
    return [...new Set(serviceSlots.filter(slot => slot.service_name === service).map(slot => slot.date))];
  };

  const getTimesForServiceAndDate = (service, date) => {
    const normalizeTime = (t) => t.split(":").slice(0, 2).join(":");

    return serviceSlots
      .filter(slot => slot.service_name === service && slot.date === date)
      .map(slot => {
        const slotTime = normalizeTime(slot.time);
        const approvedCount = appointments.filter(a => {
          const apptTime = normalizeTime(a.time);
          return (
            a.service === service &&
            a.date === date &&
            apptTime === slotTime &&
            a.status.toLowerCase() === "approved"
          );
        }).length;

        const remaining = slot.max_slots - approvedCount;
        return { time: slot.time, remaining };
      }).filter(slot => slot.remaining > 0);
  };

  const handleServiceChange = (e) => {
    const service = e.target.value;
    setSelectedService(service);
    setSelectedDate("");
    setSelectedTime("");
    setAvailableTimes([]);
  };

  const handleCalendarSelect = (dateObj) => {
    const formatted = getDateOnly(dateObj);
    const validDates = getValidDatesForService(selectedService);
    const today = getDateOnly(new Date());

    if (!validDates.includes(formatted) || formatted < today) {
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

  const today = getDateOnly(new Date());
  const upcomingAppointments = appointments.filter((a) => a.date >= today);
  const pastAppointments = appointments.filter((a) => a.date < today);

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
              <li><strong>Piliin ang Serbisyo</strong></li>
              <li><strong>Pumili ng Araw at Oras</strong></li>
              <li><strong>Kumpirmahin</strong></li>
              <li><strong>Tandaan ang Detalye</strong></li>
              <li><strong>Dumating sa Takdang Oras</strong></li>
            </ol>
          </div>
        </div>
        <div className="senior-paalala">
          <p className="senior-p"><strong>Paalala:</strong> Kayo ay bibigyan ng prayoridad sa clinic.</p>
        </div>
      </div>

      <div className="button-wrapper">
        <button className="secondary-button" onClick={() => openModal("reserveSlot")}>Reserve a Slot</button>
        <button className="secondary-button" onClick={() => openModal("upcoming")}>View Reserved Slots</button>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <h2>{modalContent === "reserveSlot" ? "Reserve a Slot" : "Your Appointments"}</h2>

        {modalContent === "reserveSlot" ? (
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
                    const formatted = getDateOnly(date);
                    const today = getDateOnly(new Date());
                    return formatted < today || !getValidDatesForService(selectedService).includes(formatted);
                  }}
                  tileClassName={({ date }) => {
                    const formatted = getDateOnly(date);
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
                    <option key={i} value={t.time}>
                      {formatTimeAMPM(t.time)} ({t.remaining} slot{t.remaining > 1 ? "s" : ""} left)
                    </option>
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
        ) : (
          <>
            <div className="tab-buttons">
              <button onClick={() => setModalContent("pending")} className={modalContent === "pending" ? "active-tab" : ""}>Pending</button>
              <button onClick={() => setModalContent("upcoming")} className={modalContent === "upcoming" ? "active-tab" : ""}>Upcoming</button>
              <button onClick={() => setModalContent("past")} className={modalContent === "past" ? "active-tab" : ""}>Past</button>
            </div>

            {modalContent === "pending" && (
              <>
                <h3>Pending Appointments</h3>
                {renderAppointmentsTable(upcomingAppointments.filter((a) => a.status.toLowerCase() === "pending"))}
              </>
            )}
            {modalContent === "upcoming" && (
              <>
                <h3>Upcoming Appointments</h3>
                {renderAppointmentsTable(upcomingAppointments.filter((a) => a.status.toLowerCase() !== "pending"), true)}
              </>
            )}
            {modalContent === "past" && (
              <>
                <h3>Past Appointments (Last 3 Days)</h3>
                <div className="view-log-list">
                  {pastAppointments.filter((a) => {
                    const apptDate = new Date(a.date);
                    const threeDaysAgo = new Date();
                    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                    return apptDate >= threeDaysAgo;
                  }).map((a, i) => (
                    <div className="log-item" key={i}>
                      <p><strong>Service:</strong> {a.service}</p>
                      <p><strong>Date:</strong> {formatDateToReadable(a.date)}</p>
                      <p><strong>Time:</strong> {formatTimeAMPM(a.time)}</p>
                      <p><strong>Status:</strong> {a.status}</p>
                      <p><strong>Remarks:</strong> {a.remarks || "-"}</p>
                      <hr />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </Modal>

      {showNotification && (
        <div className="toast-notification">
          <p>🔔 Naaprubahan na ang iyong appointment! Tingnan ang "View Reserved Slots".</p>
          <button onClick={() => setShowNotification(false)}>OK</button>
        </div>
      )}

      <BackToHome role={role} />
      <Footer role={role} />
    </div>
  );
};

export default SeniorCare;
