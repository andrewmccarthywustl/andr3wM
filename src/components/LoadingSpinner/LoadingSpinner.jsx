// src/components/LoadingSpinner/LoadingSpinner.jsx

import React from "react";
import styles from "./LoadingSpinner.module.css";

function LoadingSpinner() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinnerWrapper}>
        <div className={styles.loadingSpinner}></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
