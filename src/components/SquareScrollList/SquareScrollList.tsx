// src/components/SquareScrollList/SquareScrollList.tsx
import React, { useState, useCallback, useRef, memo } from "react";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import SquareItem from "../SquareItem/SquareItem";
import styles from "./SquareScrollList.module.css";

interface ScrollState {
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

interface SquareItemData {
  id: number | string;
  name: string;
  secondaryName?: string;
  imageUrl: string;
  externalUrl: string;
  position?: number;
}

interface SquareScrollListProps {
  items: SquareItemData[];
  buttonText: string;
}

const SquareScrollList: React.FC<SquareScrollListProps> = memo(
  ({ items, buttonText }) => {
    // Properly type the useState hook
    const [scrollStates, setScrollStates] = useState<ScrollState>({
      canScrollLeft: false,
      canScrollRight: true,
    });

    // Fix the useRef by specifying the correct type and initial value
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    // Performance optimization: Memoize scroll handler
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      const canScrollLeft = container.scrollLeft > 20;

      // Check if we've reached the end (right)
      const isAtEnd =
        Math.abs(
          container.scrollWidth - container.clientWidth - container.scrollLeft
        ) < 20;

      const canScrollRight = !isAtEnd;

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
    const scrollItems = useCallback((direction: "left" | "right") => {
      const container = scrollContainerRef.current;
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
            ref={scrollContainerRef}
            className={styles.itemList}
            onScroll={handleScroll}
            role="list"
          >
            {items.map((item) => (
              <SquareItem key={item.id} item={item} buttonText={buttonText} />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

SquareScrollList.displayName = "SquareScrollList";

export default SquareScrollList;
