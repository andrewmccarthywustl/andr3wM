// src/pages/Media/Media.jsx
import React from "react";
import MediaLayout from "../../components/MediaLayout/MediaLayout";
import MediaNav from "../../components/MediaNav/MediaNav";
import MediaReviews from "../../components/MediaReviews/MediaReviews";
import styles from "./Media.module.css";
import typography from "../../styles/typography.module.css";

function Media() {
  return (
    <div className={styles.mediaPage}>
      <MediaLayout />
      <MediaNav />
      <div id="reviews" className={styles.section}>
        <h1 className={typography.heading1}>Reviews</h1>
        <MediaReviews />
      </div>
      <div id="favorites" className={styles.section}>
        <h1 className={typography.heading1}>Favorites</h1>
        {/* Favorites component will go here */}
      </div>
      <div id="youtube" className={styles.section}>
        <h1 className={typography.heading1}>YouTube</h1>
        {/* YouTube component will go here */}
      </div>
      <div id="music" className={styles.section}>
        <h1 className={typography.heading1}>Music</h1>
        {/* Music component will go here */}
      </div>
    </div>
  );
}

export default Media;
