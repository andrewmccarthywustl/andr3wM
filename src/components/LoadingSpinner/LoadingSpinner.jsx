// src/components/LoadingSpinner/LoadingSpinner.jsx
import React from "react";
import styles from "./LoadingSpinner.module.css";

function LoadingSpinner() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinner}>
          <div className={styles.dot1}></div>
          <div className={styles.dot2}></div>
          <div className={styles.dot3}></div>
        </div>
        <div className={styles.pulseRing}></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
