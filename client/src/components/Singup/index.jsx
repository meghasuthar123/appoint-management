import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const SignUp = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [doctorData, setDoctorData] = useState({
    specialization: "",
    phoneNumber: "",
    address: "",
    consultationFees: 0,
    availability: {
      days: [],
      timeslots: [],
    },
  });
  const [error, setError] = useState("");
  const [isDoctor, setIsDoctor] = useState(false); // Add state to toggle doctor sign-up
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    const { name, value } = input;
    if (isDoctor && (input.name === "specialization" || input.name === "phoneNumber" || input.name === "address" || input.name === "consultationFees")) {
      setDoctorData({ ...doctorData, [name]: value });
    } else if (isDoctor && name.startsWith("availability")) {
      const parts = name.split(".");
      setDoctorData((prevData) => ({
        ...prevData,
        availability: {
          ...prevData.availability,
          [parts[1]]: value.split(",").map((item) => item.trim()),
        },
      }));
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isDoctor
        ? "https://doc-appoint-server.onrender.com/api/doctors/signup"
        : "https://doc-appoint-server.onrender.com/api/users/signup";
      const payload = isDoctor ? { ...data, ...doctorData } : data;
      const { data: res } = await axios.post(url, payload);
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
        <div className={styles.left}>
          <h1>Welcome Back</h1>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              Sign in
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              onChange={handleChange}
              value={data.firstName}
              required
              className={styles.input}
              pattern="^[A-Za-z]+$"
              title="First name should contain only letters."
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              onChange={handleChange}
              value={data.lastName}
              required
              className={styles.input}
              pattern="^[A-Za-z]+$"
              title="Last name should contain only letters."
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              title="Please enter a valid email address."
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            {isDoctor && (
              <>
                <input
                  type="text"
                  placeholder="Specialization"
                  name="specialization"
                  onChange={handleChange}
                  value={doctorData.specialization}
                  required
                  className={styles.input}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  onChange={handleChange}
                  value={doctorData.phoneNumber}
                  required
                  className={styles.input}
                  pattern="^\d{10}$"
                  title="Phone number should be 10 digits."
                />
                <input
                  type="text"
                  placeholder="Address"
                  name="address"
                  onChange={handleChange}
                  value={doctorData.address}
                  required
                  className={styles.input}
                />
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
              </>
            )}
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Sign Up
            </button>
          </form>
          <button
            type="button"
            className={styles.toggle_btn}
            onClick={() => setIsDoctor(!isDoctor)}
          >
            {isDoctor ? "Sign up as a User" : "Sign up as a Doctor"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;