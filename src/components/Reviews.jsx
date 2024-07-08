import React, { useState } from "react";
import "./Reviews.css";
// import { reviewsData } from "../data/reviewsData";
const reviewsData = [
  {
    id: 1,
    type: "Film",
    title: "Requiem for a Dream",
    director: "Darren Aronofsky",
    rating: 4.7,
    review:
      "A haunting and visually striking exploration of addiction and its consequences.",
    imageUrl:
      "https://posters.movieposterdb.com/05_06/2000/0180093/l_22570_0180093_b1de8732.jpg",
    date: "2023-05-15",
  },
  {
    id: 2,
    type: "Book",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    rating: 9.5,
    review:
      "A classic novel about the American Dream, wealth, and the Jazz Age.",
    imageUrl: "https://images.isbndb.com/covers/63/92/9780743246392.jpg",
    date: "2023-05-15",
  },
];

const ReviewCard = ({ item }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="review-card" onClick={() => setIsPopupOpen(!isPopupOpen)}>
      <div className="review-image">
        <img src={item.imageUrl} alt={item.title} />
      </div>
      <div className="review-content">
        <h3>{item.title}</h3>
        <p>{item.type === "Book" ? item.author : item.director}</p>
        <div className="rating">Rating: {item.rating}/10</div>
        <div className="review-date">
          Reviewed on: {new Date(item.date).toLocaleDateString()}
        </div>
      </div>
      {isPopupOpen && (
        <div className="review-popup">
          <p>{item.review}</p>
        </div>
      )}
    </div>
  );
};

const ReviewSection = ({ title, reviews }) => (
  <div className="review-section">
    <h3>{title}</h3>
    <div className="reviews-container">
      {reviews.map((item) => (
        <ReviewCard key={item.id} item={item} />
      ))}
    </div>
  </div>
);

const Reviews = () => {
  const filmReviews = reviewsData.filter((item) => item.type === "Film");
  const bookReviews = reviewsData.filter((item) => item.type === "Book");

  return (
    <section className="reviews-section">
      <h2>Reviews</h2>
      <ReviewSection title="Film Reviews" reviews={filmReviews} />
      <ReviewSection title="Book Reviews" reviews={bookReviews} />
    </section>
  );
};

export default Reviews;
