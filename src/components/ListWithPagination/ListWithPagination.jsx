// src/components/ListWithPagination/ListWithPagination.jsx
import React, { useState } from "react";
import { FaRandom } from "react-icons/fa";
import styles from "./ListWithPagination.module.css";

const ListWithPagination = ({
  title,
  items,
  itemsPerPage = 4,
  renderItem,
  onRandomSelect,
  showRandom = true,
  actionButton,
  actionIcon,
  actionText,
  showActionButton = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = items.slice(startIndex, endIndex);
  const paddedItems = [...currentItems];
  while (paddedItems.length < itemsPerPage) {
    paddedItems.push(null);
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const defaultRenderItem = (item) => (
    <>
      <div className={styles.itemInfo}>
        <h3 className={styles.itemTitle}>{item.title}</h3>
        <p className={styles.itemSubtitle}>{item.subtitle}</p>
      </div>
      {showActionButton && (
        <button
          onClick={() => actionButton(item)}
          className={styles.actionButton}
        >
          {actionIcon}
          <span>{actionText}</span>
        </button>
      )}
    </>
  );

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
        {paddedItems.map((item, index) => (
          <div key={item?.id || `empty-${index}`} className={styles.listItem}>
            {item ? (
              renderItem ? (
                renderItem(item)
              ) : (
                defaultRenderItem(item)
              )
            ) : (
              <div className={styles.emptyItem} />
            )}
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={`${styles.paginationButton} ${styles.prevNext}`}
            disabled={currentPage === 1}
          >
            « Prev
          </button>

          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={`${styles.paginationButton} ${styles.prevNext}`}
            disabled={currentPage === totalPages}
          >
            Next »
          </button>
        </div>
      )}
    </div>
  );
};

export default ListWithPagination;
