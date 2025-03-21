// src/main.tsx
import "./polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import "./styles/global.css";

const rootElement = document.getElementById("root");

// Add a null check before creating the root
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
    <SpeedInsights />
    <Analytics />
  </React.StrictMode>
);
