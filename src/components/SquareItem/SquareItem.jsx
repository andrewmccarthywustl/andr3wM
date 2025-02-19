import React, { memo, useCallback } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import styles from "./SquareItem.module.css";
import typography from "../../styles/typography.module.css";

const SquareItem = memo(({ item, buttonText }) => {
  const isMobile = useIsMobile();

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      window.open(item.externalUrl, "_blank", "noopener,noreferrer");
    },
    [item.externalUrl]
  );

  return (
    <div
      className={styles.squareItem}
      onClick={handleClick}
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

// Add display name for React DevTools
SquareItem.displayName = "SquareItem";

export default SquareItem;
