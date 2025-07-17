import React, { useState } from 'react';
import { FaLightbulb } from 'react-icons/fa';
import './MoodCalendar.css';

const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const initialVoiceNotes = {
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
    mood: 'neutral',
    summary: 'Today was fairly average, but productive.'
  }
};

const moodOptions = [
  { value: 'happy', emoji: '😊', label: 'Happy', color: '#4CAF50' },
  { value: 'sad', emoji: '😢', label: 'Sad', color: '#2196F3' },
  { value: 'angry', emoji: '😠', label: 'Angry', color: '#F44336' },
  { value: 'neutral', emoji: '😐', label: 'Neutral', color: '#9E9E9E' },
  { value: 'excited', emoji: '🤩', label: 'Excited', color: '#FFC107' },
  { value: 'tired', emoji: '😴', label: 'Tired', color: '#673AB7' }
];

const MoodIcon = ({ mood }) => {
  const moodMap = moodOptions.reduce((acc, option) => {
    acc[option.value] = {
      emoji: option.emoji,
      label: option.label,
      color: option.color
    };
    return acc;
  }, {});

  const currentMood = moodMap[mood] || moodMap.neutral;

  return (
    <span
      className="mood-icon"
      title={currentMood.label}
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
  const [voiceNotes, setVoiceNotes] = useState(() => {
    const savedNotes = localStorage.getItem('moodCalendarNotes');
    return savedNotes ? JSON.parse(savedNotes) : initialVoiceNotes;
  });
  const [isEditingMood, setIsEditingMood] = useState(false);

  const firstDay = new Date(year, month, 1);
  const startDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];



  const monthName = today.toLocaleString('en-US', { month: 'long' });
const saveNotes = (notes) => {
  setVoiceNotes(notes);
  localStorage.setItem('moodCalendarNotes', JSON.stringify(notes));
};

  const handleDayClick = (day) => {
    if (day) {
      setSelectedDay(day);
      setIsEditingMood(false);
    }
  };
  const handleMoodChange = (newMood) => {
    const updatedNotes = {
      ...voiceNotes,
      [selectedDay]: {
        ...voiceNotes[selectedDay],
        mood: newMood
      }
    };
    saveNotes(updatedNotes);
    setIsEditingMood(false);
  };

  const currentNote = voiceNotes[selectedDay];

  return (
    <div className="calendar-wrapper">
      <div className="gradient-ball" />
      <div className="gradient-ball-2" />
      <div className="gradient-ball-3" />
      <div className="gradient-ball-4" />
      
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
              voiceNotes[day] ? 'has-note' : ''
            }`}
            onClick={() => handleDayClick(day)}
          >
            {day || ''}
            {voiceNotes[day] && (
              <MoodIcon mood={voiceNotes[day].mood} />
            )}
          </div>
        ))}
      </div>

      <div className="voice-note-panel">
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h3>Daily Reflection</h3>
    <button 
      onClick={() => {
        localStorage.removeItem('moodCalendarNotes');
        setVoiceNotes(initialVoiceNotes);
      }}
      className="clear-data-btn"
    >
      Clear Data
    </button>
  </div>
        <h3>Daily Reflection</h3>

        {currentNote ? (
          <>
            <div className="note-section">
              <p className="note-content">{currentNote.note}</p>

              <div className="mood-summary">
                <strong>Your mood today:</strong>{' '}
                <span className="mood-emoji">
                  <MoodIcon mood={currentNote.mood} />{' '}
                  {currentNote.mood?.charAt(0).toUpperCase() + currentNote.mood?.slice(1)}
                  
                  <button 
  className="edit-mood-btn"
  onClick={() => setIsEditingMood(!isEditingMood)}
>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4V11H11V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 13H13V20H20V13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 13H7V17H11V13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 4H13V8H17V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
  {isEditingMood ? 'Cancel' : 'Edit Mood'}
</button>
                </span>
              </div>

              {isEditingMood && (
                <div className="mood-selector">
                  {moodOptions.map(option => (
                    <button
                      key={option.value}
                      className="mood-option"
                      onClick={() => handleMoodChange(option.value)}
                      style={{ backgroundColor: option.color }}
                      title={option.label}
                    >
                      {option.emoji}
                    </button>
                  ))}
                </div>
              )}

              {currentNote.summary && (
                <div className="summary-section" style={{ marginTop: '1rem' }}>
                  <strong>Summary:</strong> <span>{currentNote.summary}</span>
                </div>
              )}
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