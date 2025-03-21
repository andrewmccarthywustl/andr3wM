// src/components/ImageCard/ImageCard.tsx
import React from "react";
import styles from "./ImageCard.module.css";

interface Photo {
  id: number;
  title: string;
  url: string;
  description?: string;
  category?: string;
  created_at: string;
}

interface ImageCardProps {
  photo: Photo;
  onClick: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ photo, onClick }) => {
  return (
    <div className={styles.imageCard} onClick={onClick}>
      <img src={photo.url} alt={photo.title} className={styles.image} />
      <div className={styles.overlay}>
        <h3 className={styles.title}>{photo.title}</h3>
        <p className={styles.date}>
          {new Date(photo.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ImageCard;
