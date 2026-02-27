import React, { useState, useEffect } from 'react';
import { getServiceProviders } from '../services/api';
import './ServiceProviderDashboard.css';

export default function ServiceProviderDashboard() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await getServiceProviders();
      setProviders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading providers:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading providers...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>👨‍🔧 Service Provider Dashboard</h1>
        <p>Manage and view all service providers</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{providers.length}</h3>
            <p>Total Providers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{providers.filter(p => p.available).length}</h3>
            <p>Available Now</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>
              {(providers.reduce((sum, p) => sum + p.rating, 0) / providers.length).toFixed(1)}
            </h3>
            <p>Average Rating</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-info">
            <h3>100%</h3>
            <p>Success Rate</p>
          </div>
        </div>
      </div>

      <div className="providers-section">
        <h2>All Service Providers</h2>
        <div className="providers-grid">
          {providers.map((provider) => (
            <div key={provider.id} className="provider-card">
              <div className="provider-header">
                <div className="provider-avatar">👨‍🔧</div>
                <div className="provider-info">
                  <h3>{provider.name}</h3>
                  <p className="provider-service">{provider.service}</p>
                </div>
                <div className={`availability-badge ${provider.available ? 'available' : 'unavailable'}`}>
                  {provider.available ? '🟢 Available' : '🔴 Busy'}
                </div>
              </div>

              <div className="provider-stats">
                <div className="provider-rating">
                  <span className="rating-stars">
                    {'⭐'.repeat(Math.floor(provider.rating))}
                  </span>
                  <span className="rating-value">{provider.rating.toFixed(1)}</span>
                </div>
                
                <div className="provider-details">
                  <div className="detail-item">
                    <span className="detail-label">Service Type:</span>
                    <span className="detail-value">{provider.service}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">
                      {provider.available ? 'Ready to serve' : 'Currently serving'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="provider-actions">
                <button className="btn btn-secondary btn-small">
                  View Profile
                </button>
                <button className="btn btn-primary btn-small">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h2>📋 Provider Information</h2>
        <div className="info-cards">
          <div className="info-card">
            <h3>🎯 How to Join</h3>
            <p>
              Interested in becoming a service provider? Contact us to learn about
              registration requirements and start serving customers in your area.
            </p>
          </div>
          <div className="info-card">
            <h3>💼 Benefits</h3>
            <p>
              Flexible hours, competitive earnings, and be your own boss. Help people
              when they need it most and build a successful service business.
            </p>
          </div>
          <div className="info-card">
            <h3>📱 Tools & Support</h3>
            <p>
              Access our provider app with real-time requests, GPS navigation, and
              24/7 support to help you deliver excellent service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
