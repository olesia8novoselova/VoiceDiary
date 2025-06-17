import React from "react";
import AudioRecorder from "../components/AudioRecorder";
import WaveAnimation from "../components/WaveAnimation";
import "./OnboardingPage.css";

function OnboardingPage() {
  return (
    <div className="container">
      <header>
        <h1>Your AI Voice Diary</h1>
        <p>Understand your emotions with every word.</p>
      </header>

      <section className="features">
        <div className="card">
          <h3>Voice Journaling</h3>
          <p>Just talk—no typing needed. Captures your tone & pace.</p>
        </div>
        <div className="card">
          <h3>Emotion Analysis</h3>
          <p>Detects joy, stress, sadness. Understand how you feel.</p>
        </div>
        <div className="card">
          <h3>Mood Calendar</h3>
          <p>Track your emotions over time visually.</p>
        </div>
      </section>

      <AudioRecorder />
      <WaveAnimation />
    </div>
  );
}

export default OnboardingPage;
