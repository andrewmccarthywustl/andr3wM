// src/services/api/database.types.ts
export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: number;
          title: string;
          content: string;
          author: string;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          title: string;
          content: string;
          author: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          author?: string;
          updated_at?: string;
        };
      };
      media_reviews: {
        Row: {
          id: number;
          title: string;
          media_type: string;
          rating: number;
          review_text: string;
          image_url: string;
          reviewer: string;
          director?: string | null;
          author?: string | null;
          created_at: string;
        };
        Insert: {
          title: string;
          media_type: string;
          rating: number;
          review_text: string;
          image_url: string;
          reviewer: string;
          director?: string | null;
          author?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          media_type?: string;
          rating?: number;
          review_text?: string;
          image_url?: string;
          director?: string | null;
          author?: string | null;
        };
      };
      favorites: {
        Row: {
          id: number;
          type: string;
          name: string;
          secondary_name?: string;
          image_url: string;
          external_url: string;
          position: number;
          created_at: string;
        };
        Insert: {
          type: string;
          name: string;
          secondary_name?: string;
          image_url: string;
          external_url: string;
          position: number;
          created_at?: string;
        };
        Update: {
          type?: string;
          name?: string;
          secondary_name?: string;
          image_url?: string;
          external_url?: string;
          position?: number;
        };
      };
      photos: {
        Row: {
          id: number;
          title: string;
          description?: string;
          url: string;
          category: string;
          position?: number; // Added position property
          created_at: string;
        };
        Insert: {
          title: string;
          description?: string;
          url: string;
          category: string;
          position?: number; // Added position property
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          url?: string;
          category?: string;
          position?: number; // Added position property
        };
      };
    };
    Functions: {
      increment_positions: {
        Args: {
          p_type: string;
          p_position: number;
        };
        Returns: void;
      };
      decrement_positions: {
        Args: {
          p_type: string;
          p_position: number;
        };
        Returns: void;
      };
    };
  };
};
