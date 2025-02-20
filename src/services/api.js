// src/services/api.js

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const MediaType = {
  MOVIE: "movie",
  BOOK: "book",
  SHOW: "show",
};

export const FavoriteType = {
  ALBUM: "album",
  PODCAST: "podcast",
  ARTIST: "artist",
  CHANNEL: "channel",
  VIDEO: "video",
};

export const api = {
  // Blog Posts
  getBlogPosts: async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    console.log("Raw blog posts from database:", data);
    const parsedPosts = data.map((post) => ({
      ...post,
      content: JSON.parse(post.content),
    }));
    console.log("Parsed blog posts:", parsedPosts);
    return parsedPosts;
  },

  addBlogPost: async (blogPost) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    console.log("Adding blog post with content:", blogPost.content);

    const { data, error } = await supabase
      .from("blog_posts")
      .insert([
        {
          title: blogPost.title,
          content: JSON.stringify(blogPost.content),
          author: userData.user.id,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding blog post:", error);
      throw error;
    }

    console.log("Added blog post:", data[0]);
    return {
      ...data[0],
      content: JSON.parse(data[0].content),
    };
  },

  updateBlogPost: async (id, updatedPost) => {
    console.log("Updating blog post:", id, updatedPost);
    const { data, error } = await supabase
      .from("blog_posts")
      .update({
        title: updatedPost.title,
        content: JSON.stringify(updatedPost.content),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();
    if (error) {
      console.error("Error updating blog post:", error);
      throw error;
    }
    console.log("Updated blog post:", data[0]);
    return {
      ...data[0],
      content: JSON.parse(data[0].content),
    };
  },

  deleteBlogPost: async (id) => {
    console.log("Deleting blog post:", id);
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      console.error("Error deleting blog post:", error);
      throw error;
    }
    console.log("Blog post deleted successfully");
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

  //favorites
  // Favorites-related API methods

  // Get all favorites, sorted by position within each type
  getFavorites: async (type = null) => {
    let query = supabase
      .from("favorites")
      .select("*")
      .order("position", { ascending: true });

    if (type && Object.values(FavoriteType).includes(type)) {
      query = query.eq("type", type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  addFavorite: async (favorite) => {
    if (!Object.values(FavoriteType).includes(favorite.type)) {
      throw new Error("Invalid favorite type");
    }

    // Validate position is non-negative
    if (favorite.position < 0) {
      throw new Error("Position must be a non-negative number");
    }

    // First, get all items of this type to validate position
    const { data: existingItems, error: fetchError } = await supabase
      .from("favorites")
      .select("position")
      .eq("type", favorite.type)
      .order("position", { ascending: true });

    if (fetchError) throw fetchError;

    // Validate position is not larger than current count
    if (favorite.position > existingItems.length) {
      throw new Error(`Position cannot be larger than ${existingItems.length}`);
    }

    // Shift items at and after the target position using PostgreSQL template
    const { error: shiftError } = await supabase.rpc("increment_positions", {
      p_type: favorite.type,
      p_position: favorite.position,
    });

    if (shiftError) throw shiftError;

    // Insert the new item
    const { data: insertedItem, error: insertError } = await supabase
      .from("favorites")
      .insert([
        {
          type: favorite.type,
          name: favorite.name,
          secondary_name: favorite.secondary_name,
          image_url: favorite.image_url,
          external_url: favorite.external_url,
          position: favorite.position,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;
    return insertedItem;
  },

  updateFavorite: async (id, updatedFavorite) => {
    // Get the current favorite to check its position
    const { data: currentFavorite, error: fetchError } = await supabase
      .from("favorites")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // If position is changing, handle the reordering
    if (currentFavorite.position !== updatedFavorite.position) {
      // First, close the gap at the old position
      const { error: closeGapError } = await supabase.rpc(
        "decrement_positions",
        {
          p_type: currentFavorite.type,
          p_position: currentFavorite.position,
        }
      );

      if (closeGapError) throw closeGapError;

      // Then, make space at the new position
      const { error: makeSpaceError } = await supabase.rpc(
        "increment_positions",
        {
          p_type: currentFavorite.type,
          p_position: updatedFavorite.position,
        }
      );

      if (makeSpaceError) throw makeSpaceError;
    }

    // Update the favorite itself
    const { data, error: updateError } = await supabase
      .from("favorites")
      .update({
        type: updatedFavorite.type,
        name: updatedFavorite.name,
        secondary_name: updatedFavorite.secondary_name,
        image_url: updatedFavorite.image_url,
        external_url: updatedFavorite.external_url,
        position: updatedFavorite.position,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;
    return data;
  },

  deleteFavorite: async (id) => {
    // Get the favorite to be deleted
    const { data: favoriteToDelete, error: fetchError } = await supabase
      .from("favorites")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Delete the favorite
    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    // Close the gap by decrementing positions of all items after it
    const { error: updateError } = await supabase.rpc("decrement_positions", {
      p_type: favoriteToDelete.type,
      p_position: favoriteToDelete.position,
    });

    if (updateError) throw updateError;

    return { success: true };
  },

  getMaxPosition: async (type) => {
    const { data, error } = await supabase
      .from("favorites")
      .select("position")
      .eq("type", type)
      .order("position", { ascending: false })
      .limit(1);

    if (error) throw error;
    return data.length > 0 ? data[0].position : -1;
  },

  //photos
  getPhotos: async ({ page = 1, pageSize = 20, filter = "all" }) => {
    let query = supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (filter !== "all") {
      query = query.eq("category", filter);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  addPhoto: async (photoData) => {
    const { data, error } = await supabase
      .from("photos")
      .insert([photoData])
      .select();

    if (error) throw error;
    return data[0];
  },

  updatePhoto: async (id, updatedPhotoData) => {
    const { data, error } = await supabase
      .from("photos")
      .update(updatedPhotoData)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },

  deletePhoto: async (id) => {
    const { error } = await supabase.from("photos").delete().eq("id", id);

    if (error) throw error;
    return { message: "Photo deleted successfully" };
  },
};
