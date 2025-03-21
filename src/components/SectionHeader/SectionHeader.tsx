// src/components/SectionHeader/SectionHeader.tsx
import React, { ReactNode, useState, useRef, useEffect } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { BsCalendar, BsStarFill, BsSortAlphaDown } from "react-icons/bs";
import styles from "./SectionHeader.module.css";

type ButtonType = "default" | "action";

interface ActionButton {
  type: ButtonType;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

interface SortOption {
  key: string;
  label: string;
  icon: ReactNode;
}

// Base SectionHeader without sorting
interface SectionHeaderProps {
  title: string;
  className?: string;
  actionButtons?: ActionButton[];
  children?: ReactNode;
}

// Extended SectionHeader with sorting capability
interface SortableSectionHeaderProps extends SectionHeaderProps {
  sortable: true;
  currentSort: { key: string; order: "asc" | "desc" };
  onSort: (key: string, order: "asc" | "desc") => void;
}

// Type to handle both variants
type CombinedSectionHeaderProps =
  | SectionHeaderProps
  | SortableSectionHeaderProps;

// Helper to determine if props include sorting
const isSortable = (
  props: CombinedSectionHeaderProps
): props is SortableSectionHeaderProps => {
  return "sortable" in props && props.sortable === true;
};

const SectionHeader: React.FC<CombinedSectionHeaderProps> = (props) => {
  const { title, className = "", actionButtons = [], children } = props;
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Sort options with icons
  const sortOptions: SortOption[] = [
    { key: "created_at", label: "Date", icon: <BsCalendar size={18} /> },
    { key: "rating", label: "Rating", icon: <BsStarFill size={18} /> },
    { key: "title", label: "Title", icon: <BsSortAlphaDown size={18} /> },
  ];

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortOpen]);

  // Get current sort option label
  const getCurrentSortLabel = () => {
    if (isSortable(props)) {
      const option = sortOptions.find(
        (opt) => opt.key === props.currentSort.key
      );
      return option ? option.label : "Sort";
    }
    return "";
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    if (isSortable(props)) {
      props.onSort(
        props.currentSort.key,
        props.currentSort.order === "asc" ? "desc" : "asc"
      );
    }
  };

  return (
    <div className={`${styles.sectionHeaderContainer} ${className}`}>
      <div className={styles.headerContent}>
        <h2 className={styles.sectionTitle}>{title}</h2>

        <div className={styles.actionButtonsContainer}>
          {/* Render sort controls only if sortable */}
          {isSortable(props) && (
            <div ref={sortRef} className={styles.sortContainer}>
              {/* Sort button that opens dropdown */}
              <button
                className={styles.sortButton}
                onClick={() => setIsSortOpen(!isSortOpen)}
                aria-expanded={isSortOpen}
                aria-label="Sort options"
              >
                {/* Current sort option icon */}
                <span className={styles.buttonIcon}>
                  {
                    sortOptions.find((opt) => opt.key === props.currentSort.key)
                      ?.icon
                  }
                </span>
                <span className={styles.buttonLabel}>
                  Sort by {getCurrentSortLabel()}
                </span>
              </button>

              {/* Separate order toggle button */}
              <button
                className={styles.orderToggleButton}
                onClick={toggleSortDirection}
                aria-label={`Sort ${
                  props.currentSort.order === "asc" ? "ascending" : "descending"
                }`}
              >
                {props.currentSort.order === "asc" ? (
                  <IoChevronUp className={styles.orderIcon} />
                ) : (
                  <IoChevronDown className={styles.orderIcon} />
                )}
              </button>

              {/* Dropdown menu for sort options */}
              {isSortOpen && (
                <div className={styles.sortDropdown}>
                  {sortOptions.map((option) => (
                    <button
                      key={option.key}
                      className={`${styles.sortOption} ${
                        option.key === props.currentSort.key
                          ? styles.activeSort
                          : ""
                      }`}
                      onClick={() => {
                        props.onSort(option.key, props.currentSort.order);
                        setIsSortOpen(false);
                      }}
                    >
                      <span className={styles.sortOptionIcon}>
                        {option.icon}
                      </span>
                      <span className={styles.sortOptionLabel}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Regular action buttons */}
          {actionButtons.map((button, index) => (
            <button
              key={`button-${index}`}
              className={`${styles.actionButton} ${
                button.isActive ? styles.active : ""
              }`}
              onClick={button.onClick}
            >
              {button.icon && (
                <span className={styles.buttonIcon}>{button.icon}</span>
              )}
              <span className={styles.buttonLabel}>{button.label}</span>
            </button>
          ))}
        </div>

        {children && <div className={styles.customContent}>{children}</div>}
      </div>
      <div className={styles.horizontalLine}></div>
    </div>
  );
};

export default SectionHeader;
