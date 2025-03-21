// src/components/LoadingSpinner/LoadingSpinner.tsx
import React from "react";
import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  fullPage?: boolean;
  message?: string | null;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullPage = true,
  message = null,
}) => {
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
};

export default LoadingSpinner;
