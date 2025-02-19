import React, { useRef, useState } from "react";
import styles from "./ReviewItem.module.css";
import typography from "../../styles/typography.module.css";
import useIsMobile from "../../hooks/useIsMobile";

function ReviewItem({ review, onClick, index }) {
  const itemRef = useRef(null);
  const isMobile = useIsMobile();

  return (
    <div
      ref={itemRef}
      className={styles.reviewItem}
      onClick={() => onClick(review)} // Simplified to work on both mobile and desktop
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
