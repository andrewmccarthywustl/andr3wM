// src/hooks/useIsMobile.ts
import { useMemo } from "react";

const useIsMobile = (): boolean => {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  }, []);
};

export default useIsMobile;
