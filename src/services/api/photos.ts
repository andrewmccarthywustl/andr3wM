// src/services/api/photos.ts
import { supabase } from "./client";
import { Photo } from "./types";

interface GetPhotosOptions {
  page?: number;
  pageSize?: number;
  filter?: string;
}

export const photoApi = {
  getPhotos: async ({
    page = 1,
    pageSize = 20,
    filter = "all",
  }: GetPhotosOptions): Promise<Photo[]> => {
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

  addPhoto: async (
    photoData: Omit<Photo, "id" | "created_at">
  ): Promise<Photo> => {
    const { data, error } = await supabase
      .from("photos")
      .insert([photoData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updatePhoto: async (
    id: number,
    updatedPhotoData: Partial<Photo>
  ): Promise<Photo> => {
    const { data, error } = await supabase
      .from("photos")
      .update(updatedPhotoData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deletePhoto: async (id: number): Promise<{ message: string }> => {
    const { error } = await supabase.from("photos").delete().eq("id", id);

    if (error) throw error;
    return { message: "Photo deleted successfully" };
  },
};
