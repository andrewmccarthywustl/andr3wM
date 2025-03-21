// src/hooks/useScrollTo.ts
import { useCallback } from "react";

/**
 * Hook for reliable scrolling that accounts for fixed headers
 *
 * @param {number} headerOffset - Height of fixed headers to account for
 * @return {Function} - Function to call with element ID to scroll to
 */
export const useScrollTo = (headerOffset: number = 60) => {
  return useCallback(
    (elementId: string) => {
      // Wait for any pending state updates to complete
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (!element) {
          console.error(`Element with id "${elementId}" not found`);
          return;
        }

        // Create a stylesheet with a scroll-margin-top rule for the element
        const style = document.createElement("style");
        style.textContent = `#${elementId} { scroll-margin-top: ${headerOffset}px; }`;
        document.head.appendChild(style);

        // Use scrollIntoView with 'smooth' behavior
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Clean up the added style after scrolling
        setTimeout(() => {
          document.head.removeChild(style);
        }, 1000); // Give enough time for the scroll to complete
      }, 0);
    },
    [headerOffset]
  );
};

export default useScrollTo;
