// src/components/Header.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Header.module.css";

function Header() {
  // Access user and isAdmin from AuthContext
  const { user, isAdmin } = useAuth();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.navLinks}>
          {/* Navigation links */}
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          <Link to="/reviews" className={styles.navLink}>
            Reviews
          </Link>
          <Link to="/blog" className={styles.navLink}>
            Blog
          </Link>
          {/* Conditional rendering for admin link */}
          {user && isAdmin && (
            <Link to="/admin" className={styles.navLink}>
              Admin
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
