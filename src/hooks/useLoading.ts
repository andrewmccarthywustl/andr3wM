// src/hooks/useLoading.ts
import { useState, useCallback } from "react";

interface UseLoadingReturn {
  isLoading: boolean;
  error: string | null;
  startLoading: () => void;
  stopLoading: () => void;
  setLoadingError: (error: string) => void;
}

/**
 * Custom hook to manage loading states and errors
 * @param initialState - Initial loading state
 * @returns Object with loading state, error state, and functions to control them
 */
export const useLoading = (initialState: boolean = false): UseLoadingReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(initialState);
  const [error, setError] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setLoadingError = useCallback((error: string) => {
    setError(error);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
  };
};

export default useLoading;
