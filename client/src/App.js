// src/App.js
import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from './pages/HomePage';
import AppointmentPage from './pages/AppointmentPage';
import ContactPage from './pages/ContactPage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorDetailPage from './pages/DoctorDetailPage'; // Import DoctorDetailPage
import Layout from './components/Layout';
import Signup from "./components/Singup";
import Login from "./components/Login";
import DoctorLogin from "./components/Login/DoctorLogin";
import DoctorDashboard from "./components/DoctorDashboard";
import DoctorDetails from "./components/Singup/DoctorDetails";
import PatientDashboard from './components/PatientDashboard';

function App() {
  const user = localStorage.getItem("token");

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/appointments" element={<AppointmentPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/signup" exact element={<Signup />} />
        <Route path="/doctor-details" element={<DoctorDetails />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/doctorlogin" exact element={<DoctorLogin />} />
        <Route path="/dashboard" element={user ? <DoctorDashboard /> : <Navigate to="/doctorlogin" replace />} />
        <Route path="/my_appointments" element={user ? <PatientDashboard /> : <Navigate to="/login" replace />} />
        <Route path="DoctorDetailPage/" element={<DoctorDetailPage />} /> 
        <Route path="/" element={<Navigate replace to="/login" />} />
      </Routes>
    </Layout>
  );
}

export default App;
