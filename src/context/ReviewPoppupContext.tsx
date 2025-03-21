// src/context/ReviewPopupContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Review } from "../services/api/types";

interface ReviewPopupContextType {
  selectedReview: Review | null;
  isPopupOpen: boolean;
  openReviewPopup: (review: Review) => void;
  closeReviewPopup: () => void;
}

const ReviewPopupContext = createContext<ReviewPopupContextType | undefined>(
  undefined
);

export const useReviewPopup = () => {
  const context = useContext(ReviewPopupContext);
  if (context === undefined) {
    throw new Error("useReviewPopup must be used within a ReviewPopupProvider");
  }
  return context;
};

export const ReviewPopupProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const openReviewPopup = (review: Review) => {
    setSelectedReview(review);
    setIsPopupOpen(true);
  };

  const closeReviewPopup = () => {
    setIsPopupOpen(false);
    // We could clear the selected review here, but it's better to keep it
    // during the closing animation so the content doesn't disappear immediately
    setTimeout(() => {
      setSelectedReview(null);
    }, 300); // Match the animation duration
  };

  return (
    <ReviewPopupContext.Provider
      value={{ selectedReview, isPopupOpen, openReviewPopup, closeReviewPopup }}
    >
      {children}
    </ReviewPopupContext.Provider>
  );
};
