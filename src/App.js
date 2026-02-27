import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import RequestServiceScreen from './screens/RequestServiceScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import MessagingScreen from './screens/MessagingScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import ServiceProviderDashboard from './screens/ServiceProviderDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/request-service" element={<RequestServiceScreen />} />
          <Route path="/chatbot" element={<ChatbotScreen />} />
          <Route path="/messaging/:requestId" element={<MessagingScreen />} />
          <Route path="/feedback/:requestId" element={<FeedbackScreen />} />
          <Route path="/provider-dashboard" element={<ServiceProviderDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
