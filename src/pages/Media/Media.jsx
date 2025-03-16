// src/pages/Media/Media.jsx
import React, { useState, useEffect } from "react";
import MediaNav from "../../components/MediaNav/MediaNav";
import MediaReviews from "../../components/MediaReviews/MediaReviews";
import FavoritesSection from "../../components/FavoritesSection/FavoritesSection";
import PageTitle from "../../components/PageTitle/PageTitle";
import LoadingSpinner from "../../components/LoadingSpinner";
import styles from "./Media.module.css";
import typography from "../../styles/typography.module.css";

function Media() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or fetch necessary data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Short timeout to ensure components are ready

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading media..." />;
  }

  return (
    <div className={styles.mediaPage}>
      <PageTitle title="Media" />
      <div className={styles.introContent}>
        {" "}
        <p>
          This page is just where I keep track of the movies, tv shows and books
          I watch/read. This practice has helped me keep track of my time and
          holds me accountable for what I'm doing with my time to some extent.
          LLMs are also really good at reccommending things, owning this data of
          what I like and my thoughts is perfect context for LLMs. I have done a
          little bit of data analysis on myself and my vocabulary is shite. I
          don't put much effort into writing these reviews, but I am now
          attempting to make an active effort to improve my writing. Overall
          this page is goofy, but it has genuinely helped me better use my time.
          This page has helped me gain a sense of agency and a feeling of growth
          in this modern world where algorithms drown you with a constant stream
          of things.
        </p>
        <h2>Goals for this page:</h2>
        <ul>
          <li>Read more books than tv shows watched.</li>
          <li>Not have like as my most used word.</li>
          <li>Learn some cool shit, hear different perspectives.</li>
          <li>
            Add a section for things I made instead of just judging other
            peoples things
          </li>
        </ul>
      </div>

      <div className={styles.spacer}></div>

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
