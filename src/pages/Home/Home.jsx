// src/pages/Home/Home.jsx
import React, { useState, useEffect } from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import LoadingSpinner from "../../components/LoadingSpinner";
import styles from "./Home.module.css";
import typography from "../../styles/typography.module.css";

function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or perform actual data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading homepage..." />;
  }

  return (
    <div className={styles.homeContainer}>
      <PageTitle
        title="Welcome To My Website"
        subtitle="A personal space for my creative work, thoughts, and interests"
      />

      <div className={styles.gridLayout}>
        <div className={styles.blockOne}>
          <p className={typography.bodyText}>
            This website functions as a panopticon for myself; it keeps me
            accountable and motivates me to do things I have wanted to do with
            my time rather than just drift along in the passage of time. In the
            future, I would like to be able to look back and be proud of how I
            spent my finite time on this earth. I'll keep adding pages to the
            site and iterating as time passes. I grew up on the internet, and I
            care about it. This is my attempt to contribute something meaningful
            to it.
          </p>
        </div>

        <div className={styles.blockTwo}>
          <div className={styles.imageContainer}>
            <img
              src="https://lh3.googleusercontent.com/pw/AP1GczPs7QXkj1wt3YyVTriyiibY5Dp2RJex-7sTFJc9-zoztK-w72d-igzGvtDPOC5KliF3dgvbWQ_LD82qFbIuBx1pkpiWZ5IW7g9kM4-RVvB6oKCQ723D8HkNf7QuEggIM5Z2uuPhMJdxVqCGJ6OIp6Ru=w1000-h1084-s-no-gm?authuser=0"
              alt="Panopticon"
              className={styles.image}
            />
          </div>
        </div>

        <div className={styles.blockThree}>
          <div className={styles.imageContainer}>
            <img
              src="https://lh3.googleusercontent.com/pw/AP1GczOLpdgIbZo6BTy2dI5aRNX_K66rJg3QeMMX1O1ATyZOTIlJ5AMQdwzUdleJVj9WprJ_xZNWH75ao7vuU7yt3fahAqLdrSsxbaZp8lZvgS9H_lQ1EV7B9qVJT724t_mpU3b8E614NwjqgWDCmUKdrHGf=w784-h1252-s-no-gm?authuser=0"
              alt="Highland Cow"
              className={styles.image}
            />
          </div>
        </div>

        <div className={styles.blockFour}>
          <p className={typography.heading1}>
            <a
              href="https://www.youtube.com/watch?v=PaVNww17wJs"
              target="_blank"
              rel="noreferrer"
            >
              Illegitimi Non Carborundum
            </a>
          </p>
        </div>

        <div className={styles.blockFive}>
          <div className={styles.imageContainer}>
            <img
              src="https://lh3.googleusercontent.com/pw/AP1GczOl4i-isPIHD_fLaY-BP-wLez9rLSCZG3Kw07j57h6plyTYFiXpJl_qOx1A26vEKaWZHv6688LF9uvrrR0JEGICIS2PPre13t_5kLuK5gSUVFMhna-9lJUqedij9NHiqJReWOs-3mtwRQZqwYohyuR4=w1000-h1000-s-no-gm?authuser=0"
              alt="Lighthouse"
              className={styles.image}
            />
          </div>
        </div>

        <div className={styles.blockSix}>
          <div className={styles.imageContainer}>
            <img
              src="https://lh3.googleusercontent.com/pw/AP1GczMi9tTODeYUPVLjG_mLF4Xe3mca9vXgNAKjnEqV-ueVTlD_MpvoN6NQXgj_6wPGmzrtS3_YqZX07nHAufSd2GBnz8IDe4YfHdVtsAuXFvzoYNXXnAlXBkEKpB0xvqZvpT8h933ANyTlpjtvO-V_1yEs=w1200-h700-s-no-gm?authuser=0"
              alt="Desert Landscape"
              className={styles.image}
            />
          </div>
        </div>

        <div className={styles.blockSeven}>
          <p className={typography.bodyText}>
            This is my social media without the vanity. I own the data on this
            website, and having access to a lot of data about yourself in the
            age of AI is pretty cool. I have watched so much good film as of
            late just by feeding my reviews and a bit of prompting into a LLM.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
