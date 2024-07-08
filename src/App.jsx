import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Reviews from "./components/Reviews";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import "./App.css";

const App = () => {
  const [currentView, setCurrentView] = useState("home");

  const renderContent = () => {
    switch (currentView) {
      case "reviews":
        return <Reviews />;
      case "admin":
        return <AdminPanel />;
      case "home":
      default:
        return (
          <>
            <Hero />
            <Features />
          </>
        );
    }
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="app-container">
      <Header onNavigate={handleNavigation} />
      <main className="main-content">{renderContent()}</main>
      <Footer onNavigate={handleNavigation} />
    </div>
  );
};

export default App;
