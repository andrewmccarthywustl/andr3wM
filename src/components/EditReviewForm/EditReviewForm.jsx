// src/components/EditReviewForm/EditReviewForm.jsx

import React, { useState } from "react";
import { MediaType } from "../../services/api";
import styles from "./EditReviewForm.module.css";

function EditReviewForm({ review, onSubmit, onCancel }) {
  const [editedReview, setEditedReview] = useState({ ...review });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const rating = parseFloat(editedReview.rating);
    if (isNaN(rating) || rating < 1 || rating > 10) {
      setError("Rating must be a number between 1 and 10");
      return;
    }

    onSubmit(editedReview);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editReviewForm}>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Title
        </label>
        <input
          id="title"
          name="title"
          value={editedReview.title}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="media_type" className={styles.label}>
          Media Type
        </label>
        <select
          id="media_type"
          name="media_type"
          value={editedReview.media_type}
          onChange={handleChange}
          className={styles.select}
          required
        >
          <option value={MediaType.MOVIE}>Movie</option>
          <option value={MediaType.SHOW}>TV Show</option>
          <option value={MediaType.BOOK}>Book</option>
        </select>
      </div>

      {editedReview.media_type === MediaType.MOVIE && (
        <div className={styles.formGroup}>
          <label htmlFor="director" className={styles.label}>
            Director
          </label>
          <input
            id="director"
            name="director"
            value={editedReview.director || ""}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
      )}

      {editedReview.media_type === MediaType.BOOK && (
        <div className={styles.formGroup}>
          <label htmlFor="author" className={styles.label}>
            Author
          </label>
          <input
            id="author"
            name="author"
            value={editedReview.author || ""}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="rating" className={styles.label}>
          Rating (1-10)
        </label>
        <input
          id="rating"
          name="rating"
          type="number"
          step="0.1"
          min="1"
          max="10"
          value={editedReview.rating}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="review_text" className={styles.label}>
          Review
        </label>
        <textarea
          id="review_text"
          name="review_text"
          value={editedReview.review_text}
          onChange={handleChange}
          className={styles.textarea}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="image_url" className={styles.label}>
          Image URL
        </label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          value={editedReview.image_url}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button type="submit" className={styles.submitButton}>
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default EditReviewForm;
