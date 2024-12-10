// src/pages/MediaReviews/MediaReviews.jsx

import React, { useState, useEffect } from "react";
import { api, MediaType } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ReviewItem from "../../components/ReviewItem/ReviewItem";
import ReviewForm from "../../components/ReviewForm";
import ReviewPopup from "../../components/ReviewPopup/ReviewPopup";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import LoadingSpinner from "../../components/LoadingSpinner";
import SortDropdown from "../../components/SortDropdown";
import useIsMobile from "../../hooks/useIsMobile";
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
  const [animateItems, setAnimateItems] = useState({
    [MediaType.MOVIE]: false,
    [MediaType.SHOW]: false,
    [MediaType.BOOK]: false,
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const defaultSortOptions = {
    [MediaType.MOVIE]: { key: "created_at", order: "desc" },
    [MediaType.SHOW]: { key: "created_at", order: "desc" },
    [MediaType.BOOK]: { key: "created_at", order: "desc" },
  };

  const [sortOptions, setSortOptions] = useState(defaultSortOptions);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    const sortedReviews = {};
    Object.keys(reviews).forEach((mediaType) => {
      sortedReviews[mediaType] = sortReviews(
        reviews[mediaType],
        sortOptions[mediaType]
      );
    });
    setReviews(sortedReviews);
  }, [sortOptions]);

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
      setAnimateItems({
        [MediaType.MOVIE]: true,
        [MediaType.SHOW]: true,
        [MediaType.BOOK]: true,
      });
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
      setIsAddingReview(false);
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

  const handleSort = (mediaType, key, order) => {
    setSortOptions((prevOptions) => ({
      ...prevOptions,
      [mediaType]: { key, order },
    }));
    setAnimateItems((prevState) => ({
      ...prevState,
      [mediaType]: false,
    }));
    setTimeout(() => {
      setAnimateItems((prevState) => ({
        ...prevState,
        [mediaType]: true,
      }));
    }, 50);
  };

  const sortReviews = (reviewsToSort, sortOption) => {
    return [...reviewsToSort].sort((a, b) => {
      if (sortOption.key === "title") {
        return sortOption.order === "asc"
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      } else if (sortOption.key === "created_at") {
        return sortOption.order === "asc"
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at);
      } else if (sortOption.key === "rating") {
        return sortOption.order === "asc"
          ? a.rating - b.rating
          : b.rating - a.rating;
      }
      return 0;
    });
  };

  const openReviewPopup = (review) => {
    setSelectedReview(review);
    setIsPopupOpen(true);
    if (isMobile) {
      document.body.classList.add("no-scroll");
    }
  };

  const closeReviewPopup = () => {
    setIsPopupOpen(false);
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      setSelectedReview(null);
      setIsEditing(false);
    }, 300);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.mediaReviews}>
      {user && (
        <div className={styles.addReviewSection}>
          <button
            onClick={() => setIsAddingReview(!isAddingReview)}
            className={styles.addReviewButton}
          >
            {isAddingReview ? "Cancel" : "Add New Review"}
          </button>
          {isAddingReview && <ReviewForm onSubmit={handleReviewSubmit} />}
        </div>
      )}
      {[MediaType.MOVIE, MediaType.SHOW, MediaType.BOOK].map((mediaType) => (
        <section key={mediaType} className={styles.reviewSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} Reviews
            </h2>
            <div className={styles.sortContainer}>
              <SortDropdown
                onSort={(key, order) => handleSort(mediaType, key, order)}
                currentSort={sortOptions[mediaType]}
              />
            </div>
          </div>
          <div className={styles.reviewList}>
            {reviews[mediaType].map((review, index) => (
              <ReviewItem
                key={review.id}
                review={review}
                onClick={openReviewPopup}
                index={index}
                animate={animateItems[mediaType]}
              />
            ))}
          </div>
        </section>
      ))}
      {selectedReview && (
        <ReviewPopup
          review={selectedReview}
          onClose={closeReviewPopup}
          onEdit={handleEditReview}
          onDelete={handleDeleteReview}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          currentUser={user}
          isOpen={isPopupOpen}
          isMobile={isMobile}
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
