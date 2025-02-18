// FavoritesSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import ScrollableAlbumList from "../ScrollableAlbumList/ScrollableAlbumList";
import CircularScrollList from "../CircularScrollList/CircularScrollList";
import FavoritesForm from "../FavoritesForm/FavoritesForm";
import { api, FavoriteType } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import styles from "./FavoritesSection.module.css";
import typography from "../../styles/typography.module.css";

const FavoritesSection = () => {
  const [favorites, setFavorites] = useState({
    [FavoriteType.ALBUM]: [],
    [FavoriteType.ARTIST]: [],
    [FavoriteType.CHANNEL]: [],
  });
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);
  const { user } = useAuth();

  const fetchFavorites = useCallback(async () => {
    try {
      const data = await api.getFavorites();
      const categorized = {
        [FavoriteType.ALBUM]: data.filter((f) => f.type === FavoriteType.ALBUM),
        [FavoriteType.ARTIST]: data.filter(
          (f) => f.type === FavoriteType.ARTIST
        ),
        [FavoriteType.CHANNEL]: data.filter(
          (f) => f.type === FavoriteType.CHANNEL
        ),
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

  const formatAlbumData = (albumFavorites) =>
    albumFavorites.map((f) => ({
      id: f.id,
      name: f.name,
      artist: f.secondary_name,
      imageUrl: f.image_url,
      spotifyUrl: f.external_url,
    }));

  const formatCircularData = (favorites) =>
    favorites.map((f) => ({
      id: f.id,
      name: f.name,
      imageUrl: f.image_url,
      url: f.external_url,
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
        <ScrollableAlbumList
          title="Albums"
          albums={formatAlbumData(favorites[FavoriteType.ALBUM])}
        />

        <CircularScrollList
          title="Musicians"
          items={formatCircularData(favorites[FavoriteType.ARTIST])}
          itemType={FavoriteType.ARTIST}
        />

        <CircularScrollList
          title="YouTube Channels"
          items={formatCircularData(favorites[FavoriteType.CHANNEL])}
          itemType={FavoriteType.CHANNEL}
        />
      </div>
    </div>
  );
};

export default FavoritesSection;
