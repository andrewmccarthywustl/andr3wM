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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla et
            nostrum aperiam totam aspernatur perspiciatis explicabo molestias,
            minima iste, voluptatibus modi veritatis repellat accusamus optio
            corporis fugit illum dolore libero? Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Assumenda iste, alias voluptate et ad
            voluptatem? Sapiente, odit corporis quisquam dolorum dicta
            distinctio id quasi fugiat! Nihil consequuntur tenetur hic
            molestias. Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Voluptas vitae dolorum neque, labore ipsam reprehenderit rem
            suscipit, omnis facere dicta inventore, consequatur blanditiis
            deserunt nulla aliquam minus excepturi deleniti totam. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Vel eos reiciendis,
            tempora quasi, ea quas voluptates ipsam praesentium aliquam sequi
            tenetur minima autem harum distinctio. Quos delectus distinctio
            molestias dolores.
          </p>
        </div>

        <div className={styles.blockTwo}>
          <div className={styles.imageContainer}>
            <img
              src="https://lh3.googleusercontent.com/pw/AP1GczO4xckATWOBv3Hhmr3iDiRVAUVza-el4IBR94GEgG2THt-b7txiAyI0RbWDx8JktYWCgdA9YkgeX8jb4WW2MoYCRaZD8ZeXBHdHO828NvAOVl3U8bhSnhubPRKv281R9mMMY7_Sox9KRcSFoQuLfnNS=w416-h625-s-no-gm?authuser=0"
              alt="Movie Theater"
              className={styles.image}
            />
          </div>
        </div>

        <div className={styles.blockThree}>
          <div className={styles.imageContainer}>
            <img
              src="https://lh3.googleusercontent.com/pw/AP1GczO4xckATWOBv3Hhmr3iDiRVAUVza-el4IBR94GEgG2THt-b7txiAyI0RbWDx8JktYWCgdA9YkgeX8jb4WW2MoYCRaZD8ZeXBHdHO828NvAOVl3U8bhSnhubPRKv281R9mMMY7_Sox9KRcSFoQuLfnNS=w416-h625-s-no-gm?authuser=0"
              alt="Library"
              className={styles.image}
            />
          </div>
        </div>

        <div className={`${styles.textBlock} ${styles.blockFour}`}>
          <p className={typography.heading2}>My Collection</p>
        </div>

        <div className={styles.blockFive}>
          <div className={styles.imageContainer}>
            <img
              src="https://lh3.googleusercontent.com/pw/AP1GczO4xckATWOBv3Hhmr3iDiRVAUVza-el4IBR94GEgG2THt-b7txiAyI0RbWDx8JktYWCgdA9YkgeX8jb4WW2MoYCRaZD8ZeXBHdHO828NvAOVl3U8bhSnhubPRKv281R9mMMY7_Sox9KRcSFoQuLfnNS=w416-h625-s-no-gm?authuser=0"
              alt="TV Show"
              className={styles.image}
            />
          </div>
        </div>

        <div className={styles.blockSix}>
          <div className={styles.imageContainer}>
            <img
              src="https://lh3.googleusercontent.com/pw/AP1GczO4xckATWOBv3Hhmr3iDiRVAUVza-el4IBR94GEgG2THt-b7txiAyI0RbWDx8JktYWCgdA9YkgeX8jb4WW2MoYCRaZD8ZeXBHdHO828NvAOVl3U8bhSnhubPRKv281R9mMMY7_Sox9KRcSFoQuLfnNS=w416-h625-s-no-gm?authuser=0"
              alt="Book Collection"
              className={styles.image}
            />
          </div>
        </div>

        <div className={`${styles.textBlock} ${styles.blockSeven}`}>
          <p className={typography.bodyText}>
            Below you'll find my collection of reviews for movies, TV shows, and
            books. Each review includes a rating, detailed thoughts, and key
            information about the work.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MediaLayout;
