// FavoritesSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import SquareScrollList from "../SquareScrollList";
import CircularScrollList from "../CircularScrollList";
import VideoList from "../VideoList";
import FavoritesForm from "../FavoritesForm";
import { api, FavoriteType } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../LoadingSpinner";
import styles from "./FavoritesSection.module.css";
import typography from "../../styles/typography.module.css";

const FavoritesSection = () => {
  // State management
  const [favorites, setFavorites] = useState({
    [FavoriteType.ALBUM]: [],
    [FavoriteType.ARTIST]: [],
    [FavoriteType.PODCAST]: [],
    [FavoriteType.CHANNEL]: [],
    [FavoriteType.VIDEO]: [],
  });
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch favorites data
  const fetchFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getFavorites();

      // Sort and categorize favorites by type
      const categorized = Object.values(FavoriteType).reduce((acc, type) => {
        acc[type] = data
          .filter((item) => item.type === type)
          .sort((a, b) => a.position - b.position);
        return acc;
      }, {});

      setFavorites(categorized);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError("Failed to load favorites. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Form submission handler
  const handleFavoriteSubmit = async () => {
    await fetchFavorites();
    setIsAddingFavorite(false);
  };

  // Data formatting functions
  const formatSquareData = (items) =>
    items.map((item) => ({
      id: item.id,
      name: item.name,
      secondaryName: item.secondary_name,
      imageUrl: item.image_url,
      externalUrl: item.external_url,
      position: item.position,
    }));

  const formatCircularData = (items) =>
    items.map((item) => ({
      id: item.id,
      name: item.name,
      imageUrl: item.image_url,
      url: item.external_url,
      position: item.position,
    }));

  const formatVideoData = (items) =>
    items.map((item) => ({
      id: item.id,
      title: item.name,
      channel: item.secondary_name,
      url: item.external_url,
      position: item.position,
    }));

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button onClick={fetchFavorites} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  const isEmptyFavorites = Object.values(favorites).every(
    (list) => list.length === 0
  );

  return (
    <div className={styles.favoritesSection}>
      <div className={styles.favoritesHeader}>
        <h1 className={`${styles.sectionTitle} ${typography.heading1}`}>
          Favorites
        </h1>
        {user && (
          <button
            onClick={() => setIsAddingFavorite(true)}
            className={styles.addButton}
          >
            Add Favorite
          </button>
        )}
      </div>

      {isAddingFavorite && (
        <div className={styles.formContainer}>
          <FavoritesForm
            onSubmit={handleFavoriteSubmit}
            onCancel={() => setIsAddingFavorite(false)}
          />
        </div>
      )}

      <div className={styles.listContainer}>
        {/* Albums Section */}
        {favorites[FavoriteType.ALBUM].length > 0 && (
          <SquareScrollList
            title="Albums"
            items={formatSquareData(favorites[FavoriteType.ALBUM])}
            buttonText="Listen to Album"
          />
        )}

        {/* Musicians Section */}
        {favorites[FavoriteType.ARTIST].length > 0 && (
          <CircularScrollList
            title="Music Artists"
            items={formatCircularData(favorites[FavoriteType.ARTIST])}
            itemType={FavoriteType.ARTIST}
          />
        )}

        {/* Podcasts Section */}
        {favorites[FavoriteType.PODCAST].length > 0 && (
          <SquareScrollList
            title="Podcasts"
            items={formatSquareData(favorites[FavoriteType.PODCAST])}
            buttonText="Open Podcast's Website"
          />
        )}

        {/* YouTube Channels Section */}
        {favorites[FavoriteType.CHANNEL].length > 0 && (
          <CircularScrollList
            title="YouTube Channels"
            items={formatCircularData(favorites[FavoriteType.CHANNEL])}
            itemType={FavoriteType.CHANNEL}
          />
        )}

        {/* Videos Section */}
        {favorites[FavoriteType.VIDEO].length > 0 && (
          <VideoList
            title="Videos"
            videos={formatVideoData(favorites[FavoriteType.VIDEO])}
          />
        )}

        {/* Empty State */}
        {isEmptyFavorites && (
          <div className={styles.emptyState}>
            <p>No favorites added yet.</p>
            {user && (
              <button
                onClick={() => setIsAddingFavorite(true)}
                className={styles.addButton}
              >
                Add Your First Favorite
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesSection;
