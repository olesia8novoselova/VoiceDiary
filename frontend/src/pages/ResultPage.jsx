import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResultPage.css";

function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;

  const date = new Date().toLocaleDateString("en-GB");

  if (!result) {
    return (
      <div className="result-wrapper">
        <h2>No analysis data found.</h2>
        <button onClick={() => navigate("/")}>Go back to recording</button>
      </div>
    );
  }

  const fullText = `Dzhamilya, here your mood today is ${result.emotion}.
Your tone is ${result.tone}, and the main topics you talked about were: ${result.themes?.join(", ") || "none"}.`;

  return (
    <div className="result-page">
      <div className="gradient-ball"></div>
      <div className="gradient-ball-2"></div>
      <div className="gradient-ball-3"></div>
      <div className="gradient-ball-4"></div>
      <div className="gradient-ball-5"></div>

      <div className="result-header">
        <span onClick={() => navigate("/")} className="start-link">Start recording</span>
        <div className="day-box">
          <p>Day 1/30</p>
          <small>Click to see recommendations</small>
        </div>
      </div>

      <div className="result-card">
        <h2>Dzhamilya, here your mood and recommendations for today...</h2>
        <p className="result-content">{fullText}</p>
        <p className="result-date">Day {date}</p>
      </div>
    </div>
  );
}

export default ResultPage;
