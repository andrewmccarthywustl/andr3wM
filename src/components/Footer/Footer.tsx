// src/components/Footer/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaXTwitter,
  FaYoutube,
  FaTiktok,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa6";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.socialIcons}>
          <a
            href="mailto:andr3wM.3mail@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Email"
          >
            <FaEnvelope />
          </a>
          <a
            href="https://www.youtube.com/@ndr3wM"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="YouTube"
          >
            <FaYoutube />
          </a>
          <a
            href="https://x.com/andr_3wM"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="X / Twitter"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://www.tiktok.com/@andr.3wm"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="TikTok"
          >
            <FaTiktok />
          </a>
          <a
            href="https://instagram.com/andr.3wm"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
      <div className={styles.adminLink}>
        {user ? (
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        ) : (
          <Link to="/login" className={styles.loginLink}>
            Admin
          </Link>
        )}
      </div>
    </footer>
  );
};

export default Footer;
