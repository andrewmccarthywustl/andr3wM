// src/components/ReviewItem/ReviewItem.jsx

import React, { useEffect, useRef, useState } from "react";
import styles from "./ReviewItem.module.css";

function ReviewItem({ review, onClick, index, animate }) {
  const itemRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const item = itemRef.current;
    if (item && animate) {
      // Trigger the slide-in effect after a short delay
      setTimeout(() => {
        setIsVisible(true);
      }, index * 100);
    } else {
      setIsVisible(false);
    }
  }, [index, animate]);

  return (
    <div
      ref={itemRef}
      className={`${styles.reviewItem} ${isVisible ? styles.visible : ""}`}
      onClick={onClick}
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
    </div>
  );
}

export default ReviewItem;
