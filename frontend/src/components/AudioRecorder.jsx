import { useRef, useState, useEffect } from "react";

const AudioRecorder = ({ setIsRecording }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    setRecording(true);
    setIsRecording(true)
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false); 
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Microphone error:", err);
      setRecording(false);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setRecording(false);
    setIsRecording(false); 
 
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="record-section" style={{ textAlign: "center", marginTop: "2rem" }}>
      <button
        className={`record-btn ${recording ? "active" : ""}`}
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
      </button>

      {audioURL && (
        <audio controls src={audioURL} style={{ marginTop: "1rem" }} />
      )}
    </div>
  );
};

export default AudioRecorder;
