// src/components/ReviewItem/ReviewItem.tsx
import React, { useRef } from "react";
import { Review } from "../../services/api/types";
import useIsMobile from "../../hooks/useIsMobile";
import styles from "./ReviewItem.module.css";

interface ReviewItemProps {
  review: Review;
  onClick: (review: Review) => void;
  index: number;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onClick }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({
    x: 0,
    y: 0,
    time: 0,
  });
  const isMobile = useIsMobile();

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

    // Only trigger click if:
    // 1. Touch duration is less than 200ms (quick tap)
    // 2. Movement is less than 10px in any direction (not scrolling)
    if (deltaTime < 200 && deltaX < 10 && deltaY < 10) {
      onClick(review);
    }
  };

  return (
    <div
      ref={itemRef}
      className={styles.reviewItem}
      onClick={!isMobile ? () => onClick(review) : undefined}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      role="button"
      tabIndex={0}
      aria-label={`View review of ${review.title}`}
    >
      <div className={styles.imageContainer}>
        <img
          src={review.image_url}
          alt={review.title}
          className={styles.reviewImage}
        />
        <div className={styles.reviewOverlay}>
          <p>View Full Review</p>
        </div>
      </div>
      <h3 className={styles.reviewTitle}>{review.title}</h3>
      <p className={styles.reviewRating}>
        Rating: {review.rating.toFixed(1)}/10
      </p>
      <p className={styles.reviewDate}>
        {new Date(review.created_at).toLocaleDateString()}
      </p>
      <div
        className={styles.ratingBar}
        style={{
          backgroundColor: `rgb(${
            review.rating >= 9
              ? 0
              : review.rating >= 8
              ? Math.round(255 * (1 - (review.rating - 8)))
              : review.rating >= 7
              ? Math.round(255 * 0.8)
              : review.rating >= 5
              ? 255
              : review.rating >= 3
              ? 255
              : 255
          }, ${
            review.rating >= 9
              ? 255
              : review.rating >= 8
              ? 255
              : review.rating >= 7
              ? 255
              : review.rating >= 5
              ? Math.round(255 * ((review.rating - 5) / 2))
              : review.rating >= 3
              ? Math.round(255 * (review.rating / 5) * 0.3)
              : 0
          }, 0)`,
        }}
      />
    </div>
  );
};

export default ReviewItem;
