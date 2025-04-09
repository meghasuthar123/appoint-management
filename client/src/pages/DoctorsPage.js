// src/pages/DoctorsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DoctorsPage.css';

function DoctorsPage() {
  const [doctorsData, setDoctorsData] = useState([]);
  const [dateRange, setDateRange] = useState('');
  const [specialist, setSpecialist] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('https://doc-appoint-server.onrender.com/api/doctors');
        setDoctorsData(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  const handleSpecialistChange = (event) => {
    setSpecialist(event.target.value);
  };

  const handleAppointmentClick = (doctor) => {
    navigate('/appointments', { state: { doctor } });
  };

  const handleDoctorClick = (doctorId) => {
    localStorage.setItem('doctorId', doctorId);
    navigate('/DoctorDetailPage/');
    console.log('Doctor clicked:', doctorId);
  };
  

  return (
    <div className="main-div">
    <div className="doctors-page-container">
      <aside className="doctors-filter-section">
        <h2 className="doctors-filter-title">Filter</h2>
        <label className="doctors-filter-label">
          Date Range:
          <input
            type="date"
            value={dateRange}
            onChange={handleDateRangeChange}
            className="doctors-filter-input"
          />
        </label>
        <label className="doctors-filter-label">
          Specialist:
          <select
            value={specialist}
            onChange={handleSpecialistChange}
            className="doctors-filter-select"
          >
            <option value="">All</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="General Physician">General Physician</option>
            <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
            <option value="Psychiatrist">Psychiatrist</option>
          </select>
        </label>
      </aside>
      <main className="doctors-list-section">
        {doctorsData
          .filter((doctor) =>
            specialist ? doctor.specialization === specialist : true
          )
          .map((doctor) => (
            <div key={doctor._id} className="doctor-card-container"onClick={() => handleDoctorClick(doctor._id)}>
              <img src={doctor.photo || 'https://via.placeholder.com/100'} alt={doctor.name} className="doctor-photo-img" />
              <div className="doctor-info-section">
                <h3 className="doctor-info-title">{doctor.firstName} {doctor.lastName}</h3>
                <p>{doctor.specialization}</p>
              </div>
              <div className="doctor-details-section">
                <p className="doctor-details-text">Location: {doctor.address}</p>
                <p className="doctor-details-text">Phone: {doctor.phoneNumber}</p>
                <button className="appointment-button" onClick={() => handleAppointmentClick(doctor)}>Make an Appointment</button>
              </div>
            </div>
          ))}
      </main>
    </div>
    </div>
  );
}

export default DoctorsPage;
