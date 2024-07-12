import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Footer.css";

const Footer = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {user ? (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        ) : (
          <Link to="/login" className="login-link">
            Admin
          </Link>
        )}
      </div>
    </footer>
  );
};

export default Footer;
