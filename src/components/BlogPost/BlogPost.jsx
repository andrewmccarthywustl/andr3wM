// src/components/BlogPost/BlogPost.jsx

import React, { useState, useEffect, useRef } from "react";
import styles from "./BlogPost.module.css";
import EditBlogPostForm from "../EditBlogPostForm";

function BlogPost({ post, onEdit, onDelete, currentUser, index }) {
  const [isEditing, setIsEditing] = useState(false);
  const postRef = useRef(null);

  useEffect(() => {
    const post = postRef.current;
    if (post) {
      post.style.animationDelay = `${index * 0.1}s`;
    }
  }, [index]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = (editedPost) => {
    onEdit(editedPost);
    setIsEditing(false);
  };

  return (
    <div ref={postRef} className={`${styles.blogPost} ${styles.slideIn}`}>
      {isEditing ? (
        <EditBlogPostForm
          post={post}
          onSubmit={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          <h3 className={styles.postTitle}>{post.title}</h3>
          <pre className={styles.postContent}>{post.content}</pre>
          <p className={styles.postMeta}>
            <span className={styles.postDate}>
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </p>
          {currentUser &&
            (currentUser.id === post.author || currentUser.isAdmin) && (
              <div className={styles.postActions}>
                <button onClick={handleEdit} className={styles.editButton}>
                  Edit Post
                </button>
                <button
                  onClick={() => onDelete(post.id)}
                  className={styles.deleteButton}
                >
                  Delete Post
                </button>
              </div>
            )}
        </>
      )}
    </div>
  );
}

export default BlogPost;
