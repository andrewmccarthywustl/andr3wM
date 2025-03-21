// src/components/ScrollToTop/ScrollToTop.tsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const prevPathRef = useRef<string>(pathname);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      const scrollElements = [
        document.documentElement,
        document.body,
        document.querySelector(".mainContent"),
        document.querySelector(".appContainer"),
      ];

      scrollElements.forEach((el) => {
        if (el) {
          el.scrollTo({
            top: 0,
            behavior: "instant" as ScrollBehavior,
          });
        }
      });

      prevPathRef.current = pathname;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
