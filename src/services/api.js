import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const api = {
  // Media Reviews
  getReviews: async (mediaType = null) => {
    let query = supabase
      .from("media_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (mediaType) {
      query = query.eq("media_type", mediaType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  addReview: async (review) => {
    const { data, error } = await supabase.from("media_reviews").insert([
      {
        ...review,
        reviewer: supabase.auth.user().id,
      },
    ]);
    if (error) throw error;
    return data[0];
  },

  updateReview: async (id, updatedReview) => {
    const { data, error } = await supabase
      .from("media_reviews")
      .update({
        ...updatedReview,
        updated_at: new Date().toISOString(),
      })
      .match({ id });
    if (error) throw error;
    return data[0];
  },

  deleteReview: async (id) => {
    const { error } = await supabase
      .from("media_reviews")
      .delete()
      .match({ id });
    if (error) throw error;
    return { message: "Review deleted successfully" };
  },

  uploadImage: async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("media-images")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
      error: urlError,
    } = supabase.storage.from("media-images").getPublicUrl(fileName);

    if (urlError) throw urlError;

    return publicUrl;
  },

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
    const { data, error } = await supabase.from("blog_posts").insert([
      {
        ...blogPost,
        author: supabase.auth.user().id,
        published: false, // Default to unpublished
      },
    ]);
    if (error) throw error;
    return data[0];
  },

  updateBlogPost: async (id, updatedBlogPost) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .update({
        ...updatedBlogPost,
        updated_at: new Date().toISOString(),
      })
      .match({ id });
    if (error) throw error;
    return data[0];
  },

  deleteBlogPost: async (id) => {
    const { error } = await supabase.from("blog_posts").delete().match({ id });
    if (error) throw error;
    return { message: "Blog post deleted successfully" };
  },

  publishBlogPost: async (id, publishState) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .update({ published: publishState, updated_at: new Date().toISOString() })
      .match({ id });
    if (error) throw error;
    return data[0];
  },
};
