// src/pages/BlogPostEditor/BlogPostEditor.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blogApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import PageContainer from "../../components/layout/PageContainer";
import SectionContainer from "../../components/layout/SectionContainer";
import LoadingSpinner from "../../components/LoadingSpinner";
import Button from "../../components/ui/Button";
import styles from "./BlogPostEditor.module.css";

interface BlogFormData {
  title: string;
  content_text: string;
  featured_image: string;
}

const BlogPostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content_text: "",
    featured_image: "",
  });

  // Use this instead of checking image directly
  const [isImageValid, setIsImageValid] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isEditMode && id) {
      fetchBlogPost();
    } else {
      setIsLoading(false);
    }
  }, [id, user, navigate, isEditMode]);

  const fetchBlogPost = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const data = await blogApi.getBlogPostById(id);
      setFormData({
        title: data.title || "",
        content_text: data.content_text || "",
        featured_image: data.featured_image || "",
      });

      // Pre-validate the image if it exists
      if (data.featured_image) {
        checkImage(data.featured_image);
      }
    } catch (error) {
      console.error("Error fetching blog post:", error);
      setError("Failed to load blog post for editing.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check if an image URL is valid
  const checkImage = (url: string): void => {
    const img = new Image();
    img.onload = () => setIsImageValid(true);
    img.onerror = () => setIsImageValid(false);
    img.src = url;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "featured_image" && value) {
      checkImage(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setIsLoading(true);

      if (isEditMode && id) {
        await blogApi.updateBlogPost(id, formData);
        navigate(`/blog/${id}`);
      } else {
        const newPost = await blogApi.addBlogPost(formData);
        navigate(`/blog/${newPost.id}`);
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
      setError("Failed to save blog post. Please try again.");
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode && id) {
      navigate(`/blog/${id}`);
    } else {
      navigate("/blog");
    }
  };

  const testImage = () => {
    if (formData.featured_image) {
      window.open(formData.featured_image, "_blank");
    }
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        fullPage
        message={isEditMode ? "Loading blog post..." : "Preparing editor..."}
      />
    );
  }

  return (
    <PageContainer>
      <SectionContainer>
        <div className={styles.editorContainer}>
          <h1 className={styles.editorTitle}>
            {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.blogForm}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.formLabel}>
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Enter blog post title"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="featured_image" className={styles.formLabel}>
                Featured Image URL
              </label>
              <div className={styles.inputWithButton}>
                <input
                  id="featured_image"
                  name="featured_image"
                  type="text" // Using text instead of url for more flexible input
                  value={formData.featured_image}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Enter image URL"
                />
                <button
                  type="button"
                  onClick={testImage}
                  className={styles.testButton}
                  disabled={!formData.featured_image}
                >
                  Test
                </button>
              </div>

              {formData.featured_image && (
                <div className={styles.imagePreviewContainer}>
                  <div className={styles.imagePreview}>
                    <img
                      src={formData.featured_image}
                      alt="Preview"
                      className={styles.previewImage}
                      onLoad={() => setIsImageValid(true)}
                      onError={() => setIsImageValid(false)}
                    />
                    {!isImageValid && (
                      <div className={styles.imageErrorOverlay}>
                        <p>Image could not be loaded</p>
                        <p className={styles.smallText}>
                          The URL may be incorrect or the image might not be
                          publicly accessible
                        </p>
                      </div>
                    )}
                  </div>
                  <p className={styles.imageHelpText}>
                    {isImageValid
                      ? "Image validated successfully"
                      : "Make sure the image URL is publicly accessible and directly links to an image file."}
                  </p>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="content_text" className={styles.formLabel}>
                Content
              </label>
              <textarea
                id="content_text"
                name="content_text"
                value={formData.content_text}
                onChange={handleChange}
                className={styles.formTextarea}
                placeholder="Write your blog post here..."
                rows={15}
                required
              />
            </div>

            <div className={styles.formActions}>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Post"
                  : "Publish Post"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </SectionContainer>
    </PageContainer>
  );
};

export default BlogPostEditor;
