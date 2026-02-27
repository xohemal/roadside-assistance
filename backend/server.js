require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (replace with database in production)
let serviceRequests = [];
let messages = [];
let feedbacks = [];
let serviceProviders = [
  { id: 'sp1', name: 'John\'s Towing', service: 'Towing', available: true, rating: 4.5 },
  { id: 'sp2', name: 'Quick Mechanic', service: 'Mechanical', available: true, rating: 4.8 },
  { id: 'sp3', name: 'Tire Expert', service: 'Tire Change', available: true, rating: 4.3 },
  { id: 'sp4', name: 'Battery Pro', service: 'Battery Jump', available: true, rating: 4.6 }
];

// Helper: AI call with retries and timeout
async function callAIWithRetries(prompt, parameters = {}, maxAttempts = 3, timeout = 10000) {
  if (!HUGGINGFACE_API_KEY) return null;
  const url = 'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct';
  const payload = { inputs: prompt, parameters };
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const resp = await axios.post(url, payload, {
        headers: { 'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
        timeout
      });
      if (resp.data && resp.data[0] && resp.data[0].generated_text) {
        return resp.data[0].generated_text.trim();
      }
      if (typeof resp.data === 'string' && resp.data.trim()) return resp.data.trim();
    } catch (err) {
      console.error(`AI call attempt ${attempt} failed:`, err.message);
      if (attempt < maxAttempts) await new Promise(r => setTimeout(r, 500 * attempt));
    }
  }
  return null;
}

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Roadside Assistance API is running!' });
});

