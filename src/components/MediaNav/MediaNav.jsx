// src/components/MediaNav/MediaNav.jsx
import React, { useState, useEffect } from "react";
import styles from "./MediaNav.module.css";
import typography from "../../styles/typography.module.css";

function MediaNav() {
  const [activeSection, setActiveSection] = useState("reviews");

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  return (
    <nav className={styles.mediaNav}>
      <div className={styles.mediaNavContent}>
        <button
          onClick={() => scrollToSection("reviews")}
          className={`${styles.navButton} ${
            activeSection === "reviews" ? styles.active : ""
          } ${typography.heading3}`}
        >
          Reviews
        </button>
        <button
          onClick={() => scrollToSection("favorites")}
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
