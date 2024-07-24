// src/components/ReviewPopup/ReviewPopup.jsx

import React, { useEffect } from "react";
import EditReviewForm from "../EditReviewForm";
import styles from "./ReviewPopup.module.css";

function ReviewPopup({
  review,
  onClose,
  onEdit,
  onDelete,
  isEditing,
  setIsEditing,
  currentUser,
}) {
  useEffect(() => {
    // Prevent background scrolling when the popup is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className={styles.reviewPopup} onClick={onClose}>
      <div
        className={styles.reviewPopupContent}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          <span>&times;</span>
        </button>
        {isEditing ? (
          <EditReviewForm
            review={review}
            onSubmit={onEdit}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className={styles.reviewPopupImageContainer}>
              <img
                src={review.image_url}
                alt={review.title}
                className={styles.reviewPopupImage}
              />
            </div>
            <div className={styles.reviewPopupText}>
              <h2>{review.title}</h2>
              {review.media_type === "movie" && review.director && (
                <p>Director: {review.director}</p>
              )}
              {review.media_type === "book" && review.author && (
                <p>Author: {review.author}</p>
              )}
              <p>Rating: {review.rating.toFixed(1)}/10</p>
              <p>Date: {new Date(review.created_at).toLocaleDateString()}</p>
              <div className={styles.reviewContent}>
                <p>{review.review_text}</p>
              </div>
            </div>
            {currentUser && currentUser.id === review.reviewer && (
              <div className={styles.reviewPopupButtons}>
                <button onClick={() => setIsEditing(true)}>Edit Review</button>
                <button onClick={() => onDelete(review.id)}>
                  Delete Review
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ReviewPopup;
