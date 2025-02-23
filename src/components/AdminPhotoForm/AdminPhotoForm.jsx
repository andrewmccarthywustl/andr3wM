// src/components/AdminPhotoForm/AdminPhotoForm.jsx

import React, { useState, useEffect } from "react";
import { photoApi } from "../../services/api";
import styles from "./AdminPhotoForm.module.css";

function AdminPhotoForm({ photo, onPhotoAdded, onCancel }) {
  const [photoData, setPhotoData] = useState({
    title: "",
    description: "",
    url: "",
    category: "other",
  });

  useEffect(() => {
    if (photo) {
      setPhotoData(photo);
    }
  }, [photo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPhotoData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (photo) {
        await photoApi.updatePhoto(photo.id, photoData);
      } else {
        await api.addPhoto(photoData);
      }
      onPhotoAdded(photoData);
    } catch (error) {
      console.error("Error saving photo:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        name="title"
        value={photoData.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <textarea
        name="description"
        value={photoData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        type="url"
        name="url"
        value={photoData.url}
        onChange={handleChange}
        placeholder="Photo URL"
        required
      />
      <select
        name="category"
        value={photoData.category}
        onChange={handleChange}
        required
      >
        <option value="nature">Nature</option>
        <option value="urban">Urban</option>
        <option value="portrait">Portrait</option>
        <option value="other">Other</option>
      </select>
      <button type="submit">{photo ? "Update" : "Add"} Photo</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

export default AdminPhotoForm;
