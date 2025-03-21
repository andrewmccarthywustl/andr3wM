// src/components/FavoritesForm/FavoritesForm.tsx
import React, { useState, useEffect } from "react";
import { favoriteApi, FavoriteType, Favorite } from "../../services/api";
import styles from "./FavoritesForm.module.css";

interface FavoriteFormData {
  type: FavoriteType;
  name: string;
  secondary_name?: string;
  image_url: string;
  external_url: string;
  position: number;
}

interface FavoritesFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const FavoritesForm: React.FC<FavoritesFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<FavoriteFormData>({
    type: FavoriteType.ALBUM,
    name: "",
    secondary_name: "",
    image_url: "",
    external_url: "",
    position: 0,
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Favorite[]>([]);
  const [selectedItem, setSelectedItem] = useState<Favorite | null>(null);
  const [showExisting, setShowExisting] = useState<boolean>(false);
  const [maxPosition, setMaxPosition] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchMaxPosition = async () => {
      try {
        const maxPos = await favoriteApi.getMaxPosition(formData.type);
        setMaxPosition(maxPos + 1);

        if (!selectedItem) {
          setFormData((prev) => ({
            ...prev,
            position: maxPos + 1,
          }));
        }
      } catch (error) {
        console.error("Error fetching max position:", error);
      }
    };
    fetchMaxPosition();
  }, [formData.type, selectedItem]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev } as FavoriteFormData;

      if (name === "type") {
        // Ensure type is properly cast to FavoriteType
        updatedData.type = value as FavoriteType;
      } else if (name === "position") {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
          updatedData.position = numValue;
        }
      } else {
        // @ts-ignore - Handle other properties
        updatedData[name] = value;
      }

      // Clear image URL if type is VIDEO or SONG
      if (
        name === "type" &&
        (value === FavoriteType.VIDEO || value === FavoriteType.SONG)
      ) {
        updatedData.image_url = "";
      }

      return updatedData;
    });
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, image_url: url }));
    setImagePreview(url);
  };

  const validateUrls = () => {
    try {
      if (
        formData.type !== FavoriteType.VIDEO &&
        formData.type !== FavoriteType.SONG
      ) {
        new URL(formData.image_url);
      }
      new URL(formData.external_url);
      return true;
    } catch {
      setError("Please enter valid URLs");
      return false;
    }
  };

  const validatePosition = () => {
    const pos = parseInt(formData.position.toString(), 10);

    if (isNaN(pos)) {
      setError("Position must be a valid number");
      return false;
    }

    if (pos < 0) {
      setError("Position cannot be negative");
      return false;
    }

    if (!selectedItem && pos > maxPosition) {
      setError(`Position cannot be greater than ${maxPosition}`);
      return false;
    }

    if (selectedItem && pos > maxPosition - 1) {
      setError(`Position cannot be greater than ${maxPosition - 1}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateUrls() || !validatePosition()) {
      return;
    }

    try {
      setIsSubmitting(true);
      if (selectedItem) {
        await favoriteApi.updateFavorite(selectedItem.id, formData);
      } else {
        await favoriteApi.addFavorite(formData);
      }
      onSubmit();
      resetForm();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: FavoriteType.ALBUM,
      name: "",
      secondary_name: "",
      image_url: "",
      external_url: "",
      position: 0,
    });
    setImagePreview("");
    setSelectedItem(null);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // Get all favorites and filter client-side
      const allFavorites = await favoriteApi.getFavorites();
      const filteredResults = allFavorites.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search items");
    }
  };

  const handleEdit = (item: Favorite) => {
    setFormData({
      type: item.type,
      name: item.name,
      secondary_name: item.secondary_name || "",
      image_url: item.image_url,
      external_url: item.external_url,
      position: item.position,
    });
    setImagePreview(item.image_url);
    setSelectedItem(item);
    setShowExisting(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      setIsSubmitting(true);
      await favoriteApi.deleteFavorite(id);
      setSearchResults(searchResults.filter((item) => item.id !== id));
      onSubmit();
    } catch (error) {
      console.error("Delete error:", error);
      setError("Failed to delete item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPositionHelp = () => {
    if (selectedItem) {
      return `Enter a position between 0 and ${
        maxPosition - 1
      }. Item will be removed from its current position (${
        selectedItem.position
      }) and inserted at the new position, shifting other items as needed.`;
    }
    return `Enter a position between 0 and ${maxPosition}. Items at or after this position will be shifted forward.`;
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formToggle}>
        <button
          type="button"
          className={`${styles.toggleButton} ${
            !showExisting ? styles.active : ""
          }`}
          onClick={() => setShowExisting(false)}
        >
          Add New
        </button>
        <button
          type="button"
          className={`${styles.toggleButton} ${
            showExisting ? styles.active : ""
          }`}
          onClick={() => setShowExisting(true)}
        >
          Edit Existing
        </button>
      </div>

      {showExisting ? (
        <div className={styles.existingSection}>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          <div className={styles.existingItems}>
            {searchResults.map((item) => (
              <div key={item.id} className={styles.existingItem}>
                {item.image_url &&
                  !(
                    item.type === FavoriteType.VIDEO ||
                    item.type === FavoriteType.SONG
                  ) && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className={styles.itemImage}
                    />
                  )}
                <div className={styles.itemInfo}>
                  <h3>{item.name}</h3>
                  {item.secondary_name && <p>{item.secondary_name}</p>}
                  <p className={styles.itemType}>{item.type}</p>
                  <p className={styles.itemPosition}>
                    Current Position: {item.position}
                  </p>
                </div>
                <div className={styles.itemActions}>
                  <button
                    onClick={() => handleEdit(item)}
                    className={styles.editButton}
                    disabled={isSubmitting}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className={styles.deleteButton}
                    disabled={isSubmitting}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value={FavoriteType.ALBUM}>Album</option>
              <option value={FavoriteType.ARTIST}>Artist</option>
              <option value={FavoriteType.PODCAST}>Podcast</option>
              <option value={FavoriteType.CHANNEL}>Channel</option>
              <option value={FavoriteType.VIDEO}>Video</option>
              <option value={FavoriteType.SONG}>Song</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>
              Position
              {selectedItem && (
                <span className={styles.currentPosition}>
                  (Current: {selectedItem.position})
                </span>
              )}
            </label>
            <input
              type="number"
              name="position"
              value={formData.position}
              onChange={handleChange}
              min="0"
              max={selectedItem ? maxPosition - 1 : maxPosition}
              required
              className={styles.input}
              disabled={isSubmitting}
            />
            <small className={styles.fieldHelp}>{getPositionHelp()}</small>
          </div>

          <div className={styles.field}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={
                formData.type === FavoriteType.VIDEO
                  ? "Video Title"
                  : formData.type === FavoriteType.SONG
                  ? "Song Title"
                  : "Enter name..."
              }
              required
              disabled={isSubmitting}
            />
          </div>

          {(formData.type === FavoriteType.ALBUM ||
            formData.type === FavoriteType.PODCAST ||
            formData.type === FavoriteType.VIDEO ||
            formData.type === FavoriteType.SONG) && (
            <div className={styles.field}>
              <label>
                {formData.type === FavoriteType.ALBUM
                  ? "Artist Name"
                  : formData.type === FavoriteType.PODCAST
                  ? "Host/Network"
                  : formData.type === FavoriteType.VIDEO
                  ? "Channel Name"
                  : "Artist Name"}
              </label>
              <input
                type="text"
                name="secondary_name"
                value={formData.secondary_name || ""}
                onChange={handleChange}
                required={
                  formData.type === FavoriteType.ALBUM ||
                  formData.type === FavoriteType.VIDEO ||
                  formData.type === FavoriteType.SONG
                }
                disabled={isSubmitting}
              />
            </div>
          )}

          {!(
            formData.type === FavoriteType.VIDEO ||
            formData.type === FavoriteType.SONG
          ) && (
            <div className={styles.field}>
              <label>Image URL</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleImageUrlChange}
                placeholder="https://..."
                required
                disabled={isSubmitting}
              />
              {imagePreview && (
                <div className={styles.preview}>
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
          )}

          <div className={styles.field}>
            <label>External URL</label>
            <input
              type="url"
              name="external_url"
              value={formData.external_url}
              onChange={handleChange}
              placeholder={
                formData.type === FavoriteType.ALBUM
                  ? "Music Streaming URL"
                  : formData.type === FavoriteType.PODCAST
                  ? "Podcast URL"
                  : formData.type === FavoriteType.ARTIST
                  ? "Artist Profile URL"
                  : formData.type === FavoriteType.CHANNEL
                  ? "YouTube Channel URL"
                  : formData.type === FavoriteType.SONG
                  ? "Music URL"
                  : "Video URL"
              }
              required
              disabled={isSubmitting}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttons}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : selectedItem ? "Update" : "Add"}{" "}
              Favorite
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                onCancel();
              }}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FavoritesForm;
