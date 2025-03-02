// src/components/MediaNav/MediaNav.jsx
import React, { useState } from "react";
import { useScrollTo } from "../../hooks/useScrollTo";
import styles from "./MediaNav.module.css";
import typography from "../../styles/typography.module.css";

function MediaNav() {
  const [activeSection, setActiveSection] = useState("reviews");
  const scrollToElement = useScrollTo(90); // Account for header + nav height

  const handleNavClick = (sectionId) => {
    scrollToElement(sectionId);
    setActiveSection(sectionId);
  };

  return (
    <nav className={styles.mediaNav}>
      <div className={styles.mediaNavContent}>
        <button
          onClick={() => handleNavClick("reviews")}
          className={`${styles.navButton} ${
            activeSection === "reviews" ? styles.active : ""
          } ${typography.heading3}`}
        >
          Reviews
        </button>
        <button
          onClick={() => handleNavClick("favorites")}
          className={`${styles.navButton} ${
            activeSection === "favorites" ? styles.active : ""
          } ${typography.heading3}`}
        >
          Favorites
        </button>
      </div>
    </nav>
  );
}

export default MediaNav;
