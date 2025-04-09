// src/components/DoctorDetails.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const DoctorDetails = () => {
  const [doctorData, setDoctorData] = useState({
    consultationFees: 0,
    availability: {
      days: [],
      timeslots: [],
    },
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    const { name, value } = input;
    const parts = name.split(".");

    if (parts.length === 1) {
      setDoctorData({ ...doctorData, [name]: value });
    } else if (parts.length === 2 && parts[0] === "availability") {
      setDoctorData((prevData) => ({
        ...prevData,
        availability: {
          ...prevData.availability,
          [parts[1]]: value.split(",").map((item) => item.trim()),
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "https://doc-appoint-server.onrender.com/api/doctors/details";
      const { data: res } = await axios.post(url, doctorData);
      navigate("/login");
      console.log(res.message);
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Doctor Additional Details</h1>
            <label htmlFor="consultationFees">Consultation Fees:</label>
            <input
              type="number"
              id="consultationFees"
              name="consultationFees"
              value={doctorData.consultationFees}
              onChange={handleChange}
              required
              className={styles.input}
            />
            <h2>Availability:</h2>
            <label htmlFor="availabilityDays">Days (comma separated):</label>
            <input
              type="text"
              id="availabilityDays"
              name="availability.days"
              value={doctorData.availability.days.join(", ")}
              onChange={handleChange}
              placeholder="e.g., Monday, Wednesday, Friday"
              required
              className={styles.input}
            />
            <label htmlFor="availabilityTimeslots">Timeslots (comma separated):</label>
            <input
              type="text"
              id="availabilityTimeslots"
              name="availability.timeslots"
              value={doctorData.availability.timeslots.join(", ")}
              onChange={handleChange}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
