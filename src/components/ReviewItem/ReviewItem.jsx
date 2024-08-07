// src/components/ReviewItem/ReviewItem.jsx

import React, { useEffect, useRef } from "react";
import styles from "./ReviewItem.module.css";

function ReviewItem({ review, onClick, index }) {
  const itemRef = useRef(null);

  useEffect(() => {
    const item = itemRef.current;
    if (item) {
      item.style.animationDelay = `${index * 0.1}s`;
    }
  }, [index]);

  return (
    <div
      ref={itemRef}
      className={`${styles.reviewItem} ${styles.slideIn}`}
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
