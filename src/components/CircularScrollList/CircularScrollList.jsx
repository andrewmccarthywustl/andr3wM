// src/components/CircularScrollList/CircularScrollList.jsx
import React, { useState, useCallback, memo } from "react";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import CircularItem from "../CircularItem";
import styles from "./CircularScrollList.module.css";
import typography from "../../styles/typography.module.css";

// Constants to prevent recreation
const SCROLL_THRESHOLD = 20;
const SCROLL_ITEMS = 3;
const ITEM_WIDTH = 200;
const ITEM_GAP = 16; // Equivalent to var(--spacing-lg)

const CircularScrollList = memo(({ title, items }) => {
  // Scroll state management
  const [scrollStates, setScrollStates] = useState({
    canScrollLeft: false,
    canScrollRight: true,
  });

  // Memoized scroll handler with performance optimization
  const handleScroll = useCallback((e) => {
    const container = e.target;
    const canScrollLeft = container.scrollLeft > SCROLL_THRESHOLD;
    const canScrollRight =
      container.scrollLeft <
      container.scrollWidth - container.clientWidth - SCROLL_THRESHOLD;

    // Prevent unnecessary state updates
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

  // Memoized scroll function with performance optimization
  const scrollItems = useCallback((direction) => {
    const container = document.querySelector("#circular-scroll-container");
    if (!container) return;

    const scrollAmount = (ITEM_WIDTH + ITEM_GAP) * SCROLL_ITEMS;

    requestAnimationFrame(() => {
      container.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    });
  }, []);

  return (
    <div className={styles.listContainer}>
      <div className={styles.sectionHeader}>
        <h2 className={`${styles.sectionTitle} ${typography.heading2}`}>
          {title}
        </h2>
      </div>

      <div className={styles.scrollContainer}>
        {/* Gradient overlays */}
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

        {/* Navigation arrows */}
        {scrollStates.canScrollLeft && (
          <IoChevronBack
            className={`${styles.scrollArrow} ${styles.scrollArrowLeft}`}
            onClick={() => scrollItems("left")}
            aria-label="Scroll left"
          />
        )}

        {scrollStates.canScrollRight && (
          <IoChevronForward
            className={`${styles.scrollArrow} ${styles.scrollArrowRight}`}
            onClick={() => scrollItems("right")}
            aria-label="Scroll right"
          />
        )}

        {/* Items list */}
        <div
          id="circular-scroll-container"
          className={styles.itemList}
          onScroll={handleScroll}
          role="list"
        >
          {items.map((item) => (
            <CircularItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
});

CircularScrollList.displayName = "CircularScrollList";

export default CircularScrollList;
