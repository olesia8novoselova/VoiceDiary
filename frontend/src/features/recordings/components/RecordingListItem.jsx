import { format } from "date-fns";
import "./RecordingListItem.css";
import { useGetRecordingAnalysisQuery } from "../recordingsApi";

function RecordingListItem({ recording, isExpanded, onToggleExpand }) {
  const { data: fullAnalysis, isLoading: isAnalysisLoading } =
    useGetRecordingAnalysisQuery(recording.record_id, {
      skip: !isExpanded,
    });

  const formattedDate = format(
    new Date(recording.record_date),
    "MMM d, yyyy - h:mm a"
  );

  const displayRecording =
    isExpanded && fullAnalysis ? { ...recording, ...fullAnalysis } : recording;

  return (
    <div
      className={`recording-item ${isExpanded ? "expanded" : ""}`}
      onClick={onToggleExpand}
      aria-expanded={isExpanded}
    >
      <div className="recording-summary">
        <div className="recording-meta">
          <span
            className={`emotion-badge ${displayRecording.emotion?.toLowerCase()}`}
          >
            {displayRecording.emotion}
          </span>
          <span className="date">{formattedDate}</span>
          {displayRecording.feedback !== undefined &&
            displayRecording.feedback !== null && (
              <span className="feedback">
                Rating: {displayRecording.feedback}/5
              </span>
            )}
        </div>
        <div className="recording-preview">
          <p>{displayRecording.summary}</p>
        </div>
      </div>

      {isExpanded && (
        <div className="recording-details">
          <h3>Full Analysis</h3>

          {isAnalysisLoading ? (
            <div className="loading-analysis">Loading analysis...</div>
          ) : (
            <>
              {displayRecording.insights?.emotional_dynamics && (
                <div className="detail-section">
                  <h4>Emotional Dynamics</h4>
                  <p>{displayRecording.insights.emotional_dynamics}</p>
                </div>
              )}

              {displayRecording.insights?.key_triggers?.length > 0 && (
                <div className="detail-section">
                  <h4>Key Triggers</h4>
                  <ul>
                    {displayRecording.insights.key_triggers.map(
                      (trigger, i) => (
                        <li key={`trigger-${i}`}>{trigger}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {displayRecording.insights?.recommendations?.length > 0 && (
                <div className="detail-section">
                  <h4>Recommendations</h4>
                  <ol>
                    {displayRecording.insights.recommendations.map((rec, i) => (
                      <li key={`recommendation-${i}`}>{rec}</li>
                    ))}
                  </ol>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default RecordingListItem;
