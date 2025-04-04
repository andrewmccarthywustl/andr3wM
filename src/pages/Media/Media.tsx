// src/pages/Media/Media.tsx
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from "react";
import {
  reviewApi,
  favoriteApi,
  MediaType,
  FavoriteType,
  Review,
  Favorite,
} from "../../services/api";
import PageContainer from "../../components/layout/PageContainer";
import SectionContainer from "../../components/layout/SectionContainer";
import PageTitle from "@/components/typograpny/PageTitle";
import SectionTitle from "@/components/typograpny/SectionTitle";
import SectionHeader from "../../components/SectionHeader";
import ReviewList from "../../components/ReviewList";
import SquareScrollList from "../../components/SquareScrollList";
import CircularScrollList from "../../components/CircularScrollList";
import ListWithPagination from "../../components/ListWithPagination";
import ReviewsForm from "../../components/ReviewsForm";
import FavoritesForm from "../../components/FavoritesForm";
import DataExport from "../../components/DataExport";
import LoadingSpinner from "../../components/LoadingSpinner";
import ReviewPopup from "../../components/ReviewPopup";
import { useAuth } from "../../context/AuthContext";
import { FaPlay, FaRandom } from "react-icons/fa";
import useIsMobile from "../../hooks/useIsMobile";
import styles from "./Media.module.css";

// Create ReviewPopupContext
interface ReviewPopupContextType {
  selectedReview: Review | null;
  isPopupOpen: boolean;
  openReviewPopup: (review: Review) => void;
  closeReviewPopup: () => void;
}

const ReviewPopupContext = createContext<ReviewPopupContextType | undefined>(
  undefined
);

export const useReviewPopup = () => {
  const context = useContext(ReviewPopupContext);
  if (context === undefined) {
    throw new Error("useReviewPopup must be used within a ReviewPopupProvider");
  }
  return context;
};

// Define types for our state objects
interface ReviewsState {
  [MediaType.MOVIE]: Review[];
  [MediaType.SHOW]: Review[];
  [MediaType.BOOK]: Review[];
  [key: string]: Review[]; // Add index signature
}

interface FavoritesState {
  [FavoriteType.ALBUM]: Favorite[];
  [FavoriteType.ARTIST]: Favorite[];
  [FavoriteType.PODCAST]: Favorite[];
  [FavoriteType.CHANNEL]: Favorite[];
  [FavoriteType.VIDEO]: Favorite[];
  [FavoriteType.SONG]: Favorite[];
  [key: string]: Favorite[]; // Add index signature
}

interface ResetKeysState {
  [MediaType.MOVIE]: string;
  [MediaType.SHOW]: string;
  [MediaType.BOOK]: string;
  [key: string]: string; // Add index signature
}

interface SortOptions {
  [MediaType.MOVIE]: { key: string; order: "asc" | "desc" };
  [MediaType.SHOW]: { key: string; order: "asc" | "desc" };
  [MediaType.BOOK]: { key: string; order: "asc" | "desc" };
  [key: string]: { key: string; order: "asc" | "desc" }; // Add index signature
}

// Interface for formatted item data
interface SquareItemData {
  id: number | string;
  name: string;
  secondaryName?: string;
  imageUrl: string;
  externalUrl: string;
  position?: number;
}

interface CircularItemData {
  id: number | string;
  name: string;
  imageUrl: string;
  url: string;
  position?: number;
}

interface ListItemData {
  id: number | string;
  title: string;
  subtitle?: string;
  url: string;
  position?: number;
}

