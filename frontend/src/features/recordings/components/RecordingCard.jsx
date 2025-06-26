import React from "react";
import "./RecordingCard.css";

function RecordingCard({ result, recordTimestamp }) {
  if (!result) return null;

  const formattedDate = new Date(result.record_date).toLocaleDateString("en-GB");

  const fullText = `Dzhamilya, your mood today is ${result.emotion}.
Summary: ${result.summary}`;

  return (
    <div className="recording-card">
      <h2>Dzhamilya, here your mood and recommendations for today...</h2>
      <p className="result-content">{fullText}</p>
      <p className="result-date">Date: {formattedDate}</p>
    </div>
  );
}

export default RecordingCard;