// Create service request
app.post('/api/service-requests', (req, res) => {
  const { userId, location, serviceType, description } = req.body;
  
  if (!location || !serviceType) {
    return res.status(400).json({ error: 'Location and service type are required' });
  }

  // Find available provider
  const provider = serviceProviders.find(sp => 
    sp.service.toLowerCase().includes(serviceType.toLowerCase()) && sp.available
  ) || serviceProviders.find(sp => sp.available);

  const request = {
    id: uuidv4(),
    userId: userId || 'user-' + uuidv4(),
    location,
    serviceType,
    description,
    providerId: provider ? provider.id : null,
    providerName: provider ? provider.name : 'Searching...',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  serviceRequests.push(request);

  // Notify provider via socket
  if (provider) {
    io.emit('newServiceRequest', request);
  }

  res.status(201).json(request);
});

// Get all service requests
app.get('/api/service-requests', (req, res) => {
  res.json(serviceRequests);
});

// Get specific service request
app.get('/api/service-requests/:id', (req, res) => {
  const request = serviceRequests.find(r => r.id === req.params.id);
  if (!request) {
    return res.status(404).json({ error: 'Service request not found' });
  }
  res.json(request);
});

// Update service request status
app.patch('/api/service-requests/:id', (req, res) => {
  const { status } = req.body;
  const request = serviceRequests.find(r => r.id === req.params.id);
  
  if (!request) {
    return res.status(404).json({ error: 'Service request not found' });
  }

  request.status = status;
  request.updatedAt = new Date().toISOString();

  io.emit('requestUpdated', request);
  res.json(request);
});

// Get messages for a request
app.get('/api/messages/:requestId', (req, res) => {
  const requestMessages = messages.filter(m => m.requestId === req.params.requestId);
  res.json(requestMessages);
});

// Send a message
app.post('/api/messages', async (req, res) => {
  const { requestId, senderId, senderType, text, isAI } = req.body;

  if (!requestId || !text) {
    return res.status(400).json({ error: 'Request ID and message text are required' });
  }

  let messageText = text;

  // If this is an AI provider message, generate intelligent response
  if (isAI && senderType === 'provider' && HUGGINGFACE_API_KEY) {
    try {
      const request = serviceRequests.find(r => r.id === requestId);
      const systemPromptParts = [
        `You are a professional roadside assistance service provider. Be friendly, helpful, and professional. Provide updates about your arrival, ask concise clarifying questions, and reassure the customer.`,
      ];
      if (request) {
        systemPromptParts.push(`Service: ${request.serviceType}. Provider: ${request.providerName || 'Assigned technician'}. Location: ${request.location || 'unknown'}.`);
      }
      const systemPrompt = systemPromptParts.join(' ');

      const prompt = `${systemPrompt}\n\nCustomer: ${text}\nProvider:`;

      const aiResult = await callAIWithRetries(prompt, {
        max_new_tokens: 80,
        temperature: 0.6,
        top_p: 0.9
      }, 3, 10000);

      if (aiResult && aiResult.length) {
        messageText = aiResult.trim();
      } else {
        const fallbacks = [
          "I'm on my way! Should reach you in about 15-20 minutes. Can you describe the issue in more detail?",
          "Thanks for the info. I have all the tools needed. I'll be there shortly!",
          "Got it! I'm just 10 minutes away. Stay safe and I'll get you back on the road soon.",
          "No problem at all! I deal with this all the time. I'll have you sorted out quickly.",
          "Perfect, I can see your location. Traffic is light so I should be there very soon!"
        ];
        messageText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }
    } catch (error) {
      console.error('AI message error:', error.message);
      messageText = "Thanks for your message! I'm on my way to help you. I'll be there shortly!";
    }
  }

  const message = {
    id: uuidv4(),
    requestId,
    senderId: senderId || 'unknown',
    senderType: senderType || 'user',
    text: messageText,
    timestamp: new Date().toISOString()
  };

  messages.push(message);
  io.emit(`message-${requestId}`, message);

  res.status(201).json(message);
});

// Submit feedback
app.post('/api/feedback', (req, res) => {
  const { requestId, rating, comment } = req.body;

  if (!requestId || !rating) {
    return res.status(400).json({ error: 'Request ID and rating are required' });
  }

  const feedback = {
    id: uuidv4(),
    requestId,
    rating,
    comment,
    createdAt: new Date().toISOString()
  };

  feedbacks.push(feedback);

  // Update provider rating
  const request = serviceRequests.find(r => r.id === requestId);
  if (request && request.providerId) {
    const provider = serviceProviders.find(sp => sp.id === request.providerId);
    if (provider) {
      const providerFeedbacks = feedbacks.filter(f => {
        const req = serviceRequests.find(r => r.id === f.requestId);
        return req && req.providerId === provider.id;
      });
      const avgRating = providerFeedbacks.reduce((sum, f) => sum + f.rating, 0) / providerFeedbacks.length;
      provider.rating = Math.round(avgRating * 10) / 10;
    }
  }

  res.status(201).json(feedback);
});

// Get all feedbacks
app.get('/api/feedback', (req, res) => {
  res.json(feedbacks);
});

// Get service providers
app.get('/api/providers', (req, res) => {
  res.json(serviceProviders);
});

// Chatbot endpoint with AI integration
app.post('/api/chatbot', async (req, res) => {
  const { message, requestId, contextMessages } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Prepare conversation context
    const history = [];
    if (Array.isArray(contextMessages) && contextMessages.length) {
      contextMessages.slice(-8).forEach(m => {
        history.push(`${m.senderType === 'provider' ? 'Provider' : 'User'}: ${m.text}`);
      });
    } else if (requestId) {
      const reqMsgs = messages.filter(m => m.requestId === requestId).slice(-8);
      reqMsgs.forEach(m => history.push(`${m.senderType === 'provider' ? 'Provider' : 'User'}: ${m.text}`));
    }

    const request = requestId ? serviceRequests.find(r => r.id === requestId) : null;

    const systemPrompt = `You are a concise and helpful roadside assistance chatbot. Tasks:
- Understand user intent and provide clear options (ask questions, offer to request service, or provide self-help steps)
- If user asks to request service, explain next steps and ask for location and issue.
- If user appears to be in immediate danger, advise calling emergency services.
Keep responses short (<=100 words), friendly, and accurate. Include suggested quick actions as bullet points when appropriate.`;

    const contextText = history.length ? `${history.join('\n')}\n` : '';

    const prompt = `${systemPrompt}\n\n${request ? `Request details: Service=${request.serviceType}, Location=${request.location}\n` : ''}${contextText}User: ${message}\nAssistant:`;

    if (HUGGINGFACE_API_KEY) {
      const aiResult = await callAIWithRetries(prompt, {
        max_new_tokens: 200,
        temperature: 0.3,
        top_p: 0.95
      }, 3, 12000);

      if (aiResult && aiResult.trim()) {
        const text = aiResult.trim().replace(/^Assistant:\s*/i, '');
        return res.json({ response: text, usedAI: true });
      }
    }
  } catch (error) {
    console.error('AI API error:', error.message);
  }

  // Fallback rule-based with suggestions
  const lowerMessage = message.toLowerCase();
  let responseText = '';
  const suggestions = [];

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    responseText = 'Hello! I\'m here to help with roadside assistance. How can I assist you today?';
    suggestions.push('Request Service', 'Pricing', 'Track Provider');
  } else if (lowerMessage.includes('services') || lowerMessage.includes('offer')) {
    responseText = 'We offer towing, flat tire changes, battery jump-starts, fuel delivery, lockout assistance, and minor mechanical repairs.';
    suggestions.push('Request Service');
  } else if (lowerMessage.includes('how long') || lowerMessage.includes('wait time')) {
    responseText = 'Typical response time is 20–30 minutes depending on your location and traffic.';
  } else if (lowerMessage.includes('cost') || lowerMessage.includes('price')) {
    responseText = 'Pricing depends on the service; most jobs range from $50–$150. You\'ll get a quote before service starts.';
  } else if (lowerMessage.includes('cancel')) {
    responseText = 'To cancel a request, open the active request and tap "Cancel Request". You can also message the provider to advise cancellation.';
  } else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('911')) {
    responseText = 'If this is a life-threatening emergency, call 911 immediately. For urgent assistance, select "Request Service" now.';
    suggestions.push('Call 911', 'Request Service');
  } else {
    responseText = 'I\'m here to help! You can ask about services, pricing, expected wait times, or click "Request Service" to get immediate assistance.';
    suggestions.push('Request Service', 'Contact Support');
  }

  return res.json({ response: responseText, usedAI: false, suggestions });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinRequest', (requestId) => {
    socket.join(`request-${requestId}`);
    console.log(`Client ${socket.id} joined request ${requestId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚗 Roadside Assistance API running on port ${PORT}`);
});

module.exports = { app, server };
