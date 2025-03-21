// src/components/layout/ContentContainer.tsx
import React from "react";
import styles from "./Layout.module.css";

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`${styles.contentContainer} ${className}`}>{children}</div>
  );
};

export default ContentContainer;
