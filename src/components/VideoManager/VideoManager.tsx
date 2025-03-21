// src/components/VideoManager/VideoManager.tsx
import React, { useState, useEffect } from "react";
import { videoApi } from "../../services/api";
import Button from "../ui/Button";
import styles from "./VideoManager.module.css";

interface Video {
  id: string;
  title: string;
  thumbnailurl: string;
  url: string;
  published_at: string;
  position?: number;
}

interface VideoManagerProps {
  onVideoChange: () => void;
  allVideos: Video[];
}

// Function to generate a random ID
const generateRandomId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const VideoManager: React.FC<VideoManagerProps> = ({
  onVideoChange,
  allVideos,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Video[]>([]);

  const [formData, setFormData] = useState({
    id: generateRandomId(),
    title: "",
    thumbnailurl: "",
    url: "",
    published_at: new Date().toISOString().split("T")[0],
    position: 0,
  });

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<boolean>(false);

  // Set default position to highest+1 for new videos or keep the current position for editing
  useEffect(() => {
    const setDefaultPosition = async () => {
      if (!selectedVideo) {
        try {
          const maxPosition = await videoApi.getMaxPosition();
          setFormData((prev) => ({
            ...prev,
            position: maxPosition + 1,
          }));
        } catch (error) {
          console.error("Error fetching max position:", error);
        }
      }
    };

    setDefaultPosition();
  }, [selectedVideo]);

  // Update searchResults whenever searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const filteredVideos = allVideos.filter((video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredVideos);
  }, [searchTerm, allVideos]);

  const resetForm = () => {
    setFormData({
      id: generateRandomId(),
      title: "",
      thumbnailurl: "",
      url: "",
      published_at: new Date().toISOString().split("T")[0],
      position: 0,
    });
    setSelectedVideo(null);
    setSearchTerm("");
    setSearchResults([]);
    setThumbnailPreview(false);
    setError(null);
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setFormData({
      id: video.id,
      title: video.title,
      thumbnailurl: video.thumbnailurl,
      url: video.url,
      published_at: new Date(video.published_at).toISOString().split("T")[0],
      position: video.position || 0,
    });
    setThumbnailPreview(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "position" ? parseInt(value, 10) || 0 : value,
    }));

    // Check thumbnail preview when URL changes
    if (name === "thumbnailurl") {
      setThumbnailPreview(true);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.thumbnailurl.trim()) {
      setError("Thumbnail URL is required");
      return false;
    }
    if (!formData.url.trim()) {
      setError("Video URL is required");
      return false;
    }
    if (formData.position < 0) {
      setError("Position must be a non-negative number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const videoData = {
        ...formData,
        published_at: new Date(formData.published_at).toISOString(),
      };

      if (selectedVideo) {
        await videoApi.updateVideo(selectedVideo.id, videoData);
      } else {
        await videoApi.addVideo(videoData);
      }

      onVideoChange();
      resetForm();
      setIsExpanded(false);
    } catch (error) {
      console.error("Error saving video:", error);
      setError(error instanceof Error ? error.message : "Failed to save video");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    setIsSubmitting(true);
    try {
      await videoApi.deleteVideo(id);
      onVideoChange();
      resetForm();
    } catch (error) {
      console.error("Error deleting video:", error);
      setError("Failed to delete the video. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.videoManager}>
      <Button
        variant="primary"
        onClick={() => setIsExpanded(!isExpanded)}
        className={styles.toggleButton}
      >
        {isExpanded ? "Close Manager" : "Manage Videos"}
      </Button>

      {isExpanded && (
        <div className={styles.managerContent}>
          <div className={styles.searchSection}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search videos..."
              className={styles.searchInput}
            />

            {searchResults.length > 0 && (
              <div className={styles.searchResults}>
                {searchResults.map((video) => (
                  <div
                    key={video.id}
                    className={styles.searchResultItem}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className={styles.resultThumbnail}>
                      <img src={video.thumbnailurl} alt={video.title} />
                    </div>
                    <div className={styles.resultInfo}>
                      <h4>{video.title}</h4>
                      <p className={styles.resultPosition}>
                        Position: {video.position}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className={styles.videoForm}>
            <h3 className={styles.formTitle}>
              {selectedVideo ? "Edit Video" : "Add New Video"}
            </h3>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter video title"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="url">Video URL</label>
                <input
                  id="url"
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="thumbnailurl">Thumbnail URL</label>
                <input
                  id="thumbnailurl"
                  type="url"
                  name="thumbnailurl"
                  value={formData.thumbnailurl}
                  onChange={handleChange}
                  placeholder="Enter thumbnail URL"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="published_at">Publication Date</label>
                <input
                  id="published_at"
                  type="date"
                  name="published_at"
                  value={formData.published_at}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="position">Position</label>
                <input
                  id="position"
                  type="number"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  min="0"
                  required
                  disabled={isSubmitting}
                />
                <small className={styles.helpText}>
                  Higher numbers appear first. The video with the highest
                  position will be featured.
                </small>
              </div>
            </div>

            {thumbnailPreview && formData.thumbnailurl && (
              <div className={styles.thumbnailPreview}>
                <img
                  src={formData.thumbnailurl}
                  alt="Thumbnail preview"
                  onError={() => setThumbnailPreview(false)}
                />
              </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.buttonGroup}>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : selectedVideo
                  ? "Update Video"
                  : "Add Video"}
              </Button>

              {selectedVideo && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDelete(selectedVideo.id)}
                  disabled={isSubmitting}
                  className={styles.deleteButton}
                >
                  Delete Video
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Reset Form
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VideoManager;
