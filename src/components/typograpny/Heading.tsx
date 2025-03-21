// src/components/typography/Heading.tsx
import React from "react";
import styles from "./Typography.module.css";

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}

export const Heading: React.FC<HeadingProps> = ({
  level,
  children,
  className = "",
  accent = false,
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const baseClass = styles[`heading${level}`];
  const accentClass = accent ? styles.accent : "";

  return (
    <Tag className={`${baseClass} ${accentClass} ${className}`}>{children}</Tag>
  );
};

export default Heading;
