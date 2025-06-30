import React, { useState } from 'react';
import { FaPlay, FaStop, FaMusic, FaLightbulb } from 'react-icons/fa';
import './MoodCalendar.css';

const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];


const mockVoiceNotes = {
  3: {
    note: 'Finished project ahead of schedule',
    recommendation: 'Great job! Reward yourself with something nice today.',
    mood: 'happy'
  },
  15: {
    note: 'Feeling anxious about meeting',
    recommendation: 'Try deep breathing exercises before your meeting.',
    mood: 'sad'
  },
  [new Date().getDate()]: {
    note: 'Just recorded my thoughts',
    recommendation: 'Practice gratitude by listing 3 things you appreciate.',
    mood: 'neutral'
  }
};


const MoodIcon = ({ mood }) => {
  const moodIcons = {
    happy: { emoji: '😊', color: '#4CAF50' }, 
    sad: { emoji: '😢', color: '#2196F3' },
    angry: { emoji: '😠', color: '#F44336' }, 
    neutral: { emoji: '😐', color: '#9E9E9E' }, 
    excited: { emoji: '🤩', color: '#FFC107' }, 
    tired: { emoji: '😴', color: '#673AB7' } 
  };
  
  const currentMood = moodIcons[mood] || moodIcons.neutral;
  
  return (
    <span 
      className="mood-icon"
      style={{ backgroundColor: currentMood.color }}
    >
      {currentMood.emoji}
    </span>
  );
};

const Calendar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const currentDate = today.getDate();

  const [selectedDay, setSelectedDay] = useState(currentDate);
  const [isPlaying, setIsPlaying] = useState(false);

  const firstDay = new Date(year, month, 1);
  const startDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const monthName = today.toLocaleString('en-US', { month: 'long' });

  const handleDayClick = (day) => {
    if (day) setSelectedDay(day);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const currentNote = mockVoiceNotes[selectedDay];

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <h2>{monthName} {year}</h2>
      </div>
      
      <div className="day-names">
        {dayNames.map((name, i) => (
          <div key={i} className="day-name">{name}</div>
        ))}
      </div>

      <div className="days-grid">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`day-cell ${day === selectedDay ? 'selected' : ''} ${
              mockVoiceNotes[day] ? 'has-note' : ''
            }`}
            onClick={() => handleDayClick(day)}
          >
            {day || ''}
            {mockVoiceNotes[day] && (
              <>
                <FaMusic className="note-icon" />
                <MoodIcon mood={mockVoiceNotes[day].mood} />
              </>
            )}
          </div>
        ))}
      </div>

      <div className="voice-note-panel">
        <h3>Daily Reflection</h3>
        
        {currentNote ? (
          <>
            <div className="note-section">
              <p className="note-content">{currentNote.note}</p>
              <button 
                className={`play-button ${isPlaying ? 'playing' : ''}`}
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <>
                    <FaStop /> Stop Listening
                  </>
                ) : (
                  <>
                    <FaPlay /> Play Recording
                  </>
                )}
              </button>
            </div>

            <div className="recommendation-section">
              <div className="recommendation-header">
                <FaLightbulb className="recommendation-icon" />
                <h4>AI Recommendation</h4>
              </div>
              <p className="recommendation-text">{currentNote.recommendation}</p>
            </div>
          </>
        ) : (
          <p className="empty-note">No reflection for this day</p>
        )}
      </div>
    </div>
  );
};

export default Calendar;