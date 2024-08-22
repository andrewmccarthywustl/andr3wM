// src/components/RichBlogPostEditor/RichBlogPostEditor.jsx

import React, { useState } from "react";
import styles from "./RichBlogPostEditor.module.css";

const RichBlogPostEditor = ({ initialContent, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialContent?.title || "");
  const [content, setContent] = useState(initialContent?.text || "");
  const [images, setImages] = useState(initialContent?.images || []);
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleAddImage = () => {
    if (newImageUrl) {
      setImages([...images, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSave = () => {
    const blogPostContent = {
      title,
      content: {
        text: content,
        images: images,
      },
    };
    console.log("Saving blog post with content:", blogPostContent);
    onSave(blogPostContent);
  };

  return (
    <div className={styles.editorContainer}>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Enter blog post title"
        className={styles.titleInput}
      />
      <textarea
        value={content}
        onChange={handleContentChange}
        className={styles.contentTextarea}
        placeholder="Write your blog post here..."
      />
      <div className={styles.imageSection}>
        <input
          type="text"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Enter image URL"
          className={styles.imageInput}
        />
        <button onClick={handleAddImage} className={styles.addImageButton}>
          Add Image
        </button>
      </div>
      <div className={styles.imagePreview}>
        {images.map((url, index) => (
          <div key={index} className={styles.imageContainer}>
            <img
              src={url}
              alt={`Preview ${index}`}
              className={styles.previewImage}
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className={styles.removeImageButton}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handleSave} className={styles.saveButton}>
          Save Post
        </button>
        <button onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RichBlogPostEditor;
