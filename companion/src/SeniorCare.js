import React, { useState } from "react";
import Modal from "react-modal";
import "./SeniorCare.css";

const SeniorCare = () => {
  // State to control the modal visibility and modal content
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // State to control the user inputs and reservation data
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [reservedSlots, setReservedSlots] = useState([]); // Store multiple reserved slots

  // Mock data for services and available times
  const services = [
    "Health Check-up",
    "Free Medicine",
    "Massage",
    "Dental Check-up",
    "Eye Check-up",
  ];
  const times = {
    "Health Check-up": ["9:00 AM", "1:00 PM", "3:00 PM"],
    "Free Medicine": ["10:00 AM", "2:00 PM", "4:00 PM"],
    Massage: ["11:00 AM", "2:30 PM", "5:00 PM"],
    "Dental Check-up": ["9:30 AM", "12:00 PM", "3:30 PM"],
    "Eye Check-up": ["10:30 AM", "1:30 PM", "4:30 PM"],
  };

  // Function to handle service change
  const handleServiceChange = (e) => {
    const service = e.target.value;
    setSelectedService(service);
    setAvailableTimes(times[service] || []); // Update available times based on selected service
  };

  // Function to open modal and set content
  const openModal = (contentType) => {
    setModalContent(contentType);
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent("");
    setSelectedService("");
    setSelectedDate("");
    setSelectedTime("");
  };

  // Handle reservation confirmation
  const handleReservation = () => {
    // Add the new reservation to the list of reserved slots
    setReservedSlots([
      ...reservedSlots,
      {
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
      },
    ]);
    closeModal();
  };

  return (
    <div className="senior-care-container">
      <h2 className="section-title">Mga Hakbang sa Pag-book ng Appointment</h2>
      <ol className="instruction-list">
        <li>
          <strong>Piliin ang Serbisyong Kailangan:</strong>
          <p>
            Hanapin ang mga serbisyong pangkalusugan tulad ng health check-up,
            masahe, libreng gamot, dental check-up, o eye check-up.
            <br />- Pindutin ang serbisyong nais n'yo i-book.
          </p>
        </li>
        <li>
          <strong>Pumili ng Araw at Oras ng Appointment:</strong>
          <p>
            Pagkatapos piliin ang serbisyo, lilitaw ang kalendaryo o listahan ng
            mga available na oras. <br />- Pumili ng petsa at oras na
            pinakakomportable para sa inyo.
          </p>
        </li>
        <li>
          <strong>Kumpirmahin ang Appointment:</strong>
          <p>
            Kapag nakapili na ng araw at oras, pindutin ang "Kumpirmahin" o
            "Book Appointment" na button. <br />- Lalabas ang detalye ng inyong
            appointment, kasama ang petsa, oras, at lokasyon ng serbisyong
            napili.
          </p>
        </li>
        <li>
          <strong>Tandaan ang Detalye ng Appointment:</strong>
          <p>
            - Tingnan ang confirmation message o text na ipadadala ng app.
            Tandaan ang petsa at oras ng inyong appointment.
          </p>
        </li>
        <li>
          <strong>Dumating sa Takdang Oras ng Appointment:</strong>
          <p>
            - Siguraduhing dumating sa tamang oras o 10-15 minuto bago ang
            schedule upang maayos ang proseso ng inyong pagbisita.
          </p>
        </li>
      </ol>
      <p className="note">
        <strong>Paalala:</strong>
        Sa pamamagitan ng pag-book ng appointment sa app, kayo ay bibigyan ng
        prayoridad sa clinic o health center. Hindi na kailangang maghintay ng
        matagal dahil nakatakda na ang inyong oras.
      </p>

      <div className="button-container">
        <button
          className="secondary-button"
          onClick={() => openModal("reserveSlot")}
        >
          Reserve a Slot
        </button>
        <button
          className="secondary-button"
          onClick={() => openModal("editInfo")}
        >
          Edit Information
        </button>
        <button
          className="secondary-button"
          onClick={() => openModal("viewReservedSlot")}
        >
          View Reserved Slot
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Reserve Slot Modal"
        className="modal"
      >
        <h2>{modalContent === "reserveSlot" && "Reserve a Slot"}</h2>

        {/* Content for Reserve Slot */}
        {modalContent === "reserveSlot" && (
          <div>
            <div>
              <label htmlFor="service">Choose a service:</label>
              <select
                id="service"
                value={selectedService}
                onChange={handleServiceChange}
                className="service-select"
              >
                <option value="">Select a service</option>
                {services.map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date">Choose a date:</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
            </div>

            <div>
              <label htmlFor="time">Choose a time:</label>
              <select
                id="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="time-select"
                disabled={!selectedService || !selectedDate}
              >
                <option value="">Select a time</option>
                {availableTimes.length > 0 &&
                  availableTimes.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
              </select>
            </div>

            <button
              onClick={handleReservation}
              className="secondary-button"
              disabled={!selectedService || !selectedDate || !selectedTime}
            >
              Confirm Reservation
            </button>
          </div>
        )}

        {/* Content for View Reserved Slot */}
        {modalContent === "viewReservedSlot" && (
          <div>
            <h3>Your Reserved Slots</h3>
            {reservedSlots.length > 0 ? (
              <ul>
                {reservedSlots.map((slot, index) => (
                  <li key={index}>
                    <p>
                      <strong>Service:</strong> {slot.service}
                    </p>
                    <p>
                      <strong>Date:</strong> {slot.date}
                    </p>
                    <p>
                      <strong>Time:</strong> {slot.time}
                    </p>
                    <hr />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reserved slots found.</p>
            )}
          </div>
        )}

        {/* Other modal content */}
        {modalContent === "editInfo" && (
          <div>
            <p>Here you can edit your personal information.</p>
          </div>
        )}

        <button onClick={closeModal}>Close</button>
      </Modal>

      <a href="/" className="back-link">
        Back to Home
      </a>
    </div>
  );
};

export default SeniorCare;
