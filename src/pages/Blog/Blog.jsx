// src/pages/Blog/Blog.jsx

import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import BlogPostForm from "../../components/BlogPostForm";
import BlogPost from "../../components/BlogPost";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import LoadingSpinner from "../../components/LoadingSpinner";
import styles from "./Blog.module.css";

function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true);
      const data = await api.getBlogPosts();
      setBlogPosts(data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setError("Failed to load blog posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlogPostSubmit = async (newBlogPost) => {
    try {
      setError(null);
      const addedPost = await api.addBlogPost(newBlogPost);
      setBlogPosts([addedPost, ...blogPosts]);
    } catch (error) {
      console.error("Error adding blog post:", error);
      setError(error.message || "Failed to add blog post. Please try again.");
    }
  };

  const handleEditSubmit = async (updatedPost) => {
    try {
      const editedPost = await api.updateBlogPost(updatedPost.id, updatedPost);
      setBlogPosts(
        blogPosts.map((post) => (post.id === editedPost.id ? editedPost : post))
      );
    } catch (error) {
      console.error("Error updating blog post:", error);
      setError(
        error.message || "Failed to update blog post. Please try again."
      );
    }
  };

  const handleDeletePost = async (postId) => {
    setDeleteConfirmation(postId);
  };

  const confirmDeletePost = async () => {
    if (!deleteConfirmation) return;

    try {
      await api.deleteBlogPost(deleteConfirmation);
      setBlogPosts(blogPosts.filter((post) => post.id !== deleteConfirmation));
      setDeleteConfirmation(null);
    } catch (error) {
      console.error("Error deleting blog post:", error);
      setError("Failed to delete blog post. Please try again.");
    }
  };

  const cancelDeletePost = () => {
    setDeleteConfirmation(null);
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) return <div className={styles.errorMessage}>{error}</div>;

  return (
    <div className={styles.blogContainer}>
      <div className={styles.blogContent}>
        <h2 className={styles.blogTitle}>The Blog</h2>
        {user && <BlogPostForm onSubmit={handleBlogPostSubmit} />}
        <div className={styles.blogPosts}>
          {blogPosts.map((post, index) => (
            <BlogPost
              key={post.id}
              post={post}
              onEdit={handleEditSubmit}
              onDelete={handleDeletePost}
              currentUser={user}
              index={index}
            />
          ))}
        </div>
        {deleteConfirmation && (
          <DeleteConfirmation
            onConfirm={confirmDeletePost}
            onCancel={cancelDeletePost}
            itemName="blog post"
          />
        )}
      </div>
    </div>
  );
}

export default Blog;
