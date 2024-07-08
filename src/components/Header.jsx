import React from "react";
import "./Header.css";

const Header = ({ onNavigate }) => (
  <header>
    <nav className="container">
      <div className="logo" onClick={() => onNavigate("home")}>
        slite
      </div>
      <div className="nav-links">
        <a href="#product" onClick={() => onNavigate("home")}>
          Product
        </a>
        <a href="#solutions" onClick={() => onNavigate("home")}>
          Solutions
        </a>
        <a href="#pricing" onClick={() => onNavigate("home")}>
          Pricing
        </a>
        <a href="#resources" onClick={() => onNavigate("home")}>
          Resources
        </a>
        <a href="#reviews" onClick={() => onNavigate("reviews")}>
          Reviews
        </a>
        <a href="#sign-in">Sign in</a>
        <a href="#" className="button button-outline">
          Book a demo
        </a>
        <a href="#" className="button button-primary">
          Start for free
        </a>
      </div>
    </nav>
  </header>
);

export default Header;
