// src/components/ReviewPopup/ReviewPopup.jsx

import React, { useEffect, useRef } from "react";
import { IoChevronBack } from "react-icons/io5";
import EditReviewForm from "../EditReviewForm";
import styles from "./ReviewPopup.module.css";
import typography from "../../styles/typography.module.css";

function ReviewPopup({
  review,
  onClose,
  onEdit,
  onDelete,
  isEditing,
  setIsEditing,
  currentUser,
  isOpen,
  isMobile,
}) {
  const popupContentRef = useRef(null);

  useEffect(() => {
    if (isOpen && popupContentRef.current) {
      popupContentRef.current.scrollTop = 0;
    }
  }, [isOpen, review]);

  return (
    <div className={`${styles.reviewPopup} ${isOpen ? styles.open : ""}`}>
      <div ref={popupContentRef} className={styles.reviewPopupContent}>
        <button className={styles.backButton} onClick={onClose}>
          <IoChevronBack />
        </button>
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
                <h2
                  className={`${styles.reviewPopupTitle} ${typography.heading2}`}
                >
                  {review.title}
                </h2>
                {review.media_type === "movie" && review.director && (
                  <p
                    className={`${styles.reviewPopupDetail} ${typography.bodyText}`}
                  >
                    Director: {review.director}
                  </p>
                )}
                {review.media_type === "book" && review.author && (
                  <p
                    className={`${styles.reviewPopupDetail} ${typography.bodyText}`}
                  >
                    Author: {review.author}
                  </p>
                )}
                <p
                  className={`${styles.reviewPopupRating} ${typography.bodyText}`}
                >
                  Rating: {review.rating.toFixed(1)}/10
                </p>
                <p
                  className={`${styles.reviewPopupDate} ${typography.bodyText}`}
                >
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className={styles.reviewPopupBody}>
              <p className={`${styles.reviewPopupText} ${typography.bodyText}`}>
                {review.review_text}
              </p>
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
  );
}

export default ReviewPopup;
