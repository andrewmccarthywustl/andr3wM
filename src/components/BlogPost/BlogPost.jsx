import React, { useState, useRef, useEffect } from "react";
import styles from "./BlogPost.module.css";
import RichBlogPostEditor from "../RichBlogPostEditor/RichBlogPostEditor";
import typography from "../../styles/typography.module.css";

function BlogPost({ post, onEdit, onDelete, currentUser, index, id }) {
  const [isEditing, setIsEditing] = useState(false);
  const postRef = useRef(null);

  useEffect(() => {
    const postElement = postRef.current;
    if (postElement) {
      postElement.style.animationDelay = `${index * 0.1}s`;
    }
  }, [index]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = (editedPost) => {
    onEdit({ ...post, ...editedPost });
    setIsEditing(false);
  };

  const renderContent = () => {
    if (!post.content) {
      console.error("Post content is undefined:", post);
      return <p>Error: Content not available</p>;
    }

    const { text, images } = post.content;
    const paragraphs = (text || "").split("\n");
    const content = [];
    let imageIndex = 0;

    paragraphs.forEach((paragraph, index) => {
      if (paragraph.trim() !== "") {
        if (images && images[imageIndex]) {
          content.push(
            <div key={`content${index}`} className={styles.contentWrapper}>
              <img
                src={images[imageIndex]}
                alt={`Blog image ${imageIndex + 1}`}
                className={styles.inlineImage}
              />
              <p>{paragraph}</p>
            </div>
          );
          imageIndex++;
        } else {
          content.push(<p key={`p${index}`}>{paragraph}</p>);
        }
      }
    });

    // Add any remaining images
    for (let i = imageIndex; i < (images?.length || 0); i++) {
      content.push(
        <img
          key={`img${i}`}
          src={images[i]}
          alt={`Blog image ${i + 1}`}
          className={styles.inlineImage}
        />
      );
    }

    return content;
  };

  return (
    <div
      ref={postRef}
      className={`${styles.blogPost} ${styles.slideIn}`}
      id={id}
    >
      {isEditing ? (
        <RichBlogPostEditor
          initialContent={{ title: post.title, ...post.content }}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          <h2 className={`${styles.postTitle} ${typography.heading2}`}>
            {post.title}
          </h2>
          <p className={`${styles.postMeta} ${typography.bodyText}`}>
            {new Date(post.created_at).toLocaleDateString()}
          </p>
          <div className={`${styles.postContent} ${typography.bodyText}`}>
            {renderContent()}
          </div>
          {currentUser &&
            (currentUser.id === post.author || currentUser.isAdmin) && (
              <div className={styles.postActions}>
                <button onClick={handleEdit} className={styles.editButton}>
                  Edit
                </button>
                <button
                  onClick={() => onDelete(post.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            )}
        </>
      )}
    </div>
  );
}

export default BlogPost;
