// src/layouts/MainLayout.tsx
import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
