import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getMessages, sendMessage } from '../services/api';
import './MessagingScreen.css';

export default function MessagingScreen() {
  const { requestId } = useParams();
  const location = useLocation();
  const providerName = location.state?.providerName || 'Service Provider';
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000); // Poll for new messages
    return () => clearInterval(interval);
  }, [requestId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const data = await getMessages(requestId);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessageText = inputText;
    setInputText('');

    try {
      const messageData = {
        requestId,
        senderId: 'user-123',
        senderType: 'user',
        text: userMessageText,
      };

      await sendMessage(messageData);
      await loadMessages();

      // AI auto-response from service provider
      setTimeout(async () => {
        try {
          const providerMessageData = {
            requestId,
            senderId: 'provider-ai',
            senderType: 'provider',
            text: userMessageText, // Will be replaced by AI response
            isAI: true,
          };

          await sendMessage(providerMessageData);
          await loadMessages();
        } catch (error) {
          console.error('Error getting AI response:', error);
        }
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="messaging-container">
        <div className="loading">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="messaging-container">
      <div className="messaging-card">
        <div className="messaging-header">
          <div className="provider-info">
            <div className="provider-avatar">👨‍🔧</div>
            <div>
              <h2>{providerName}</h2>
              <p className="status-indicator">🟢 Online</p>
            </div>
          </div>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.senderType === 'user' ? 'user-message' : 'provider-message'}`}
              >
                <div className="message-avatar">
                  {message.senderType === 'user' ? '👤' : '👨‍🔧'}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <textarea
            className="message-input"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="1"
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={!inputText.trim()}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
