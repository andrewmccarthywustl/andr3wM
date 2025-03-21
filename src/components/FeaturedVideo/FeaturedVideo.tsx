// src/components/FeaturedVideo/FeaturedVideo.tsx
import React from "react";
import styles from "./FeaturedVideo.module.css";

interface VideoProps {
  id?: string;
  title: string;
  thumbnailUrl: string;
  url: string;
  publishedAt?: string;
}

interface FeaturedVideoProps {
  video: VideoProps;
}

const FeaturedVideo: React.FC<FeaturedVideoProps> = ({ video }) => {
  if (!video) return null;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";

    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateString)
        .toLocaleDateString(undefined, options)
        .toLowerCase();
    } catch (e) {
      return "";
    }
  };

  return (
    <div className={styles.featuredSection}>
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.featuredCard}
      >
        <div className={styles.videoContainer}>
          <div className={styles.thumbnailContainer}>
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className={styles.thumbnail}
            />
            <div className={styles.playButton}>
              <span className={styles.playIcon}>▶</span>
            </div>
          </div>
        </div>

        <div className={styles.videoInfo}>
          <h3 className={styles.videoTitle}>{video.title}</h3>
          {video.publishedAt && (
            <p className={styles.videoDate}>{formatDate(video.publishedAt)}</p>
          )}
        </div>
      </a>
    </div>
  );
};

export default FeaturedVideo;
