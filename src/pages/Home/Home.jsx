// src/pages/Home/Home.jsx

import React from "react";
import styles from "./Home.module.css";
import EmailLink from "../../components/EmailLink";

function Home() {
  return (
    <div className={styles.homeContainer}>
      <section className={styles.heroSection}>
        <h1 className={styles.title}>Welcome To My Website</h1>
        <p className={styles.description}>
          I am not too sure what I am going to put here yet. Right now I got
          some movie reviews and a bare bones blog. I'll add a section on my
          youtube channel and some photography stuff once I actually start doing
          these things. I am really just using this website to have some
          motivation to do things because when something is available to the
          public it kind of keeps you and check and if you want to be cool as
          shit you gotta put stuff on there that is dope ah hell.
        </p>
        <p className={styles.description}>
          Email me if you have any recs, comments, questions or concerns.
        </p>
        <EmailLink email="andr3wM.3mail@gmail.com" />
      </section>
    </div>
  );
}

export default Home;
