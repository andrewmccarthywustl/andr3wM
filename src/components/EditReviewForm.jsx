import React, { useState } from "react";
import { MediaType } from "../services/api";

const EditReviewForm = ({ review, onSubmit, onCancel }) => {
  const [editedReview, setEditedReview] = useState({ ...review });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(editedReview);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-review-form">
      <input
        name="title"
        value={editedReview.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <select
        name="media_type"
        value={editedReview.media_type}
        onChange={handleChange}
        required
      >
        <option value={MediaType.MOVIE}>Movie</option>
        <option value={MediaType.SHOW}>TV Show</option>
        <option value={MediaType.BOOK}>Book</option>
      </select>
      <input
        name="rating"
        type="number"
        step="0.1"
        min="1"
        max="10"
        value={editedReview.rating}
        onChange={handleChange}
        placeholder="Rating (1-10)"
        required
      />
      <textarea
        name="review_text"
        value={editedReview.review_text}
        onChange={handleChange}
        placeholder="Review"
        required
      />
      <input
        name="image_url"
        type="url"
        value={editedReview.image_url}
        onChange={handleChange}
        placeholder="Image URL"
        required
      />
      <button type="submit">Save Changes</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EditReviewForm;
