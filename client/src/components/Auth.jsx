import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css"; // Import CSS file

const Auth = () => {
  const [isDoctor, setIsDoctor] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    specialization: "",
    phoneNumber: "",
    address: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isDoctor
        ? "https://doc-appoint-server.onrender.com/api/doctors/login"
        : "https://doc-appoint-server.onrender.com/api/users/login";
      const { data: res } = await axios.post(url, loginData);
      navigate("/home");
      console.log(res.message);
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isDoctor
        ? "https://doc-appoint-server.onrender.com/api/doctors/signup"
        : "https://doc-appoint-server.onrender.com/api/users/signup";
      const payload = isDoctor
        ? signUpData
        : {
            firstName: signUpData.firstName,
            lastName: signUpData.lastName,
            email: signUpData.email,
            password: signUpData.password
          };
      const { data: res } = await axios.post(url, payload);
      navigate("/login");
      console.log(res.message);
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  const toggleForm = () => {
    document.getElementById("container").classList.toggle("active");
  };

  return (
    <div className="container" id="container">
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignUpSubmit}>
          <h1>Create Account</h1>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            onChange={handleSignUpChange}
            value={signUpData.firstName}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            onChange={handleSignUpChange}
            value={signUpData.lastName}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleSignUpChange}
            value={signUpData.email}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleSignUpChange}
            value={signUpData.password}
            required
          />
          {isDoctor && (
            <>
              <input
                type="text"
                placeholder="Specialization"
                name="specialization"
                onChange={handleSignUpChange}
                value={signUpData.specialization}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                name="phoneNumber"
                onChange={handleSignUpChange}
                value={signUpData.phoneNumber}
                required
              />
              <input
                type="text"
                placeholder="Address"
                name="address"
                onChange={handleSignUpChange}
                value={signUpData.address}
                required
              />
            </>
          )}
          <button type="submit">Sign Up</button>
          <p>
            Already have an account? <a onClick={toggleForm}>Sign In</a>
          </p>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form onSubmit={handleLoginSubmit}>
          <h1>Sign in</h1>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleLoginChange}
            value={loginData.email}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleLoginChange}
            value={loginData.password}
            required
          />
          <button type="submit">Sign In</button>
          <p>
            Don't have an account? <a onClick={toggleForm}>Sign Up</a>
          </p>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button id="login" onClick={toggleForm}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button id="register" onClick={toggleForm}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
