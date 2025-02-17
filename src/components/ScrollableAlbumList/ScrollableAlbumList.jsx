// src/components/ScrollableAlbumList/ScrollableAlbumList.jsx
import React, { useState, useCallback, memo } from "react";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import AlbumItem from "../AlbumItem/AlbumItem";
import styles from "./ScrollableAlbumList.module.css";
import typography from "../../styles/typography.module.css";

const ScrollableAlbumList = memo(({ title, albums }) => {
  // Scroll state management
  const [scrollStates, setScrollStates] = useState({
    canScrollLeft: false,
    canScrollRight: true,
  });

  // Performance optimization: Memoize scroll handler
  const handleScroll = useCallback((e) => {
    const container = e.target;
    const canScrollLeft = container.scrollLeft > 20;
    const canScrollRight =
      container.scrollLeft < container.scrollWidth - container.clientWidth - 20;

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
  const scrollAlbums = useCallback((direction) => {
    const container = document.querySelector("#album-scroll-container");
    if (!container) return;

    const scrollAmount = 200 * 3; // Width of album item * number of items to scroll

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
      <div className={styles.sectionHeader}>
        <h2 className={`${styles.sectionTitle} ${typography.heading2}`}>
          {title}
        </h2>
      </div>

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
            onClick={() => scrollAlbums("left")}
            aria-label="Scroll left"
          />
        )}

        {scrollStates.canScrollRight && (
          <IoChevronForward
            className={`${styles.scrollArrow} ${styles.scrollArrowRight}`}
            onClick={() => scrollAlbums("right")}
            aria-label="Scroll right"
          />
        )}

        {/* Album list */}
        <div
          id="album-scroll-container"
          className={styles.albumList}
          onScroll={handleScroll}
          role="list"
        >
          {albums.map((album) => (
            <AlbumItem key={album.id} album={album} />
          ))}
        </div>
      </div>
    </div>
  );
});

// Add display name for React DevTools
ScrollableAlbumList.displayName = "ScrollableAlbumList";

export default ScrollableAlbumList;
