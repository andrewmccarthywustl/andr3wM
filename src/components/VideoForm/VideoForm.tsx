// src/components/VideoForm/VideoForm.tsx
import React, { useState, useEffect } from "react";
import { videoApi } from "../../services/api";
import Button from "../ui/Button";
import styles from "./VideoForm.module.css";

interface VideoFormProps {
  video?: {
    id: string;
    title: string;
    thumbnailurl: string;
    url: string;
    published_at: string;
    position?: number;
  };
  onSubmit: () => void;
  onCancel: () => void;
}

// Function to generate a random ID
const generateRandomId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const VideoForm: React.FC<VideoFormProps> = ({ video, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: video?.id || generateRandomId(),
    title: video?.title || "",
    thumbnailurl: video?.thumbnailurl || "",
    url: video?.url || "",
    published_at: video?.published_at
      ? new Date(video.published_at).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    position: video?.position !== undefined ? video.position : 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<boolean>(false);

  useEffect(() => {
    // For new videos, set position higher than current max to make it the featured video
    const setHighestPosition = async () => {
      if (!video) {
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

    setHighestPosition();
  }, [video]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "position" ? parseInt(value, 10) || 0 : value,
    }));

    // Check thumbnail preview
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

      if (video) {
        await videoApi.updateVideo(video.id, videoData);
      } else {
        await videoApi.addVideo(videoData);
      }
      onSubmit();
    } catch (error) {
      console.error("Error saving video:", error);
      setError(error instanceof Error ? error.message : "Failed to save video");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.formTitle}>
        {video ? "Edit Video" : "Add New Video"}
      </h3>

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
        {thumbnailPreview && formData.thumbnailurl && (
          <div className={styles.thumbnailPreview}>
            <img
              src={formData.thumbnailurl}
              alt="Thumbnail preview"
              onError={() => setThumbnailPreview(false)}
            />
          </div>
        )}
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
          Higher numbers appear first. The video with the highest position will
          be featured.
        </small>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.buttonGroup}>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : video ? "Update Video" : "Add Video"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default VideoForm;
