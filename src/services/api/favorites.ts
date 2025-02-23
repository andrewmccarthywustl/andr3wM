// src/services/api/favorites.ts
import { supabase } from "./client";
import { FavoriteType, Favorite } from "./types";

export const favoriteApi = {
  getFavorites: async (
    type: FavoriteType | null = null
  ): Promise<Favorite[]> => {
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

  addFavorite: async (
    favorite: Omit<Favorite, "id" | "created_at">
  ): Promise<Favorite> => {
    if (!Object.values(FavoriteType).includes(favorite.type)) {
      throw new Error("Invalid favorite type");
    }

    if (favorite.position < 0) {
      throw new Error("Position must be a non-negative number");
    }

    // Get existing items to validate position
    const { data: existingItems, error: fetchError } = await supabase
      .from("favorites")
      .select("position")
      .eq("type", favorite.type)
      .order("position", { ascending: true });

    if (fetchError) throw fetchError;

    if (favorite.position > (existingItems?.length ?? 0)) {
      throw new Error(
        `Position cannot be larger than ${existingItems?.length ?? 0}`
      );
    }

    // Shift items
    const { error: shiftError } = await supabase.rpc("increment_positions", {
      p_type: favorite.type,
      p_position: favorite.position,
    });

    if (shiftError) throw shiftError;

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

  updateFavorite: async (
    id: number,
    updatedFavorite: Partial<Favorite>
  ): Promise<Favorite> => {
    const { data: currentFavorite, error: fetchError } = await supabase
      .from("favorites")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    if (
      currentFavorite.position !== updatedFavorite.position &&
      updatedFavorite.position !== undefined
    ) {
      const { error: closeGapError } = await supabase.rpc(
        "decrement_positions",
        {
          p_type: currentFavorite.type,
          p_position: currentFavorite.position,
        }
      );

      if (closeGapError) throw closeGapError;

      const { error: makeSpaceError } = await supabase.rpc(
        "increment_positions",
        {
          p_type: currentFavorite.type,
          p_position: updatedFavorite.position,
        }
      );

      if (makeSpaceError) throw makeSpaceError;
    }

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

  deleteFavorite: async (id: number): Promise<{ success: boolean }> => {
    const { data: favoriteToDelete, error: fetchError } = await supabase
      .from("favorites")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    const { error: updateError } = await supabase.rpc("decrement_positions", {
      p_type: favoriteToDelete.type,
      p_position: favoriteToDelete.position,
    });

    if (updateError) throw updateError;

    return { success: true };
  },

  getMaxPosition: async (type: FavoriteType): Promise<number> => {
    const { data, error } = await supabase
      .from("favorites")
      .select("position")
      .eq("type", type)
      .order("position", { ascending: false })
      .limit(1);

    if (error) throw error;
    return data.length > 0 ? data[0].position : -1;
  },
};
