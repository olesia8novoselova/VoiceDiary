import "./RecordingCard.css";

function RecordingCard({ result }) {
  if (!result) return null;

  const formattedDate = new Date(result.record_date).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="recording-card">
      <div className="card-header">
        <h2>Your Emotional Report</h2>
        <span
          className={`emotion-pill ${
            ["happy", "surprised"].includes(result.emotion)
              ? "positive"
              : ["sad", "fearful", "disgust"].includes(result.emotion)
              ? "negative"
              : ["angry"].includes(result.emotion)
              ? "aggressive"
              : "neutral"
          }`}
        >
          {result.emotion}
        </span>
      </div>

      <div className="card-section">
        <h3>Summary</h3>
        <p className="summary-text">{result.summary}</p>
      </div>

      {/* <div className="card-section">
        <h3>Emotional Analysis</h3>
        <div className="insights-grid">
          <div className="insight-item">
            <h4>Pattern</h4>
            <p>{result.insights.emotional_dynamics}</p>
          </div>

          <div className="insight-item">
            <h4>Key Triggers</h4>
            <ul>
              {result.insights.key_triggers.map((trigger, index) => (
                <li key={index}>{trigger}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card-section">
        <h3>Physical Responses</h3>
        <div className="physical-responses">
          <div>
            <span role="img" aria-label="Morning">
              🌞
            </span>
            <p>{result.insights.physical_reactions.morning}</p>
          </div>
          <div>
            <span role="img" aria-label="Afternoon">
              🌆
            </span>
            <p>{result.insights.physical_reactions.afternoon}</p>
          </div>
        </div>
      </div>

      <div className="card-section">
        <h3>Coping Strategies</h3>
        <div className="strategy-boxes">
          <div className="strategy successful">
            <h4>What worked</h4>
            <p>{result.insights.coping_effectiveness.successful}</p>
          </div>
          <div className="strategy unsuccessful">
            <h4>What didn't</h4>
            <p>{result.insights.coping_effectiveness.unsuccessful}</p>
          </div>
        </div>
      </div>

      <div className="card-section">
        <h3>Recommendations</h3>
        <ol className="recommendations-list">
          {result.insights.recommendations.map((rec, index) => (
            <li key={index}>
              <strong>{rec.split(":")[0]}:</strong> {rec.split(":")[1]}
            </li>
          ))}
        </ol>
      </div> */}

      {result.insights && (
        <>
          <div className="card-section">
            <h3>Emotional Analysis</h3>
            <div className="insights-grid">
              <div className="insight-item">
                <h4>Pattern</h4>
                <p>{result.insights.emotional_dynamics}</p>
              </div>

              <div className="insight-item">
                <h4>Key Triggers</h4>
                <ul>
                  {result.insights.key_triggers.map((trigger, index) => (
                    <li key={index}>{trigger}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="card-section">
            <h3>Physical Responses</h3>
            <div className="physical-responses">
              <div>
                <span role="img" aria-label="Morning">
                  🌞
                </span>
                <p>{result.insights.physical_reactions.morning}</p>
              </div>
              <div>
                <span role="img" aria-label="Afternoon">
                  🌆
                </span>
                <p>{result.insights.physical_reactions.afternoon}</p>
              </div>
            </div>
          </div>

          <div className="card-section">
            <h3>Coping Strategies</h3>
            <div className="strategy-boxes">
              <div className="strategy successful">
                <h4>What worked</h4>
                <p>{result.insights.coping_effectiveness.successful}</p>
              </div>
              <div className="strategy unsuccessful">
                <h4>What didn't</h4>
                <p>{result.insights.coping_effectiveness.unsuccessful}</p>
              </div>
            </div>
          </div>

          <div className="card-section">
            <h3>Recommendations</h3>
            <ol className="recommendations-list">
              {result.insights.recommendations.map((rec, index) => (
                <li key={index}>
                  <strong>{rec.split(":")[0]}:</strong> {rec.split(":")[1]}
                </li>
              ))}
            </ol>
          </div>
        </>
      )}

      {!result.insights && (
        <div className="card-section">
          <p>Loading detailed analysis...</p>
        </div>
      )}

      <div className="card-footer">
        <p className="record-date">Recorded: {formattedDate}</p>
      </div>
      <div className="watermark">AI-generated, for reference only</div>
    </div>
  );
}

export default RecordingCard;
