// src/pages/Blog/Blog.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { blogApi } from "../../services/api";
import { BlogPost } from "../../services/api/types";
import { useAuth } from "../../context/AuthContext";
import PageContainer from "../../components/layout/PageContainer";
import SectionContainer from "../../components/layout/SectionContainer";
import PageTitle from "../../components/typograpny/PageTitle";
import BlogCard from "../../components/BlogCard/BlogCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import Button from "../../components/ui/Button";
import styles from "./Blog.module.css";

const Blog: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleAddNewPost = () => {
    navigate("/blog/new");
  };

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading blog posts..." />;
  }

  return (
    <PageContainer>
      <SectionContainer>
        <PageTitle
          title="Blog"
          subtitle="Thoughts, ideas, and other things I've written down"
        />

        {user && (
          <div className={styles.adminControls}>
            <Button variant="primary" onClick={handleAddNewPost}>
              Add New Post
            </Button>
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.blogGrid}>
          {blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <div key={post.id} className={styles.blogCardContainer}>
                <BlogCard post={post} />
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </SectionContainer>
    </PageContainer>
  );
};

export default Blog;
