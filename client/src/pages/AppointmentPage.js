import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/appointment.css";

const AppointmentPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    reason: "",
    date: "",
    timeSlot: "",
    paymentType: "cash",
    doctorEmail: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get("https://doc-appoint-server.onrender.com/api/doctors");
        setDoctors(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = ({ currentTarget: input }) => {
    const newValue = input.value;

    if (input.name === "doctorEmail") {
      const doctor = doctors.find(doc => doc._id === newValue);
      setSelectedDoctor(doctor);
      setAvailableDates(getAvailableDates(doctor));
      setAvailableTimeSlots([]);
      setAppointmentData(prevData => ({
        ...prevData,
        doctorEmail: newValue,
        date: "",
        timeSlot: ""
      }));
    } else if (input.name === "date") {
      setAvailableTimeSlots(getAvailableTimeSlots(newValue));
      setAppointmentData(prevData => ({
        ...prevData,
        date: newValue,
        timeSlot: ""
      }));
    } else {
      setAppointmentData({ ...appointmentData, [input.name]: newValue });
    }
    console.log(appointmentData);

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // // add the user_id to the appointment data
    const user_id = localStorage.getItem("user_id");
    setAppointmentData({ ...appointmentData, userId: user_id });
    console.log(appointmentData);
    try {
      const url = "https://doc-appoint-server.onrender.com/api/appointments";
      const { data: res } = await axios.post(url, appointmentData);
      setSuccess("Appointment booked successfully!");
      console.log(res.message);
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  const getAvailableDates = (doctor) => {
    if (!doctor) return [];
    const today = new Date();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const availableDates = [];

    for (let i = 0; i < 30; i++) { // Check the next 30 days
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dayName = daysOfWeek[date.getDay()];

      if (doctor.availability.days.includes(dayName)) {
        availableDates.push(date.toISOString().split('T')[0]);
      }
    }

    return availableDates;
  };

  const getAvailableTimeSlots = (selectedDate) => {
    if (!selectedDoctor) return [];
    const selectedDay = new Date(selectedDate).getDay();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysOfWeek[selectedDay];

    if (selectedDoctor.availability.days.includes(dayName)) {
      return selectedDoctor.availability.timeslots;
    }
    return [];
  };

  return (
    <div className="appointment-container">
      <div className="appointment-form-container">
        <form className="form-container" onSubmit={handleSubmit}>
          <h1>Book an Appointment</h1>
          <div className="input-group">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              onChange={handleChange}
              value={appointmentData.firstName}
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              onChange={handleChange}
              value={appointmentData.lastName}
              required
              className={styles.input}
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={appointmentData.email}
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Phone Number"
              name="phoneNo"
              onChange={handleChange}
              value={appointmentData.phoneNo}
              required
              className={styles.input}
            />
          </div>
          <div className="input-group">
            <textarea
              placeholder="Reason for Visit"
              name="reason"
              onChange={handleChange}
              value={appointmentData.reason}
              required
              className={styles.textarea}
            />
            <select
              name="paymentType"
              onChange={handleChange}
              value={appointmentData.paymentType}
              required
              className={styles.select}
            >
              <option value="cash">Cash</option>
            </select>
          </div>
          <div className="input-group">
            <select
              name="doctorEmail"
              onChange={handleChange}
              value={appointmentData.doctorEmail}
              required
              className={styles.select}
            >
              <option value="" disabled>
                Select a Doctor
              </option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>
          {selectedDoctor && (
            <div className="input-group">
              <select
                name="date"
                onChange={handleChange}
                value={appointmentData.date}
                required
                className={styles.select}
              >
                <option value="" disabled>
                  Select a Date
                </option>
                {availableDates.map(date => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>
          )}
          {appointmentData.date && (
            <div className="input-group">
              <select
                name="timeSlot"
                onChange={handleChange}
                value={appointmentData.timeSlot}
                required
                className={styles.select}
              >
                <option value="" disabled>
                  Select a Time Slot
                </option>
                {availableTimeSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          )}
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}
          <button type="submit" className="green-btn">
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentPage;