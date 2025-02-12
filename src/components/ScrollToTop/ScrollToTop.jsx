// src/components/ScrollToTop/ScrollToTop.jsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      const scrollElements = [
        document.documentElement,
        document.body,
        document.querySelector(".mainContent"),
        document.querySelector(".appContainer"),
      ];

      console.log(
        "Scrollable elements:",
        scrollElements.map((el) => ({
          element: el?.className || el?.tagName,
          scrollHeight: el?.scrollHeight,
          clientHeight: el?.clientHeight,
          overflow: el?.style?.overflow,
        }))
      );

      scrollElements.forEach((el) => {
        if (el) {
          el.scrollTo({
            top: 0,
            behavior: "instant",
          });
        }
      });

      prevPathRef.current = pathname;
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;
