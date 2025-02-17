// src/components/CircularScrollList/CircularItem.jsx
import React, { memo, useCallback } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import styles from "./CircularItem.module.css";
import typography from "../../styles/typography.module.css";

const CircularItem = memo(({ item }) => {
  const isMobile = useIsMobile();

  // Performance optimization: Memoized click handler with platform-specific behavior
  const handleClick = useCallback(
    (e) => {
      e.preventDefault();

      if (!item.url) return;

      if (isMobile) {
        // Direct URL navigation for mobile (same as album implementation)
        window.location.href = item.url;
      } else {
        // Open in new tab for desktop (same as album implementation)
        window.open(item.url, "_blank", "noopener,noreferrer");
      }
    },
    [item.url, isMobile]
  );

  return (
    <div
      className={styles.circularItem}
      onClick={handleClick}
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

// Add display name for React DevTools
CircularItem.displayName = "CircularItem";

export default CircularItem;
