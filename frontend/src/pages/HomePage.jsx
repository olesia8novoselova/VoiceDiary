import { useState, useEffect, useRef } from "react";
import AudioRecorder from "../features/recordings/components/AudioRecorder";
import WaveAnimation from "../features/recordings/components/WaveAnimation";
import RecordingCard from "../features/recordings/components/RecordingCard";
import FeedbackWidget from "../features/recordings/components/FeedbackWidget";
import Calendar from "../features/calendar/components/MoodCalendar";
import Header from "../features/Header/Header";
import "./HomePage.css";
import { useSetRecordingFeedbackMutation } from "../features/recordings/recordingsApi";

const prompts = [
  "How was your day?",
  "What did you feel today?",
  "What made you happy or upset?",
  "What are you thinking about right now?",
  "What events were important to you today?",
  "Is there anything you'd like to let go of?",
  "What are you proud of today?",
  "What caused you stress or anxiety?",
];

function HomePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const resultRef = useRef(null);
  const [currentDay] = useState(1);
  const [setFeedback] = useSetRecordingFeedbackMutation();

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPrompt(prompts[randomIndex]);
  }, []);

  useEffect(() => {
    if (analysisResult && resultRef.current) {
      setTimeout(() => {
        const yOffset = -120;
        const y =
          resultRef.current.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 100);
    }
  }, [analysisResult]);

  const handleRecordingStart = () => {
    setAnalysisResult(null);
    setShowFeedback(false);
    setIsRecording(true);
  };

  const handleFeedbackSubmit = async (rating) => {
    try {
      if (!analysisResult?.record_id) {
        console.error("No recording ID available for feedback");
        return;
      }

      await setFeedback({
        recordId: analysisResult.record_id,
        feedback: rating
      }).unwrap();

      console.log("Feedback submitted successfully:", rating);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  return (
    <div className={`home-page ${showCalendar ? "calendar-mode" : ""}`}>
      <div className="gradient-ball"></div>
      <div className="gradient-ball-2"></div>
      <div className="gradient-ball-3"></div>
      <div className="gradient-ball-4"></div>
      <div className="gradient-ball-5"></div>

      <Header
        currentDay={currentDay}
        onCalendarToggle={() => setShowCalendar(!showCalendar)}
      />

      <div className="home-content">
        <h1 className="main-title">Your AI Voice Diary</h1>
        <p className="subtitle">Create your first record today</p>

        <div className="prompt-section">
          <p className="prompt-message">{currentPrompt}</p>
          <AudioRecorder
            setIsRecording={setIsRecording}
            onRecordingStart={handleRecordingStart}
            onResult={(result) => {
              setAnalysisResult(result);
              setShowFeedback(true);
            }}
          />
        </div>
      </div>

      <WaveAnimation className="wave-container" isRecording={isRecording} />

      {analysisResult && (
        <div ref={resultRef} className="result-container">
          <RecordingCard result={analysisResult} />
          {showFeedback && <FeedbackWidget onSubmit={handleFeedbackSubmit} />}
        </div>
      )}

      {showCalendar && (
        <div className="calendar-overlay">
          <button className="close-btn" onClick={() => setShowCalendar(false)}>
            ✕
          </button>
          <div className="calendar-container-homepage">
            <Calendar />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;