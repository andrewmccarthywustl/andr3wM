// src/components/ReviewPopup/ReviewPopup.tsx
import React, { useEffect, useRef, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { Review } from "../../services/api/types";
import styles from "./ReviewPopup.module.css";

interface ReviewPopupProps {
  review: Review;
  onClose: () => void;
  isOpen: boolean;
  isMobile?: boolean;
}

const ReviewPopup: React.FC<ReviewPopupProps> = ({
  review,
  onClose,
  isOpen,
  isMobile = false,
}) => {
  const popupContentRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({
    x: 0,
    y: 0,
    time: 0,
  });

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
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
    <aside
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
          aria-label="Close review"
        >
          <IoChevronBack />
        </button>

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
      </div>
    </aside>
  );
};

export default ReviewPopup;
