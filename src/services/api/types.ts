// src/services/api/types.ts
export type MediaType = "movie" | "book" | "show";
export type FavoriteType =
  | "album"
  | "artist"
  | "podcast"
  | "channel"
  | "video"
  | "song";

export const MediaType = {
  MOVIE: "movie",
  BOOK: "book",
  SHOW: "show",
} as const;

export const FavoriteType = {
  ALBUM: "album",
  ARTIST: "artist",
  PODCAST: "podcast",
  CHANNEL: "channel",
  VIDEO: "video",
  SONG: "song",
} as const;

export interface BlogPost {
  id: number;
  title: string;
  content: {
    text: string;
    images: string[];
  };
  author: string;
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: number;
  title: string;
  media_type: MediaType;
  rating: number;
  review_text: string;
  image_url: string;
  reviewer: string;
  director?: string | null;
  author?: string | null;
  created_at: string;
}

export interface Favorite {
  id: number;
  type: FavoriteType;
  name: string;
  secondary_name?: string;
  image_url: string;
  external_url: string;
  position: number;
  created_at: string;
}

export interface Photo {
  id: number;
  title: string;
  description?: string;
  url: string;
  category: string;
  created_at: string;
}
