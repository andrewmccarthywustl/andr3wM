import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Media from "./pages/Media";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Photography from "./pages/Photography";
import Favorites from "./pages/Favorites";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";

// Import CSS modules
import layoutStyles from "./styles/layout.module.css";
import utilityStyles from "./styles/utilities.module.css";

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={utilityStyles.flexCenter}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={layoutStyles.appContainer}>
      <Header />
      <main className={`${layoutStyles.mainContent} ${utilityStyles.fadeIn}`}>
        <div className={layoutStyles.container}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/media" element={<Media />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/photography" element={<Photography />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </main>
      <Footer />
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
