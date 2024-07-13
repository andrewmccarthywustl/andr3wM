import React, { useState, useEffect } from "react";
import { api, MediaType } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewForm";
import ReviewPopup from "./ReviewPopup";
import DeleteConfirmationPopup from "./DeleteConfirmationPopup";
import "./MediaReviews.css";

const MediaReviews = () => {
  const [reviews, setReviews] = useState({
    [MediaType.MOVIE]: [],
    [MediaType.SHOW]: [],
    [MediaType.BOOK]: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const allReviews = await api.getReviews();
      const categorizedReviews = {
        [MediaType.MOVIE]: allReviews.filter(
          (review) => review.media_type === MediaType.MOVIE
        ),
        [MediaType.SHOW]: allReviews.filter(
          (review) => review.media_type === MediaType.SHOW
        ),
        [MediaType.BOOK]: allReviews.filter(
          (review) => review.media_type === MediaType.BOOK
        ),
      };
      setReviews(categorizedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      // Ensure the media_type is valid
      if (!Object.values(MediaType).includes(reviewData.media_type)) {
        throw new Error("Invalid media type");
      }

      const addedReview = await api.addReview({
        ...reviewData,
        director:
          reviewData.media_type === MediaType.MOVIE
            ? reviewData.director
            : null,
        author:
          reviewData.media_type === MediaType.BOOK ? reviewData.author : null,
      });
      setReviews((prevReviews) => ({
        ...prevReviews,
        [addedReview.media_type]: [
          addedReview,
          ...prevReviews[addedReview.media_type],
        ],
      }));
    } catch (error) {
      console.error("Error adding review:", error);
      setError("Failed to add review. Please try again.");
    }
  };

  const handleEditReview = async (updatedReview) => {
    try {
      const editedReview = await api.updateReview(updatedReview.id, {
        ...updatedReview,
        director:
          updatedReview.media_type === MediaType.MOVIE
            ? updatedReview.director
            : null,
        author:
          updatedReview.media_type === MediaType.BOOK
            ? updatedReview.author
            : null,
      });
      setReviews((prevReviews) => {
        const updatedReviews = { ...prevReviews };
        Object.keys(updatedReviews).forEach((mediaType) => {
          updatedReviews[mediaType] = updatedReviews[mediaType].map((review) =>
            review.id === editedReview.id ? editedReview : review
          );
        });
        return updatedReviews;
      });
      setSelectedReview(editedReview);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating review:", error);
      setError("Failed to update review. Please try again.");
    }
  };

  const handleDeleteReview = (reviewId) => {
    setDeleteConfirmation(reviewId);
  };

  const confirmDeleteReview = async () => {
    if (!deleteConfirmation) return;

    try {
      await api.deleteReview(deleteConfirmation);
      setReviews((prevReviews) => {
        const updatedReviews = { ...prevReviews };
        Object.keys(updatedReviews).forEach((mediaType) => {
          updatedReviews[mediaType] = updatedReviews[mediaType].filter(
            (review) => review.id !== deleteConfirmation
          );
        });
        return updatedReviews;
      });
      setSelectedReview(null);
      setDeleteConfirmation(null);
    } catch (error) {
      console.error("Error deleting review:", error);
      setError("Failed to delete review. Please try again.");
    }
  };

  const cancelDeleteReview = () => {
    setDeleteConfirmation(null);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="media-reviews">
      {user && <ReviewForm onSubmit={handleReviewSubmit} />}
      {[MediaType.MOVIE, MediaType.SHOW, MediaType.BOOK].map((mediaType) => (
        <section key={mediaType} className={`${mediaType}-reviews`}>
          <h2>
            {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} Reviews
          </h2>
          <div className="scroll-container">
            {reviews[mediaType].map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                onClick={() => setSelectedReview(review)}
              />
            ))}
          </div>
        </section>
      ))}
      {selectedReview && (
        <ReviewPopup
          review={selectedReview}
          onClose={() => {
            setSelectedReview(null);
            setIsEditing(false);
          }}
          onEdit={handleEditReview}
          onDelete={handleDeleteReview}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          currentUser={user}
        />
      )}
      {deleteConfirmation && (
        <DeleteConfirmationPopup
          onConfirm={confirmDeleteReview}
          onCancel={cancelDeleteReview}
        />
      )}
    </div>
  );
};

export default MediaReviews;
