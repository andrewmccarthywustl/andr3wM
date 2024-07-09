import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext"; // Assume you have an auth context
import "./Blog.css";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const { user, isAdmin } = useAuth(); // Assume you have an auth context that provides user info and admin status

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const fetchedBlogPosts = await api.getBlogPosts();
      setBlogPosts(fetchedBlogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  const handleBlogPostSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newBlogPost = {
      title: form.title.value,
      content: form.content.value,
    };
    try {
      await api.addBlogPost(newBlogPost);
      fetchBlogPosts();
      form.reset();
    } catch (error) {
      console.error("Error adding blog post:", error);
    }
  };

  const handleBlogPostEdit = async (id, updatedBlogPost) => {
    try {
      await api.updateBlogPost(id, updatedBlogPost);
      fetchBlogPosts();
    } catch (error) {
      console.error("Error updating blog post:", error);
    }
  };

  const handleBlogPostDelete = async (id) => {
    try {
      await api.deleteBlogPost(id);
      fetchBlogPosts();
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  };

  const handlePublishToggle = async (id, currentPublishState) => {
    try {
      await api.publishBlogPost(id, !currentPublishState);
      fetchBlogPosts();
    } catch (error) {
      console.error("Error toggling publish state:", error);
    }
  };

  return (
    <div className="blog">
      <h2>Blog Posts</h2>
      {user && (
        <form onSubmit={handleBlogPostSubmit}>
          <input
            name="title"
            type="text"
            placeholder="Blog Post Title"
            required
          />
          <textarea name="content" placeholder="Blog Post Content" required />
          <button type="submit">Add Blog Post</button>
        </form>
      )}
      <ul>
        {blogPosts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>Created: {new Date(post.created_at).toLocaleDateString()}</p>
            <p>
              Last Updated: {new Date(post.updated_at).toLocaleDateString()}
            </p>
            <p>Status: {post.published ? "Published" : "Draft"}</p>
            {(isAdmin || user?.id === post.author) && (
              <>
                <button
                  onClick={() =>
                    handleBlogPostEdit(post.id, {
                      ...post,
                      content: prompt("Edit blog post:", post.content),
                    })
                  }
                >
                  Edit
                </button>
                <button onClick={() => handleBlogPostDelete(post.id)}>
                  Delete
                </button>
                <button
                  onClick={() => handlePublishToggle(post.id, post.published)}
                >
                  {post.published ? "Unpublish" : "Publish"}
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
