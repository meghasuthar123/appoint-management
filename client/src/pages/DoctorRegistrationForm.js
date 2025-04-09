import React, { useState } from 'react';

const DoctorRegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    specialization: '',
    password: '',
    consultationFees: 0,
    availability: {
      days: [],
      timeslots: [],
    },
  });

  const handleAddDay = (day) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        days: [...formData.availability.days, day.trim()],
      },
    });
  };

  const handleRemoveDay = (day) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        days: formData.availability.days.filter(d => d !== day),
      },
    });
  };

  const handleAddTimeslot = (timeslot) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        timeslots: [...formData.availability.timeslots, timeslot.trim()],
      },
    });
  };

  const handleRemoveTimeslot = (timeslot) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        timeslots: formData.availability.timeslots.filter(t => t !== timeslot),
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'consultationFees' ? Number(value) : value, // Handle numeric input for consultationFees
    }));
  };

  return (
    <div className="doctor-registration-form">
      <h2>Doctor Registration</h2>
      <form onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNo">Phone Number:</label>
          <input type="text" id="phoneNo" name="phoneNo" value={formData.phoneNo} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="specialization">Specialization:</label>
          <input type="text" id="specialization" name="specialization" value={formData.specialization} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="consultationFees">Consultation Fees:</label>
          <input
            type="number"
            id="consultationFees"
            name="consultationFees"
            value={formData.consultationFees}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="availability">Availability (Days and Timeslots):</label>
          <div>
            <h4>Days:</h4>
            <ul>
              {formData.availability.days.map(day => (
                <li key={day}>
                  {day}
                  <button onClick={() => handleRemoveDay(day)}>Remove</button>
                </li>
              ))}
            </ul>
            <input
              type="text"
              placeholder="Add Day"
              onChange={(e) => handleAddDay(e.target.value)}
            />
          </div>
          <div>
            <h4>Timeslots:</h4>
            <ul>
              {formData.availability.timeslots.map(timeslot => (
                <li key={timeslot}>
                  {timeslot}
                  <button onClick={() => handleRemoveTimeslot(timeslot)}>Remove</button>
                </li>
              ))}
            </ul>
            <input
              type="text"
              placeholder="Add Timeslot"
              onChange={(e) => handleAddTimeslot(e.target.value)}
            />
          </div>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default DoctorRegistrationForm;

