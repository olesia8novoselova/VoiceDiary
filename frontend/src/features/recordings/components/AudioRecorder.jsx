import { useRef, useState } from "react";
import {
  FaMicrophone,
  FaPause,
  FaStop,
  FaTrash,
  FaCheck,
  FaExclamationTriangle,
  FaPlay,
} from "react-icons/fa";
import "./AudioRecorder.css";
import useAudioRecorder from "../hooks/useAudioRecorder";

const AudioRecorder = ({ setIsRecording, onRecordingStart, onResult }) => {
  const micIconRef = useRef(null);

  const [showTooltip, setShowTooltip] = useState(false);

  const {
    isRecording,
    isPaused,
    recordTime,
    audioBlob,
    permission,
    showControls,
    isLoading,
    showDeleteConfirm,
    isActionInProgress,
    togglePause,
    cancelRecording,
    handleDeleteClick,
    handleDeleteCancel,
    saveRecording,
    formatTime,
    handleMainButtonClick,
    stopRecording,
  } = useAudioRecorder({ setIsRecording, onRecordingStart, onResult });


  return (
    <div className="audio-recorder-wrapper">
      <div className="audio-recorder-container">
        {permission === "denied" && (
          <div className="permission-denied-banner">
            <FaExclamationTriangle className="warning-icon" />
            <span>
              Microphone access is blocked. Please enable it in your browser
              settings.
            </span>
          </div>
        )}

        <div
          className={`recorder-circle ${isRecording ? "recording" : ""} ${
            isPaused ? "is-paused" : ""
          } ${permission === "denied" ? "disabled" : ""}`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {showTooltip && (
            <div
              className={`tooltip ${isRecording ? "recording-tooltip" : ""}`}
            >
              {isRecording ? "Click to stop" : "Click to record"}
            </div>
          )}
          <button
            className="main-record-button"
            onClick={handleMainButtonClick}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
            disabled={permission === "denied" || isActionInProgress}
          >
            {isRecording ? <div className="pulse-animation"></div> : null}
            <FaMicrophone className="mic-icon" ref={micIconRef} />
          </button>
        </div>

        {isRecording && showControls && (
          <div className="recording-controls-below">
            <span className="timer">{formatTime(recordTime)}</span>
            <button
              className={`control-button pause-button ${
                isPaused ? "resume-state" : ""
              }`}
              onClick={togglePause}
              aria-label={isPaused ? "Resume recording" : "Pause recording"}
            >
              {isPaused ? <FaPlay /> : <FaPause />}
            </button>
            <button
              className="control-button stop-button"
              onClick={stopRecording}
              aria-label="Stop recording"
            >
              <FaStop />
            </button>
          </div>
        )}

        {isLoading && (
          <div className="loading-state">
            <div className="dots-loading">
              <div
                className="dot"
                style={{ "--delay": "0s", "--color": "#653c45" }}
              ></div>
              <div
                className="dot"
                style={{ "--delay": "0.2s", "--color": "#7a4b56" }}
              ></div>
              <div
                className="dot"
                style={{ "--delay": "0.4s", "--color": "#cac1f9" }}
              ></div>
            </div>
            <p className="analysis-note">
              Voice recording is being analyzed...
            </p>
          </div>
        )}

        {permission === "prompt" && !isRecording && (
          <div className="permission-prompt">
            <p>Click the microphone to start recording</p>
            <small>We'll ask for microphone permission</small>
          </div>
        )}

        {audioBlob && !isRecording && !showDeleteConfirm && (
          <div className="post-recording-actions">
            <div className="action-buttons-container">
              <button
                className="action-button delete-button"
                onClick={handleDeleteClick}
                aria-label="Delete recording"
              >
                <FaTrash />
                <span className="button-label">Delete</span>
              </button>
              <button
                className="action-button save-button"
                onClick={saveRecording}
                aria-label="Save recording"
              >
                <FaCheck />
                <span className="button-label">Save</span>
              </button>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="delete-confirmation">
            <p>Are you sure you want to delete this recording?</p>
            <div className="confirmation-buttons">
              <button
                className="confirm-button confirm-delete"
                onClick={cancelRecording}
              >
                Yes, delete
              </button>
              <button
                className="confirm-button cancel-delete"
                onClick={handleDeleteCancel}
              >
                No, keep it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;