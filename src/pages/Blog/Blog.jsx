// src/pages/Blog/Blog.jsx
import React, { useState, useEffect } from "react";
import { blogApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import RichBlogPostEditor from "../../components/RichBlogPostEditor/RichBlogPostEditor";
import BlogPost from "../../components/BlogPost/BlogPost";
import BlogSidebar from "../../components/BlogSidebar/BlogSidebar";
import DeleteConfirmation from "../../components/DeleteConfirmation/DeleteConfirmation";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import PageTitle from "../../components/PageTitle/PageTitle";
import styles from "./Blog.module.css";

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
      const addedPost = await blogApi.addBlogPost(newBlogPost);
      setBlogPosts([addedPost, ...blogPosts]);
      setIsAddingPost(false);
    } catch (error) {
      console.error("Error adding blog post:", error);
      setError(error.message || "Failed to add blog post. Please try again.");
    }
  };

  const handleEditSubmit = async (updatedPost) => {
    try {
      const editedPost = await blogApi.updateBlogPost(
        updatedPost.id,
        updatedPost
      );
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
  // In Blog.jsx
  const scrollToPost = (postId) => {
    // The element ID should include "post-" prefix based on your markup
    const element = document.getElementById(`post-${postId}`);
    if (element) {
      // Maybe add visual highlighting if needed
      console.log(`Post #post-${postId} exists`);
    }
    if (!element) {
      console.error(`Post element with id "post-${postId}" not found`);
      return;
    }

    // Calculate the header height (adjust value as needed)
    const headerHeight = 80;

    // Calculate position
    const elementRect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetPosition = scrollTop + elementRect.top - headerHeight;

    // Scroll the window
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    setTimeout(() => {
      element.style.backgroundColor = "";
    }, 1500);

    // Debug info
    console.log(`Scrolling to post-${postId}`, {
      elementRect,
      headerHeight,
      targetPosition,
    });
  };

  if (isLoading)
    return <LoadingSpinner fullPage message="Loading blog posts..." />;

  if (error) return <div className={styles.errorMessage}>{error}</div>;

  return (
    <div className={styles.blogPageContainer}>
      <PageTitle title="The Blog" />
      <div className={styles.contentWrapper}>
        <div className={styles.blogGrid}>
          <div className={styles.blogContentColumn}>
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
                  id={`post-${post.id}`} // This is crucial - ensure this exact format is used
                />
              ))}
            </div>
          </div>

          <div className={styles.sidebarColumn}>
            <BlogSidebar posts={blogPosts} onPostClick={scrollToPost} />
          </div>
        </div>
      </div>

      {deleteConfirmation && (
        <DeleteConfirmation
          onConfirm={confirmDeletePost}
          onCancel={cancelDeletePost}
          itemName="blog post"
        />
      )}
    </div>
  );
}

export default Blog;
