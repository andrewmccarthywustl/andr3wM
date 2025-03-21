// src/components/typography/Paragraph.tsx
import React from "react";
import styles from "./Typography.module.css";

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
  monospace?: boolean;
  size?: "small" | "medium" | "large";
}

export const Paragraph: React.FC<ParagraphProps> = ({
  children,
  className = "",
  monospace = false,
  size = "medium",
}) => {
  const monoClass = monospace ? styles.monospace : "";
  const sizeClass = styles[size];

  return (
    <p className={`${styles.paragraph} ${monoClass} ${sizeClass} ${className}`}>
      {children}
    </p>
  );
};

export default Paragraph;
