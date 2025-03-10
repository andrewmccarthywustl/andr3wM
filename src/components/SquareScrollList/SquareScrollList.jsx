// src/components/SquareScrollList/SquareScrollList.jsx
import React, { useState, useCallback, memo } from "react";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import { FaRandom } from "react-icons/fa";
import SquareItem from "../SquareItem/SquareItem";
import styles from "./SquareScrollList.module.css";
import typography from "../../styles/typography.module.css";

const SquareScrollList = memo(
  ({ title, items, buttonText, onRandomSelect }) => {
    // Scroll state management
    const [scrollStates, setScrollStates] = useState({
      canScrollLeft: false,
      canScrollRight: true,
    });

    // Performance optimization: Memoize scroll handler
    const handleScroll = useCallback((e) => {
      const container = e.target;
      const canScrollLeft = container.scrollLeft > 20;
      const canScrollRight =
        container.scrollLeft <
        container.scrollWidth - container.clientWidth - 20;

      // Only update state if values changed to prevent unnecessary rerenders
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

    // Performance optimization: Memoize scroll function
    const scrollItems = useCallback((direction) => {
      const container = document.querySelector("#square-scroll-container");
      if (!container) return;

      const scrollAmount = 200 * 3; // Width of item * number of items to scroll

      // Use requestAnimationFrame for smooth scrolling
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
          {onRandomSelect && (
            <button onClick={onRandomSelect} className={styles.randomButton}>
              <FaRandom className={styles.randomIcon} />
              <span>Random</span>
            </button>
          )}
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

          {/* Item list */}
          <div
            id="square-scroll-container"
            className={styles.itemList}
            onScroll={handleScroll}
            role="list"
          >
            {items.map((item) => (
              <SquareItem
                key={item.id}
                item={{
                  name: item.name,
                  secondaryName: item.secondaryName,
                  imageUrl: item.imageUrl,
                  externalUrl: item.externalUrl,
                }}
                buttonText={buttonText}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

// Add display name for React DevTools
SquareScrollList.displayName = "SquareScrollList";

export default SquareScrollList;
