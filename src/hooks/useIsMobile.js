// src/hooks/useIsMobile.js
import { useMemo } from "react";

export const useIsMobile = () => {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  }, []);
};

export default useIsMobile;
