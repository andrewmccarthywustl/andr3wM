// src/components/VideoList/VideoList.jsx
import React from "react";
import { FaPlay, FaRandom } from "react-icons/fa";
import styles from "./VideoList.module.css";
import typography from "../../styles/typography.module.css";

const VideoList = ({ title, videos }) => {
  const handleVideoClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleRandomVideo = () => {
    if (videos.length === 0) return;
    const randomIndex = Math.floor(Math.random() * videos.length);
    const randomVideo = videos[randomIndex];
    handleVideoClick(randomVideo.url);
  };

  return (
    <div className={styles.videoListContainer}>
      <div className={styles.titleContainer}>
        <h2 className={`${styles.sectionTitle} ${typography.heading2}`}>
          {title}
        </h2>
        <button
          onClick={handleRandomVideo}
          className={styles.randomButton}
          title="Open Random Video"
        >
          <FaRandom className={styles.randomIcon} />
          <span>Random</span>
        </button>
      </div>
      <div className={styles.videoList}>
        {videos.map((video) => (
          <div key={video.id} className={styles.videoItem}>
            <div className={styles.videoInfo}>
              <p className={styles.videoTitle}>{video.title}</p>
              <p className={styles.channelName}>{video.channel}</p>
            </div>
            <button
              onClick={() => handleVideoClick(video.url)}
              className={styles.watchButton}
            >
              <FaPlay className={styles.playIcon} />
              <span>Watch</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
