// src/pages/Home/Home.tsx
import React from "react";
import PageContainer from "../../components/layout/PageContainer";
import SectionContainer from "../../components/layout/SectionContainer";

import PageTitle from "../../components/typograpny/PageTitle";
import Paragraph from "../../components/typograpny/Paragraph";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  return (
    <PageContainer>
      <SectionContainer noPaddingBottom>
        <PageTitle title="Welcome" subtitle="Site EST. July 2024 " />
      </SectionContainer>
      <SectionContainer noPaddingTop>
        <div className={styles.gridLayout}>
          <div className={styles.blockOne}>
            <Paragraph>
              This website functions as a panopticon for myself; it keeps me
              accountable and motivates me to do things I have wanted to do with
              my time rather than just drift along in the passage of time. In
              the future, I would like to be able to look back and be proud of
              how I spent my finite time on this earth. I'll keep adding pages
              to the site and iterating as time passes. I grew up on the
              internet, and I care about it. This is my attempt to contribute
              something meaningful to it.
            </Paragraph>
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
            <h2 className={styles.accent}>
              <a
                href="https://www.youtube.com/watch?v=PaVNww17wJs"
                target="_blank"
                rel="noreferrer"
              >
                Illegitimi Non Carborundum
              </a>
            </h2>
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
            <Paragraph>
              This is my social media without the vanity. I own the data on this
              website, and having access to a lot of data about yourself in the
              age of AI is pretty cool. I have watched so much good film as of
              late just by feeding my reviews and a bit of prompting into a LLM.
            </Paragraph>
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
};

export default Home;
