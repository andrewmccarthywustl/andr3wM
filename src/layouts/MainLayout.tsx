// src/layouts/MainLayout.tsx
import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import layoutStyles from "../styles/layout.module.css";
import utilityStyles from "../styles/utilities.module.css";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={layoutStyles.appContainer}>
      <Header />
      <main className={`${layoutStyles.mainContent} ${utilityStyles.fadeIn}`}>
        <div className={layoutStyles.container}>{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
