import React from "react";
import "./Footer.css";

const Footer = ({ onNavigate }) => (
  <footer className="site-footer">
    <div className="container">
      <div className="footer-content">
        <nav className="footer-nav">
          <a
            href="admin"
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
