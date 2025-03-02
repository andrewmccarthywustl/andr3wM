// src/components/WithLoading/WithLoading.jsx
import React, { useState, useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner";

// Higher-order component to provide consistent loading behavior
const WithLoading = (WrappedComponent, loadingFn) => {
  return function WithLoadingComponent(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const result = await loadingFn();
          setData(result);
        } catch (err) {
          console.error("Error loading data:", err);
          setError(err.message || "An error occurred while loading data");
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, []);

    if (isLoading) {
      return <LoadingSpinner fullPage message="Loading content..." />;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    return <WrappedComponent {...props} data={data} />;
  };
};

export default WithLoading;
