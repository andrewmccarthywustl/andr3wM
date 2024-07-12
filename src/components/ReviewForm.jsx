// src/components/ReviewForm.jsx
import React, { useState } from "react";
import { MediaType } from "../services/api";

const ReviewForm = ({ onSubmit }) => {
  const [ratingError, setRatingError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    media_type: MediaType.MOVIE, // Set a default value
    rating: "",
    review_text: "",
    image_url: "",
    director: "", // Add director field
    author: "", // Add author field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRatingError("");
    const rating = parseFloat(formData.rating);

    if (isNaN(rating) || rating < 1 || rating > 10) {
      setRatingError("Rating must be a number between 1 and 10");
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
    <form onSubmit={handleSubmit} className="review-form">
      <input
        name="title"
        type="text"
        placeholder="Title"
        required
        value={formData.title}
        onChange={handleChange}
      />
      <select
        name="media_type"
        required
        value={formData.media_type}
        onChange={handleChange}
      >
        <option value={MediaType.MOVIE}>Movie</option>
        <option value={MediaType.SHOW}>TV Show</option>
        <option value={MediaType.BOOK}>Book</option>
      </select>
      {formData.media_type === MediaType.MOVIE && (
        <input
          name="director"
          type="text"
          placeholder="Director"
          required
          value={formData.director}
          onChange={handleChange}
        />
      )}
      {formData.media_type === MediaType.BOOK && (
        <input
          name="author"
          type="text"
          placeholder="Author"
          required
          value={formData.author}
          onChange={handleChange}
        />
      )}
      <input
        name="rating"
        type="number"
        step="0.1"
        min="1"
        max="10"
        placeholder="Rating (1-10)"
        required
        value={formData.rating}
        onChange={handleChange}
      />
      {ratingError && <p className="error-message">{ratingError}</p>}
      <textarea
        name="review_text"
        placeholder="Review"
        required
        value={formData.review_text}
        onChange={handleChange}
      />
      <input
        name="image_url"
        type="url"
        placeholder="Image URL"
        required
        value={formData.image_url}
        onChange={handleChange}
      />
      <button type="submit">Add Review</button>
    </form>
  );
};

export default ReviewForm;
