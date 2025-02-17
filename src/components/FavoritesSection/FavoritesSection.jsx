// src/components/FavoritesSection/FavoritesSection.jsx
import React, { useMemo, useCallback } from "react";
import ScrollableAlbumList from "../ScrollableAlbumList/ScrollableAlbumList";
import CircularScrollList from "../CircularScrollList/CircularScrollList";
import styles from "./FavoritesSection.module.css";
import typography from "../../styles/typography.module.css";

// Constants extracted outside component to prevent recreation
const EXTERNAL_LINK_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
};

const FavoritesSection = () => {
  // Memoized data arrays to prevent unnecessary recreations
  const favoriteAlbums = useMemo(
    () => [
      {
        id: 1,
        name: "Kid A",
        artist: "Radiohead",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/en/0/02/Kid_A_cover.png",
        spotifyUrl: "https://open.spotify.com/album/6GjwtEZcfenmOf6l18N7T7",
      },
      {
        id: 2,
        name: "Vespertine",
        artist: "Björk",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/en/3/39/Bjork_Vespertine_cover.png",
        spotifyUrl: "https://open.spotify.com/album/5vBpIxm8ws6pWyVmTWiGE1",
      },
      {
        id: 3,
        name: "In Rainbows",
        artist: "Radiohead",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/en/1/14/Inrainbowscover.png",
        spotifyUrl: "https://open.spotify.com/album/5vBpIxm8ws6pWyVmTWiGE1",
      },
    ],
    []
  );

  const favoriteArtists = useMemo(
    () => [
      {
        id: 1,
        name: "Radiohead",
        imageUrl:
          "https://i.scdn.co/image/ab6761610000e5ebc8dd398813a31c3c7d8484c9",
        url: "https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb",
      },
      {
        id: 2,
        name: "Björk",
        imageUrl:
          "https://i.scdn.co/image/ab6761610000e5eba0787934705a5c1a7c7d1d2c",
        url: "https://open.spotify.com/artist/7w29UYBi0qsHi5RTcv3lmA",
      },
    ],
    []
  );

  const favoriteChannels = useMemo(
    () => [
      {
        id: 1,
        name: "Ordinary Things",
        imageUrl:
          "https://yt3.googleusercontent.com/5OEYRQnxBTZujl9qKsImFtFmZXDKgPa3bfxdglxNxT4bY0ZgFN5CoXb5_HNdvl4qE0GXw2be=s176-c-k-c0x00ffffff-no-rj",
        url: "https://youtube.com/@OrdinaryThings",
      },
      {
        id: 2,
        name: "3Blue1Brown",
        imageUrl:
          "https://yt3.googleusercontent.com/ytc/AIf8zZRWLS5S_bKwGG6-vJHhHdKVR8D8Cr9J1M9kxHVO=s176-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@3blue1brown",
      },
    ],
    []
  );

  // Memoized click handlers to maintain referential stability
  const handleAlbumClick = useCallback((album) => {
    if (album?.spotifyUrl) {
      window.open(album.spotifyUrl, "_blank", "noopener,noreferrer");
    }
  }, []);

  const handleArtistClick = useCallback((artist) => {
    if (artist?.url) {
      window.open(artist.url, "_blank", "noopener,noreferrer");
    }
  }, []);

  const handleChannelClick = useCallback((channel) => {
    if (channel?.url) {
      window.open(channel.url, "_blank", "noopener,noreferrer");
    }
  }, []);

  return (
    <div className={styles.favoritesSection}>
      <h1 className={`${styles.sectionTitle} ${typography.heading1}`}>
        Favorites
      </h1>

      <div className={styles.listContainer}>
        <ScrollableAlbumList
          title="Albums"
          albums={favoriteAlbums}
          onAlbumClick={handleAlbumClick}
        />

        <CircularScrollList
          title="Musicians"
          items={favoriteArtists}
          onItemClick={handleArtistClick}
        />

        <CircularScrollList
          title="YouTube Channels"
          items={favoriteChannels}
          onItemClick={handleChannelClick}
        />
      </div>
    </div>
  );
};

// Memoize the entire component to prevent unnecessary rerenders
export default React.memo(FavoritesSection);
