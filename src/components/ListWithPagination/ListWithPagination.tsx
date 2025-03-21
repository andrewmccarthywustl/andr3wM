// src/components/ListWithPagination/ListWithPagination.tsx
import React, { useState, ReactNode } from "react";
import styles from "./ListWithPagination.module.css";

interface ListItem {
  id: number | string;
  title: string;
  subtitle?: string;
  url: string;
}

interface ListWithPaginationProps {
  items: ListItem[];
  itemsPerPage?: number;
  renderItem?: (item: ListItem) => ReactNode;
  showActionButton?: boolean;
  actionButton?: (item: ListItem) => void;
  actionIcon?: ReactNode;
  actionText?: string;
}

const ListWithPagination: React.FC<ListWithPaginationProps> = ({
  items,
  itemsPerPage = 4,
  renderItem,
  showActionButton = true,
  actionButton,
  actionIcon,
  actionText,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = items.slice(startIndex, endIndex);
  const paddedItems = [...currentItems];
  while (paddedItems.length < itemsPerPage) {
    paddedItems.push({} as ListItem); // Push an empty object cast as ListItem
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const defaultRenderItem = (item: ListItem) => (
    <>
      <div className={styles.itemInfo}>
        <h3 className={styles.itemTitle}>{item.title}</h3>
        {item.subtitle && (
          <p className={styles.itemSubtitle}>{item.subtitle}</p>
        )}
      </div>
      {showActionButton && actionButton && (
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
      <div className={styles.list}>
        {paddedItems.map((item, index) => (
          <div
            key={item?.id || `empty-${index}`}
            className={item?.id ? styles.listItem : styles.emptyItem}
          >
            {item?.id
              ? renderItem
                ? renderItem(item)
                : defaultRenderItem(item)
              : null}
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
