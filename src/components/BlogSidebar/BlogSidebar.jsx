// src/components/BlogSidebar/BlogSidebar.jsx
import React, { useState } from "react";
import { useScrollTo } from "../../hooks/useScrollTo";
import styles from "./BlogSidebar.module.css";

const BlogSidebar = ({ posts, onPostClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const scrollToElement = useScrollTo(110); // Adjust header offset as needed

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter posts based on search term
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group posts by year
  const groupedPosts = filteredPosts.reduce((acc, post) => {
    const year = new Date(post.created_at).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {});

  // Sort years in descending order
  const sortedYears = Object.keys(groupedPosts).sort((a, b) => b - a);

  const handlePostClick = (postId) => {
    scrollToElement(`post-${postId}`);
    // Call the original onPostClick if needed
    if (onPostClick) onPostClick(postId);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>Recent Posts</h2>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.postsContainer}>
        {sortedYears.length > 0 ? (
          sortedYears.map((year) => (
            <div key={year} className={styles.yearGroup}>
              <h3 className={styles.yearHeading}>{year}</h3>
              <ul className={styles.postsList}>
                {groupedPosts[year].map((post) => (
                  <li key={post.id} className={styles.postItem}>
                    <button
                      onClick={() => handlePostClick(post.id)}
                      className={styles.postLink}
                    >
                      <span className={styles.postTitle}>{post.title}</span>
                      <span className={styles.postDate}>
                        {formatDate(post.created_at)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className={styles.emptyState}>
            {searchTerm ? "No posts match your search" : "No posts yet"}
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogSidebar;
