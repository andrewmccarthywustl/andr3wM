import React, { useState } from "react";
import "./Reviews.css";

const reviewsData = [
  {
    id: 1,
    type: "Film",
    title: "Requiem for a Dream",
    director: "Darren Aronofsky",
    rating: 4.7,
    review:
      "A haunting and visually striking exploration of addiction and its consequences.",
    imageUrl: "https://example.com/requiem-for-a-dream-.jpg",
  },
  // Add more reviews with imageUrl
];

const ReviewCard = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="review-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="review-image">
        <img src={item.imageUrl} alt={item.title} />
      </div>
      <div className="review-content">
        <h3>{item.title}</h3>
        <p>{item.type === "Book" ? item.author : item.director}</p>
        <div className="rating">Rating: {item.rating}/5</div>
      </div>
      {isHovered && (
        <div className="review-popup">
          <p>{item.review}</p>
        </div>
      )}
    </div>
  );
};

const Reviews = () => {
  return (
    <section className="reviews-section">
      <h2>Book and Film Reviews</h2>
      <div className="reviews-container">
        {reviewsData.map((item) => (
          <ReviewCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default Reviews;
