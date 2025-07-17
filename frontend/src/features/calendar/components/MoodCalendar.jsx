
import React, { useState } from 'react';
import { FaLightbulb, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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
    
    >
      {currentMood.emoji}
    </span>
  );
};

const Calendar = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [voiceNotes, setVoiceNotes] = useState(() => {
    const savedNotes = localStorage.getItem('moodCalendarNotes');
    return savedNotes ? JSON.parse(savedNotes) : initialVoiceNotes;
  });
  const [isEditingMood, setIsEditingMood] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const monthName = currentDate.toLocaleString('en-US', { month: 'long' });

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

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
    setSelectedDay(null);
  };

  const currentNote = selectedDay ? voiceNotes[selectedDay] : null;

  return (
    <div className="calendar-wrapper">
      <div className="gradient-ball" />
      <div className="gradient-ball-2" />
      <div className="gradient-ball-3" />
      <div className="gradient-ball-4" />
      
      <div className="calendar-header">
        <div className="month-navigation">
          <button 
            onClick={() => changeMonth(-1)}
            className="nav-button"
          >
            <FaChevronLeft />
          </button>
          <h2>{monthName} {year}</h2>
          <button 
            onClick={() => changeMonth(1)}
            className="nav-button"
          >
            <FaChevronRight />
          </button>
        </div>
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
          {day && (
            <span className="day-number">{day}</span>
          )}
          {voiceNotes[day] ? (
            <div className="mood-emoji-main">
              <MoodIcon mood={voiceNotes[day].mood} />
            </div>
          ) : day && (
            <div className="empty-day"></div>
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
          <p className="empty-note">
            {selectedDay 
              ? `No reflection for ${monthName} ${selectedDay}, ${year}` 
              : 'Select a day to view or add reflection'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Calendar;