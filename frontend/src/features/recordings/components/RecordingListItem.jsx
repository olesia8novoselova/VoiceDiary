import { useState } from "react";
import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import "./RecordingListItem.css";
import { useGetRecordingAnalysisQuery } from "../recordingsApi";
import { useDeleteRecordingMutation } from "../recordingsApi";
import { useRecalculateTotalsMutation } from "../../calendar/totalApi";

function LoadingSkeleton() {
  return (
    <div className="loading-skeleton">
      <div className="skeleton-line short"></div>
      <div className="skeleton-line medium"></div>
      <div className="skeleton-line long"></div>
    </div>
  );
}

function RecordingListItem({ recording, isExpanded, onToggleExpand }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteRecording] = useDeleteRecordingMutation();
  const [recalculateTotals] = useRecalculateTotalsMutation();
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

  const handleDelete = async () => {
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const recordDate = parseISO(recording.record_date);
      const zonedDate = toZonedTime(recordDate, userTimeZone);
      const utcDate = format(zonedDate, "yyyy-MM-dd");
      
      await deleteRecording(recording.record_id).unwrap();
      await recalculateTotals({
        userId: recording.user_id, 
        date: utcDate
      }).unwrap();
      
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Failed to delete recording:", err);
    }
  };

  const renderInsightSection = (title, content, renderFn) => {
    if (!content || (Array.isArray(content) && content.length === 0))
      return null;
    return (
      <div className="detail-section">
        <h4>
          <span className="section-icon">
            {title === "Emotional Analysis" && "🧠"}
            {title === "Physical Response" && "💪"}
            {title === "Coping Strategies" && "🛡️"}
            {title === "Recommendations" && "💡"}
          </span>
          {title}
        </h4>
        {renderFn(content)}
      </div>
    );
  };

  const hasCopingStrategies = (strategies) => {
    return strategies?.effective || strategies?.ineffective;
  };

  return (
    <div
      className={`recording-item ${isExpanded ? "expanded" : ""}`}
      aria-expanded={isExpanded}
    >
      <div className="recording-header" onClick={onToggleExpand}>
        <svg
          className="expand-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 10L12 15L17 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

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
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`star ${
                        i < displayRecording.feedback ? "filled" : ""
                      }`}
                    >
                      {i < displayRecording.feedback ? "★" : "☆"}
                    </span>
                  ))}
                </span>
              )}
          </div>
          <div className="recording-preview">
            <p>{displayRecording.summary}</p>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="recording-details">
          {isAnalysisLoading ? (
            <div className="loading-analysis">
              <LoadingSkeleton />
            </div>
          ) : (
            <>
              {renderInsightSection(
                "Emotional Analysis",
                displayRecording.insights?.emotional_dynamics,
                (content) => (
                  <div className="insight-card">
                    <p>{content || "No emotional dynamics data available"}</p>
                    {displayRecording.insights?.key_triggers?.length > 0 && (
                      <div className="insight-subsection">
                        <h5>Key Triggers</h5>
                        <ul>
                          {displayRecording.insights.key_triggers.map(
                            (trigger, index) => (
                              <li key={index}>{trigger}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              )}

              {renderInsightSection(
                "Physical Response",
                displayRecording.insights?.physical_reaction,
                (reaction) => (
                  <div className="insight-card">
                    <p>{reaction || "No physical reaction data available"}</p>
                  </div>
                )
              )}

              {hasCopingStrategies(
                displayRecording.insights?.coping_strategies
              ) &&
                renderInsightSection(
                  "Coping Strategies",
                  displayRecording.insights?.coping_strategies,
                  (strategies) => (
                    <div className="strategy-container">
                      {strategies.effective && (
                        <div className="strategy-card effective">
                          <div className="strategy-header">
                            <span className="strategy-icon">✅</span>
                            <h5>Effective</h5>
                          </div>
                          <p>{strategies.effective}</p>
                        </div>
                      )}
                      {strategies.ineffective && (
                        <div className="strategy-card ineffective">
                          <div className="strategy-header">
                            <span className="strategy-icon">❌</span>
                            <h5>Ineffective</h5>
                          </div>
                          <p>{strategies.ineffective}</p>
                        </div>
                      )}
                    </div>
                  )
                )}

              {displayRecording.insights?.recommendations?.length > 0 &&
                renderInsightSection(
                  "Recommendations",
                  displayRecording.insights.recommendations,
                  (recommendations) => (
                    <div className="recommendations-card">
                      <ol>
                        {recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ol>
                    </div>
                  )
                )}

              <div className="buttons">
                <button
                  className="delete"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Recording
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete this recording? This action cannot
              be undone.
            </p>
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button className="confirm-delete-button" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecordingListItem;
