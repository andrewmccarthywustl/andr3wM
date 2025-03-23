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
            // Reds - brighter versions
            if (rating < 4.0) return "#FF3D3D"; // Brighter Candy Apple Red
            else if (rating < 4.5)
              return "#FF5A41"; // Brighter between Candy Apple and Orioles
            // Red-Orange (for below average) - brighter versions
            else if (rating < 5.0) return "#FF7E41"; // Brighter Orioles Orange
            else if (rating < 5.5)
              return "#FF9543"; // Brighter between Orioles and Beer
            // Orange (for average) - brighter versions
            else if (rating < 6.0) return "#FFAE45"; // Brighter Beer
            else if (rating < 6.5)
              return "#FFBD54"; // Brighter between Beer and Saffron
            // Orange-Yellow (slightly above average) - brighter versions
            else if (rating < 7.0) return "#FFD763"; // Brighter Saffron
            else if (rating < 7.3)
              return "#FFE063"; // Brighter between Saffron and Brass
            // Yellow-Tan (good ratings) - brighter versions
            else if (rating < 7.6) return "#F5E563"; // Brighter Light Brass
            else if (rating < 7.9) return "#CCD364"; // Brighter Brass
            // Yellow-Green (very good ratings) - brighter versions
            else if (rating < 8.2) return "#BAD56A"; // Brighter Yellowish Green
            else if (rating < 8.4) return "#9BC958"; // Brighter Lime Green
            else if (rating < 8.6) return "#7DBC4F"; // Brighter Medium Green
            else if (rating < 8.8) return "#5FAF45"; // Brighter Forest Green
            // Strong greens for excellent ratings - brighter versions
            else if (rating < 9.0) return "#2A9F2A"; // Brighter Kelly Green
            else if (rating < 9.2) return "#208E20"; // Brighter Deep Green
            else if (rating < 9.4) return "#207C20"; // Brighter Pine Green
            else if (rating < 9.6)
              return "#206B20"; // Brighter Dark Forest Green
            // Darkest greens for exceptional top scores - brighter versions
            else if (rating < 9.8) return "#205A20"; // Brighter Very Dark Green
            else return "#204820"; // Brighter Almost Black Green
          })(),
        }}
      />
    </div>
  );
};

export default ReviewItem;
