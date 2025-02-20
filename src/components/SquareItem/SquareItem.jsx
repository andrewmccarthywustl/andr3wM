// src/components/SquareItem/SquareItem.jsx
import React, { memo, useCallback, useRef } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import styles from "./SquareItem.module.css";
import typography from "../../styles/typography.module.css";

const SquareItem = memo(({ item, buttonText }) => {
  const isMobile = useIsMobile();
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      window.open(item.externalUrl, "_blank", "noopener,noreferrer");
    },
    [item.externalUrl]
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
      className={styles.squareItem}
      onClick={!isMobile ? handleClick : undefined}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      role="button"
      tabIndex={0}
    >
      <div className={styles.imageContainer}>
        <img
          src={item.imageUrl}
          alt={`${item.name}${
            item.secondaryName ? ` by ${item.secondaryName}` : ""
          }`}
          className={styles.squareImage}
          loading="lazy"
        />
        <div className={styles.itemOverlay}>
          <span className={styles.playButton}>{buttonText}</span>
        </div>
      </div>

      <div className={styles.itemInfo}>
        <h3 className={`${styles.itemTitle}`}>{item.name}</h3>
        {item.secondaryName && (
          <p className={`${styles.secondaryName}`}>{item.secondaryName}</p>
        )}
      </div>
    </div>
  );
});

SquareItem.displayName = "SquareItem";

export default SquareItem;
