// src/components/layout/SectionContainer.tsx
import React from "react";
import styles from "./Layout.module.css";

interface SectionContainerProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  noPaddingTop?: boolean;
  noPaddingBottom?: boolean;
  noPaddingX?: boolean;
  className?: string;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  fullWidth = false,
  noPaddingTop = false,
  noPaddingBottom = false,
  noPaddingX = false,
  className = "",
}) => {
  return (
    <div
      className={`
        ${styles.sectionContainer}
        ${fullWidth ? styles.fullWidth : ""}
        ${noPaddingTop ? styles.noPaddingTop : ""}
        ${noPaddingBottom ? styles.noPaddingBottom : ""}
        ${noPaddingX ? styles.noPaddingX : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default SectionContainer;
