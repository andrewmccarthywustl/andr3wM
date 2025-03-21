// src/components/DeleteConfirmation/DeleteConfirmation.tsx
import React, { useCallback } from "react";
import styles from "./DeleteConfirmation.module.css";

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
  itemName?: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  onConfirm,
  onCancel,
  itemName = "item",
}) => {
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only cancel if the click is directly on the overlay, not its children
      if (e.target === e.currentTarget) {
        onCancel();
      }
    },
    [onCancel]
  );

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        className={styles.confirmationBox}
        onClick={(e) => e.stopPropagation()}
      >
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
};

export default DeleteConfirmation;
