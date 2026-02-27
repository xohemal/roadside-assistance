# 🚗 Roadside Assistance Web Application

A comprehensive MVP web application for roadside assistance services with real-time GPS tracking, AI chatbot support, in-app messaging, and service rating features.

## ✨ Features

### Core Features
- **🆘 Instant Service Requests** - Users can request roadside help with just a few clicks
- **📍 GPS Location Sharing** - Real-time location tracking using Google Maps API
- **🤖 AI Chatbot** - 24/7 automated assistant to answer common questions
- **💬 In-App Messaging** - Direct communication between users and service providers
- **⭐ Rating & Feedback** - Users can rate and review service quality
- **👨‍🔧 Provider Dashboard** - View and manage all service providers

### Services Offered
- Towing Service
- Mechanical Repairs
- Tire Changes
- Battery Jump-starts
- Fuel Delivery
- Lockout Assistance

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router DOM** - Navigation and routing
- **Google Maps JavaScript API** - Location and mapping services
- **Axios** - HTTP client for API requests
- **CSS3** - Custom styling with responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing
- **Body Parser** - Request body parsing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Google Maps API Key** (for location services)

## 🚀 Installation & Setup

### 1. Clone or Navigate to the Project Directory

```powershell
cd c:\Users\ashmi\OneDrive\Desktop\roadside_ass_app
```

### 2. Install Frontend Dependencies

```powershell
npm install
```

### 3. Install Backend Dependencies

```powershell
cd backend; npm install; cd ..
```

### 4. Configure Google Maps API

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
3. Open `public/index.html` and replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places"></script>
```

### 5. Configure Backend URL (Optional)

If you're deploying the backend to a different server, update the API URL in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
// Change to: const API_BASE_URL = 'https://your-backend-url.com/api';
```

## 🎯 Running the Application

### Option 1: Run Frontend and Backend Separately

**Terminal 1 - Start Backend Server:**
```powershell
cd backend; node server.js
```
The backend server will run on `http://localhost:3000`

**Terminal 2 - Start Frontend:**
```powershell
npm start
```
The frontend will run on `http://localhost:3000` (or another port if 3000 is occupied)

### Option 2: Run Backend from Root

```powershell
npm run server
```

Then in another terminal:
```powershell
npm start
```

## 📱 Usage Guide

### For Users

1. **Request Service**
   - Click "Request Service" from the home page
   - Your location will be automatically detected
   - Select the type of service you need
   - Add any additional details
   - Submit your request

2. **Chat with AI Assistant**
   - Click "AI Assistant" for 24/7 support
   - Ask questions about services, pricing, or wait times
   - Get instant responses

3. **Message Service Provider**
   - After submitting a request, you can chat with your assigned provider
   - Track communication in real-time

4. **Rate Your Service**
   - After service completion, provide a rating (1-5 stars)
   - Leave optional comments about your experience

### For Service Providers

1. **View Dashboard**
   - Access the Provider Dashboard from the navigation
   - See all available providers
   - Check availability and ratings

## 🗂️ Project Structure

```
roadside_ass_app/
├── public/
│   └── index.html              # HTML template with Google Maps script
├── src/
│   ├── components/
│   │   ├── Header.js           # Navigation header
│   │   └── Header.css
│   ├── screens/
│   │   ├── HomeScreen.js       # Landing page
│   │   ├── HomeScreen.css
│   │   ├── RequestServiceScreen.js    # Service request with map
│   │   ├── RequestServiceScreen.css
│   │   ├── ChatbotScreen.js    # AI assistant interface
│   │   ├── ChatbotScreen.css
│   │   ├── MessagingScreen.js  # User-provider messaging
│   │   ├── MessagingScreen.css
│   │   ├── FeedbackScreen.js   # Rating & review
│   │   ├── FeedbackScreen.css
│   │   ├── ServiceProviderDashboard.js
│   │   └── ServiceProviderDashboard.css
│   ├── services/
│   │   └── api.js              # API client functions
│   ├── App.js                  # Main app with routing
│   ├── App.css                 # Global styles
│   ├── index.js                # Entry point
│   └── index.css
├── backend/
│   ├── server.js               # Express server with API routes
│   └── package.json            # Backend dependencies
├── package.json                # Frontend dependencies
└── README.md                   # This file
```

## 🔌 API Endpoints

### Service Requests
- `POST /api/service-requests` - Create a new service request
- `GET /api/service-requests` - Get all service requests
- `GET /api/service-requests/:id` - Get specific request
- `PATCH /api/service-requests/:id` - Update request status

### Messaging
- `GET /api/messages/:requestId` - Get messages for a request
- `POST /api/messages` - Send a new message

### Feedback
- `POST /api/feedback` - Submit service feedback
- `GET /api/feedback` - Get all feedback

### Chatbot
- `POST /api/chatbot` - Get chatbot response

### Providers
- `GET /api/providers` - Get all service providers

## 🎨 Customization

### Change Theme Colors

Edit the CSS files to customize the color scheme:
- Primary Color: `#FF6B35` (Orange)
- Secondary Color: `#4ECDC4` (Teal)
- Background: `#F8F9FA` (Light Gray)

### Add More Services

1. Update the services array in `RequestServiceScreen.js`
2. Add corresponding service types in the backend `server.js`

### Modify Chatbot Responses

Edit the chatbot logic in `backend/server.js` under the `/api/chatbot` endpoint

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)

1. Build the production version:
```powershell
npm run build
```

2. Deploy the `build` folder to your hosting service

### Backend Deployment (Heroku/Railway/Render)

1. Navigate to backend folder
2. Ensure `package.json` has start script
3. Deploy to your preferred hosting platform
4. Update `API_BASE_URL` in `src/services/api.js`

## 🔐 Security Notes

- This is an MVP and stores data in memory
- For production, implement:
  - Database (MongoDB, PostgreSQL)
  - User authentication (JWT)
  - Input validation
  - Rate limiting
  - HTTPS encryption

## 🐛 Troubleshooting

### Google Maps not loading
- Verify your API key is correct
- Check that required APIs are enabled in Google Cloud Console
- Ensure your domain is authorized (for production)

### Backend connection errors
- Verify backend server is running on port 3000
- Check for CORS issues
- Ensure `API_BASE_URL` matches your backend URL

### Location not detected
- Allow location permissions in your browser
- Use HTTPS in production (required for geolocation)

## 📝 Future Enhancements

- [ ] User authentication and profiles
- [ ] Payment integration
- [ ] Real-time provider tracking
- [ ] Push notifications
- [ ] Service history
- [ ] Multiple language support
- [ ] Admin dashboard
- [ ] Analytics and reporting

## 📄 License

This project is created for educational purposes as an MVP demonstration.

## 👨‍💻 Support

For issues or questions:
- Check the troubleshooting section
- Review the code comments
- Test API endpoints using tools like Postman

---

Built with ❤️ for roadside assistance services
