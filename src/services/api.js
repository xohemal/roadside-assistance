import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// You can change this to your deployed backend URL
// const API_BASE_URL = 'https://your-backend-url.com/api';

export const createServiceRequest = async (requestData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/service-requests`, requestData);
    return response.data;
  } catch (error) {
    console.error('Error creating service request:', error);
    throw error;
  }
};

export const getServiceRequest = async (requestId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/service-requests/${requestId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service request:', error);
    throw error;
  }
};

export const updateServiceRequestStatus = async (requestId, status) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/service-requests/${requestId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating service request:', error);
    throw error;
  }
};

export const getMessages = async (requestId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/messages/${requestId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (messageData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/messages`, messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/feedback`, feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

export const getChatbotResponse = async (message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chatbot`, { message });
    return response.data.response;
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    throw error;
  }
};

export const getServiceProviders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/providers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service providers:', error);
    throw error;
  }
};
