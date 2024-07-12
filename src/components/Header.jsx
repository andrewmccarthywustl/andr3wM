import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { user, isAdmin } = useAuth();

  return (
    <header className="header">
      <nav>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/reviews">Reviews</Link>
          <Link to="/blog">Blog</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
