// src/components/EditBlogPostForm/EditBlogPostForm.jsx

import React, { useState } from "react";
import styles from "./EditBlogPostForm.module.css";

function EditBlogPostForm({ post, onSubmit, onCancel }) {
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...post, title: editedTitle, content: editedContent });
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
    <form onSubmit={handleSubmit} className={styles.editForm}>
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
        <button type="submit" className={styles.saveButton}>
          Save Changes
        </button>
        <button onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditBlogPostForm;
