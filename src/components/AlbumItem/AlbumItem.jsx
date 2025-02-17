// src/components/AlbumItem/AlbumItem.jsx
import React, { memo, useCallback } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import styles from "./AlbumItem.module.css";
import typography from "../../styles/typography.module.css";

const AlbumItem = memo(({ album }) => {
  const isMobile = useIsMobile();

  // Platform-specific click handler with memoization
  const handleClick = useCallback(
    (e) => {
      e.preventDefault();

      if (isMobile) {
        window.location.href = album.spotifyUrl;
      } else {
        window.open(album.spotifyUrl, "_blank", "noopener,noreferrer");
      }
    },
    [album.spotifyUrl, isMobile]
  );

  return (
    <div
      className={styles.albumItem}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.imageContainer}>
        <img
          src={album.imageUrl}
          alt={`${album.name} by ${album.artist}`}
          className={styles.albumImage}
          loading="lazy"
        />
      </div>

      <div className={styles.albumInfo}>
        <h3 className={`${styles.albumTitle} ${typography.heading3}`}>
          {album.name}
        </h3>
        <p className={`${styles.artistName} ${typography.bodyText}`}>
          {album.artist}
        </p>
      </div>

      <div className={styles.albumOverlay}>
        <span className={styles.playButton}>
          {isMobile ? "Open in Spotify" : "Play on Spotify"}
        </span>
      </div>
    </div>
  );
});

// Add display name for React DevTools
AlbumItem.displayName = "AlbumItem";

export default AlbumItem;
