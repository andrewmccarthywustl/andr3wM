// src/pages/Media/Media.jsx
import React from "react";
import MediaNav from "../../components/MediaNav/MediaNav";
import MediaReviews from "../../components/MediaReviews/MediaReviews";
import FavoritesSection from "../../components/FavoritesSection/FavoritesSection";
import PageTitle from "../../components/PageTitle/PageTitle";
import styles from "./Media.module.css";
import typography from "../../styles/typography.module.css";

function Media() {
  return (
    <div className={styles.mediaPage}>
      <PageTitle
        title="Media"
        subtitle="Tracking, reflecting, and sharing my experiences with books, movies, music, and more"
      />

      <div className={styles.gridLayout}>
        <div className={styles.blockOne}>
          <p className={typography.bodyText}>
            I enjoy reading and listening to what other people have to say. I
            value a good story and like learning from my media. Keeping track of
            what I consume has allowed me to do that better and holds me
            accountable for my time. I don't think everything should be
            documented; trying to turn the present into content detracts from
            the experience. However, reflection is good. I try to keep track of
            the movies, books, and TV shows I've seen so I can recommend them,
            connect with others, and talk about them. Memory is fleeting, and if
            the security on my database is up to date, these reviews are like a
            lossy copy of my memories. I like YouTube a lot; it's the only
            social media platform that has improved my life, so I'm also
            including videos, channels, and playlists that I really like here.
            Podcasts I enjoy listening to will also find their way here. I think
            I'll also add my favorite albums and such, really just to test the
            capabilities of AI for music recommendations. Music is too
            subjective to rate, and my opinion on music changes too quickly for
            current thoughts after listening to an album to be useful. So, I'm
            just going to list my favorites.
          </p>
        </div>

        <div className={styles.blockTwo}>
          <div className={styles.imageContainer}>
            <img
              src="https://lh3.googleusercontent.com/pw/AP1GczMv3EWCI-UFDYo3f4w6P9SElc0iSZE3n3LVQI5mGIHJds3AHCBRoYiQns6aGDKnKG7PAxlILHw9N_tP3hChBlDy_hX3hteE2VuXya0M9dOe9quuasFy0zaRf9gsJ2Nd8E3oNPQ9oPyeOYOd3VD373qz=w643-h657-s-no-gm?authuser=0"
              alt="ascii_andrew_and_abstract_shapes"
              className={styles.image}
            />
          </div>
        </div>
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
