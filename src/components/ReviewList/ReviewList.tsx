// src/components/ReviewList/ReviewList.tsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import ReviewItem from "../ReviewItem";
import { useReviewPopup } from "../../pages/Media/Media"; // Import from the file where context is defined
import styles from "./ReviewList.module.css";

interface ReviewListProps {
  reviews: any[];
  resetKey?: string; // Add this prop to track sort changes
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, resetKey }) => {
  const [scrollStates, setScrollStates] = useState<{
    canScrollLeft: boolean;
    canScrollRight: boolean;
  }>({
    canScrollLeft: false,
    canScrollRight: true,
  });

  const { openReviewPopup } = useReviewPopup();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Add effect to reset scroll position when resetKey changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [resetKey]);

  // Handle scroll event
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const canScrollLeft = container.scrollLeft > 20;

    // Check if we've reached the end (right)
    const isAtEnd =
      Math.abs(
        container.scrollWidth - container.clientWidth - container.scrollLeft
      ) < 20;

    const canScrollRight = !isAtEnd;

    setScrollStates((prev) => {
      if (
        prev.canScrollLeft === canScrollLeft &&
        prev.canScrollRight === canScrollRight
      ) {
        return prev;
      }
      return { canScrollLeft, canScrollRight };
    });
  }, []);

  // Scroll reviews
  const scrollReviews = useCallback((direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const itemWidth = 220; // Approximate width of review item
    const gap = 16; // Gap between items
    const scrollAmount = (itemWidth + gap) * 2; // Scroll 2 items at a time

    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className={styles.reviewListContainer}>
      <div
        className={`${styles.gradientLeft} ${
          scrollStates.canScrollLeft ? styles.gradientShow : ""
        }`}
      />

      <div
        className={`${styles.gradientRight} ${
          scrollStates.canScrollRight ? styles.gradientShow : ""
        }`}
      />

      {scrollStates.canScrollLeft && (
        <IoChevronBack
          className={`${styles.scrollArrow} ${styles.scrollArrowLeft}`}
          onClick={() => scrollReviews("left")}
          aria-label="Scroll left"
        />
      )}

      {scrollStates.canScrollRight && (
        <IoChevronForward
          className={`${styles.scrollArrow} ${styles.scrollArrowRight}`}
          onClick={() => scrollReviews("right")}
          aria-label="Scroll right"
        />
      )}

      <div
        ref={scrollContainerRef}
        className={styles.reviewList}
        onScroll={handleScroll}
      >
        {reviews.map((review, index) => (
          <ReviewItem
            key={review.id}
            review={review}
            onClick={openReviewPopup}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
