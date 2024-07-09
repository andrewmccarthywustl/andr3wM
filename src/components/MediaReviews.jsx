import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./MediaReviews.css";

const MediaReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [mediaType, setMediaType] = useState("all");
  const [imageFile, setImageFile] = useState(null);
  const { user } = useAuth(); // Now this should work

  useEffect(() => {
    fetchReviews();
  }, [mediaType]);

  const fetchReviews = async () => {
    try {
      const fetchedReviews = await api.getReviews(
        mediaType === "all" ? null : mediaType
      );
      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    let imageUrl = "";
    if (imageFile) {
      try {
        imageUrl = await api.uploadImage(imageFile);
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    const newReview = {
      title: form.title.value,
      media_type: form.media_type.value,
      author_or_director: form.author_or_director.value,
      release_year: parseInt(form.release_year.value),
      rating: parseFloat(form.rating.value),
      review_text: form.review_text.value,
      image_url: imageUrl,
    };

    try {
      await api.addReview(newReview);
      fetchReviews();
      form.reset();
      setImageFile(null);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleReviewEdit = async (id, updatedReview) => {
    try {
      await api.updateReview(id, updatedReview);
      fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleReviewDelete = async (id) => {
    try {
      await api.deleteReview(id);
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="media-reviews">
      <h2>Media Reviews</h2>
      <select value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
        <option value="all">All</option>
        <option value="book">Books</option>
        <option value="movie">Movies</option>
      </select>
      {user && (
        <form onSubmit={handleReviewSubmit}>
          <input name="title" type="text" placeholder="Title" required />
          <select name="media_type" required>
            <option value="book">Book</option>
            <option value="movie">Movie</option>
          </select>
          <input
            name="author_or_director"
            type="text"
            placeholder="Author/Director"
            required
          />
          <input
            name="release_year"
            type="number"
            placeholder="Release Year"
            required
          />
          <input
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            placeholder="Rating"
            required
          />
          <textarea name="review_text" placeholder="Review Text" required />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button type="submit">Add Review</button>
        </form>
      )}
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <h3>{review.title}</h3>
            {review.image_url && (
              <img
                src={review.image_url}
                alt={review.title}
                style={{ maxWidth: "200px" }}
              />
            )}
            <p>Type: {review.media_type}</p>
            <p>
              {review.media_type === "book" ? "Author" : "Director"}:{" "}
              {review.author_or_director}
            </p>
            <p>Release Year: {review.release_year}</p>
            <p>Rating: {review.rating}/5</p>
            <p>{review.review_text}</p>
            <p>Created: {new Date(review.created_at).toLocaleDateString()}</p>
            <p>
              Last Updated: {new Date(review.updated_at).toLocaleDateString()}
            </p>
            {user?.id === review.reviewer && (
              <>
                <button
                  onClick={() =>
                    handleReviewEdit(review.id, {
                      ...review,
                      review_text: prompt("Edit review:", review.review_text),
                    })
                  }
                >
                  Edit
                </button>
                <button onClick={() => handleReviewDelete(review.id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MediaReviews;
