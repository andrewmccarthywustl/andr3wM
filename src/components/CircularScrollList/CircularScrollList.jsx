// src/components/CircularScrollList/CircularScrollList.jsx
import React, { useState, useCallback, memo, useRef } from "react";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import { FaRandom } from "react-icons/fa";
import { FavoriteType } from "../../services/api";
import CircularItem from "../CircularItem";
import styles from "./CircularScrollList.module.css";
import typography from "../../styles/typography.module.css";

const CircularScrollList = memo(
  ({ title, items, itemType, onRandomSelect }) => {
    const [scrollStates, setScrollStates] = useState({
      canScrollLeft: false,
      canScrollRight: true,
    });
    const scrollContainerRef = useRef(null);

    const handleScroll = useCallback((e) => {
      const container = e.target;
      const canScrollLeft = container.scrollLeft > 20;
      const canScrollRight =
        container.scrollLeft <
        container.scrollWidth - container.clientWidth - 20;

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

    const scrollItems = useCallback((direction) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollAmount = 200 * 3;

      requestAnimationFrame(() => {
        container.scrollBy({
          left: direction === "right" ? scrollAmount : -scrollAmount,
          behavior: "smooth",
        });
      });
    }, []);

    const getButtonText = (type) => {
      switch (type) {
        case FavoriteType.ARTIST:
          return "Open Artist's Website";
        case FavoriteType.CHANNEL:
          return "Open Channel Link";
        default:
          return "View Profile";
      }
    };

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

          <div
            ref={scrollContainerRef}
            className={styles.itemList}
            onScroll={handleScroll}
            role="list"
          >
            {items.map((item) => (
              <CircularItem
                key={item.id}
                item={item}
                buttonText={getButtonText(itemType)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

CircularScrollList.displayName = "CircularScrollList";

export default CircularScrollList;
