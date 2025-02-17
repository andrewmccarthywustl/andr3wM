// src/pages/Media/Media.jsx
import React from "react";
import MediaLayout from "../../components/MediaLayout/MediaLayout";
import MediaNav from "../../components/MediaNav/MediaNav";
import MediaReviews from "../../components/MediaReviews/MediaReviews";
import FavoritesSection from "../../components/FavoritesSection/FavoritesSection";
import styles from "./Media.module.css";
import typography from "../../styles/typography.module.css";

function Media() {
  return (
    <div className={styles.mediaPage}>
      <MediaLayout />
      <MediaNav />
      <div id="reviews" className={styles.section}>
        <MediaReviews />
      </div>
      <div id="favorites" className={styles.section}>
        <FavoritesSection />
      </div>
    </div>
  );
}

export default Media;
