// src/types/index.ts
export type MediaType = "movie" | "book" | "show";
export type FavoriteType =
  | "album"
  | "artist"
  | "podcast"
  | "channel"
  | "video"
  | "song";

export const MediaType = {
  MOVIE: "movie" as MediaType,
  BOOK: "book" as MediaType,
  SHOW: "show" as MediaType,
};

export const FavoriteType = {
  ALBUM: "album" as FavoriteType,
  ARTIST: "artist" as FavoriteType,
  PODCAST: "podcast" as FavoriteType,
  CHANNEL: "channel" as FavoriteType,
  VIDEO: "video" as FavoriteType,
  SONG: "song" as FavoriteType,
};

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
  position?: number;
  created_at: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  url: string;
  embedUrl: string;
  viewCount?: string;
  likeCount?: string;
}
