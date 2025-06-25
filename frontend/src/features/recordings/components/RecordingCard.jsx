import React from "react";
import "./RecordingCard.css";

function RecordingCard({ result, recordDuration, recordTimestamp }) {
  if (!result) return null;

  const formattedDate = new Date(recordTimestamp).toLocaleDateString("en-GB");

  const fullText = `Dzhamilya, your mood today is ${result.emotion}.
Summary: ${result.Summary}
The main topics you talked about were: ${result.themes?.join(", ") || "none"}.`;

  return (
    <div className="recording-card">
      <h2>Dzhamilya, here your mood and recommendations for today...</h2>
      <p className="result-content">{fullText}</p>
      <p className="result-date">Date: {formattedDate}</p>
    </div>
  );
}

export default RecordingCard;
