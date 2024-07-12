import React from "react";

const DeleteConfirmationPopup = ({ onConfirm, onCancel }) => (
  <div className="delete-confirmation-popup">
    <p>Are you sure you want to delete this review?</p>
    <button onClick={onConfirm}>Yes, delete</button>
    <button onClick={onCancel}>Cancel</button>
  </div>
);

export default DeleteConfirmationPopup;
