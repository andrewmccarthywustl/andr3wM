// src/components/Header/Header.jsx

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Header.module.css";

function Header() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/reviews", label: "Reviews" },
    { path: "/blog", label: "Blog" },
  ];

  if (user && isAdmin) {
    navItems.push({ path: "/admin", label: "Admin" });
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${
                location.pathname === item.path ? styles.active : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
