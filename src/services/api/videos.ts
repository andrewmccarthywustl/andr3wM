// src/services/api/videos.ts
import { supabase } from "./client";

// Simple Video interface
export interface SimpleVideo {
  id: string;
  title: string;
  thumbnailurl: string;
  url: string;
  published_at: string;
  position?: number;
}

export const videoApi = {
  getVideos: async (limit = 20): Promise<SimpleVideo[]> => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("position", { ascending: false }) // Changed to descending order
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching videos from database:", error);
      throw error;
    }
  },

  addVideo: async (video: SimpleVideo): Promise<SimpleVideo> => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .insert([video])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding video:", error);
      throw error;
    }
  },

  updateVideo: async (
    id: string,
    video: Partial<SimpleVideo>
  ): Promise<SimpleVideo> => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .update(video)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating video:", error);
      throw error;
    }
  },

  deleteVideo: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.from("videos").delete().eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting video:", error);
      throw error;
    }
  },

  getMaxPosition: async (): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("position")
        .order("position", { ascending: false }) // Already in descending order
        .limit(1);

      if (error) throw error;
      return data.length > 0 ? data[0].position : 0;
    } catch (error) {
      console.error("Error getting max position:", error);
      throw error;
    }
  },
};
