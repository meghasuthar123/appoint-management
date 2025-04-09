// src/components/Layout.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Layout.css';

function Layout({ children }) {
  const { isAuthenticated, role, logout } = useContext(AuthContext);
  console.log('role:', role);

  return (
    <div className="layout-container">
      <header className="layout-header">
        <div className="logo">
          <h1><Link to="/" style={{ color: 'black', textDecoration: 'none' }}>Doct-Appoint</Link></h1>
        </div>
        <nav className="layout-nav">
          <ul>
            <li><Link to="/" style={{ textDecoration: 'none' }}>Home</Link></li>
            <li><Link to="/doctors">Doctors</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            {role === 'patient' && <li><Link to="/my_appointments">My Appointments</Link></li>}
            <li><Link to="/appointments" className="appointment-button">Make an Appointment</Link></li>
            {isAuthenticated ? (
              <>
                {role === 'doctor' && <li><Link to="/dashboard">Dashboard</Link></li>}
                <li><Link to="/" onClick={logout}>Logout</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
}

export default Layout;
