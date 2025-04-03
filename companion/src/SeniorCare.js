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
  const [reservedSlots, setReservedSlots] = useState([]);

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

  // Handle date selection
  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    const selectedDay = new Date(dateValue).getDay();

    if (selectedDay === 0 || selectedDay === 6) {
      alert("Weekends (Saturday and Sunday) are not allowed. Please select a weekday.");
      setSelectedDate("");
      return;
    }

    if (excludedDays[selectedService]?.includes(selectedDay)) {
      alert(`The selected service is not available on this day. Please choose another date.`);
      setSelectedDate("");
      return;
    }

    setSelectedDate(dateValue);
  };

  // Fetch reserved appointments
  useEffect(() => {
    const fetchReservedSlots = async () => {
      try {
        const response = await fetch("https://companion.up.railway.app/appointments.php", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setReservedSlots(data);
      } catch (error) {
        console.error("Error fetching reserved slots:", error);
      }
    };

    if (role === "client") {
      fetchReservedSlots();
    }
  }, [role]);

  // Handle service selection
  const handleServiceChange = (e) => {
    const service = e.target.value;
    setSelectedService(service);
    setAvailableTimes(times[service] || []);
  };

  const openModal = (contentType) => {
    setModalContent(contentType);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent("");
    setSelectedService("");
    setSelectedDate("");
    setSelectedTime("");
  };

  // Reservation handler
  const handleReservation = async () => {
    const newReservation = {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      status: "Pending Approval",
    };

    try {
      const response = await fetch("https://companion.up.railway.app/appointments.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReservation),
      });

      const data = await response.json();

      if (response.ok) {
        setReservedSlots([...reservedSlots, newReservation]);
        alert("Your reservation is confirmed. It is pending approval.");
      } else {
        console.error("Reservation failed:", data.error);
      }
    } catch (error) {
      console.error("Error making reservation:", error);
    }

    closeModal();
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

        <div className="instruction-container">
          <div className="instruction-desc">
            <ol className="instruction-list">
              <li>
                <strong>Piliin ang Serbisyong Kailangan:</strong>
                <p>Hanapin ang mga serbisyong pangkalusugan tulad ng health check-up, masahe, libreng gamot, dental check-up, o eye check-up. Pindutin ang serbisyong nais n'yo i-book.</p>
              </li>
              <li>
                <strong>Pumili ng Araw at Oras ng Appointment:</strong>
                <p>Pagkatapos piliin ang serbisyo, lilitaw ang kalendaryo o listahan ng mga available na oras. Pumili ng petsa at oras na pinakakomportable para sa inyo.</p>
              </li>
              <li>
                <strong>Kumpirmahin ang Appointment:</strong>
                <p>Kapag nakapili na ng araw at oras, pindutin ang "Kumpirmahin" o "Book Appointment". Lalabas ang detalye ng inyong appointment.</p>
              </li>
              <li>
                <strong>Tandaan ang Detalye:</strong>
                <p>Tingnan ang confirmation message. Tandaan ang petsa at oras.</p>
              </li>
              <li>
                <strong>Dumating sa Takdang Oras:</strong>
                <p>Siguraduhing dumating 10-15 minuto bago ang schedule.</p>
              </li>
            </ol>
          </div>
        </div>

        <div className="senior-paalala">
          <p className="senior-p">
            <strong>Paalala: </strong>Sa pamamagitan ng pag-book ng appointment, kayo ay bibigyan ng prayoridad sa clinic o health center.
          </p>
        </div>
      </div>

      {role === "client" && (
        <div className="button-container">
          <button className="secondary-button" onClick={() => openModal("reserveSlot")}>
            Reserve a Slot
          </button>
          <button className="secondary-button" onClick={() => openModal("editInfo")}>
            Edit Information
          </button>
          <button className="secondary-button" onClick={() => openModal("viewReservedSlot")}>
            View Reserved Slot
          </button>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Reservation Modal"
        className="modal"
      >
        <h2>
          {modalContent === "reserveSlot" && "Reserve a Slot"}
          {modalContent === "viewReservedSlot" && "Your Reserved Slots"}
          {modalContent === "editInfo" && "Edit Information"}
        </h2>

        {modalContent === "reserveSlot" && (
          <div>
            <label htmlFor="service">Choose a service:</label>
            <select id="service" value={selectedService} onChange={handleServiceChange} className="service-select">
              <option value="">Select a service</option>
              {services.map((service, idx) => (
                <option key={idx} value={service}>{service}</option>
              ))}
            </select>

            <label htmlFor="date">Choose a date:</label>
            <input type="date" id="date" value={selectedDate} onChange={handleDateChange} className="date-input" disabled={!selectedService} />

            <label htmlFor="time">Choose a time:</label>
            <select id="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="time-select" disabled={!selectedService || !selectedDate}>
              <option value="">Select a time</option>
              {availableTimes.map((time, idx) => (
                <option key={idx} value={time}>{time}</option>
              ))}
            </select>

            <button onClick={handleReservation} className="secondary-button" disabled={!selectedService || !selectedDate || !selectedTime}>
              Confirm Reservation
            </button>
          </div>
        )}

        {modalContent === "viewReservedSlot" && (
          <div>
            {reservedSlots.length > 0 ? (
              <ul>
                {reservedSlots.map((slot, index) => (
                  <li key={index}>
                    <p><strong>Service:</strong> {slot.service}</p>
                    <p><strong>Date:</strong> {slot.date}</p>
                    <p><strong>Time:</strong> {slot.time}</p>
                    <p><strong>Status:</strong> {slot.status || "Pending Approval"}</p>
                    <hr />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reserved slots found.</p>
            )}
          </div>
        )}

        {modalContent === "editInfo" && (
          <div>
            <p>Here you can edit your personal information.</p>
          </div>
        )}

        <button onClick={closeModal}>Close</button>
      </Modal>

      <BackToHome role={role} />
      <Footer role={role} />
    </div>
  );
};

export default SeniorCare;
