import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./SeniorCare.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToHome from "./BackToHome";

const excludedDays = {
  "Health Check-up": [0, 6],
  "Free Medicine": [0, 6],
  Massage: [0, 6],
  "Dental Check-up": [0, 6],
  "Eye Check-up": [0, 6],
};

const SeniorCare = ({ role, handleLogout }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");

  const [pastAppointments, setPastAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const services = [
    "Health Check-up",
    "Free Medicine",
    "Massage",
    "Dental Check-up",
    "Eye Check-up",
  ];

  const times = {
    "Health Check-up": ["9:00 AM - 10:00 AM", "1:00 PM - 2:00 PM", "3:00 PM - 4:00 PM"],
    "Free Medicine": ["10:00 AM - 12:00 PM", "1:00 PM - 3:00 PM", "4:00 PM - 5:00 PM"],
    Massage: ["11:00 AM - 12:00 PM", "2:30 PM - 3:30 PM", "4:00 PM - 5:00 PM"],
    "Dental Check-up": ["9:30 AM - 11:30 AM", "1:00 PM - 4:30 PM"],
    "Eye Check-up": ["9:30 AM - 11:30 AM", "1:30 PM - 4:30 PM"],
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost/php/appointments.php", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        const today = new Date().toISOString().split("T")[0];
        const upcoming = [];
        const past = [];

        data.forEach((slot) => {
          if (slot.date >= today) {
            upcoming.push(slot);
          } else {
            past.push(slot);
          }
        });

        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
      } catch (error) {
        console.error("Error loading appointments:", error);
      }
    };

    if (role === "client") fetchAppointments();
  }, [role]);

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    const selectedDay = new Date(dateValue).getDay();

    if (selectedDay === 0 || selectedDay === 6) {
      alert("Weekends are not allowed.");
      setSelectedDate("");
      return;
    }

    if (excludedDays[selectedService]?.includes(selectedDay)) {
      alert("This service is not available on the selected day.");
      setSelectedDate("");
      return;
    }

    setSelectedDate(dateValue);
  };

  const handleServiceChange = (e) => {
    const service = e.target.value;
    setSelectedService(service);
    setAvailableTimes(times[service] || []);
  };

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

  const handleReservation = async () => {
    const newReservation = {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      status: "Pending Approval",
    };

    try {
      const response = await fetch("http://localhost/php/appointments.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReservation),
      });

      if (response.ok) {
        alert("Your reservation has been submitted.");
        closeModal();
      } else {
        const data = await response.json();
        alert("Reservation failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Reservation error:", error);
    }
  };

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
        <ol className="instruction-list">
          <li><strong>Piliin ang Serbisyo</strong>: Hanapin ang serbisyong kailangan.</li>
          <li><strong>Pumili ng Araw at Oras</strong>: Pumili ng available schedule.</li>
          <li><strong>Kumpirmahin</strong>: Pindutin ang "Confirm Reservation".</li>
          <li><strong>Tandaan</strong>: Tanggapin ang confirmation message.</li>
          <li><strong>Dumating sa Oras</strong>: Maging maagap sa appointment.</li>
        </ol>
        <p className="senior-paalala"><strong>Paalala:</strong> May prayoridad sa clinic ang may appointment.</p>
      </div>

      {role === "client" && (
        <div className="button-wrapper">
          <div className="button-container">
            <button className="secondary-button" onClick={() => openModal("reserveSlot")}>Reserve a Slot</button>
            <button className="secondary-button" onClick={() => openModal("viewReservedSlot")}>View Reserved Slots</button>
          </div>
        </div>
      )}

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <h2>{modalContent === "reserveSlot" ? "Reserve a Slot" : "Your Appointments"}</h2>

        {modalContent === "reserveSlot" && (
          <>
            <label>Choose a service:</label>
            <select value={selectedService} onChange={handleServiceChange} className="input-field">
              <option value="">Select a service</option>
              {services.map((service, idx) => (
                <option key={idx} value={service}>{service}</option>
              ))}
            </select>

            <label>Choose a date:</label>
            <input type="date" value={selectedDate} onChange={handleDateChange} className="input-field" disabled={!selectedService} />

            <label>Choose a time:</label>
            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="input-field" disabled={!selectedDate}>
              <option value="">Select a time</option>
              {availableTimes.map((time, idx) => (
                <option key={idx} value={time}>{time}</option>
              ))}
            </select>

            <div className="modal-buttons">
              <button
                onClick={handleReservation}
                className="secondary-button"
                disabled={!selectedService || !selectedDate || !selectedTime}
              >
                Confirm Reservation
              </button>
              <button onClick={closeModal} className="secondary-button gray-button">Close</button>
            </div>
          </>
        )}

        {modalContent === "viewReservedSlot" && (
          <>
            <h3>Upcoming Appointments</h3>
            {upcomingAppointments.length > 0 ? (
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((slot, i) => (
                    <tr key={i}>
                      <td>{slot.service}</td>
                      <td>{slot.date}</td>
                      <td>{slot.time}</td>
                      <td>{slot.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No upcoming appointments.</p>}

            <h3 style={{ marginTop: "20px" }}>Past Appointments</h3>
            {pastAppointments.length > 0 ? (
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pastAppointments.map((slot, i) => (
                    <tr key={i}>
                      <td>{slot.service}</td>
                      <td>{slot.date}</td>
                      <td>{slot.time}</td>
                      <td>{slot.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No past appointments.</p>}
          </>
        )}
      </Modal>

      <BackToHome role={role} />
      <Footer role={role} />
    </div>
  );
};

export default SeniorCare;
