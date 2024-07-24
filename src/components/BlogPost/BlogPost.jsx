// src/components/BlogPost/BlogPost.jsx

import React, { useState } from "react";
import styles from "./BlogPost.module.css";

function BlogPost({ post, onEdit, onDelete, currentUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(post.title);
    setEditedContent(post.content);
  };

  const handleSaveEdit = () => {
    onEdit({ ...post, title: editedTitle, content: editedContent });
    setIsEditing(false);
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

  return (
    <div className={styles.blogPost}>
      {isEditing ? (
        <form className={styles.editForm}>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className={styles.editInput}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onKeyDown={handleTabKey}
            className={styles.editTextarea}
          />
          <div className={styles.editButtons}>
            <button onClick={handleSaveEdit} className={styles.saveButton}>
              Save Changes
            </button>
            <button onClick={handleCancelEdit} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
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
