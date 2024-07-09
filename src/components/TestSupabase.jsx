import React, { useEffect, useState } from "react";
import { api } from "../services/api";

const TestSupabase = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await api.getReviews();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReviews();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (reviews.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <h2>Media Reviews</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>{review.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestSupabase;
