// src/components/FavoritesSection/FavoritesSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import SquareScrollList from "../SquareScrollList";
import CircularScrollList from "../CircularScrollList";
import ListWithPagination from "../ListWithPagination";
import FavoritesForm from "../FavoritesForm";
import DataExport from "../DataExport";
import { favoriteApi, FavoriteType } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../LoadingSpinner";
import { FaPlay } from "react-icons/fa";
import styles from "./FavoritesSection.module.css";
import typography from "../../styles/typography.module.css";
import useLoading from "../../hooks/useLoading";

const FavoritesSection = () => {
  const [favorites, setFavorites] = useState({
    [FavoriteType.ALBUM]: [],
    [FavoriteType.ARTIST]: [],
    [FavoriteType.PODCAST]: [],
    [FavoriteType.CHANNEL]: [],
    [FavoriteType.VIDEO]: [],
    [FavoriteType.SONG]: [],
  });
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);
  const { isLoading, error, startLoading, stopLoading, setLoadingError } =
    useLoading(true);
  const { user } = useAuth();

  const fetchFavorites = useCallback(async () => {
    try {
      startLoading();
      const data = await favoriteApi.getFavorites();

      const categorized = Object.values(FavoriteType).reduce((acc, type) => {
        acc[type] = data
          .filter((item) => item.type === type)
          .sort((a, b) => a.position - b.position);
        return acc;
      }, {});

      setFavorites(categorized);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setLoadingError("Failed to load favorites. Please try again later.");
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, setLoadingError]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

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

  const formatListData = (items) =>
    items.map((item) => ({
      id: item.id,
      title: item.name,
      subtitle: item.secondary_name,
      url: item.external_url,
      position: item.position,
    }));

  // Random selection handlers
  const handleRandomAlbum = () => {
    const albums = favorites[FavoriteType.ALBUM];
    if (albums.length === 0) return;
    const randomAlbum = albums[Math.floor(Math.random() * albums.length)];
    window.open(randomAlbum.external_url, "_blank", "noopener,noreferrer");
  };

  const handleRandomArtist = () => {
    const artists = favorites[FavoriteType.ARTIST];
    if (artists.length === 0) return;
    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
    window.open(randomArtist.external_url, "_blank", "noopener,noreferrer");
  };

  const handleRandomPodcast = () => {
    const podcasts = favorites[FavoriteType.PODCAST];
    if (podcasts.length === 0) return;
    const randomPodcast = podcasts[Math.floor(Math.random() * podcasts.length)];
    window.open(randomPodcast.external_url, "_blank", "noopener,noreferrer");
  };

  const handleRandomChannel = () => {
    const channels = favorites[FavoriteType.CHANNEL];
    if (channels.length === 0) return;
    const randomChannel = channels[Math.floor(Math.random() * channels.length)];
    window.open(randomChannel.external_url, "_blank", "noopener,noreferrer");
  };

  const handleRandomVideo = () => {
    const videos = favorites[FavoriteType.VIDEO];
    if (videos.length === 0) return;
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    window.open(randomVideo.external_url, "_blank", "noopener,noreferrer");
  };

  const handleRandomSong = () => {
    const songs = favorites[FavoriteType.SONG];
    if (songs.length === 0) return;
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    window.open(randomSong.external_url, "_blank", "noopener,noreferrer");
  };

  const handleActionClick = (item) => {
    window.open(item.url, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner fullPage message="Loading your favorites..." />
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
        <div className={styles.headerActions}>
          {user && (
            <button
              onClick={() => setIsAddingFavorite(!isAddingFavorite)}
              className={styles.addButton}
            >
              {isAddingFavorite ? "Cancel" : "Add/Edit Favorite"}
            </button>
          )}
          {user && (
            <DataExport
              data={Object.values(favorites).flat()}
              fileName="favorites.json"
              label="Export Favorites"
              types={Object.values(FavoriteType)}
              isReviews={false}
            />
          )}
        </div>
      </div>

      {isAddingFavorite && user && (
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
            onRandomSelect={handleRandomAlbum}
          />
        )}

        {/* Musicians Section */}
        {favorites[FavoriteType.ARTIST].length > 0 && (
          <CircularScrollList
            title="Music Artists"
            items={formatCircularData(favorites[FavoriteType.ARTIST])}
            itemType={FavoriteType.ARTIST}
            onRandomSelect={handleRandomArtist}
          />
        )}

        {/* Songs Section */}
        {favorites[FavoriteType.SONG].length > 0 && (
          <ListWithPagination
            title="Songs"
            items={formatListData(favorites[FavoriteType.SONG])}
            onRandomSelect={handleRandomSong}
            actionButton={handleActionClick}
            actionIcon={<FaPlay />}
            actionText="Play"
          />
        )}

        {/* Podcasts Section */}
        {favorites[FavoriteType.PODCAST].length > 0 && (
          <SquareScrollList
            title="Podcasts"
            items={formatSquareData(favorites[FavoriteType.PODCAST])}
            buttonText="Open Podcast's Website"
            onRandomSelect={handleRandomPodcast}
          />
        )}

        {/* YouTube Channels Section */}
        {favorites[FavoriteType.CHANNEL].length > 0 && (
          <CircularScrollList
            title="YouTube Channels"
            items={formatCircularData(favorites[FavoriteType.CHANNEL])}
            itemType={FavoriteType.CHANNEL}
            onRandomSelect={handleRandomChannel}
          />
        )}

        {/* Videos Section */}
        {favorites[FavoriteType.VIDEO].length > 0 && (
          <ListWithPagination
            title="Videos"
            items={formatListData(favorites[FavoriteType.VIDEO])}
            onRandomSelect={handleRandomVideo}
            actionButton={handleActionClick}
            actionIcon={<FaPlay />}
            actionText="Watch"
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
