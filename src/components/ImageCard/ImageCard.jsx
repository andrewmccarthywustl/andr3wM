// src/components/ImageCard/ImageCard.jsx

import React from "react";
import styles from "./ImageCard.module.css";

function ImageCard({ photo, onClick }) {
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
}

export default ImageCard;
