import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import MediaReviews from "./components/MediaReviews";
import Blog from "./components/Blog";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Features />
                </>
              }
            />
            <Route path="/reviews" element={<MediaReviews />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
