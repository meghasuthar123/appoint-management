import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientsInLine, setPatientsInLine] = useState(null); // State for patients in line
  const [availability, setAvailability] = useState({
    days: [],
    timeslots: [],
    patientsInLine: 0
  });
  const [newAvailability, setNewAvailability] = useState({
    days: [],
    timeslots: "",
    patientsInLine: 0
  });
  const [doctorInfo, setDoctorInfo] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error('No token found in local storage');
        return;
      }

      try {
        const docid = localStorage.getItem("docid");
        if (!docid) {
          console.error('No docid found in local storage');
          return;
        }

        const response = await axios.get(`https://doc-appoint-server.onrender.com/api/appointments/bydoctor?docid=${docid}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const doctorResponse = await axios.get(`https://doc-appoint-server.onrender.com/api/doctors/${docid}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const patientsInLine = await axios.get(`https://doc-appoint-server.onrender.com/api/doctors/${docid}/patients`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setPatientsInLine(patientsInLine.data); // Set patients in line data
        setAppointments(response.data);
        setDoctorInfo(doctorResponse.data);
        setAvailability(doctorResponse.data.availability);
        setNewAvailability(prevState => ({ ...prevState, patientsInLine: doctorResponse.data.availability.patientsInLine }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments or doctor data:', error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setNewAvailability(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const docid = localStorage.getItem("docid");

    try {
      const updatedAvailability = {
        days: newAvailability.days.split(',').map(day => day.trim()),
        timeslots: newAvailability.timeslots.split(',').map(slot => slot.trim()),
        patientsInLine: parseInt(newAvailability.patientsInLine, 10)
      };

      await axios.put(`https://doc-appoint-server.onrender.com/api/doctors/${docid}/availability`, updatedAvailability, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAvailability(updatedAvailability);
      setNewAvailability({ days: "", timeslots: "", patientsInLine: 0 });

      alert('Availability updated successfully!');
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const doctor = doctorInfo;

  const displayDoctorInfo = (doctor) => (
    <div>
      <h3>Welcome, Dr. {doctor.firstName} {doctor.lastName}</h3>
      <p className='specialization'>{doctor.specialization}</p>
    </div>
  );

  const convertDate = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  // Filter out appointments with a past date
  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const currentDate = new Date();
    return appointmentDate >= currentDate;
  });

  return (
    <div className="dashboard-container">
      <h2>Doctor Dashboard</h2>
      {doctor && (
        <div>
          {displayDoctorInfo(doctor)}
          <div className="section">
            <h4>Appointments</h4>
            {upcomingAppointments.length === 0 ? (
              <p>No upcoming appointments available.</p>
            ) : (
              <ul>
                {upcomingAppointments.map((appointment, index) => (
                  <li key={appointment._id}>
                    <div className="appointment-item">
                      <div className="appointment-number">
                        <strong>{index + 1}.</strong>
                      </div>
                      <div className="appointment-details">
                        <div><strong>Patient Name:</strong> {appointment.firstName} {appointment.lastName}</div>
                        <div><strong>Date:</strong> {convertDate(appointment.date)}</div>
                        <div><strong>Phone Number:</strong> {appointment.phoneNo}</div>
                        <div><strong>Reason:</strong> {appointment.reason ? appointment.reason : 'Reason not provided'}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="section">
            <h4>Update Availability</h4>
            <form onSubmit={handleAvailabilitySubmit}>
              <label>
                Available Days (comma separated):
                <input
                  type="text"
                  name="days"
                  value={newAvailability.days}
                  onChange={handleAvailabilityChange}
                  required
                />
              </label>
              <br />
              <label>
                Available Timeslots (comma separated):
                <input
                  type="text"
                  name="timeslots"
                  value={newAvailability.timeslots}
                  onChange={handleAvailabilityChange}
                  required
                />
              </label>
              <br />
              <label>
                Number of Patients in Line:
                <input
                  type="number"
                  name="patientsInLine"
                  value={newAvailability.patientsInLine}
                  onChange={handleAvailabilityChange}
                  required
                />
              </label>
              <br />
              <button type="submit">Update Availability</button>
            </form>
            <div>
              <h5>Current Availability</h5>
              <p>Days: {availability.days.join(", ")}</p>
              <p>Timeslots: {availability.timeslots.join(", ")}</p>
              <p>Number of Patients in Line: {availability.patientsInLine}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
