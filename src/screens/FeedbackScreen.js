import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitFeedback } from '../services/api';
import './FeedbackScreen.css';

export default function FeedbackScreen() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setLoading(true);

    try {
      const feedbackData = {
        requestId,
        rating,
        comment,
      };

      await submitFeedback(feedbackData);
      setSubmitted(true);
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="feedback-container">
        <div className="feedback-card success-card">
          <div className="success-icon">✅</div>
          <h2>Thank You!</h2>
          <p>Your feedback has been submitted successfully.</p>
          <p className="redirect-message">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="feedback-card">
        <div className="feedback-header">
          <h1>⭐ Rate Your Service</h1>
          <p>Help us improve by sharing your experience</p>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="rating-section">
            <label className="form-label">How was your experience?</label>
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  {star <= (hoveredRating || rating) ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            <div className="rating-text">
              {rating === 0 && 'Select a rating'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </div>
          </div>

          <div className="comment-section">
            <label className="form-label" htmlFor="comment">
              Additional Comments (Optional)
            </label>
            <textarea
              id="comment"
              className="comment-input"
              placeholder="Tell us more about your experience..."
              rows="5"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Skip
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || rating === 0}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
