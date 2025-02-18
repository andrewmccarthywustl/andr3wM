// src/components/FavoritesForm/FavoritesForm.jsx
import React, { useState } from "react";
import { FavoriteType, api, supabase } from "../../services/api";
import styles from "./FavoritesForm.module.css";

function FavoritesForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    type: FavoriteType.ALBUM,
    name: "",
    secondary_name: "",
    image_url: "",
    external_url: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showExisting, setShowExisting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, image_url: url }));
    setImagePreview(url);
  };

  const validateUrls = () => {
    try {
      new URL(formData.image_url);
      new URL(formData.external_url);
      return true;
    } catch {
      setError("Please enter valid URLs");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateUrls()) return;

    try {
      if (selectedItem) {
        await api.updateFavorite(selectedItem.id, formData);
      } else {
        await api.addFavorite(formData);
      }
      onSubmit();
      resetForm();
    } catch (error) {
      setError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      type: FavoriteType.ALBUM,
      name: "",
      secondary_name: "",
      image_url: "",
      external_url: "",
    });
    setImagePreview("");
    setSelectedItem(null);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .ilike("name", `%${value}%`);

      if (error) throw error;
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setImagePreview(item.image_url);
    setSelectedItem(item);
    setShowExisting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.deleteFavorite(id);
      setSearchResults(searchResults.filter((item) => item.id !== id));
      onSubmit();
    } catch (error) {
      console.error("Delete error:", error);
    }
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
                <img
                  src={item.image_url}
                  alt={item.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemInfo}>
                  <h3>{item.name}</h3>
                  {item.secondary_name && <p>{item.secondary_name}</p>}
                  <p className={styles.itemType}>{item.type}</p>
                </div>
                <div className={styles.itemActions}>
                  <button
                    onClick={() => handleEdit(item)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className={styles.deleteButton}
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
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value={FavoriteType.ALBUM}>Album</option>
              <option value={FavoriteType.ARTIST}>Artist</option>
              <option value={FavoriteType.CHANNEL}>Channel</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name..."
              required
            />
          </div>

          {formData.type === FavoriteType.ALBUM && (
            <div className={styles.field}>
              <label>Artist Name</label>
              <input
                type="text"
                name="secondary_name"
                value={formData.secondary_name}
                onChange={handleChange}
                placeholder="Artist Name"
                required
              />
            </div>
          )}

          <div className={styles.field}>
            <label>Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleImageUrlChange}
              placeholder="https://..."
              required
            />
            {imagePreview && (
              <div className={styles.preview}>
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label>External URL</label>
            <input
              type="url"
              name="external_url"
              value={formData.external_url}
              onChange={handleChange}
              placeholder="https://..."
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttons}>
            <button type="submit" className={styles.submitButton}>
              {selectedItem ? "Update" : "Add"} Favorite
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                onCancel();
              }}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default FavoritesForm;
