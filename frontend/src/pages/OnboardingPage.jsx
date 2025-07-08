import React, { useState, useEffect } from "react";
import AudioRecorder from "../features/recordings/components/AudioRecorder";
import WaveAnimation from "../features/recordings/components/WaveAnimation";
import Header from "../features/Header/Header";
import "./OnboardingPage.css";
import RecordingCard from "../features/recordings/components/RecordingCard";
import FeedbackWidget from "../features/recordings/components/FeedbackWidget";

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

function OnboardingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showScrollToRecord, setShowScrollToRecord] = useState(false);

  const scrollToRecord = (e) => {
    e.preventDefault();
    const recordSection = document.getElementById("record");
    recordSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRecordingStart = () => {
    setAnalysisResult(null);
    setShowFeedback(false);
    setIsRecording(true);
  };

  const handleFeedbackSubmit = (rating) => {
    console.log("Feedback submitted:", rating);
    // send the rating to your backend
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPrompt(prompts[randomIndex]);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const feedbackElement = document.querySelector(".feedback-container");
      const recordSection = document.getElementById("record");

      if (feedbackElement && recordSection) {
        const feedbackRect = feedbackElement.getBoundingClientRect();
        const isFeedbackVisible =
          feedbackRect.top < window.innerHeight && feedbackRect.bottom >= 0;
        const recordRect = recordSection.getBoundingClientRect();
        setShowScrollToRecord(isFeedbackVisible && recordRect.top < 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToRecordSection = () => {
    const recordSection = document.getElementById("record");
    if (recordSection) {
      recordSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="container">
      <Header />
      <div className="gradient-ball"></div>
      <div className="gradient-ball-2"></div>
      <div className="gradient-ball-3"></div>
      <div className="gradient-ball-4"></div>
      <div className="gradient-ball-5"></div>

      <header className="main-header">
        <p className="logo0">Understand your emotions with every word.</p>
        <h1 className="logo">Your AI Voice Diary</h1>
        <p className="subtitle">
          listens, analyzes your tone, and helps you reflect on your feelings
          over time.
        </p>
      </header>

      <section className="features">
        <div className="card">
          <h3>Voice Journaling</h3>
          <p>Just talk—no typing needed.</p>
          <p>
            Record your thoughts in seconds, anytime. VoiceDiary captures your
            tone, pace, and emotions naturally.
          </p>
        </div>
        <div className="card">
          <h3>Emotion Analysis</h3>
          <p>Understand how you truly feel.</p>
          <p>
            AI detects sadness, stress, joy, and more— then summarizes your
            emotional state.
          </p>
        </div>
        <div className="card">
          <h3>Mood Calendar</h3>
          <p>See patterns over time.</p>
          <p>
            Color days highlight your emotional trends. Tap any date to revisit
            past reflections.
          </p>
        </div>
      </section>

      <div className="cta-button">
        <button className="try-now-btn" onClick={scrollToRecord}>
          Get started
        </button>
      </div>

      <section className="try-block">
        <div className="Instr">
          <h2>Try It Now — No Signup Needed</h2>
          <p>
            Get gentle, actionable suggestions. Based on your entries,
            VoiceDiary offers self-care tips or prompts for deeper reflection.
          </p>
        </div>
        <div className="how-works">
          <h2>How Voice Diary works?</h2>
          <h4>Record</h4>
          <p>Speak freely about your day, thoughts, or worries</p>
          <h4>Analyze</h4>
          <p>We detect emotions, key topics, and mood trends.</p>
        </div>
      </section>

      <div id="record" className="record-section-container">
        <div className="prompt-message">
          <p>{currentPrompt}</p>
        </div>

        <AudioRecorder
          setIsRecording={setIsRecording}
          onRecordingStart={handleRecordingStart}
          onResult={(result) => {
            setAnalysisResult(result);
            setShowFeedback(true);
            setTimeout(() => {
              const cardElement = document.querySelector(".recording-card");
              if (cardElement) {
                cardElement.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 300);
          }}
        />

        {analysisResult && <RecordingCard result={analysisResult} />}

        {showFeedback && <FeedbackWidget onSubmit={handleFeedbackSubmit} />}
      </div>
      <WaveAnimation className="wave-container" isRecording={isRecording} />

      {showScrollToRecord && (
        <button
          className="scroll-to-record-button"
          onClick={scrollToRecordSection}
          aria-label="Scroll to microphone"
        >
          <svg
            className="up-arrow-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 15L12 9L6 15"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default OnboardingPage;
