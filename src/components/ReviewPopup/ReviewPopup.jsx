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
        <button className={styles.closeButton} onClick={onClose}></button>
        <div className={styles.scrollableContent}>
          {isEditing ? (
            <EditReviewForm
              review={review}
              onSubmit={onEdit}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <div className={styles.reviewPopupHeader}>
                <div className={styles.imageWrapper}>
                  <img
                    src={review.image_url}
                    alt={review.title}
                    className={styles.reviewPopupImage}
                  />
                </div>
                <div className={styles.reviewPopupInfo}>
                  <h2 className={styles.reviewPopupTitle}>{review.title}</h2>
                  {review.media_type === "movie" && review.director && (
                    <p className={styles.reviewPopupDetail}>
                      Director: {review.director}
                    </p>
                  )}
                  {review.media_type === "book" && review.author && (
                    <p className={styles.reviewPopupDetail}>
                      Author: {review.author}
                    </p>
                  )}
                  <p className={styles.reviewPopupRating}>
                    Rating: {review.rating.toFixed(1)}/10
                  </p>
                  <p className={styles.reviewPopupDate}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className={styles.reviewPopupBody}>
                <p className={styles.reviewPopupText}>{review.review_text}</p>
              </div>
              {currentUser && currentUser.id === review.reviewer && (
                <div className={styles.reviewPopupActions}>
                  <button
                    onClick={() => setIsEditing(true)}
                    className={styles.editButton}
                  >
                    Edit Review
                  </button>
                  <button
                    onClick={() => onDelete(review.id)}
                    className={styles.deleteButton}
                  >
                    Delete Review
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewPopup;
