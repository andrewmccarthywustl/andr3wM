import React from "react";
import "./Features.css";

const Features = () => (
  <div className="features-container">
    <div className="features">
      {[
        "Wiki",
        "Projects",
        "Process",
        "Updates",
        "Meetings",
        "Decision-making",
        "Onboarding",
        "AI Assistant",
      ].map((feature) => (
        <div key={feature} className="feature">
          {feature}
        </div>
      ))}
    </div>
  </div>
);

export default Features;
