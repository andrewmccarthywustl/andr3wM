// src/components/CircularItem/CircularItem.jsx
import React, { memo, useCallback, useRef } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import styles from "./CircularItem.module.css";
import typography from "../../styles/typography.module.css";

const CircularItem = memo(({ item, buttonText }) => {
  const isMobile = useIsMobile();
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      window.open(item.url, "_blank", "noopener,noreferrer");
    },
    [item.url]
  );

  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e) => {
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
      <h3 className={`${styles.itemName} ${typography.heading3}`}>
        {item.name}
      </h3>
      {item.description && (
        <p className={`${styles.itemDescription} ${typography.bodyText}`}>
          {item.description}
        </p>
      )}
    </div>
  );
});

CircularItem.displayName = "CircularItem";

export default CircularItem;
