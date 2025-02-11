// src/components/MediaLayout/MediaLayout.jsx
import React from "react";
import styles from "./MediaLayout.module.css";
import typography from "../../styles/typography.module.css";

function MediaLayout() {
  return (
    <div className={styles.mediaContainer}>
      <div className={styles.gridLayout}>
        <div className={styles.titleArea}>
          <h1 className={typography.heading1}>Media</h1>
        </div>

        <div className={`${styles.textBlock} ${styles.blockOne}`}>
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
          <hr />
          <p className={typography.bodyText}>
            This page is still quite incomplete; I'll refine it over time, and
            that text block above is some temporary absolute yappage.
          </p>
        </div>

        <div className={styles.blockTwo}>
          <div className={styles.imageContainer}>
            <img
              src="https://lh3.googleusercontent.com/pw/AP1GczM1ZYa8hrQmAo1tj3UpVAnJDF8LsiUZiuk6e0YkEsegQg_Okquk8e03rdDTCMg8PPV8MUYdDP3h53zPf2vPLnRCDnp8gfvlc0u5zGALxIP_olN9XQ_lycT8wgqwkXA1jPzD4ZNrlMlx0NWFD-2OrEDn=w643-h657-s-no-gm?authuser=0"
              alt="ascii_andrew_and_abstract_shapes"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaLayout;
