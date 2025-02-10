import React from "react";
import styles from "./Favorites.module.css";

function Favorites() {
  return (
    <div className={styles.favoritesContainer}>
      <h1>Things I like</h1>
      <p>
        Most of this website right now is defined by things I like. I've spent
        more time reviewing bullshit on this site than doing contributing real
        content. So lets continue that trend with some more bs.
      </p>
      <h2>Youtube Channels</h2>
      <p>
        Youtube is the only social media platrorm I respect. There are great
        creatives and you could turn off your viewing history and make it so you
        only see the channels you are subscribed to, so you have the ability to
        only see the content you subcribed to instead of being sucked into a
        rabit hole of short form content
        <ul>
          <li>
            <a target="_blank" href="https://www.youtube.com/@OrdinaryThings">
              Ordinary things
            </a>
          </li>
        </ul>
      </p>
      <h2>Youtube Videos</h2>
      <ul>
        <li>
          <a target="_blank" href="https://www.youtube.com/watch?v=7xTGNNLPyMI">
            Three and a half hour goated summary of LLMs
          </a>
        </li>
      </ul>
      <h2>Podcasts</h2>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://www.theringer.com/podcasts/plain-english-with-derek-thompson"
          >
            Plain English
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Favorites;
