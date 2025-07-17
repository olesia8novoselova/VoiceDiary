import { useState } from "react";
import { format } from "date-fns";
import "./RecordingListItem.css";
import { useGetRecordingAnalysisQuery, useDeleteRecordingMutation } from "../recordingsApi";

function RecordingListItem({ recording, isExpanded, onToggleExpand, onDelete }) {
  const { data: fullAnalysis, isLoading: isAnalysisLoading } =
    useGetRecordingAnalysisQuery(recording.record_id, {
      skip: !isExpanded,
    });
  
  const [deleteRecording] = useDeleteRecordingMutation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formattedDate = format(
    new Date(recording.record_date),
    "MMM d, yyyy - h:mm a"
  );

  const displayRecording =
    isExpanded && fullAnalysis ? { ...recording, ...fullAnalysis } : recording;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRecording(recording.record_id).unwrap();
      if (onDelete) onDelete(recording.record_id);
    } catch (error) {
      console.error("Failed to delete recording:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

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
          <div className="details-header">
            <h3>Full Analysis</h3>
            <button 
              onClick={handleDeleteClick}
              className="delete-button"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Recording"}
            </button>
          </div>

          {showDeleteConfirm && (
            <div className="delete-confirmation">
              <p>Are you sure you want to delete this recording?</p>
              <div className="confirmation-buttons">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirmDelete();
                  }}
                  className="confirm-button"
                  disabled={isDeleting}
                >
                  Yes, Delete
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelDelete();
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

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