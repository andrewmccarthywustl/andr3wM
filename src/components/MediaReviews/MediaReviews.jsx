// src/components/MediaReviews/MediaReviews.jsx
import React, { useState, useEffect, useRef } from "react";
import { reviewApi, MediaType } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ReviewItem from "../ReviewItem/ReviewItem";
import ReviewsForm from "../ReviewsForm";
import ReviewPopup from "../ReviewPopup/ReviewPopup";
import LoadingSpinner from "../LoadingSpinner";
import SortDropdown from "../SortDropdown";
import DataExport from "../DataExport";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import styles from "./MediaReviews.module.css";
import typography from "../../styles/typography.module.css";
import useIsMobile from "../../hooks/useIsMobile";
import useLoading from "../../hooks/useLoading";

function MediaReviews() {
  const [reviews, setReviews] = useState({
    [MediaType.MOVIE]: [],
    [MediaType.SHOW]: [],
    [MediaType.BOOK]: [],
  });
  const { isLoading, error, startLoading, stopLoading, setLoadingError } =
    useLoading(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [scrollStates, setScrollStates] = useState({
    [MediaType.MOVIE]: { canScrollLeft: false, canScrollRight: true },
    [MediaType.SHOW]: { canScrollLeft: false, canScrollRight: true },
    [MediaType.BOOK]: { canScrollLeft: false, canScrollRight: true },
  });

  const defaultSortOptions = {
    [MediaType.MOVIE]: { key: "created_at", order: "desc" },
    [MediaType.SHOW]: { key: "created_at", order: "desc" },
    [MediaType.BOOK]: { key: "created_at", order: "desc" },
  };

  const [sortOptions, setSortOptions] = useState(defaultSortOptions);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const scrollReviews = (mediaType, direction) => {
    const container = document.querySelector(`#scroll-${mediaType}`);
    if (!container) return;

    const itemWidth = container.children[0]?.offsetWidth || 0;
    const gap = parseInt(getComputedStyle(container).gap) || 0;
    const scrollAmount = (itemWidth + gap) * 3;

    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const handleScroll = (mediaType, e) => {
    const container = e.target;
    const canScrollLeft = container.scrollLeft > 20;
    const canScrollRight =
      container.scrollLeft < container.scrollWidth - container.clientWidth - 20;

    setScrollStates((prev) => ({
      ...prev,
      [mediaType]: { canScrollLeft, canScrollRight },
    }));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    Object.keys(reviews).forEach((mediaType) => {
      const container = document.querySelector(`#scroll-${mediaType}`);
      checkScroll(mediaType, container);
    });
  }, [reviews]);

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

  const checkScroll = (mediaType, container) => {
    if (!container) return;
    const canScrollLeft = container.scrollLeft > 0;
    const canScrollRight =
      container.scrollLeft === 0
        ? true
        : container.scrollLeft < container.scrollWidth - container.clientWidth;

    setScrollStates((prev) => ({
      ...prev,
      [mediaType]: { canScrollLeft, canScrollRight },
    }));
  };

  const fetchReviews = async () => {
    try {
      startLoading();
      const allReviews = await reviewApi.getReviews();
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
      setLoadingError("Failed to load reviews. Please try again later.");
    } finally {
      stopLoading();
    }
  };

  const handleReviewFormSubmit = () => {
    fetchReviews(); // Refresh the reviews list
    setIsAddingReview(false);
  };

  const handleEditReview = async (updatedReview) => {
    try {
      const editedReview = await reviewApi.updateReview(
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
      setLoadingError("Failed to update review. Please try again.");
    }
  };

  const handleDeleteReview = (reviewId) => {
    setDeleteConfirmation(reviewId);
  };

  const confirmDeleteReview = async () => {
    if (!deleteConfirmation) return;
    try {
      await reviewApi.deleteReview(deleteConfirmation);
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
      setLoadingError("Failed to delete review. Please try again.");
    }
  };

  const cancelDeleteReview = () => {
    setDeleteConfirmation(null);
  };

  const handleSort = (mediaType, key, order) => {
    const container = document.querySelector(`#scroll-${mediaType}`);
    // Reset scroll position immediately
    if (container) container.scrollLeft = 0;

    setSortOptions((prevOptions) => ({
      ...prevOptions,
      [mediaType]: { key, order },
    }));

    // Force scrollLeft again after state update since React might rerender
    requestAnimationFrame(() => {
      if (container) container.scrollLeft = 0;
    });
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
  };

  const closeReviewPopup = () => {
    setIsPopupOpen(false);
    setSelectedReview(null);
  };

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading reviews..." />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.mediaReviewsContainer}>
      <div className={styles.reviewsHeader}>
        <h1 className={`${styles.bigTitle} ${typography.heading1}`}>Reviews</h1>
        {user && (
          <div className={styles.headerActions}>
            <button
              onClick={() => setIsAddingReview(!isAddingReview)}
              className={styles.addReviewButton}
            >
              {isAddingReview ? "Cancel" : "Add/Edit Review"}
            </button>
            <DataExport
              data={Object.values(reviews).flat()}
              fileName="media-reviews.json"
              label="Export Reviews"
              types={Object.values(MediaType)}
              isReviews={true}
            />
          </div>
        )}
      </div>

      {isAddingReview && user && (
        <div className={styles.reviewFormContainer}>
          <ReviewsForm
            onSubmit={handleReviewFormSubmit}
            onCancel={() => setIsAddingReview(false)}
          />
        </div>
      )}

      {[MediaType.MOVIE, MediaType.SHOW, MediaType.BOOK].map((mediaType) => (
        <section key={mediaType} className={styles.reviewSection}>
          <div className={styles.sectionHeader}>
            <h2 className={`${styles.sectionTitle} ${typography.heading2}`}>
              {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} Reviews
            </h2>
            <div className={styles.sortContainer}>
              <SortDropdown
                onSort={(key, order) => handleSort(mediaType, key, order)}
                currentSort={sortOptions[mediaType]}
              />
            </div>
          </div>
          <div className={styles.reviewListContainer}>
            <div
              className={`${styles.gradientLeft}`}
              style={{
                opacity: scrollStates[mediaType].canScrollLeft ? 1 : 0,
              }}
            />
            {scrollStates[mediaType].canScrollLeft && (
              <IoChevronBack
                className={`${styles.scrollArrow} ${styles.scrollArrowLeft}`}
                onClick={() => scrollReviews(mediaType, "left")}
              />
            )}
            <div
              className={`${styles.gradientRight}`}
              style={{
                opacity: scrollStates[mediaType].canScrollRight ? 1 : 0,
              }}
            />
            {scrollStates[mediaType].canScrollRight && (
              <IoChevronForward
                className={`${styles.scrollArrow} ${styles.scrollArrowRight}`}
                onClick={() => scrollReviews(mediaType, "right")}
              />
            )}
            <div
              id={`scroll-${mediaType}`}
              className={styles.reviewList}
              onScroll={(e) => handleScroll(mediaType, e)}
            >
              {reviews[mediaType].length > 0 ? (
                reviews[mediaType].map((review, index) => (
                  <ReviewItem
                    key={review.id}
                    review={review}
                    onClick={openReviewPopup}
                    index={index}
                  />
                ))
              ) : (
                <div className={styles.emptyReviews}>
                  <p>No {mediaType} reviews yet</p>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}
      {selectedReview && (
        <ReviewPopup
          review={selectedReview}
          onClose={closeReviewPopup}
          isOpen={isPopupOpen && selectedReview !== null}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}

export default MediaReviews;
