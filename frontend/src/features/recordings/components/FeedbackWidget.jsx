import React, { useState } from "react";
import "./FeedbackWidget.css";

const FeedbackWidget = ({ onSubmit }) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ratings = [
    { value: 1, emoji: "😠", label: "Very Poor" },
    { value: 2, emoji: "😕", label: "Poor" },
    { value: 3, emoji: "😐", label: "Average" },
    { value: 4, emoji: "🙂", label: "Good" },
    { value: 5, emoji: "😊", label: "Excellent" },
  ];

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
    onSubmit(rating);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="feedback-container">
        <div className="thank-you-message">
          Thank you for your feedback! ❤️
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <h3>How accurate was this analysis?</h3>
      <p className="instruction">Click to submit your rating</p>
      <div className="rating-container">
        {ratings.map((rating) => (
          <button
            key={rating.value}
            className={`rating-option ${
              (hoverRating || selectedRating) >= rating.value ? "active" : ""
            }`}
            onMouseEnter={() => setHoverRating(rating.value)}
            onMouseLeave={() => setHoverRating(null)}
            onClick={() => handleRatingClick(rating.value)}
            aria-label={rating.label}
          >
            <span className="emoji">{rating.emoji}</span>
            <span className="label">{rating.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeedbackWidget;