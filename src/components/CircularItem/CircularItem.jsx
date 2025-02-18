// CircularItem.jsx
import React, { memo, useCallback } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import styles from "./CircularItem.module.css";
import typography from "../../styles/typography.module.css";

const CircularItem = memo(({ item, buttonText }) => {
  const isMobile = useIsMobile();

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      window.open(item.url, "_blank", "noopener,noreferrer");
    },
    [item.url]
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
