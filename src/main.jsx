// src/main.jsx
import "./polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SpeedInsights } from "@vercel/speed-insights/next";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
