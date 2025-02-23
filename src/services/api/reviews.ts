// src/services/api/reviews.ts
import { supabase } from "./client";
import { MediaType, Review } from "./types";

export const reviewApi = {
  getReviews: async (mediaType: MediaType | null = null): Promise<Review[]> => {
    let query = supabase
      .from("media_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (mediaType && Object.values(MediaType).includes(mediaType)) {
      query = query.eq("media_type", mediaType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  addReview: async (
    review: Omit<Review, "id" | "created_at" | "reviewer">
  ): Promise<Review> => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    if (!Object.values(MediaType).includes(review.media_type)) {
      throw new Error("Invalid media type");
    }

    const rating = parseFloat(String(review.rating));
    if (isNaN(rating) || rating < 1 || rating > 10) {
      throw new Error("Rating must be a number between 1 and 10");
    }

    const { data, error } = await supabase
      .from("media_reviews")
      .insert([
        {
          title: review.title,
          media_type: review.media_type,
          rating: rating,
          review_text: review.review_text,
          image_url: review.image_url,
          reviewer: userData.user.id,
          director:
            review.media_type === MediaType.MOVIE ? review.director : null,
          author: review.media_type === MediaType.BOOK ? review.author : null,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateReview: async (
    id: number,
    updatedReview: Partial<Review>
  ): Promise<Review> => {
    const { data, error } = await supabase
      .from("media_reviews")
      .update({
        title: updatedReview.title,
        media_type: updatedReview.media_type,
        rating: updatedReview.rating
          ? parseFloat(String(updatedReview.rating))
          : undefined,
        review_text: updatedReview.review_text,
        image_url: updatedReview.image_url,
        director:
          updatedReview.media_type === MediaType.MOVIE
            ? updatedReview.director
            : null,
        author:
          updatedReview.media_type === MediaType.BOOK
            ? updatedReview.author
            : null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteReview: async (reviewId: number): Promise<void> => {
    const { error } = await supabase
      .from("media_reviews")
      .delete()
      .eq("id", reviewId);

    if (error) throw error;
  },
};
