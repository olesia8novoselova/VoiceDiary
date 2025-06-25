import React from "react";
import "./RecordingCard.css";

function RecordingCard({ result, recordDuration, recordTimestamp }) {
  if (!result) return null;

  const formattedDate = new Date(recordTimestamp).toLocaleDateString("en-GB");
  const formattedTime = new Date(recordTimestamp).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const durationMinutes = Math.floor(recordDuration / 60)
    .toString()
    .padStart(2, "0");
  const durationSeconds = (recordDuration % 60).toString().padStart(2, "0");
  const formattedDuration = `${durationMinutes}:${durationSeconds}`;

  const fullText = `Dzhamilya, your mood today is ${result.emotion}.
Summary: ${result.Summary}
The main topics you talked about were: ${result.themes?.join(", ") || "none"}.`;

  return (
    <div className="recording-card">
      <h2>Dzhamilya, here your mood and recommendations for today...</h2>
      <p className="result-content">{fullText}</p>
      <p className="result-date">Date: {formattedDate}</p>
      {/* <p className="result-time">Recorded at: {formattedTime}</p>
      <p className="result-duration">Duration: {formattedDuration}</p> */}
    </div>
  );
}

export default RecordingCard;
