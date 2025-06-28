import React, { useState, useEffect, useRef } from "react";
import AudioRecorder from "../features/recordings/components/AudioRecorder";
import WaveAnimation from "../features/recordings/components/WaveAnimation";
import RecordingCard from "../features/recordings/components/RecordingCard";
import "./HomePage.css";

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

  const resultRef = useRef(null);
  const [currentDay, setCurrentDay] = useState(1);

useEffect(() => {
  const storedDays = JSON.parse(localStorage.getItem("recordedDays") || "[]");

  const currentMonth = new Date().toISOString().slice(0, 7); 
  const daysThisMonth = storedDays.filter((day) => day.startsWith(currentMonth));

  setCurrentDay(daysThisMonth.length);
}, [analysisResult]);


  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPrompt(prompts[randomIndex]);
  }, []);


 useEffect(() => {
  if (analysisResult && resultRef.current) {
    setTimeout(() => {
      const yOffset = -120; 
      const y =
        resultRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, 100);
  }
}, [analysisResult]);


  return (
    <div className="home-page">
      {/* большие цветные шары....*/}
      <div className="gradient-ball"></div>
      <div className="gradient-ball-2"></div>
      <div className="gradient-ball-3"></div>
      <div className="gradient-ball-4"></div>
      <div className="gradient-ball-5"></div>
       <div className="result-header">
     
        <div className="day-box">
        <p>Day {currentDay}/30</p>
        <small>Click to see recommendations</small>
        </div>

        <div className = "profile-box">
            <p>Your profile</p>

        </div>

      </div>


      <div className="home-content">
        <h1 className="main-title">Your AI Voice Diary</h1>
        <p className="subtitle">Create your first record today</p>

        <div className="prompt-section">
          <p className="prompt-message">{currentPrompt}</p>
          <AudioRecorder setIsRecording={setIsRecording} onResult={setAnalysisResult} />
        </div>
      </div>

      <WaveAnimation className="wave-container" isRecording={isRecording} />

      {analysisResult && (
        <div ref={resultRef}>
          <RecordingCard result={analysisResult} />
        </div>
      )}
    </div>
  );
}

export default HomePage;
