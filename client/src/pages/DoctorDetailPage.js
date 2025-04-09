import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './DoctorDetailPage.css';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patientsInLine, setPatientsInLine] = useState(null); // State for patients in line

  useEffect(() => {
    const fetchDoctorAndAppointments = async () => {
      try {
        const doctorId = localStorage.getItem("doctorId");
        console.log('Doctor ID:', doctorId);

        const doctorResponse = await axios.get(`https://doc-appoint-server.onrender.com/api/doctors/${doctorId}`);
        setDoctor(doctorResponse.data);


        const patientsInLine = await axios.get(`https://doc-appoint-server.onrender.com/api/doctors/${doctorId}/patients`);
        console.log('Patients in line:', patientsInLine.data.patientsInLine);
        setPatientsInLine(patientsInLine.data.patientsInLine); // Set patients in line data

        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctor details or appointments:', error);
        setLoading(false);
      }
    };

    fetchDoctorAndAppointments();
  }, [id]);

  const displayPatientsInLine = () => {
    if (!patientsInLine) {
      return <p>Loading patients in line...</p>;
    }

    if (patientsInLine === 0) {
      return <p>No patients in line.</p>;
    }

    console.log('Patients in line:', patientsInLine);
    return (
      <ul>
        {patientsInLine}
      </ul>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!doctor) {
    return <div>No doctor found</div>;
  }

  return (
    <div className="doctor-detail-container">
      <h2>Dr. {doctor.firstName} {doctor.lastName}</h2>
      <p className='specialization'>{doctor.specialization}</p>
      <p>Consultation Fees: Rs{doctor.consultationFees}</p>
      <p>Availability: {doctor.availability.days.join(", ")} - {doctor.availability.timeslots.join(", ")}</p>

      <div className="appointments-section">
        <h3>Patients in Line</h3>
        {displayPatientsInLine()}
      </div>
    </div>
  );
};

export default DoctorDetailPage;
