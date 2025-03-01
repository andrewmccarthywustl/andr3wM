// src/layouts/PageLayout.tsx
import React from "react";
import styles from "./PageLayout.module.css";
import typography from "../styles/typography.module.css";

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  backgroundImage?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  children,
  backgroundImage,
}) => {
  return (
    <div className={styles.pageContainer}>
      <div
        className={styles.heroSection}
        style={
          backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}
        }
      >
        <div className={styles.heroContent}>
          <h1 className={`${styles.pageTitle} ${typography.heading1}`}>
            {title}
          </h1>
          {description && (
            <p className={`${styles.pageDescription} ${typography.bodyText}`}>
              {description}
            </p>
          )}
        </div>
      </div>
      <div className={styles.contentSection}>{children}</div>
    </div>
  );
};

export default PageLayout;
