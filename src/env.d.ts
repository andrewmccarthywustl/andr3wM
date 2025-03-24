// src/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_GOOGLE_ANALYTICS_ID: string; // Add this line
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Add this to your existing env.d.ts file
interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}
