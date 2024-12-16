// src/pages/Home/Home.jsx

import React from "react";
import styles from "./Home.module.css";
import EmailLink from "../../components/EmailLink";

function Home() {
  return (
    <div className={styles.homeContainer}>
      <section className={styles.heroSection}>
        <img
          className={styles.heroImage}
          src="website_image.png"
          alt="Profile Image"
        />
        <h1 className={styles.title}>Welcome To My Website</h1>
        <p className={styles.description}>
          Im just putting out stuff on here. Got this to keep myself in check
          and add some stakes to the menial things I do like reading and
          watching movies, thinking and taking photos.
        </p>
        <EmailLink email="andr3wM.3mail@gmail.com" />
      </section>
    </div>
  );
}

export default Home;
