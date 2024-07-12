import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const MediaType = {
  MOVIE: "movie",
  BOOK: "book",
  SHOW: "show",
};

export const api = {
  // Blog Posts
  getBlogPosts: async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  addBlogPost: async (blogPost) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from("blog_posts")
      .insert([
        {
          title: blogPost.title,
          content: blogPost.content,
          author: userData.user.id,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  },

  updateBlogPost: async (id, updatedPost) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .update(updatedPost)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data[0];
  },

  deleteBlogPost: async (id) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) throw error;
    return { message: "Blog post deleted successfully" };
  },

  // Media Reviews
  getReviews: async (mediaType = null) => {
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

  addReview: async (review) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    if (!Object.values(MediaType).includes(review.media_type)) {
      throw new Error("Invalid media type");
    }

    const rating = parseFloat(review.rating);
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
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return data[0];
  },

  updateReview: async (id, updatedReview) => {
    const { data, error } = await supabase
      .from("media_reviews")
      .update({
        title: updatedReview.title,
        media_type: updatedReview.media_type,
        rating: parseFloat(updatedReview.rating),
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
      .select();
    if (error) throw error;
    return data[0];
  },

  deleteReview: async (reviewId) => {
    const { error } = await supabase
      .from("media_reviews")
      .delete()
      .eq("id", reviewId);
    if (error) throw error;
  },
};
