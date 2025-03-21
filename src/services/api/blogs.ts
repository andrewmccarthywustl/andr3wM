// src/services/api/blogs.ts
import { supabase } from "./client";
import { BlogPost } from "./types";

export const blogApi = {
  getBlogPosts: async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  getBlogPostById: async (id: string): Promise<BlogPost> => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  addBlogPost: async (
    blogPost: Omit<BlogPost, "id" | "created_at" | "author">
  ): Promise<BlogPost> => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Don't validate URL - just store as is
    const { data, error } = await supabase
      .from("blog_posts")
      .insert([
        {
          title: blogPost.title,
          content_text: blogPost.content_text,
          featured_image: blogPost.featured_image,
          author: userData.user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw new Error(`Failed to add blog post: ${error.message}`);
    }

    return data;
  },

  updateBlogPost: async (
    id: string,
    updatedPost: Partial<BlogPost>
  ): Promise<BlogPost> => {
    const { data, error } = await supabase
      .from("blog_posts")
      .update({
        title: updatedPost.title,
        content_text: updatedPost.content_text,
        featured_image: updatedPost.featured_image,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      throw new Error(`Failed to update blog post: ${error.message}`);
    }

    return data;
  },

  deleteBlogPost: async (id: string): Promise<{ message: string }> => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) throw error;
    return { message: "Blog post deleted successfully" };
  },
};
