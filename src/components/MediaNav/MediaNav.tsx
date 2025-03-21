// src/components/MediaNav/MediaNav.tsx
import React, { useState } from "react";
import { useScrollTo } from "../../hooks/useScrollTo";
import styles from "./MediaNav.module.css";

interface MediaNavProps {
  activeSection?: string;
}

const MediaNav: React.FC<MediaNavProps> = ({ activeSection = "reviews" }) => {
  const [activeSectionState, setActiveSection] =
    useState<string>(activeSection);
  const scrollToElement = useScrollTo(90); // Account for header + nav height

  const handleNavClick = (sectionId: string) => {
    scrollToElement(sectionId);
    setActiveSection(sectionId);
  };

  return (
    <nav className={styles.mediaNav}>
      <div className={styles.mediaNavContent}>
        <button
          onClick={() => handleNavClick("reviews")}
          className={`${styles.navButton} ${
            activeSectionState === "reviews" ? styles.active : ""
          }`}
        >
          Reviews
        </button>
        <button
          onClick={() => handleNavClick("favorites")}
          className={`${styles.navButton} ${
            activeSectionState === "favorites" ? styles.active : ""
          }`}
        >
          Favorites
        </button>
      </div>
    </nav>
  );
};

export default MediaNav;
