// src/components/AdminPhotoForm/AdminPhotoForm.tsx
import React, { useState, useEffect } from "react";
import { photoApi } from "../../services/api";
import styles from "./AdminPhotoForm.module.css";

interface Photo {
  id?: number;
  title: string;
  description?: string;
  url: string;
  category: string;
  position?: number;
  created_at?: string;
}

interface AdminPhotoFormProps {
  photo?: Photo;
  onPhotoAdded: (photo: Photo) => void;
  onCancel: () => void;
}

const AdminPhotoForm: React.FC<AdminPhotoFormProps> = ({
  photo,
  onPhotoAdded,
  onCancel,
}) => {
  const [photoData, setPhotoData] = useState<Photo>({
    title: "",
    description: "",
    url: "",
    category: "other",
    position: 0,
  });
  const [maxPosition, setMaxPosition] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    // Fetch max position for the position field
    const fetchMaxPosition = async () => {
      try {
        const maxPos = await photoApi.getMaxPosition();
        setMaxPosition(maxPos + 1);

        // If it's a new photo (not editing), set default position to the end
        if (!photo) {
          setPhotoData((prev) => ({
            ...prev,
            position: maxPos + 1,
          }));
        }
      } catch (error) {
        console.error("Error fetching max position:", error);
      }
    };

    fetchMaxPosition();

    // If editing an existing photo, populate form with its data
    if (photo) {
      setPhotoData({
        ...photo,
        position: photo.position || 0,
      });
    }
  }, [photo]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setPhotoData((prev) => ({
      ...prev,
      [name]: name === "position" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const validateForm = (): boolean => {
    // Position validation
    const pos = parseInt(String(photoData.position), 10);
    if (isNaN(pos) || pos < 0) {
      setError("Position must be a non-negative number");
      return false;
    }

    // URL validation
    try {
      new URL(photoData.url);
    } catch (e) {
      setError("Please enter a valid URL for the photo");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      if (photo && photo.id) {
        // Updating existing photo
        await photoApi.updatePhoto(photo.id, photoData);
      } else {
        // Adding new photo
        await photoApi.addPhoto(photoData);
      }
      onPhotoAdded(photoData);
    } catch (error) {
      console.error("Error saving photo:", error);
      setError(error instanceof Error ? error.message : "Failed to save photo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.formTitle}>
        {photo ? "Edit Photo" : "Add New Photo"}
      </h3>

      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={photoData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={photoData.description || ""}
          onChange={handleChange}
          placeholder="Description (optional)"
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="url">Photo URL</label>
        <input
          id="url"
          type="url"
          name="url"
          value={photoData.url}
          onChange={handleChange}
          placeholder="https://"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={photoData.category}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        >
          <option value="nature">Nature</option>
          <option value="urban">Urban</option>
          <option value="portrait">Portrait</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="position">
          Position{" "}
          {photo && (
            <span className={styles.currentPosition}>
              (Current: {photo.position})
            </span>
          )}
        </label>
        <input
          id="position"
          type="number"
          name="position"
          value={photoData.position}
          onChange={handleChange}
          min="0"
          disabled={isSubmitting}
        />
        <small className={styles.helpText}>
          {photo
            ? "Photos will be reordered based on the new position."
            : `Enter a position between 0 and ${maxPosition}. Photos at or after this position will be shifted.`}
        </small>
      </div>

      {photoData.url && (
        <div className={styles.previewContainer}>
          <p>Preview:</p>
          <img
            src={photoData.url}
            alt="Preview"
            className={styles.imagePreview}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://via.placeholder.com/150?text=Invalid+URL";
            }}
          />
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.buttonGroup}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : photo ? "Update Photo" : "Add Photo"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdminPhotoForm;
