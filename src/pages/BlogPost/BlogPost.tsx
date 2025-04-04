// src/pages/BlogPost/BlogPost.tsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { blogApi } from "../../services/api";
import { BlogPost as BlogPostType } from "../../services/api/types";
import { useAuth } from "../../context/AuthContext";
import PageContainer from "../../components/layout/PageContainer";
import SectionContainer from "../../components/layout/SectionContainer";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { formatDate } from "../../utils/formatters";
import styles from "./BlogPost.module.css";

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  useEffect(() => {
    // Check image when post changes
    if (post?.featured_image) {
      const img = new Image();
      img.onload = () => setImageError(false);
      img.onerror = () => setImageError(true);
      img.src = post.featured_image;
    }
  }, [post]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        navigate("/blog");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  const fetchBlogPost = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const data = await blogApi.getBlogPostById(id);
      setPost(data);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      setError(
        "Failed to load blog post. It may have been deleted or doesn't exist."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/blog/edit/${id}`);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      await blogApi.deleteBlogPost(id);
      navigate("/blog");
    } catch (error) {
      console.error("Error deleting blog post:", error);
      setError("Failed to delete blog post. Please try again.");
      setIsLoading(false);
    }
    setShowDeleteConfirmation(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading blog post..." />;
  }

  if (error || !post) {
    return (
      <PageContainer>
        <SectionContainer>
          <div className={styles.errorContainer}>
            <h2>Error</h2>
            <p>{error || "Blog post not found"}</p>
            <Link to="/blog" className={styles.backLink}>
              Return to Blog
            </Link>
          </div>
        </SectionContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {post.featured_image && !imageError && (
        <div className={styles.heroImageContainer}>
          <img
            src={post.featured_image}
            alt={post.title}
            className={styles.heroImage}
            onError={() => setImageError(true)}
          />
        </div>
      )}

      <SectionContainer>
        <div className={styles.blogHeader}>
          <Link to="/blog" className={styles.backLink}>
            ← Back to Blog
          </Link>

          {user && (
            <div className={styles.adminActions}>
              <Button variant="outline" size="small" onClick={handleEdit}>
                Edit
              </Button>
              <Button
                variant="outline"
                size="small"
                onClick={handleDelete}
                className={styles.deleteButton}
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        <article className={styles.blogPost}>
          <h1 className={styles.blogTitle}>{post.title}</h1>
          <p className={styles.blogDate}>{formatDate(post.created_at)}</p>

          <div className={styles.blogContent}>
            {post.content_text.split("\n").map((paragraph, index) =>
              paragraph.trim() !== "" ? (
                <p key={index} className={styles.paragraph}>
                  {paragraph}
                </p>
              ) : null
            )}
            <br />
            <h3>-@ndr3wM</h3>
          </div>
        </article>

        {showDeleteConfirmation && (
          <DeleteConfirmation
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            itemName="blog post"
          />
        )}
      </SectionContainer>
    </PageContainer>
  );
};

export default BlogPost;
