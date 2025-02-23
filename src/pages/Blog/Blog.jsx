// src/pages/Blog/Blog.jsx

import React, { useState, useEffect } from "react";
import { blogApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import RichBlogPostEditor from "../../components/RichBlogPostEditor/RichBlogPostEditor";
import BlogPost from "../../components/BlogPost/BlogPost";
import DeleteConfirmation from "../../components/DeleteConfirmation/DeleteConfirmation";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styles from "./Blog.module.css";
import typography from "../../styles/typography.module.css";

function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true);
      const data = await blogApi.getBlogPosts();
      console.log("Fetched blog posts:", data);
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
      console.log("Submitting new blog post:", newBlogPost);
      const addedPost = await blogApi.addBlogPost(newBlogPost);
      console.log("Received added post from API:", addedPost);
      setBlogPosts([addedPost, ...blogPosts]);
      setIsAddingPost(false);
    } catch (error) {
      console.error("Error adding blog post:", error);
      setError(error.message || "Failed to add blog post. Please try again.");
    }
  };

  const handleEditSubmit = async (updatedPost) => {
    try {
      console.log("Submitting edited post:", updatedPost);
      const editedPost = await blogApi.updateBlogPost(
        updatedPost.id,
        updatedPost
      );
      console.log("Received edited post from API:", editedPost);
      setBlogPosts(
        blogPosts.map((post) => (post.id === editedPost.id ? editedPost : post))
      );
    } catch (error) {
      console.error("Error updating blog post:", error);
      setError("Failed to update blog post. Please try again.");
    }
  };

  const handleDeletePost = async (postId) => {
    setDeleteConfirmation(postId);
  };

  const confirmDeletePost = async () => {
    if (!deleteConfirmation) return;

    try {
      await blogApi.deleteBlogPost(deleteConfirmation);
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
        <h1 className={`${styles.blogTitle} ${typography.heading1}`}>
          The Blog
        </h1>
        {user && !isAddingPost && (
          <button
            onClick={() => setIsAddingPost(true)}
            className={styles.addPostButton}
          >
            Add Blog Post
          </button>
        )}
        {isAddingPost && (
          <RichBlogPostEditor
            onSave={handleBlogPostSubmit}
            onCancel={() => setIsAddingPost(false)}
          />
        )}
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
