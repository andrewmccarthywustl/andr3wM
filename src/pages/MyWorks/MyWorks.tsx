// src/pages/MyWorks/MyWorks.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import SectionContainer from "../../components/layout/SectionContainer";
import PageTitle from "@/components/typograpny/PageTitle";
import SectionHeader from "@/components/SectionHeader";
import FeaturedVideo from "../../components/FeaturedVideo";
import VideoGrid from "../../components/VideoGrid";
import PhotoGrid from "../../components/PhotoGrid";
import VideoManager from "@/components/VideoManager";
import { videoApi, photoApi } from "../../services/api";
import { SimpleVideo as Video } from "../../services/api/videos";
import { useAuth } from "../../context/AuthContext";
import styles from "./MyWorks.module.css";

// interface Video {
//   id: string;
//   title: string;
//   thumbnailurl: string;
//   url: string;
//   published_at?: string;
//   position?: number;
// }

interface Photo {
  id: number;
  title: string;
  url: string;
  description?: string;
  category?: string;
  created_at?: string;
}

const MyWorks: React.FC = () => {
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState<boolean>(true);
  const [_isLoadingPhotos, setIsLoadingPhotos] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchVideos = async (): Promise<void> => {
    setIsLoadingVideos(true);
    setError(null);
    try {
      // Get all videos from the database
      const allVideos = await videoApi.getVideos();

      if (allVideos.length > 0) {
        // Sort by position in descending order (highest position first)
        const sortedVideos = [...allVideos].sort(
          (a, b) => (b.position || 0) - (a.position || 0)
        );

        // Featured video is the one with the highest position
        setFeaturedVideo(sortedVideos[0]);

        // Rest go to the grid (excluding the featured one)
        setVideos(sortedVideos.slice(1));
      } else {
        setFeaturedVideo(null);
        setVideos([]);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("Failed to load videos. Please try again later.");
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const fetchPhotos = async (): Promise<void> => {
    setIsLoadingPhotos(true);
    try {
      // Get preview photos for the gallery (limit to 8)
      const fetchedPhotos = await photoApi.getPhotos({
        page: 1,
        pageSize: 8,
        filter: "all",
      });

      setPhotos(fetchedPhotos);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchPhotos();
  }, []);

  // Transform videos to match VideoGrid component expected format
  const formatVideosForGrid = (videos: Video[]) => {
    return videos.map((video) => ({
      id: video.id,
      title: video.title,
      thumbnailUrl: video.thumbnailurl,
      url: video.url,
      publishedAt: video.published_at,
    }));
  };

  return (
    <PageContainer>
      <SectionContainer noPaddingBottom>
        <PageTitle
          title="My Works"
          subtitle="A collection of my creative projects across different mediums"
        />
      </SectionContainer>

      {/* Videos Section */}
      <SectionContainer noPaddingTop>
        <div className={styles.sectionHeader}>
          <SectionHeader title="videos" />
        </div>

        {user && (
          <VideoManager
            onVideoChange={fetchVideos}
            allVideos={[...(featuredVideo ? [featuredVideo] : []), ...videos]}
          />
        )}

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}

        {isLoadingVideos ? (
          <div className={styles.loadingMessage}>Loading videos...</div>
        ) : (
          <>
            {featuredVideo && (
              <FeaturedVideo
                video={{
                  id: featuredVideo.id,
                  title: featuredVideo.title,
                  thumbnailUrl: featuredVideo.thumbnailurl,
                  url: featuredVideo.url,
                  publishedAt: featuredVideo.published_at,
                }}
              />
            )}

            {/* Using the existing VideoGrid component */}
            {videos.length > 0 && (
              <VideoGrid videos={formatVideosForGrid(videos)} />
            )}
          </>
        )}
      </SectionContainer>

      {/* Photography Section */}
      {photos.length > 0 && (
        <SectionContainer noPaddingTop>
          <div className={styles.sectionHeader}>
            <SectionHeader title="photography" />
            <Link to="/my-works/photography" className={styles.galleryLink}>
              view full gallery
            </Link>
          </div>
          <PhotoGrid photos={photos} />
        </SectionContainer>
      )}
    </PageContainer>
  );
};

export default MyWorks;
