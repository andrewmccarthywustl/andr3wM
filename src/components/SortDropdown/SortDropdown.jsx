// src/components/SortDropdown/SortDropdown.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  FaSort,
  FaArrowUp,
  FaArrowDown,
  FaCalendar,
  FaStar,
} from "react-icons/fa";
import { BsAlphabet } from "react-icons/bs";
import styles from "./SortDropdown.module.css";

const SortDropdown = ({ onSort, currentSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSort = (key) => {
    onSort(key, currentSort.order);
    setIsOpen(false);
  };

  const toggleOrder = (e) => {
    e.stopPropagation();
    const newOrder = currentSort.order === "asc" ? "desc" : "asc";
    onSort(currentSort.key, newOrder);
  };

  const getSortIcon = (key) => {
    switch (key) {
      case "title":
        return <BsAlphabet />;
      case "created_at":
        return <FaCalendar />;
      case "rating":
        return <FaStar />;
      default:
        return <FaSort />;
    }
  };

  const getSortLabel = (key) => {
    switch (key) {
      case "title":
        return "Title";
      case "created_at":
        return "Date";
      case "rating":
        return "Rating";
      default:
        return "Sort by";
    }
  };

  return (
    <div className={styles.sortDropdownContainer} ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.sortButton}>
        {getSortIcon(currentSort.key)}{" "}
        <span>{getSortLabel(currentSort.key)}</span>
      </button>
      <button onClick={toggleOrder} className={styles.orderButton}>
        {currentSort.order === "asc" ? <FaArrowUp /> : <FaArrowDown />}
      </button>
      {isOpen && (
        <div className={styles.dropdownContent}>
          <button onClick={() => handleSort("created_at")}>
            <FaCalendar /> <span>Date</span>
          </button>
          <button onClick={() => handleSort("rating")}>
            <FaStar /> <span>Rating</span>
          </button>
          <button onClick={() => handleSort("title")}>
            <BsAlphabet /> <span>Title</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
