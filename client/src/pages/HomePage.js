// src/pages/HomePage.js

import React, { useState, useEffect, useRef } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const textRef = useRef(null);
  const underRef = useRef(null);
  const featuredRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { 
          setVisible(true);
          observer.unobserve(entry.target);
        }
      });
    });

    if (textRef.current) {
      observer.observe(textRef.current);
    }
    if (underRef.current) {
      observer.observe(underRef.current);
    }
    if (featuredRef.current) {
      observer.observe(featuredRef.current);
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
      if (underRef.current) {
        observer.unobserve(underRef.current);
      }
      if (featuredRef.current) {
        observer.unobserve(featuredRef.current);
      }
    };
  }, []);

  const features = [
    "Easy to use",
    "Shows patients in Line",
    "Appointment and Medication Summary",
    "Easy to use Dashboard for Doctors to handle their patients"
  ];

  return (
    <div className="homepage-container">
      <div className={`homepage-text ${visible ? 'fade-in' : ''}`} ref={textRef}>
        Find the best doctors<br />for your healthcare <br />needs.
      </div>
      <div className={`home-under ${visible ? 'fade-in' : ''}`} ref={underRef}>
        <p>Book appointments with top-rated doctors in your area. Get <br/>personalized care and convenient access to healthcare.</p>
      </div>
      <div className={`featured-doctors ${visible ? 'fade-in' : ''}`} ref={featuredRef}>
        <h1>Features</h1>
      </div>
      <div className="features-cards" style={{ display: 'flex', gap: '80px' }}>
        {features.map((feature, index) => (
          <div key={index} className={`feature-card ${visible ? 'fade-in' : ''}`} style={{ transitionDelay: `${index * 200}ms`, flex: '1' }}>
            <p>{feature}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
