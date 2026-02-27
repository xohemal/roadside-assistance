import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🚗</span>
          <span className="logo-text">Roadside Assist</span>
        </Link>
        
        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/request-service" 
            className={`nav-link ${location.pathname === '/request-service' ? 'active' : ''}`}
          >
            Request Service
          </Link>
          <Link 
            to="/chatbot" 
            className={`nav-link ${location.pathname === '/chatbot' ? 'active' : ''}`}
          >
            AI Assistant
          </Link>
          <Link 
            to="/provider-dashboard" 
            className={`nav-link ${location.pathname === '/provider-dashboard' ? 'active' : ''}`}
          >
            Provider Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
