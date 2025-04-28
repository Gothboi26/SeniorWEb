import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./SeniorCare.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToHome from "./BackToHome";

const formatDateToReadable = (dateStr) => {
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-US", options);
};

const formatTimeAMPM = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(h);
  date.setMinutes(m);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
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
      const res = await fetch("https://backend-production-4629.up.railway.app/appointments.php", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setAppointments(data);

      const slotRes = await fetch("https://backend-production-4629.up.railway.app/get_service_slots.php", {
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
    return [...new Set(serviceSlots.filter(slot => slot.serviceName === service).map(slot => slot.date))];
  };

  const getTimesForServiceAndDate = (service, date) => {
    const normalizeTime = (t) => t.split(":").slice(0, 2).join(":");

    return serviceSlots
      .filter(slot => slot.serviceName === service && slot.date === date)
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

        const remaining = slot.availableSlot - approvedCount;
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
      const res = await fetch("https://backend-production-4629.up.railway.app/appointments.php", {
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

  const today = getDateOnly(new Date());
  const upcomingAppointments = appointments.filter((a) => a.date >= today);
  const pastAppointments = appointments.filter((a) => a.date < today);

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
              <li><strong>Piliin ang Serbisyo</strong>
                <p>Hanapin ang mga serbisyong pangkalusugan tulad ng health check-up, masahe, libreng gamot, dental check-up, o eye check-up. Pindutin ang serbisyong nais n'yo i-book. </p>
              </li>
              <li><strong>Pumili ng Araw at Oras</strong>
                <p>Pagkatapos piliin ang serbisyo, lilitaw ang kalendaryo o listahan ng mga available na oras. Pumili ng petsa at oras na pinakakomportable para sa inyo. </p>
              </li>
              <li><strong>Kumpirmahin</strong>
                <p>Kapag nakapili na ng araw at oras, pindutin ang "Kumpirmahin" o "Book Appointment" na button. Lalabas ang detalye ng inyong appointment, kasama ang petsa, oras, at lokasyon ng serbisyong napili. </p>
              </li>
              <li><strong>Tandaan ang Detalye</strong>
                <p>Tingnan ang confirmation message o text na ipadadala ng app. Tandaan ang petsa at oras ng inyong appointment. </p>
              </li>
              <li><strong>Dumating sa Takdang Oras</strong>
                <p>Siguraduhing dumating sa tamang oras o 10-15 minuto bago ang schedule upang maayos ang proseso ng inyong pagbisita. </p>
              </li>
            </ol>
          </div>
        </div>
        <div className="senior-paalala">
          <p className="senior-p"><strong>Paalala: </strong>Sa pamamagitan ng maingat na pagtatakda ng iskedyul, kayo ay bibigyan ng prayoridad sa klinika o sentrong pangkalusugan. Hindi na ninyo kailangang maghintay nang matagal sapagkat may itinakdang oras para sa inyong konsultasyon.</p>
        </div>
      </div> {/* Closing senior-details-container */}

      <div className="button-wrapper">
        <button className="reserve-button" onClick={() => openModal("reserveSlot")}>Itakda ang Oras</button>
        <button className="view-button" onClick={() => openModal("upcoming")}>Tingnan ang Tinakdang Oras</button>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        {modalContent === "reserveSlot" ? (
          <>
            <h2>Reserve Slot</h2>
            <label>Piliin ang Serbisyo:</label>
            <select value={selectedService} onChange={handleServiceChange} className="input-field">
              <option value="">Select a service</option>
              {services.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>

            {selectedService && (
              <>
                <label>Piliin ang Araw:</label>
                <div className="calendar-styles">
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
                </div>
              </>
            )}

            {availableTimes.length > 0 && (
              <>
                <label>Piliin ang Oras:</label>
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
              <button className="confirm-button" disabled={!selectedService || !selectedDate || !selectedTime} onClick={handleReservation}>
                Confirm
              </button>
              <button className="secondary-button gray-button" onClick={closeModal}>Close</button>
            </div>
          </>
        ) : (
          <>
            <h2>My Appointments</h2>
            {renderAppointmentsTable(upcomingAppointments)}
          </>
        )}
      </Modal>

      {showNotification && (
        <div className="paalala-toast">
          <p>🔔 Naaprubahan na ang iyong appointment! Tingnan ang \"View Reserved Slots\".</p>
          <button onClick={() => setShowNotification(false)}>OK</button>
        </div>
      )}

      <BackToHome role={role} />
      <Footer role={role} />
    </div>
  );
};

export default SeniorCare;
