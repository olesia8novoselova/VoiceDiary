import React, { useState } from "react";
import AudioRecorder from "../features/recordings/components/AudioRecorder";
import WaveAnimation from "../features/recordings/components/WaveAnimation";
import Header from "../features/Header/Header";
import "./OnboardingPage.css";

function OnboardingPage() {
  const [isRecording, setIsRecording] = useState(false);

  const scrollToRecord = (e) => {
    e.preventDefault();
    const recordSection = document.getElementById("record");
    recordSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container">
      <Header />
      <div className="gradient-ball first"></div>
      <div className="gradient-ball second"></div>
      <div className="gradient-ball third"></div>
      <div className="gradient-ball fourth"></div>

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
        <AudioRecorder setIsRecording={setIsRecording} />
      </div>
      <WaveAnimation className="wave-container" isRecording={isRecording} />
    </div>
  );
}

export default OnboardingPage;