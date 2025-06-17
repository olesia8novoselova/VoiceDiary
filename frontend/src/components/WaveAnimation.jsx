import React from "react";

const WaveAnimation = () => {
  return (
    <div className="wave-container">
      <svg viewBox="0 0 1440 320">
        <path
          fill="#8b5cf6"
          fillOpacity="0.4"
          d="M0,192L60,181.3C120,171,240,149,360,154.7C480,160,600,192,720,202.7C840,213,960,203,1080,202.7C1200,203,1320,213,1380,218.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default WaveAnimation;
