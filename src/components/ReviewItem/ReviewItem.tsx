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
          backgroundColor: (() => {
            const rating = review.rating;
            // Reds - still for low ratings but not as far up the scale
            if (rating < 4.0) return "#FF0D0D"; // Candy Apple Red
            else if (rating < 4.5)
              return "#FF2A11"; // Between Candy Apple and Orioles
            // Red-Orange (for below average)
            else if (rating < 5.0) return "#FF4E11"; // Orioles Orange
            else if (rating < 5.5) return "#FF6513"; // Between Orioles and Beer
            // Orange (for average)
            else if (rating < 6.0) return "#FF8E15"; // Beer
            else if (rating < 6.5) return "#FF9D24"; // Between Beer and Saffron
            // Orange-Yellow (slightly above average)
            else if (rating < 7.0) return "#FAB733"; // Saffron
            else if (rating < 7.3)
              return "#EAC033"; // Between Saffron and Brass
            // Yellow-Tan (good ratings)
            else if (rating < 7.6) return "#D5C533"; // Light Brass
            else if (rating < 7.9) return "#ACB334"; // Brass
            // Yellow-Green (very good ratings)
            else if (rating < 8.2) return "#9AB53A"; // Yellowish Green
            else if (rating < 8.4) return "#7BA928"; // Lime Green
            else if (rating < 8.6) return "#5D9C1F"; // Medium Green
            else if (rating < 8.8) return "#3F8F15"; // Forest Green
            // Strong greens for excellent ratings
            else if (rating < 9.0) return "#0A7F0A"; // Kelly Green
            else if (rating < 9.2) return "#006E00"; // Deep Green
            else if (rating < 9.4) return "#005C00"; // Pine Green
            else if (rating < 9.6) return "#004B00"; // Dark Forest Green
            // Darkest greens for exceptional top scores
            else if (rating < 9.8) return "#003A00"; // Very Dark Green
            else return "#002800"; // Almost Black Green
          })(),
        }}
      />
    </div>
  );
};

export default ReviewItem;
