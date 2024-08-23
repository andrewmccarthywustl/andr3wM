// src/components/ReviewPopup/ReviewPopup.jsx

import React, { useEffect, useRef } from "react";
import EditReviewForm from "../EditReviewForm";
import styles from "./ReviewPopup.module.css";
import { IoChevronBack } from "react-icons/io5";

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
  const popupRef = useRef(null);
  const startX = useRef(null);

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isMobile]);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!startX.current) return;

    const currentX = e.touches[0].clientX;
    const diff = startX.current - currentX;

    if (diff > 50) {
      // Swiped left
      onClose();
    }
  };

  const handleTouchEnd = () => {
    startX.current = null;
  };

  return (
    <div
      className={`${styles.reviewPopup} ${isOpen ? styles.open : ""} ${
        isMobile ? styles.mobile : ""
      }`}
      ref={popupRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.reviewPopupContent}>
        <button className={styles.backButton} onClick={onClose}>
          <IoChevronBack />
        </button>
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
