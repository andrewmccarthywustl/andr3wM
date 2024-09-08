// src/pages/Photography/Photography.jsx

import React, { useState, useEffect, useCallback } from "react";
import Masonry from "react-masonry-css";
import ImageCard from "../../components/ImageCard/ImageCard";
import AdminPhotoForm from "../../components/AdminPhotoForm/AdminPhotoForm";
import Lightbox from "react-image-lightbox";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "react-image-lightbox/style.css";
import styles from "./Photography.module.css";

function Photography() {
  const [photos, setPhotos] = useState([]);
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const { user } = useAuth();

  const fetchPhotos = useCallback(
    async (pageNum, filterValue, reset = false) => {
      if (!hasMore && !reset) return;

      setLoading(true);
      try {
        const newPhotos = await api.getPhotos({
          page: pageNum,
          filter: filterValue,
        });
        setPhotos((prevPhotos) =>
          reset ? newPhotos : [...prevPhotos, ...newPhotos]
        );
        setHasMore(newPhotos.length === 20); // Assuming pageSize is 20
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setLoading(false);
      }
    },
    [hasMore]
  );

  useEffect(() => {
    fetchPhotos(page, filter, true);
  }, [filter]);

  useEffect(() => {
    if (page > 1) {
      fetchPhotos(page, filter);
    }
  }, [page, fetchPhotos]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
    setHasMore(true);
  };

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setLightboxIsOpen(true);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading
    ) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddPhoto = () => {
    setIsAdding(true);
  };

  const handlePhotoAdded = () => {
    setIsAdding(false);
    setPage(1);
    setHasMore(true);
    fetchPhotos(1, filter, true);
  };

  const handlePhotoEdited = async (updatedPhoto) => {
    try {
      const editedPhoto = await api.updatePhoto(updatedPhoto.id, updatedPhoto);
      setEditingPhoto(null);
      setPhotos(photos.map((p) => (p.id === editedPhoto.id ? editedPhoto : p)));
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (window.confirm("Are you sure you want to delete this photo?")) {
      try {
        await api.deletePhoto(photoId);
        setPhotos(photos.filter((p) => p.id !== photoId));
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    }
  };

  const breakpointColumnsObj = {
    default: 6,
    1100: 5,
    700: 4,
    500: 3,
  };

  return (
    <div className={styles.photographyContainer}>
      <h1 className={styles.title}>Photography</h1>
      {user && (
        <button onClick={handleAddPhoto} className={styles.addButton}>
          Add New Photo
        </button>
      )}
      {isAdding && (
        <AdminPhotoForm
          onPhotoAdded={handlePhotoAdded}
          onCancel={() => setIsAdding(false)}
        />
      )}
      <div className={styles.filterContainer}>
        <button
          onClick={() => handleFilterChange("all")}
          className={filter === "all" ? styles.active : ""}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange("nature")}
          className={filter === "nature" ? styles.active : ""}
        >
          Nature
        </button>
        <button
          onClick={() => handleFilterChange("urban")}
          className={filter === "urban" ? styles.active : ""}
        >
          Urban
        </button>
        <button
          onClick={() => handleFilterChange("portrait")}
          className={filter === "portrait" ? styles.active : ""}
        >
          Portrait
        </button>
      </div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.myMasonryGrid}
        columnClassName={styles.myMasonryGridColumn}
      >
        {photos.map((photo, index) => (
          <div key={photo.id} className={styles.photoWrapper}>
            <ImageCard photo={photo} onClick={() => openLightbox(index)} />
            {user && (
              <div className={styles.adminControls}>
                <button onClick={() => handleEditPhoto(photo)}>Edit</button>
                <button onClick={() => handleDeletePhoto(photo.id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </Masonry>
      {loading && <div className={styles.loader}>Loading...</div>}
      {lightboxIsOpen && (
        <Lightbox
          mainSrc={photos[photoIndex].url}
          nextSrc={photos[(photoIndex + 1) % photos.length].url}
          prevSrc={photos[(photoIndex + photos.length - 1) % photos.length].url}
          onCloseRequest={() => setLightboxIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + photos.length - 1) % photos.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % photos.length)
          }
          imageCaption={photos[photoIndex].title}
        />
      )}
      {editingPhoto && (
        <AdminPhotoForm
          photo={editingPhoto}
          onPhotoAdded={handlePhotoEdited}
          onCancel={() => setEditingPhoto(null)}
        />
      )}
    </div>
  );
}

export default Photography;
