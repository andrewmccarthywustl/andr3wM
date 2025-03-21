// src/components/PhotoGrid/PhotoGrid.tsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./PhotoGrid.module.css";

interface Photo {
  id: number;
  title: string;
  url: string;
  description?: string;
  category?: string;
  created_at?: string;
}

interface PhotoGridProps {
  photos: Photo[];
  limit?: number;
  linkTo?: string;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  limit = 8,
  linkTo = "/my-works/photography",
}) => {
  if (!photos || photos.length === 0) return null;

  // Take only the first 'limit' photos
  const displayPhotos = photos.slice(0, limit);

  return (
    <div className={styles.photoGridContainer}>
      <div className={styles.photoGrid}>
        {displayPhotos.map((photo) => (
          <Link to={linkTo} key={photo.id} className={styles.photoItem}>
            <div className={styles.photoWrapper}>
              <img src={photo.url} alt={photo.title} className={styles.photo} />
              <div className={styles.photoOverlay}>
                <span className={styles.photoTitle}>{photo.title}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid;
