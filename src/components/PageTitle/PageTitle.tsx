// src/components/PageTitle/PageTitle.tsx
import React from "react";
import styles from "./PageTitle.module.css";
import typography from "../../styles/typography.module.css";

interface PageTitleProps {
  title: string;
  subtitle?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle }) => {
  return (
    <div className={styles.titleContainer}>
      <h1 className={`${styles.pageTitle} ${typography.heading1}`}>{title}</h1>
    </div>
  );
};

export default PageTitle;
