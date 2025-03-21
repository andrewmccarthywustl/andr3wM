// src/components/typography/SectionTitle.tsx
import React from "react";
import styles from "./SectionTitle.module.css";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  className = "",
}) => {
  return (
    <div className={`${styles.sectionTitleContainer} ${className}`}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
