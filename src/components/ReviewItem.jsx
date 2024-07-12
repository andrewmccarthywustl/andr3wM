import React from "react";

const ReviewItem = ({ review, onClick }) => (
  <div className="review-item" onClick={onClick}>
    <div className="image-container">
      <img src={review.image_url} alt={review.title} />
      <div className="review-overlay">
        <p>View Full Review</p>
      </div>
    </div>
    <h3 className="review-title">{review.title}</h3>
    <p className="review-rating">Rating: {review.rating.toFixed(1)}/10</p>
    <p className="review-date">
      {new Date(review.created_at).toLocaleDateString()}
    </p>
  </div>
);

export default ReviewItem;
