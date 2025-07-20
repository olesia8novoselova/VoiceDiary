import { useState } from 'react';
import './DayPopup.css';
import { MoodIcon } from './MoodIcon';


const DayPopup = ({ 
  currentDayData, 
  selectedDay, 
  monthName, 
  year,
  isEditingMood,       
  setIsEditingMood,     
  onUpdateMood,          
  moodOptions            
}) => {
  const handleMoodSelect = (mood) => {
    onUpdateMood(mood); 
  };

  return (
    <div className="voice-note-panel">
      <h3>Daily Reflection</h3>

      {currentDayData ? (
        <>
          <div className="note-section">
            <div className="mood-summary">
              <strong>Your mood:</strong>
              {isEditingMood ? (
                <div className="mood-selector">
                  {moodOptions.map((option) => (
                    <button
                      key={option.value}
                      className="mood-option"
                      onClick={() => handleMoodSelect(option.value)}
                      style={{ color: option.color }}
                    >
                      {option.emoji}
                    </button>
                  ))}
                  <button 
                    className="cancel-edit-btn"
                    onClick={() => setIsEditingMood(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="mood-emoji">
                    <MoodIcon mood={currentDayData.mood} />
                    {currentDayData.mood?.charAt(0).toUpperCase() + currentDayData.mood?.slice(1)}
                  </span>
                  <button 
                    className="edit-mood-btn"
                    onClick={() => setIsEditingMood(true)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {currentDayData.summary && (
              <div className="summary-section" style={{ marginTop: '1rem' }}>
                <strong>Summary:</strong> <span>{currentDayData.summary}</span>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="empty-note">
          {selectedDay 
            ? `No data available for ${monthName} ${selectedDay}, ${year}` 
            : 'Select a day to view details'}
        </p>
      )}
    </div>
  );
};

export default DayPopup;