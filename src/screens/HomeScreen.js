import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeScreen.css';

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="home-title">🚗 Roadside Assist</h1>
        <p className="home-subtitle">Help is just a click away</p>
      </div>

      <div className="home-actions">
        <button
          className="action-card primary-action"
          onClick={() => navigate('/request-service')}
        >
          <div className="action-icon">🆘</div>
          <h3 className="action-title">Request Service</h3>
          <p className="action-subtitle">Get help now</p>
        </button>

        <button
          className="action-card secondary-action"
          onClick={() => navigate('/chatbot')}
        >
          <div className="action-icon">💬</div>
          <h3 className="action-title">AI Assistant</h3>
          <p className="action-subtitle">24/7 support</p>
        </button>
      </div>

      <div className="services-section">
        <h2 className="section-title">Our Services</h2>
        
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🚚</div>
            <div className="service-info">
              <h3 className="service-name">Towing Service</h3>
              <p className="service-desc">Professional towing to your destination</p>
            </div>
          </div>

          <div className="service-card">
            <div className="service-icon">🔧</div>
            <div className="service-info">
              <h3 className="service-name">Mechanical Repairs</h3>
              <p className="service-desc">Quick fixes on the spot</p>
            </div>
          </div>

          <div className="service-card">
            <div className="service-icon">🛞</div>
            <div className="service-info">
              <h3 className="service-name">Tire Change</h3>
              <p className="service-desc">Flat tire? We've got you covered</p>
            </div>
          </div>

          <div className="service-card">
            <div className="service-icon">🔋</div>
            <div className="service-info">
              <h3 className="service-name">Battery Jump</h3>
              <p className="service-desc">Dead battery jump-start service</p>
            </div>
          </div>

          <div className="service-card">
            <div className="service-icon">⛽</div>
            <div className="service-info">
              <h3 className="service-name">Fuel Delivery</h3>
              <p className="service-desc">Ran out of gas? We'll bring it to you</p>
            </div>
          </div>

          <div className="service-card">
            <div className="service-icon">🔑</div>
            <div className="service-info">
              <h3 className="service-name">Lockout Assistance</h3>
              <p className="service-desc">Locked out? We can help</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Need help right now?</h2>
        <button 
          className="btn btn-primary btn-large"
          onClick={() => navigate('/request-service')}
        >
          Request Service Now →
        </button>
      </div>
    </div>
  );
}
