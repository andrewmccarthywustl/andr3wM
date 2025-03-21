// src/components/CircularItem/CircularItem.tsx
import React, { memo, useCallback, useRef } from "react";
import useIsMobile from "../../hooks/useIsMobile";
import styles from "./CircularItem.module.css";

interface CircularItemData {
  id: number | string;
  name: string;
  imageUrl: string;
  url: string;
  description?: string;
}

interface CircularItemProps {
  item: CircularItemData;
  buttonText: string;
}

const CircularItem: React.FC<CircularItemProps> = memo(
  ({ item, buttonText }) => {
    const isMobile = useIsMobile();
    // Fix the initialization syntax - make sure commas are used consistently
    const touchStartRef = useRef<{ x: number; y: number; time: number }>({
      x: 0,
      y: 0,
      time: 0,
    });

    const handleClick = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        window.open(item.url, "_blank", "noopener,noreferrer");
      },
      [item.url]
    );

    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now(),
      };

      const deltaX = Math.abs(touchEnd.x - touchStartRef.current.x);
      const deltaY = Math.abs(touchEnd.y - touchStartRef.current.y);
      const deltaTime = touchEnd.time - touchStartRef.current.time;

      if (deltaTime < 200 && deltaX < 10 && deltaY < 10) {
        handleClick(e);
      }
    };

    return (
      <div
        className={styles.circularItem}
        onClick={!isMobile ? handleClick : undefined}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
        role="button"
        tabIndex={0}
      >
        <div className={styles.imageContainer}>
          <img
            src={item.imageUrl}
            alt={item.name}
            className={styles.circularImage}
            loading="lazy"
          />
          <div className={styles.circularOverlay}>
            <span className={styles.viewButton}>{buttonText}</span>
          </div>
        </div>
        <h3 className={styles.itemName}>{item.name}</h3>
        {item.description && (
          <p className={styles.itemDescription}>{item.description}</p>
        )}
      </div>
    );
  }
);

CircularItem.displayName = "CircularItem";

export default CircularItem;
