import React, { useState } from "react";
import AudioRecorder from "../components/AudioRecorder";
import WaveAnimation from "../components/WaveAnimation";
import "./OnboardingPage.css";

function OnboardingPage() {
  const [isRecording, setIsRecording] = useState(false);

  const scrollToRecord = (e) => {
    e.preventDefault();
    const recordSection = document.getElementById("record");
    if (recordSection) {
      recordSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container">
      <div className="gradient-ball first"></div>
      <div className="gradient-ball second"></div>
      <div className="gradient-ball third"></div>
      <div className="gradient-ball fourth"></div>

      <div className="auth-bar">
        <div className="auth-buttons">
          <a href="/login" className="login">Login</a>
          <a href="/signup" className="signup">Sign Up</a>
        </div>
      </div>

      <header className="main-header">
        <p className="logo0">Understand your emotions with every word.</p>
        <h1 className="logo">Your AI Voice Diary</h1>
        <p className="subtitle">
          listens, analyzes your tone, and helps you reflect on your feelings over time.
        </p>
        <div className="cta-button">
          <a href="#record" className="get-started-btn" onClick={scrollToRecord}>
            Get Started
          </a>
        </div>
      </header>

      <section className="features">
        <div className="card">
          <h3>Voice Journaling</h3>
          <p>
            Just talk—no typing needed. Record your thoughts in seconds, anytime.
            VoiceDiary captures your tone, pace, and emotions naturally.
          </p>
        </div>
        <div className="card">
          <h3>Emotion Analysis</h3>
          <p>
            Understand how you truly feel. AI detects sadness, stress, joy, and more—
            then summarizes your emotional state.
          </p>
        </div>
        <div className="card">
          <h3>Mood Calendar</h3>
          <p>
            See patterns over time. Color days highlight your emotional trends.
            Tap any date to revisit past reflections.
          </p>
        </div>
      </section>

      <section className="try-block">
        <div className="Instr">
          <h4>Try It Now — No Signup Needed</h4>
          <p>
            Get gentle, actionable suggestions. Based on your entries, VoiceDiary
            offers self-care tips or prompts for deeper reflection.
          </p>
        </div>
        <div className="how-works">
          <h4>How Voice Diary works?</h4>
          <h5>Record</h5>
          <p>Speak freely about your day, thoughts, or worries</p>
          <h6>Analyze</h6>
          <p>We detect emotions, key topics, and mood trends.</p>
        </div>
      </section>

      <div id="record" className="record-section-container">
        <div className="gradient-ball-5"></div>
        <AudioRecorder setIsRecording={setIsRecording} />
      </div>

      <WaveAnimation isRecording={isRecording} />
    </div>
  );
}

export default OnboardingPage;