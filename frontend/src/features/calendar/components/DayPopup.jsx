import './DayPopup.css';
import { MoodIcon } from './MoodIcon';

const DayPopup = ({ currentDayData, selectedDay, monthName, year }) => {
  return (
    <div className="voice-note-panel">
      <h3>Daily Reflection</h3>

      {currentDayData ? (
        <>
          <div className="note-section">
            <div className="mood-summary">
              <strong>Your mood:</strong>{' '}
              <span className="mood-emoji">
                <MoodIcon mood={currentDayData.mood} />{' '}
                {currentDayData.mood?.charAt(0).toUpperCase() + currentDayData.mood?.slice(1)}
              </span>
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