import { useState, useRef, useEffect, useCallback } from "react";
import {
  FaMicrophone,
  FaPause,
  FaStop,
  FaTrash,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./AudioRecorder.css";

const AudioRecorder = ({ setIsRecording }) => {
  const [isRecording, setRecording] = useState(false);
  const [isPaused, setPaused] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [permission, setPermission] = useState("prompt");
  const [showControls, setShowControls] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerRef = useRef(null);
  const micIconRef = useRef(null);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "microphone",
        });
        updatePermissionState(permissionStatus.state);

        permissionStatus.onchange = () => {
          updatePermissionState(permissionStatus.state);
        };
      } catch (err) {
        console.log("Permission API not supported, using default flow");
      }
    };

    checkPermission();
  }, []);

  const updatePermissionState = (state) => {
    setPermission(state === "granted" ? "granted" : "prompt");
  };

  const resetRecorder = useCallback(() => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
    }
    mediaRecorder.current = null;
    audioChunks.current = [];
    clearInterval(timerRef.current);
  }, []);

  const stopRecording = useCallback(() => {
  if (mediaRecorder.current && isRecording) {
    if (mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
    mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    clearInterval(timerRef.current);
    setRecording(false);
    setPaused(false);
    setShowControls(false);
  }
}, [isRecording]);

  useEffect(() => {
    setIsRecording(isRecording);
    return () => {
      stopRecording();
    };
  }, [isRecording, setIsRecording, stopRecording]);

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermission("granted");
      return stream;
    } catch (err) {
      console.error("Microphone access denied:", err);
      setPermission("denied");
      return null;
    }
  };

  const startRecording = async () => {
    if (permission === "denied") {
      alert(
        "Please enable microphone access in your browser settings to record audio."
      );
      return;
    }

    try {
      resetRecorder();

      let stream;
      if (permission !== "granted") {
        stream = await requestMicrophoneAccess();
        if (!stream) return;
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.current.start(100);
      setRecording(true);
      setPaused(false);
      setRecordTime(0);
      setShowControls(true);

      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setPermission("denied");
    }
  };

  const togglePause = () => {
    if (!mediaRecorder.current) return;

    if (micIconRef.current) {
      micIconRef.current.style.transition = "all 0.3s ease";
    }

    if (isPaused) {
      mediaRecorder.current.resume();
      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } else {
      mediaRecorder.current.pause();
      clearInterval(timerRef.current);
    }
    setPaused(!isPaused);
  };

  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setRecordTime(0);
    resetRecorder();
  };

  const saveRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = audioUrl;
      a.download = `voice-${new Date().toISOString()}.wav`;
      document.body.appendChild(a);
      a.click();

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(audioUrl);
      }, 100);

      setAudioBlob(null);
      setRecordTime(0);
      resetRecorder();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleMainButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
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
      >
        <button
          className="main-record-button"
          onClick={handleMainButtonClick}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
          disabled={permission === "denied"}
        >
          {isRecording ? <div className="pulse-animation"></div> : null}
          <FaMicrophone 
            className="mic-icon" 
            ref={micIconRef}
          />
        </button>
      </div>

      {isRecording && showControls && (
        <div className="recording-controls-below">
          <span className="timer">{formatTime(recordTime)}</span>
          <button
            className={`control-button pause-button ${isPaused ? "resume-state" : ""}`}
            onClick={togglePause}
            aria-label={isPaused ? "Resume recording" : "Pause recording"}
          >
            {isPaused ? (
              <div className="play-icon-wrapper">
                <div className="play-icon-triangle"></div>
              </div>
            ) : (
              <FaPause />
            )}
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

      {permission === "prompt" && !isRecording && (
        <div className="permission-prompt">
          <p>Click the microphone to start recording</p>
          <small>We'll ask for microphone permission</small>
        </div>
      )}

      {audioBlob && !isRecording && (
        <div className="post-recording-actions">
          <button
            className="action-button delete-button"
            onClick={cancelRecording}
            aria-label="Delete recording"
          >
            <FaTrash />
          </button>
          <button
            className="action-button save-button"
            onClick={saveRecording}
            aria-label="Save recording"
          >
            <FaCheck />
          </button>
        </div>
      )}

      {showSuccess && (
        <div className="success-message">
          <FaCheck className="success-icon" />
          Recording saved successfully!
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;