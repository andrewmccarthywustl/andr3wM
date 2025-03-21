// src/components/VideoGrid/VideoGrid.tsx
import React from "react";
import styles from "./VideoGrid.module.css";

interface VideoItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  url: string;
  publishedAt?: string;
}

interface VideoGridProps {
  videos: VideoItem[];
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos }) => {
  if (!videos || videos.length === 0) return null;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";

    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
      };
      return new Date(dateString)
        .toLocaleDateString(undefined, options)
        .toLowerCase();
    } catch (e) {
      return "";
    }
  };

  return (
    <div className={styles.videoGridSection}>
      <div className={styles.videoGrid}>
        {videos.map((video) => (
          <a
            key={video.id}
            className={styles.videoItem}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.thumbnailContainer}>
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className={styles.thumbnailImage}
              />
              <div className={styles.playButton}>
                <span className={styles.playIcon}>▶</span>
              </div>
            </div>
            <h3 className={styles.videoTitle}>{video.title}</h3>
            {video.publishedAt && (
              <p className={styles.videoDate}>
                {formatDate(video.publishedAt)}
              </p>
            )}
          </a>
        ))}
      </div>

      <div className={styles.horizontalLine}></div>
    </div>
  );
};

export default VideoGrid;
