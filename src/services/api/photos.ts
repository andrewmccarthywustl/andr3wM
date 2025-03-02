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
    let query = supabase.from("photos").select("*");

    if (filter !== "all") {
      query = query.eq("category", filter);
    }

    // First try to order by position if available, then by created_at
    query = query
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    // Apply pagination
    query = query.range((page - 1) * pageSize, page * pageSize - 1);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  getMaxPosition: async (): Promise<number> => {
    const { data, error } = await supabase
      .from("photos")
      .select("position")
      .order("position", { ascending: false })
      .limit(1);

    if (error) throw error;
    return data.length > 0 ? data[0].position : -1;
  },

  addPhoto: async (
    photoData: Omit<Photo, "id" | "created_at">
  ): Promise<Photo> => {
    try {
      // First, shift positions if needed
      if (photoData.position !== undefined) {
        await photoApi.shiftPositions(photoData.position);
      } else {
        // If no position provided, get the max position and add 1
        const maxPos = await photoApi.getMaxPosition();
        photoData.position = maxPos + 1;
      }

      // Now insert the new photo
      const { data, error } = await supabase
        .from("photos")
        .insert([photoData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error in addPhoto:", error);
      throw error;
    }
  },

  updatePhoto: async (
    id: number,
    updatedPhotoData: Partial<Photo>
  ): Promise<Photo> => {
    try {
      // Get the current photo to check if position is changing
      const { data: currentPhoto, error: fetchError } = await supabase
        .from("photos")
        .select("position")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // If position is changing, handle the reordering
      if (
        updatedPhotoData.position !== undefined &&
        currentPhoto.position !== updatedPhotoData.position
      ) {
        // Close the gap at the old position
        await supabase.rpc("decrement_photo_positions", {
          p_position: currentPhoto.position,
        });

        // Make space at the new position
        await photoApi.shiftPositions(updatedPhotoData.position);
      }

      // Now update the photo
      const { data, error } = await supabase
        .from("photos")
        .update(updatedPhotoData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error in updatePhoto:", error);
      throw error;
    }
  },

  deletePhoto: async (id: number): Promise<{ message: string }> => {
    try {
      // Get the position of the photo to be deleted
      const { data: photo, error: fetchError } = await supabase
        .from("photos")
        .select("position")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Delete the photo
      const { error: deleteError } = await supabase
        .from("photos")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      // Close the gap by decrementing positions of photos after the deleted one
      await supabase.rpc("decrement_photo_positions", {
        p_position: photo.position,
      });

      return { message: "Photo deleted successfully" };
    } catch (error) {
      console.error("Error in deletePhoto:", error);
      throw error;
    }
  },

  // Helper function to shift positions to make room for a new item
  shiftPositions: async (position: number): Promise<void> => {
    const { error } = await supabase.rpc("increment_photo_positions", {
      p_position: position,
    });

    if (error) {
      console.error("Error shifting positions:", error);
      throw error;
    }
  },
};
