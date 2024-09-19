// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import MediaReviews from "./pages/MediaReviews";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Photography from "./pages/Photography";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./App.css";

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reviews" element={<MediaReviews />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/photography" element={<Photography />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
      <SpeedInsights />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
