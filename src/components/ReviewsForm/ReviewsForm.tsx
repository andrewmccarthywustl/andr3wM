// src/components/ReviewsForm/ReviewsForm.tsx
import React, { useState, useEffect } from "react";
import { reviewApi, MediaType, Review } from "../../services/api";
import styles from "./ReviewsForm.module.css";

interface ReviewFormData {
  title: string;
  media_type: MediaType; // Change from string to MediaType
  rating: string;
  review_text: string;
  image_url: string;
  director?: string;
  author?: string;
}

interface ReviewsFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const ReviewsForm: React.FC<ReviewsFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    title: "",
    media_type: MediaType.MOVIE,
    rating: "",
    review_text: "",
    image_url: "",
    director: "",
    author: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Review[]>([]);
  const [selectedItem, setSelectedItem] = useState<Review | null>(null);
  const [showExisting, setShowExisting] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [allReviews, setAllReviews] = useState<Review[]>([]);

  // Fetch all reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviews = await reviewApi.getReviews();
        setAllReviews(reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load existing reviews");
      }
    };

    fetchReviews();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      // Special handling for rating to ensure it's a number
      if (name === "rating") {
        return { ...prev, [name]: value.replace(/[^0-9.]/g, "") };
      }

      // For media_type, cast the value to MediaType
      if (name === "media_type") {
        const updatedData = { ...prev, [name]: value as MediaType };
        if (value === MediaType.MOVIE) {
          updatedData.author = "";
        } else if (value === MediaType.BOOK) {
          updatedData.director = "";
        } else {
          updatedData.director = "";
          updatedData.author = "";
        }
        return updatedData;
      }

      return { ...prev, [name]: value };
    });
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, image_url: url }));
    setImagePreview(url);
  };

  const validateForm = () => {
    setError("");

    const rating = parseFloat(formData.rating);
    if (isNaN(rating) || rating < 1 || rating > 10) {
      setError("Rating must be a number between 1 and 10");
      return false;
    }

    try {
      new URL(formData.image_url);
    } catch (e) {
      setError("Please enter a valid URL for the image");
      return false;
    }

    if (formData.media_type === MediaType.MOVIE && !formData.director?.trim()) {
      setError("Director is required for movies");
      return false;
    }

    if (formData.media_type === MediaType.BOOK && !formData.author?.trim()) {
      setError("Author is required for books");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      if (selectedItem) {
        // Updating existing review
        await reviewApi.updateReview(selectedItem.id, {
          ...formData,
          rating: parseFloat(formData.rating),
        });
      } else {
        // Adding new review
        await reviewApi.addReview({
          ...formData,
          rating: parseFloat(formData.rating),
        });
      }
      onSubmit();
      resetForm();
    } catch (error) {
      console.error("Error saving review:", error);
      setError(
        error instanceof Error ? error.message : "Failed to save review"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      media_type: MediaType.MOVIE,
      rating: "",
      review_text: "",
      image_url: "",
      director: "",
      author: "",
    });
    setImagePreview("");
    setSelectedItem(null);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    // Filter existing reviews based on search term
    const filteredResults = allReviews.filter((review) =>
      review.title.toLowerCase().includes(value.toLowerCase())
    );

    setSearchResults(filteredResults);
  };

  const handleEdit = (review: Review) => {
    setFormData({
      title: review.title,
      media_type: review.media_type,
      rating: review.rating.toString(),
      review_text: review.review_text,
      image_url: review.image_url,
      director: review.director || "",
      author: review.author || "",
    });
    setImagePreview(review.image_url);
    setSelectedItem(review);
    setShowExisting(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      setIsSubmitting(true);
      await reviewApi.deleteReview(id);

      // Update local state
      setAllReviews(allReviews.filter((review) => review.id !== id));
      setSearchResults(searchResults.filter((review) => review.id !== id));

      onSubmit(); // Notify parent component
    } catch (error) {
      console.error("Delete error:", error);
      setError("Failed to delete review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formToggle}>
        <button
          type="button"
          className={`${styles.toggleButton} ${
            !showExisting ? styles.active : ""
          }`}
          onClick={() => setShowExisting(false)}
        >
          Add New
        </button>
        <button
          type="button"
          className={`${styles.toggleButton} ${
            showExisting ? styles.active : ""
          }`}
          onClick={() => setShowExisting(true)}
        >
          Edit Existing
        </button>
      </div>

      {showExisting ? (
        <div className={styles.existingSection}>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          <div className={styles.existingItems}>
            {searchResults.length > 0 ? (
              searchResults.map((review) => (
                <div key={review.id} className={styles.existingItem}>
                  <img
                    src={review.image_url}
                    alt={review.title}
                    className={styles.itemImage}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src =
                        "https://via.placeholder.com/100x150?text=No+Image";
                    }}
                  />
                  <div className={styles.itemInfo}>
                    <h3>{review.title}</h3>
                    <p>
                      {review.media_type === MediaType.MOVIE && review.director
                        ? `Director: ${review.director}`
                        : review.media_type === MediaType.BOOK && review.author
                        ? `Author: ${review.author}`
                        : review.media_type.charAt(0).toUpperCase() +
                          review.media_type.slice(1)}
                    </p>
                    <p className={styles.itemRating}>
                      Rating: {review.rating.toFixed(1)}/10
                    </p>
                    <p className={styles.itemDate}>
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      onClick={() => handleEdit(review)}
                      className={styles.editButton}
                      disabled={isSubmitting}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className={styles.deleteButton}
                      disabled={isSubmitting}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : searchTerm ? (
              <p className={styles.noResults}>No reviews match your search</p>
            ) : (
              <p className={styles.noResults}>Type to search for reviews</p>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter title..."
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="media_type">Media Type</label>
            <select
              id="media_type"
              name="media_type"
              value={formData.media_type}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            >
              <option value={MediaType.MOVIE}>Movie</option>
              <option value={MediaType.SHOW}>TV Show</option>
              <option value={MediaType.BOOK}>Book</option>
            </select>
          </div>

          {formData.media_type === MediaType.MOVIE && (
            <div className={styles.field}>
              <label htmlFor="director">Director</label>
              <input
                id="director"
                type="text"
                name="director"
                value={formData.director || ""}
                onChange={handleChange}
                required
                placeholder="Enter director's name..."
                disabled={isSubmitting}
              />
            </div>
          )}

          {formData.media_type === MediaType.BOOK && (
            <div className={styles.field}>
              <label htmlFor="author">Author</label>
              <input
                id="author"
                type="text"
                name="author"
                value={formData.author || ""}
                onChange={handleChange}
                required
                placeholder="Enter author's name..."
                disabled={isSubmitting}
              />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="rating">Rating (1-10)</label>
            <input
              id="rating"
              type="text"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="Enter a rating from 1 to 10"
              required
              disabled={isSubmitting}
            />
            <small className={styles.fieldHelp}>
              Enter a number between 1 and 10. Decimals allowed (e.g. 8.5)
            </small>
          </div>

          <div className={styles.field}>
            <label htmlFor="review_text">Review</label>
            <textarea
              id="review_text"
              name="review_text"
              value={formData.review_text}
              onChange={handleChange}
              placeholder="Write your review here..."
              rows={6}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="image_url">Image URL</label>
            <input
              id="image_url"
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleImageUrlChange}
              placeholder="https://..."
              required
              disabled={isSubmitting}
            />
            {imagePreview && (
              <div className={styles.preview}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src =
                      "https://via.placeholder.com/200x300?text=Invalid+URL";
                  }}
                />
              </div>
            )}
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttons}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : selectedItem
                ? "Update Review"
                : "Add Review"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                onCancel();
              }}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReviewsForm;
