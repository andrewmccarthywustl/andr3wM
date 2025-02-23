// src/pages/Photography/Photography.jsx

import React, { useState, useEffect, useCallback } from "react";
import Masonry from "react-masonry-css";
import ImageCard from "../../components/ImageCard";
import AdminPhotoForm from "../../components/AdminPhotoForm/AdminPhotoForm";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { photoApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal/Modal";
import LoadingSpinner from "../../components/LoadingSpinner";
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user } = useAuth();

  const fetchPhotos = useCallback(
    async (pageNum, filterValue, reset = false) => {
      if (!hasMore && !reset) return;

      setLoading(true);
      try {
        const newPhotos = await photoApi.getPhotos({
          page: pageNum,
          filter: filterValue,
        });
        setPhotos((prevPhotos) =>
          reset ? newPhotos : [...prevPhotos, ...newPhotos]
        );
        setHasMore(newPhotos.length === 20);
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

  const handleEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setIsEditModalOpen(true);
  };

  const handlePhotoEdited = async (updatedPhoto) => {
    try {
      const editedPhoto = await photoApi.updatePhoto(
        updatedPhoto.id,
        updatedPhoto
      );
      setPhotos(photos.map((p) => (p.id === editedPhoto.id ? editedPhoto : p)));
      setIsEditModalOpen(false);
      setEditingPhoto(null);
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingPhoto(null);
  };

  const handleDeletePhoto = async (photoId) => {
    if (window.confirm("Are you sure you want to delete this photo?")) {
      try {
        await photoApi.deletePhoto(photoId);
        setPhotos(photos.filter((p) => p.id !== photoId));
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    }
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
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
      {loading && (
        <div className={styles.loaderContainer}>
          <LoadingSpinner />
        </div>
      )}
      {lightboxIsOpen && (
        <Lightbox
          open={lightboxIsOpen}
          close={() => setLightboxIsOpen(false)}
          slides={photos.map((photo) => ({
            src: photo.url,
            alt: photo.title,
          }))}
          currentIndex={photoIndex}
          index={photoIndex}
          onPrev={() =>
            setPhotoIndex(
              (prevIndex) => (prevIndex - 1 + photos.length) % photos.length
            )
          }
          onNext={() =>
            setPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length)
          }
        />
      )}
      <Modal isOpen={isEditModalOpen} onClose={handleCancelEdit}>
        {editingPhoto && (
          <AdminPhotoForm
            photo={editingPhoto}
            onPhotoAdded={handlePhotoEdited}
            onCancel={handleCancelEdit}
          />
        )}
      </Modal>
    </div>
  );
}

export default Photography;
