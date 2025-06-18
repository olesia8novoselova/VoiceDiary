import React from "react";

const WaveAnimation = () => {
  return (
    <div className="wave-container">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path
          fill="transparent"
          stroke="#8b5cf6"
          strokeWidth="2"
          d="M0,60L60,55C120,50,240,40,360,45C480,50,600,70,720,70C840,70,960,50,1080,45C1200,40,1320,50,1380,55L1440,60L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
        ></path>
      </svg>
    </div>
  );
};

export default WaveAnimation;