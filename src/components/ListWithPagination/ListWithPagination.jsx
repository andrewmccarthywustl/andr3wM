// src/components/ListWithPagination/ListWithPagination.jsx
import React, { useState } from "react";
import { FaPlay, FaRandom } from "react-icons/fa";
import styles from "./ListWithPagination.module.css";

const ListWithPagination = ({
  title,
  items,
  itemsPerPage = 10,
  renderItem,
  onRandomSelect,
  showRandom = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  return (
    <div className={styles.listContainer}>
      <div className={styles.titleContainer}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {showRandom && (
          <button onClick={onRandomSelect} className={styles.randomButton}>
            <FaRandom className={styles.randomIcon} />
            <span>Random</span>
          </button>
        )}
      </div>
      <div className={styles.list}>
        {currentItems.map((item) => (
          <div key={item.id} className={styles.listItem}>
            {/* Conditionally render based on renderItem */}
            {renderItem ? (
              renderItem(item) // RenderItem is responsible for the entire item
            ) : (
              <>
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemSubtitle}>{item.subtitle}</p>
                </div>
                <button
                  onClick={() =>
                    window.open(item.url, "_blank", "noopener,noreferrer")
                  }
                  className={styles.watchButton}
                >
                  <FaPlay className={styles.playIcon} />
                  <span>Watch</span>
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={styles.paginationButton}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListWithPagination;
