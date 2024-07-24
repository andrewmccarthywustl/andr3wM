// src/components/DeleteConfirmation/DeleteConfirmation.jsx

import React, { useCallback } from "react";
import styles from "./DeleteConfirmation.module.css";

function DeleteConfirmation({ onConfirm, onCancel, itemName = "item" }) {
  const handleOverlayClick = useCallback(
    (e) => {
      // Only cancel if the click is directly on the overlay, not its children
      if (e.target === e.currentTarget) {
        onCancel();
      }
    },
    [onCancel]
  );

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.confirmationBox}>
        <p>Are you sure you want to delete this {itemName}?</p>
        <div className={styles.buttonContainer}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Yes, delete
          </button>
          <button onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
