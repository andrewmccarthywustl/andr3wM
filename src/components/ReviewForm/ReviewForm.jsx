// src/components/ReviewForm/ReviewForm.jsx

import React, { useState } from "react";
import { MediaType } from "../../services/api";
import styles from "./ReviewForm.module.css";

function ReviewForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    media_type: MediaType.MOVIE,
    rating: "",
    review_text: "",
    image_url: "",
    director: "",
    author: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const rating = parseFloat(formData.rating);
    if (isNaN(rating) || rating < 1 || rating > 10) {
      setError("Rating must be a number between 1 and 10");
      return;
    }

    onSubmit({
      ...formData,
      rating: rating,
    });

    // Reset form after submission
    setFormData({
      title: "",
      media_type: MediaType.MOVIE,
      rating: "",
      review_text: "",
      image_url: "",
      director: "",
      author: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.reviewForm}>
      <h2 className={styles.formTitle}>Add New Review</h2>

      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="media_type" className={styles.label}>
          Media Type
        </label>
        <select
          id="media_type"
          name="media_type"
          value={formData.media_type}
          onChange={handleChange}
          required
          className={styles.select}
        >
          <option value={MediaType.MOVIE}>Movie</option>
          <option value={MediaType.SHOW}>TV Show</option>
          <option value={MediaType.BOOK}>Book</option>
        </select>
      </div>

      {formData.media_type === MediaType.MOVIE && (
        <div className={styles.formGroup}>
          <label htmlFor="director" className={styles.label}>
            Director
          </label>
          <input
            id="director"
            name="director"
            type="text"
            value={formData.director}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
      )}

      {formData.media_type === MediaType.BOOK && (
        <div className={styles.formGroup}>
          <label htmlFor="author" className={styles.label}>
            Author
          </label>
          <input
            id="author"
            name="author"
            type="text"
            value={formData.author}
            onChange={handleChange}
            required
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
          value={formData.rating}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="review_text" className={styles.label}>
          Review
        </label>
        <textarea
          id="review_text"
          name="review_text"
          value={formData.review_text}
          onChange={handleChange}
          required
          className={styles.textarea}
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
          value={formData.image_url}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.submitButton}>
        Add Review
      </button>
    </form>
  );
}

export default ReviewForm;
