// src/components/LoadingSpinner/LoadingSpinner.jsx
import React from "react";
import styles from "./LoadingSpinner.module.css";

function LoadingSpinner({ fullPage = true, message = null }) {
  return (
    <div
      className={`${styles.loadingContainer} ${
        fullPage ? styles.fullPage : ""
      }`}
    >
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinner}>
          <div className={styles.dot1}></div>
          <div className={styles.dot2}></div>
          <div className={styles.dot3}></div>
        </div>
        {message && <p className={styles.loadingMessage}>{message}</p>}
      </div>
    </div>
  );
}

export default LoadingSpinner;
