// src/components/ReviewPopup.jsx
import React from "react";
import EditReviewForm from "./EditReviewForm";

const ReviewPopup = ({
  review,
  onClose,
  onEdit,
  onDelete,
  isEditing,
  setIsEditing,
  currentUser,
}) => (
  <div className="review-popup" onClick={onClose}>
    <div className="review-popup-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <div className="review-popup-image-container">
        <img
          src={review.image_url}
          alt={review.title}
          className="review-popup-image"
        />
      </div>
      <div className="review-popup-text">
        {isEditing ? (
          <EditReviewForm
            review={review}
            onSubmit={onEdit}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <h2>{review.title}</h2>
            {review.media_type === "movie" && review.director && (
              <p>Director: {review.director}</p>
            )}
            {review.media_type === "book" && review.author && (
              <p>Author: {review.author}</p>
            )}
            <p>Rating: {review.rating.toFixed(1)}/10</p>
            <p>Date: {new Date(review.created_at).toLocaleDateString()}</p>
            <div className="review-content">
              <p>{review.review_text}</p>
            </div>
          </>
        )}
        {currentUser && currentUser.id === review.reviewer && !isEditing && (
          <div className="review-popup-buttons">
            <button
              onClick={() => setIsEditing(true)}
              className="edit-review-button"
            >
              Edit Review
            </button>
            <button
              onClick={() => onDelete(review.id)}
              className="delete-review-button"
            >
              Delete Review
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ReviewPopup;
