// src/components/layout/PageContainer.tsx
import React from "react";
import LoadingSpinner from "../LoadingSpinner";
import styles from "./Layout.module.css";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  loadingMessage?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
  isLoading = false,
  loadingMessage = "Loading content...",
}) => {
  return (
    <div className={`${styles.pageContainer} ${className}`}>
      {isLoading ? (
        <LoadingSpinner fullPage message={loadingMessage} />
      ) : (
        children
      )}
    </div>
  );
};

export default PageContainer;
