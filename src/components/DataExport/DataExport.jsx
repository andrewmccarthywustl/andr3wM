// src/components/DataExport/DataExport.jsx
import React, { useState } from "react";
import { FaFileDownload, FaChevronDown } from "react-icons/fa";
import styles from "./DataExport.module.css";

const DataExport = ({
  data,
  fileName = "export.json",
  label = "Export Data",
  types = [],
  isReviews = false,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [exportFormat, setExportFormat] = useState("essential");

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest(`.${styles.exportDropdown}`)) {
      setShowOptions(false);
    }
  };

  React.useEffect(() => {
    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleExport = () => {
    // Filter data based on type
    let filteredData = [...data];

    if (selectedType !== "all" && types.length > 0) {
      filteredData = data.filter((item) =>
        isReviews
          ? item.media_type === selectedType
          : item.type === selectedType
      );
    }

    // Format data based on exportFormat
    let formattedData = filteredData;

    if (exportFormat === "essential") {
      if (isReviews) {
        // For reviews, keep only essential fields for LLM context (no URLs)
        formattedData = filteredData.map((item) => ({
          title: item.title,
          media_type: item.media_type,
          rating: item.rating,
          review_text: item.review_text,
          ...(item.director ? { director: item.director } : {}),
          ...(item.author ? { author: item.author } : {}),
        }));
      } else {
        // For favorites, only keep core content fields for LLM context (no URLs)
        formattedData = filteredData.map((item) => ({
          name: item.name,
          type: item.type,
          secondary_name: item.secondary_name || "",
        }));
      }
    }

    // Generate file name based on selection
    let exportFileName = fileName;
    if (selectedType !== "all") {
      exportFileName = `${selectedType}-${fileName}`;
    }

    // Convert to JSON string
    const jsonData = JSON.stringify(formattedData, null, 2);

    // Create a Blob with the data
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary download link
    const link = document.createElement("a");
    link.href = url;
    link.download = exportFileName;
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Close dropdown
    setShowOptions(false);
  };

  return (
    <div className={styles.exportDropdown}>
      <button onClick={toggleOptions} className={styles.exportButton}>
        <FaFileDownload className={styles.exportIcon} />
        {label}
        <FaChevronDown className={styles.chevronIcon} />
      </button>

      {showOptions && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownGroup}>
            <label className={styles.dropdownLabel}>
              {isReviews ? "Media Type:" : "Favorite Type:"}
            </label>
            <select
              className={styles.dropdownSelect}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.dropdownGroup}>
            <label className={styles.dropdownLabel}>Format:</label>
            <select
              className={styles.dropdownSelect}
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <option value="essential">Essential Fields Only</option>
              <option value="full">All Data</option>
            </select>
          </div>

          <button onClick={handleExport} className={styles.exportNowButton}>
            Export Now
          </button>
        </div>
      )}
    </div>
  );
};

export default DataExport;
