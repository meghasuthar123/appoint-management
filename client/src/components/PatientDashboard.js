import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PatientDashboard.css'; // Ensure you have a CSS file to import

const PatientDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      const patientid = localStorage.getItem("user_id");
      console.log(patientid);

      if (!patientid) {
        console.error('No patientId found in local storage');
        return;
      }

      try {
        const response = await axios.get(`https://doc-appoint-server.onrender.com/api/appointments/byuser?userid=${patientid}`);
        setPrescriptions(response.data);
        console.log(response.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="patient-dashboard-container">
      <h2>My Appointments</h2>
      {prescriptions.length === 0 ? (
        <p>No appointments available.</p>
      ) : (
        <ul>
          {prescriptions.map((appointment, index) => (
            <li key={appointment._id} className="appointment-item">
              <div className="appointment-number">
                <strong>{index + 1}.</strong>
              </div>
              <div className="appointment-details">
                <div><strong>Patient Name:</strong> {appointment.firstName} {appointment.lastName}</div>
                <div><strong>Date:</strong> {appointment.date}</div>
                <div><strong>Phone Number:</strong> {appointment.phoneNo}</div>
                <div><strong>Reason:</strong> {appointment.reason ? appointment.reason : 'Reason not provided'}</div>
                {appointment.doctor && (
                  <>
                  <div>
                    <strong>Doctor:</strong> {appointment.doctor.firstName} {appointment.doctor.lastName} ({appointment.doctor.specialization})
                  </div>
                  {/* show address , phone number */}
                  <div>
                    <strong>Address:</strong> {appointment.doctor.address}
                  </div>
                  <div>
                    <strong>Phone Number:</strong> {appointment.doctor.phoneNumber}
                  </div>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientDashboard;