const Media: React.FC = () => {
  // State for reviews
  const [reviews, setReviews] = useState<ReviewsState>({
    [MediaType.MOVIE]: [],
    [MediaType.SHOW]: [],
    [MediaType.BOOK]: [],
  });

  // Add reset keys for scroll position
  const [resetKeys, setResetKeys] = useState<ResetKeysState>({
    [MediaType.MOVIE]: "0",
    [MediaType.SHOW]: "0",
    [MediaType.BOOK]: "0",
  });

  // State for favorites
  const [favorites, setFavorites] = useState<FavoritesState>({
    [FavoriteType.ALBUM]: [],
    [FavoriteType.ARTIST]: [],
    [FavoriteType.PODCAST]: [],
    [FavoriteType.CHANNEL]: [],
    [FavoriteType.VIDEO]: [],
    [FavoriteType.SONG]: [],
  });

  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(true);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState<boolean>(true);
  const [_error, setError] = useState<string | null>(null); // Using underscore to indicate unused
  const [isAddingReview, setIsAddingReview] = useState<boolean>(false);
  const [isAddingFavorite, setIsAddingFavorite] = useState<boolean>(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const timeoutRef = useRef<number | null>(null);

  // Global review popup state
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  // Update the existing functions
  const openReviewPopup = (review: Review) => {
    // Clear any pending timeouts to prevent state conflicts
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setSelectedReview(review);
    setIsPopupOpen(true);
  };

  const closeReviewPopup = () => {
    setIsPopupOpen(false);

    // Store the timeout ID in the ref so we can clear it if needed
    timeoutRef.current = window.setTimeout(() => {
      setSelectedReview(null);
      timeoutRef.current = null;
    }, 300); // Match the animation duration
  };

  // Sort options for reviews
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    [MediaType.MOVIE]: { key: "created_at", order: "desc" as "asc" | "desc" },
    [MediaType.SHOW]: { key: "created_at", order: "desc" as "asc" | "desc" },
    [MediaType.BOOK]: { key: "created_at", order: "desc" as "asc" | "desc" },
  });

  useEffect(() => {
    fetchReviews();
    fetchFavorites();
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true);
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
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      setIsLoadingFavorites(true);
      const allFavorites = await favoriteApi.getFavorites();

      const categorizedFavorites = {
        [FavoriteType.ALBUM]: allFavorites
          .filter((item) => item.type === FavoriteType.ALBUM)
          .sort((a, b) => a.position - b.position),
        [FavoriteType.ARTIST]: allFavorites
          .filter((item) => item.type === FavoriteType.ARTIST)
          .sort((a, b) => a.position - b.position),
        [FavoriteType.PODCAST]: allFavorites
          .filter((item) => item.type === FavoriteType.PODCAST)
          .sort((a, b) => a.position - b.position),
        [FavoriteType.CHANNEL]: allFavorites
          .filter((item) => item.type === FavoriteType.CHANNEL)
          .sort((a, b) => a.position - b.position),
        [FavoriteType.VIDEO]: allFavorites
          .filter((item) => item.type === FavoriteType.VIDEO)
          .sort((a, b) => a.position - b.position),
        [FavoriteType.SONG]: allFavorites
          .filter((item) => item.type === FavoriteType.SONG)
          .sort((a, b) => a.position - b.position),
      };

      setFavorites(categorizedFavorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError("Failed to load favorites. Please try again later.");
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  // Handle sort for reviews
  const handleSort = (
    mediaType: string,
    key: string,
    order: "asc" | "desc"
  ) => {
    // Update sort options
    setSortOptions((prevOptions) => ({
      ...prevOptions,
      [mediaType]: { key, order },
    }));

    // Update reset key to trigger scroll reset
    setResetKeys((prevKeys) => ({
      ...prevKeys,
      [mediaType]: `${key}-${order}-${Date.now()}`,
    }));

    // Re-sort reviews
    setReviews((prevReviews) => {
      const sortedReviews = { ...prevReviews };

      sortedReviews[mediaType] = [...prevReviews[mediaType]].sort((a, b) => {
        if (key === "title") {
          return order === "desc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else if (key === "created_at") {
          return order === "asc"
            ? new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime();
        } else if (key === "rating") {
          return order === "asc" ? a.rating - b.rating : b.rating - a.rating;
        }
        return 0;
      });

      return sortedReviews;
    });
  };

  // Handle form submissions
  const handleReviewFormSubmit = () => {
    fetchReviews();
    setIsAddingReview(false);
  };

  const handleFavoriteFormSubmit = () => {
    fetchFavorites();
    setIsAddingFavorite(false);
  };

  // Handle random selection for favorites
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

  // Format data for favorite list components
  const formatSquareData = (items: Favorite[]): SquareItemData[] =>
    items.map((item) => ({
      id: item.id,
      name: item.name,
      secondaryName: item.secondary_name,
      imageUrl: item.image_url,
      externalUrl: item.external_url,
      position: item.position,
    }));

  const formatCircularData = (items: Favorite[]): CircularItemData[] =>
    items.map((item) => ({
      id: item.id,
      name: item.name,
      imageUrl: item.image_url,
      url: item.external_url,
      position: item.position,
    }));

  const formatListData = (items: Favorite[]): ListItemData[] =>
    items.map((item) => ({
      id: item.id,
      title: item.name,
      subtitle: item.secondary_name,
      url: item.external_url,
      position: item.position,
    }));

  const handleActionClick = (item: ListItemData) => {
    window.open(item.url, "_blank", "noopener,noreferrer");
  };

  // Check if all favorites are empty
  const isEmptyFavorites = Object.values(favorites).every(
    (list) => list.length === 0
  );

  if (isLoadingReviews && isLoadingFavorites) {
    return <LoadingSpinner fullPage message="Loading media content..." />;
  }

  const reviewPopupContextValue = {
    selectedReview,
    isPopupOpen,
    openReviewPopup,
    closeReviewPopup,
  };

  return (
    <ReviewPopupContext.Provider value={reviewPopupContextValue}>
      <PageContainer>
        <SectionContainer noPaddingBottom>
          <PageTitle
            title="Media"
            subtitle="My collection of movies, books, shows, and favorite content"
          />
        </SectionContainer>

        {/* Reviews Section */}
        <SectionContainer noPaddingTop>
          <div className={styles.sectionWithActions}>
            <SectionTitle title="Reviews" />

            {user && (
              <div className={styles.sectionActions}>
                <button
                  onClick={() => setIsAddingReview(!isAddingReview)}
                  className={styles.actionButton}
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
            <div className={styles.formContainer}>
              <ReviewsForm
                onSubmit={handleReviewFormSubmit}
                onCancel={() => setIsAddingReview(false)}
              />
            </div>
          )}

          {/* Movie Reviews */}
          {reviews[MediaType.MOVIE].length > 0 && (
            <div className={styles.reviewSection}>
              <SectionHeader
                title="Movies"
                sortable
                currentSort={sortOptions[MediaType.MOVIE]}
                onSort={(key, order) => handleSort(MediaType.MOVIE, key, order)}
                actionButtons={[]}
              />
              <ReviewList
                reviews={reviews[MediaType.MOVIE]}
                resetKey={resetKeys[MediaType.MOVIE]}
              />
            </div>
          )}

          {/* TV Show Reviews */}
          {reviews[MediaType.SHOW].length > 0 && (
            <div className={styles.reviewSection}>
              <SectionHeader
                title="TV Shows"
                sortable
                currentSort={sortOptions[MediaType.SHOW]}
                onSort={(key, order) => handleSort(MediaType.SHOW, key, order)}
                actionButtons={[]}
              />
              <ReviewList
                reviews={reviews[MediaType.SHOW]}
                resetKey={resetKeys[MediaType.SHOW]}
              />
            </div>
          )}

          {/* Book Reviews */}
          {reviews[MediaType.BOOK].length > 0 && (
            <div className={styles.reviewSection}>
              <SectionHeader
                title="Books"
                sortable
                currentSort={sortOptions[MediaType.BOOK]}
                onSort={(key, order) => handleSort(MediaType.BOOK, key, order)}
                actionButtons={[]}
              />
              <ReviewList
                reviews={reviews[MediaType.BOOK]}
                resetKey={resetKeys[MediaType.BOOK]}
              />
            </div>
          )}
        </SectionContainer>

        {/* Favorites Section */}
        <SectionContainer>
          <div className={styles.sectionWithActions}>
            <SectionTitle title="Favorites" />

            {user && (
              <div className={styles.sectionActions}>
                <button
                  onClick={() => setIsAddingFavorite(!isAddingFavorite)}
                  className={styles.actionButton}
                >
                  {isAddingFavorite ? "Cancel" : "Add/Edit Favorite"}
                </button>
                <DataExport
                  data={Object.values(favorites).flat()}
                  fileName="favorites.json"
                  label="Export Favorites"
                  types={Object.values(FavoriteType)}
                  isReviews={false}
                />
              </div>
            )}
          </div>

          {isAddingFavorite && user && (
            <div className={styles.formContainer}>
              <FavoritesForm
                onSubmit={handleFavoriteFormSubmit}
                onCancel={() => setIsAddingFavorite(false)}
              />
            </div>
          )}

          {/* Albums Section */}
          {favorites[FavoriteType.ALBUM].length > 0 && (
            <div className={styles.favoriteSection}>
              <SectionHeader
                title="Albums"
                actionButtons={[
                  {
                    type: "default",
                    label: "Random Album",
                    icon: <FaRandom />,
                    onClick: handleRandomAlbum,
                  },
                ]}
              />
              <SquareScrollList
                items={formatSquareData(favorites[FavoriteType.ALBUM])}
                buttonText="Listen to Album"
              />
            </div>
          )}

          {/* Musicians Section */}
          {favorites[FavoriteType.ARTIST].length > 0 && (
            <div className={styles.favoriteSection}>
              <SectionHeader
                title="Music Artists"
                actionButtons={[
                  {
                    type: "default",
                    label: "Random Artist",
                    icon: <FaRandom />,
                    onClick: handleRandomArtist,
                  },
                ]}
              />
              <CircularScrollList
                items={formatCircularData(favorites[FavoriteType.ARTIST])}
                itemType={FavoriteType.ARTIST}
              />
            </div>
          )}

          {/* Songs Section */}
          {favorites[FavoriteType.SONG].length > 0 && (
            <div className={styles.favoriteSection}>
              <SectionHeader
                noMarginBottom={true}
                title="Songs"
                actionButtons={[
                  {
                    type: "default",
                    label: "Random Song",
                    icon: <FaRandom />,
                    onClick: handleRandomSong,
                  },
                ]}
              />
              <ListWithPagination
                items={formatListData(favorites[FavoriteType.SONG])}
                actionButton={handleActionClick}
                actionIcon={<FaPlay />}
                actionText="Play"
              />
            </div>
          )}

          {/* Podcasts Section */}
          {favorites[FavoriteType.PODCAST].length > 0 && (
            <div className={styles.favoriteSection}>
              <SectionHeader
                title="Podcasts"
                actionButtons={[
                  {
                    type: "default",
                    label: "Random Podcast",
                    icon: <FaRandom />,
                    onClick: handleRandomPodcast,
                  },
                ]}
              />
              <SquareScrollList
                items={formatSquareData(favorites[FavoriteType.PODCAST])}
                buttonText="Open Podcast's Website"
              />
            </div>
          )}

          {/* YouTube Channels Section */}
          {favorites[FavoriteType.CHANNEL].length > 0 && (
            <div className={styles.favoriteSection}>
              <SectionHeader
                title="Creators"
                actionButtons={[
                  {
                    type: "default",
                    label: "Random Channel",
                    icon: <FaRandom />,
                    onClick: handleRandomChannel,
                  },
                ]}
              />
              <CircularScrollList
                items={formatCircularData(favorites[FavoriteType.CHANNEL])}
                itemType={FavoriteType.CHANNEL}
              />
            </div>
          )}

          {/* Videos Section */}
          {favorites[FavoriteType.VIDEO].length > 0 && (
            <div className={styles.favoriteSection}>
              <SectionHeader
                title="Videos"
                noMarginBottom
                actionButtons={[
                  {
                    type: "default",
                    label: "Random Video",
                    icon: <FaRandom />,
                    onClick: handleRandomVideo,
                  },
                ]}
              />
              <ListWithPagination
                items={formatListData(favorites[FavoriteType.VIDEO])}
                actionButton={handleActionClick}
                actionIcon={<FaPlay />}
                actionText="Watch"
              />
            </div>
          )}

          {/* Empty State */}
          {isEmptyFavorites && (
            <div className={styles.emptyState}>
              <p>No favorites added yet.</p>
              {user && (
                <button
                  onClick={() => setIsAddingFavorite(true)}
                  className={styles.actionButton}
                >
                  Add Your First Favorite
                </button>
              )}
            </div>
          )}
        </SectionContainer>

        {/* Global Review Popup */}
        {selectedReview && (
          <ReviewPopup
            review={selectedReview}
            onClose={closeReviewPopup}
            isOpen={isPopupOpen}
            isMobile={isMobile}
          />
        )}
      </PageContainer>
    </ReviewPopupContext.Provider>
  );
};

export default Media;
