import React from "react";
import "./Footer.css";

const Footer = ({ onNavigate }) => (
  <footer className="site-footer">
    <div className="container">
      <div className="footer-content">
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
        <nav className="footer-nav">
          <a href="#terms">Terms of Service</a>
          <a href="#privacy">Privacy Policy</a>
          <a
            href="#admin"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("admin");
            }}
          >
            Admin
          </a>
        </nav>
      </div>
    </div>
  </footer>
);

export default Footer;
