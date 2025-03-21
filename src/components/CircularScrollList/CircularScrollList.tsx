// src/components/CircularScrollList/CircularScrollList.tsx
import React, { useState, useCallback, memo, useRef } from "react";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import CircularItem from "../CircularItem";
import styles from "./CircularScrollList.module.css";

interface ScrollState {
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

interface CircularItemData {
  id: number | string;
  name: string;
  imageUrl: string;
  url: string;
}

interface CircularScrollListProps {
  items: CircularItemData[];
  itemType: string;
}

const CircularScrollList: React.FC<CircularScrollListProps> = memo(
  ({ items, itemType }) => {
    const [scrollStates, setScrollStates] = useState<ScrollState>({
      canScrollLeft: false,
      canScrollRight: true,
    });

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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

    const scrollItems = useCallback((direction: "left" | "right") => {
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

    const getButtonText = (type: string) => {
      switch (type) {
        case "artist":
          return "Open Artist's Website";
        case "channel":
          return "Open Channel Link";
        default:
          return "View Profile";
      }
    };

    return (
      <div className={styles.listContainer}>
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
