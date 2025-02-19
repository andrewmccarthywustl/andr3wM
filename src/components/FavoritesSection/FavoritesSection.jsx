// FavoritesSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import SquareScrollList from "../SquareScrollList";
import CircularScrollList from "../CircularScrollList";
import VideoList from "../VideoList";
import FavoritesForm from "../FavoritesForm";
import { api, FavoriteType } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import styles from "./FavoritesSection.module.css";
import typography from "../../styles/typography.module.css";

const FavoritesSection = () => {
  const [favorites, setFavorites] = useState({
    [FavoriteType.ALBUM]: [],
    [FavoriteType.PODCAST]: [],
    [FavoriteType.ARTIST]: [],
    [FavoriteType.CHANNEL]: [],
    [FavoriteType.VIDEO]: [], // Added videos to state
  });
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);
  const { user } = useAuth();

  const fetchFavorites = useCallback(async () => {
    try {
      const data = await api.getFavorites();
      const categorized = {
        [FavoriteType.ALBUM]: data.filter((f) => f.type === FavoriteType.ALBUM),
        [FavoriteType.PODCAST]: data.filter(
          (f) => f.type === FavoriteType.PODCAST
        ),
        [FavoriteType.ARTIST]: data.filter(
          (f) => f.type === FavoriteType.ARTIST
        ),
        [FavoriteType.CHANNEL]: data.filter(
          (f) => f.type === FavoriteType.CHANNEL
        ),
        [FavoriteType.VIDEO]: data.filter((f) => f.type === FavoriteType.VIDEO),
      };
      setFavorites(categorized);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleFavoriteSubmit = async () => {
    await fetchFavorites();
    setIsAddingFavorite(false);
  };

  const formatSquareData = (squareFavorites) =>
    squareFavorites.map((f) => ({
      id: f.id,
      name: f.name,
      secondaryName: f.secondary_name,
      imageUrl: f.image_url,
      externalUrl: f.external_url,
    }));

  const formatCircularData = (favorites) =>
    favorites.map((f) => ({
      id: f.id,
      name: f.name,
      imageUrl: f.image_url,
      url: f.external_url,
    }));

  const formatVideoData = (videos) =>
    videos.map((v) => ({
      id: v.id,
      title: v.name,
      channel: v.secondary_name,
      url: v.external_url,
    }));

  return (
    <div className={styles.favoritesSection}>
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

      {isAddingFavorite && (
        <FavoritesForm
          onSubmit={handleFavoriteSubmit}
          onCancel={() => setIsAddingFavorite(false)}
        />
      )}

      <div className={styles.listContainer}>
        <SquareScrollList
          title="Albums"
          items={formatSquareData(favorites[FavoriteType.ALBUM])}
          buttonText="Open in YouTube Music"
        />

        <CircularScrollList
          title="Musicians"
          items={formatCircularData(favorites[FavoriteType.ARTIST])}
          itemType={FavoriteType.ARTIST}
        />

        <SquareScrollList
          title="Podcasts"
          items={formatSquareData(favorites[FavoriteType.PODCAST])}
          buttonText="Listen Now"
        />

        <CircularScrollList
          title="YouTube Channels"
          items={formatCircularData(favorites[FavoriteType.CHANNEL])}
          itemType={FavoriteType.CHANNEL}
        />

        <VideoList
          title="Favorite Videos"
          videos={formatVideoData(favorites[FavoriteType.VIDEO])}
        />
      </div>
    </div>
  );
};

export default FavoritesSection;
