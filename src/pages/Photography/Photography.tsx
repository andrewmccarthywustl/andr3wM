// src/pages/Photography/Photography.tsx

import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Masonry from "react-masonry-css";
import PageContainer from "../../components/layout/PageContainer";
import SectionContainer from "../../components/layout/SectionContainer";
import ImageCard from "../../components/ImageCard";
import AdminPhotoForm from "../../components/AdminPhotoForm/AdminPhotoForm";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { photoApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal/Modal";
import DeleteConfirmation from "../../components/DeleteConfirmation/DeleteConfirmation";
import LoadingSpinner from "../../components/LoadingSpinner";
import styles from "./Photography.module.css";

interface Photo {
  id: number;
  title: string;
  description?: string;
  url: string;
  category: string;
  position?: number;
  created_at: string;
}

const Photography: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightboxIsOpen, setLightboxIsOpen] = useState<boolean>(false);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [filter, _setFilter] = useState<string>("all"); // Using _setFilter to indicate it's unused
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPhotos = useCallback(
    async (pageNum: number, filterValue: string, reset = false) => {
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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        navigate("/my-works");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  useEffect(() => {
    fetchPhotos(page, filter, true);
  }, [filter, fetchPhotos]);

  useEffect(() => {
    if (page > 1) {
      fetchPhotos(page, filter);
    }
  }, [page, filter, fetchPhotos]);

  const openLightbox = (index: number) => {
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

  const handleEditPhoto = (photo: Photo) => {
    setEditingPhoto(photo);
    setIsEditModalOpen(true);
  };

  const handlePhotoEdited = async (updatedPhoto: Partial<Photo>) => {
    try {
      if (!editingPhoto) return;

      const editedPhoto = await photoApi.updatePhoto(
        editingPhoto.id,
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

  const handleDeletePhoto = (photoId: number) => {
    setPhotoToDelete(photoId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeletePhoto = async () => {
    if (photoToDelete === null) return;

    try {
      await photoApi.deletePhoto(photoToDelete);
      setPhotos(photos.filter((p) => p.id !== photoToDelete));
    } catch (error) {
      console.error("Error deleting photo:", error);
    } finally {
      setShowDeleteConfirmation(false);
      setPhotoToDelete(null);
    }
  };

  const cancelDeletePhoto = () => {
    setShowDeleteConfirmation(false);
    setPhotoToDelete(null);
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
  };

  // Current photo info for the lightbox
  const currentPhoto = photos[photoIndex] || {};

  if (loading && page === 1) {
    return (
      <PageContainer>
        <LoadingSpinner fullPage message="Loading photos..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className={styles.headerContainer}>
        <Link to="/my-works" className={styles.backLink}>
          ← Back to My Works
        </Link>
        {user && (
          <button onClick={handleAddPhoto} className={styles.addButton}>
            Add New Photo
          </button>
        )}

        {isAdding && (
          <div className={styles.formContainer}>
            <AdminPhotoForm
              onPhotoAdded={handlePhotoAdded}
              onCancel={() => setIsAdding(false)}
            />
          </div>
        )}
      </div>

      <SectionContainer fullWidth noPaddingX noPaddingTop>
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

        {loading && page > 1 && (
          <div className={styles.loaderContainer}>
            <LoadingSpinner fullPage={false} message="Loading more photos..." />
          </div>
        )}

        {lightboxIsOpen && (
          <Lightbox
            open={lightboxIsOpen}
            close={() => setLightboxIsOpen(false)}
            slides={[{ src: currentPhoto.url, alt: currentPhoto.title }]}
            // Fix for the render prop
            render={{
              // Using what's actually available in the library
              // (removed 'caption' since it's not supported)
              buttonPrev: () => null,
              buttonNext: () => null,
            }}
            carousel={{ finite: true }}
            controller={{
              closeOnBackdropClick: true,
            }}
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

        {showDeleteConfirmation && (
          <DeleteConfirmation
            onConfirm={confirmDeletePhoto}
            onCancel={cancelDeletePhoto}
            itemName="photo"
          />
        )}
      </SectionContainer>
    </PageContainer>
  );
};

export default Photography;
