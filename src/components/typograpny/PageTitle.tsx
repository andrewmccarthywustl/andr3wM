// src/components/typography/PageTitle.tsx
import React from "react";
import styles from "./PageTitle.module.css";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  subtitle,
  className = "",
}) => {
  return (
    <div className={`${styles.pageTitleContainer} ${className}`}>
      <h1 className={styles.pageTitle}>{title}</h1>
      {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
      <div className={styles.horizontalLine}></div>
    </div>
  );
};

export default PageTitle;
