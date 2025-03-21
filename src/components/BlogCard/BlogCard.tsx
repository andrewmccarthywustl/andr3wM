// src/components/BlogCard/BlogCard.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatters";
import styles from "./BlogCard.module.css";
import { BlogPost } from "../../services/api/types";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const [, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  // Default placeholder image
  const placeholderImage = "https://via.placeholder.com/800x400?text=No+Image";

  // Pre-check if image exists on component mount
  useEffect(() => {
    if (post.featured_image) {
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true);
        setImageError(false);
      };
      img.onerror = () => {
        setImageError(true);
        setImageLoaded(false);
      };
      img.src = post.featured_image;
    }
  }, [post.featured_image]);

  // Decide which image to display
  const displayImage =
    !post.featured_image || imageError ? placeholderImage : post.featured_image;

  return (
    <Link to={`/blog/${post.id}`} className={styles.blogCard}>
      <div className={styles.imageContainer}>
        <img
          src={displayImage}
          alt={post.title}
          className={styles.cardImage}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            console.error("Failed to load image:", post.featured_image);
            setImageError(true);
          }}
        />
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{post.title}</h3>
        <p className={styles.cardDate}>{formatDate(post.created_at)}</p>
        <div className={styles.cardPreview}>
          {post.content_text?.slice(0, 120) || ""}
          {(post.content_text?.length || 0) > 120 ? "..." : ""}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
