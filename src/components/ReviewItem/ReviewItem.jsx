// ReviewItem.jsx
import React, { useRef, useState, useEffect } from "react";
import styles from "./ReviewItem.module.css";
import typography from "../../styles/typography.module.css";
import useIsMobile from "../../hooks/useIsMobile";

function ReviewItem({ review, onClick, index, animate }) {
  const itemRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [touched, setTouched] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const item = itemRef.current;
    if (item && animate) {
      setTimeout(() => {
        setIsVisible(true);
      }, index * 100);
    } else {
      setIsVisible(false);
    }
  }, [index, animate]);

  const handleTouch = (e) => {
    e.preventDefault();
    setTouched(true);
    setTimeout(() => setTouched(false), 3000);
  };

  return (
    <div
      ref={itemRef}
      className={`${styles.reviewItem} ${isVisible ? styles.visible : ""} ${
        touched ? styles.touched : ""
      }`}
    >
      <div
        className={styles.imageContainer}
        onTouchStart={isMobile ? handleTouch : undefined}
      >
        <img
          src={review.image_url}
          alt={review.title}
          className={styles.reviewImage}
        />
        <button
          className={styles.viewButton}
          onClick={(e) => {
            e.stopPropagation();
            onClick(review);
          }}
        >
          View Review
        </button>
        <div className={styles.reviewOverlay}>
          <p>View Full Review</p>
        </div>
      </div>
      <h3 className={`${styles.reviewTitle} ${typography.heading3}`}>
        {review.title}
      </h3>
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
}

export default ReviewItem;
