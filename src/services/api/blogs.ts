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

    return data.map((post) => ({
      ...post,
      content: JSON.parse(post.content),
    }));
  },

  addBlogPost: async (
    blogPost: Omit<BlogPost, "id" | "created_at" | "author">
  ): Promise<BlogPost> => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from("blog_posts")
      .insert([
        {
          title: blogPost.title,
          content: JSON.stringify(blogPost.content),
          author: userData.user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      content: JSON.parse(data.content),
    };
  },

  updateBlogPost: async (
    id: number,
    updatedPost: Partial<BlogPost>
  ): Promise<BlogPost> => {
    const { data, error } = await supabase
      .from("blog_posts")
      .update({
        title: updatedPost.title,
        content: updatedPost.content
          ? JSON.stringify(updatedPost.content)
          : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      content: JSON.parse(data.content),
    };
  },

  deleteBlogPost: async (id: number): Promise<{ message: string }> => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) throw error;

    return { message: "Blog post deleted successfully" };
  },
};
