import React from "react";
import "./YouTubeEmbed.css";

const YouTubeEmbed = ({ embedId }) => (
  <div className="video-responsive-container">
    <div className="video-responsive">
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  </div>
);

export default YouTubeEmbed;
