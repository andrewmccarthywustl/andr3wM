// src/components/ReviewPopup/ReviewPopup.jsx

import React, { useEffect, useRef, useState } from "react";
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
  const [isClosing, setIsClosing] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    if (isOpen && popupContentRef.current) {
      popupContentRef.current.scrollTop = 0;
    }
  }, [isOpen, review]);

  const handleClose = () => {
    if (isMobile) {
      // On mobile, close immediately
      onClose();
    } else {
      // On desktop, animate the closing
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        onClose();
      }, 300);
    }
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e) => {
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
      time: Date.now(),
    };

    const deltaX = Math.abs(touchEnd.x - touchStartRef.current.x);
    const deltaY = Math.abs(touchEnd.y - touchStartRef.current.y);
    const deltaTime = touchEnd.time - touchStartRef.current.time;

    // Only close if it was a quick tap without much movement
    if (deltaTime < 200 && deltaX < 10 && deltaY < 10) {
      handleClose();
    }
  };

  return (
    <div
      className={`
        ${styles.reviewPopup}
        ${isOpen ? styles.open : ""}
        ${!isMobile && isClosing ? styles.closing : ""}
        ${isMobile ? styles.mobile : ""}
      `}
    >
      <div ref={popupContentRef} className={styles.reviewPopupContent}>
        <button
          className={styles.backButton}
          onClick={!isMobile ? handleClose : undefined}
          onTouchStart={isMobile ? handleTouchStart : undefined}
          onTouchEnd={isMobile ? handleTouchEnd : undefined}
        >
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
