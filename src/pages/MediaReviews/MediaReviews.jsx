// src/pages/MediaReviews/MediaReviews.jsx

import React, { useState, useEffect } from "react";
import { api, MediaType } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ReviewItem from "../../components/ReviewItem/ReviewItem";
import ReviewForm from "../../components/ReviewForm";
import ReviewPopup from "../../components/ReviewPopup/ReviewPopup";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import LoadingSpinner from "../../components/LoadingSpinner";
import styles from "./MediaReviews.module.css";

function MediaReviews() {
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
      const addedReview = await api.addReview(reviewData);
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
      const editedReview = await api.updateReview(
        updatedReview.id,
        updatedReview
      );
      setReviews((prevReviews) => {
        const updatedReviews = { ...prevReviews };
        updatedReviews[editedReview.media_type] = updatedReviews[
          editedReview.media_type
        ].map((review) =>
          review.id === editedReview.id ? editedReview : review
        );
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

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.mediaReviews}>
      {user && <ReviewForm onSubmit={handleReviewSubmit} />}
      {[MediaType.MOVIE, MediaType.SHOW, MediaType.BOOK].map((mediaType) => (
        <section key={mediaType} className={styles.reviewSection}>
          <h2 className={styles.sectionTitle}>
            {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} Reviews
          </h2>
          <div className={styles.reviewList}>
            {reviews[mediaType].map((review, index) => (
              <ReviewItem
                key={review.id}
                review={review}
                onClick={() => setSelectedReview(review)}
                index={index}
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
        <DeleteConfirmation
          onConfirm={confirmDeleteReview}
          onCancel={cancelDeleteReview}
          itemName="review"
        />
      )}
    </div>
  );
}

export default MediaReviews;
