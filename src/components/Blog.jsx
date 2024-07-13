import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Blog.css";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const { user, isAdmin } = useAuth();

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

  const handleBlogPostSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const form = e.target;
    const newBlogPost = {
      title: form.title.value,
      content: form.content.value,
    };
    try {
      const addedPost = await api.addBlogPost(newBlogPost);
      setBlogPosts([addedPost, ...blogPosts]);
      form.reset();
    } catch (error) {
      console.error("Error adding blog post:", error);
      setError(error.message || "Failed to add blog post. Please try again.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const form = e.target;
    const updatedPost = {
      id: editingPost.id,
      title: form.title.value,
      content: form.content.value,
    };
    try {
      const editedPost = await api.updateBlogPost(editingPost.id, updatedPost);
      setBlogPosts(
        blogPosts.map((post) => (post.id === editedPost.id ? editedPost : post))
      );
      setEditingPost(null);
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

  const handleTabKey = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      target.value =
        target.value.substring(0, start) + "\t" + target.value.substring(end);
      target.selectionStart = target.selectionEnd = start + 1;
    }
  };

  const DeleteConfirmationPopup = () => (
    <div className="delete-confirmation-popup">
      <p>Are you sure you want to delete this blog post?</p>
      <button onClick={confirmDeletePost}>Yes, delete</button>
      <button onClick={cancelDeletePost}>Cancel</button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <div className="blog-background"></div>
      <div className="blog-container">
        <h2 className="blog-title">The Blog</h2>
        {user && (
          <form onSubmit={handleBlogPostSubmit} className="blog-form">
            <input
              name="title"
              type="text"
              placeholder="Blog Post Title"
              required
            />
            <textarea
              name="content"
              placeholder="Blog Post Content"
              required
              onKeyDown={handleTabKey}
            />
            <button type="submit">Add Blog Post</button>
          </form>
        )}
        <div className="blog-posts">
          {blogPosts.map((post) => (
            <div key={post.id} className="blog-post">
              {editingPost && editingPost.id === post.id ? (
                <form onSubmit={handleEditSubmit} className="edit-form">
                  <input
                    name="title"
                    type="text"
                    defaultValue={post.title}
                    required
                  />
                  <textarea
                    name="content"
                    defaultValue={post.content}
                    required
                    onKeyDown={handleTabKey}
                  />
                  <button type="submit">Save Changes</button>
                  <button type="button" onClick={() => setEditingPost(null)}>
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h3 className="post-title">{post.title}</h3>
                  <pre className="post-content">{post.content}</pre>
                  <p className="post-meta">
                    <span className="post-date">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </p>
                  {user && (user.id === post.author || isAdmin) && (
                    <div className="post-actions">
                      <button
                        onClick={() => setEditingPost(post)}
                        className="edit-post-button"
                      >
                        Edit Post
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="delete-post-button"
                      >
                        Delete Post
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        {deleteConfirmation && <DeleteConfirmationPopup />}
      </div>
    </>
  );
};

export default Blog;
