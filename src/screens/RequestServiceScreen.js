import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { createServiceRequest } from '../services/api';
import 'leaflet/dist/leaflet.css';
import './RequestServiceScreen.css';

// Fix for default marker icon in React-Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function RequestServiceScreen() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Fetching your location...');
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setAddress('Detecting your location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log('Detected location:', coords);
          setLocation(coords);
          reverseGeocode(coords);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enable location services.');
          // Set default location (example: Bangalore, India)
          const defaultCoords = { lat: 12.9716, lng: 77.5946 };
          setLocation(defaultCoords);
          setAddress('Location unavailable - using default location');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const reverseGeocode = async (coords) => {
    setAddress('Fetching address...');
    try {
      // Using OpenStreetMap Nominatim for reverse geocoding (free, no API key needed)
      const timestamp = Date.now(); // Cache buster
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=18&addressdetails=1&timestamp=${timestamp}`,
        {
          headers: {
            'User-Agent': 'RoadsideAssistanceApp/1.0',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      console.log('Geocoding result:', data);
      console.log('Address components:', data.address);
      
      if (data && data.display_name) {
        setAddress(data.display_name);
        console.log('Using display_name:', data.display_name);
      } else if (data && data.address) {
        // Build address from components
        const parts = [
          data.address.road,
          data.address.suburb || data.address.neighbourhood,
          data.address.city || data.address.town,
          data.address.state,
          data.address.postcode,
          data.address.country
        ].filter(Boolean);
        const builtAddress = parts.join(', ');
        setAddress(builtAddress);
        console.log('Built address:', builtAddress);
      } else {
        const fallbackAddress = `Location: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
        setAddress(fallbackAddress);
        console.log('Using fallback:', fallbackAddress);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setAddress(`Location: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
    }
  };

  const handleServiceRequest = async () => {
    setError('');
    setSuccess('');

    if (!serviceType) {
      setError('Please select a service type.');
      return;
    }

    if (!location) {
      setError('Please wait for location to be fetched.');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        location: {
          latitude: location.lat,
          longitude: location.lng,
          address: address,
        },
        serviceType,
        description,
      };

      const response = await createServiceRequest(requestData);
      
      setLoading(false);
      setSuccess(`Request submitted! Provider: ${response.providerName}`);
      
      setTimeout(() => {
        if (window.confirm(`Your request has been sent to ${response.providerName}. Would you like to chat with them?`)) {
          navigate(`/messaging/${response.id}`, { state: { providerName: response.providerName } });
        }
      }, 1000);
    } catch (error) {
      setLoading(false);
      setError('Failed to submit request. Please try again.');
      console.error('Request error:', error);
    }
  };

  const services = [
    { id: 'towing', name: 'Towing', icon: '🚚' },
    { id: 'mechanical', name: 'Mechanical', icon: '🔧' },
    { id: 'tire', name: 'Tire Change', icon: '🛞' },
    { id: 'battery', name: 'Battery Jump', icon: '🔋' },
    { id: 'fuel', name: 'Fuel Delivery', icon: '⛽' },
    { id: 'lockout', name: 'Lockout', icon: '🔑' },
  ];

  return (
    <div className="request-service-container">
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="map-container">
        {location ? (
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={15}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[location.lat, location.lng]}>
              <Popup>
                Your Location<br />
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="map-loading">
            <div className="loading">📍 Detecting your location...</div>
          </div>
        )}
      </div>

      <div className="content">
        <div className="card location-info">
          <h3 className="label">📍 Your Location</h3>
          <p className="address">{address}</p>
          {location && (
            <p className="coordinates">
              Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
            </p>
          )}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={getCurrentLocation} className="refresh-button">
              🔄 Refresh Location
            </button>
            <button 
              onClick={() => {
                const newAddress = prompt('Enter your address or location:');
                if (newAddress) {
                  setAddress(newAddress);
                }
              }} 
              className="refresh-button"
            >
              ✏️ Edit Address
            </button>
          </div>
        </div>

        <div className="section">
          <h3 className="label">Select Service Type *</h3>
          <div className="service-grid">
            {services.map((service) => (
              <button
                key={service.id}
                className={`service-button ${serviceType === service.id ? 'active' : ''}`}
                onClick={() => setServiceType(service.id)}
              >
                <div className="service-icon">{service.icon}</div>
                <div className="service-name">{service.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <h3 className="label">Additional Details (Optional)</h3>
          <textarea
            className="text-input"
            placeholder="Describe your issue..."
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary submit-button"
          onClick={handleServiceRequest}
          disabled={loading}
        >
          {loading ? 'Submitting...' : '🆘 Request Service'}
        </button>
      </div>
    </div>
  );
}


