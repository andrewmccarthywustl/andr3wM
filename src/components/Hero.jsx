// src/components/Hero.jsx

import React from "react";
import YouTubeEmbed from "./YouTubeEmbed";
import { useState, useEffect } from "react";
import "./Hero.css";

const TypewriterEffect = ({ text, delay = 50 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, delay, text]);

  return <span>{displayedText}</span>;
};

const Hero = () => (
  <div className="hero-container">
    <div className="hero-content">
      <h1>
        <TypewriterEffect text="Welcome To My Website" />
      </h1>
      <p>
        I am not too sure what to put on here yet, but I will add more content
        and improve on the design and layout as I go along.
      </p>
      <h2 className="hero-subheader">Most Recent YouTube Video</h2>
      <YouTubeEmbed embedId="DZNno1tk-2A" />
    </div>
  </div>
);

export default Hero;
