// src/components/BlogPostForm/BlogPostForm.jsx

import React, { useState } from "react";
import styles from "./BlogPostForm.module.css";

function BlogPostForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
    setTitle("");
    setContent("");
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
    <form onSubmit={handleSubmit} className={styles.blogForm}>
      <input
        name="title"
        type="text"
        placeholder="Blog Post Title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.input}
      />
      <textarea
        name="content"
        placeholder="Blog Post Content"
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleTabKey}
        className={styles.textarea}
      />
      <button type="submit" className={styles.submitButton}>
        Add Blog Post
      </button>
    </form>
  );
}

export default BlogPostForm;
