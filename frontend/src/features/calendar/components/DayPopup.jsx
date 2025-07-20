import './DayPopup.css';
import { useNavigate } from 'react-router-dom';

const moodOptions = [
  { value: 'happy', label: 'Happy', class: 'positive' },
  { value: 'surprised', label: 'Surprised', class: 'positive' },
  { value: 'sad', label: 'Sad', class: 'negative' },
  { value: 'fearful', label: 'Fearful', class: 'negative' },
  { value: 'disgust', label: 'Disgust', class: 'negative' },
  { value: 'angry', label: 'Angry', class: 'aggressive' },
  { value: 'neutral', label: 'Neutral', class: 'neutral' }
];

const DayPopup = ({ currentDayData, selectedDay, monthName, year }) => {
  const navigate = useNavigate();

  const getMoodClass = (mood) => {
    const moodObj = moodOptions.find(option => option.value === mood);
    return moodObj ? moodObj.class : 'neutral';
  };

  const getMoodLabel = (mood) => {
    const moodObj = moodOptions.find(option => option.value === mood);
    return moodObj ? moodObj.label : 'Neutral';
  };

  const handleAddReflection = () => {
    navigate('/homepage');
  };

  return (
    <div className="voice-note-panel">
      <div className="popup-header">
        <h3>{selectedDay ? `${monthName} ${selectedDay}, ${year}` : 'Daily Reflection'}</h3>
        <div className="divider"></div>
      </div>

      {currentDayData ? (
        <div className="note-content">
          <div className="mood-section">
            <h4>Your Mood</h4>
            <div className="mood-display">
              <span className={`emotion-pill ${getMoodClass(currentDayData.mood)}`}>
                {getMoodLabel(currentDayData.mood)}
              </span>
            </div>
          </div>

          {currentDayData.summary && (
            <div className="summary-section">
              <h4>Daily Summary</h4>
              <div className="summary-text">
                <p>{currentDayData.summary}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-note">
          <p>No data recorded for this day</p>
          <button 
            className="add-note-cta"
            onClick={handleAddReflection}
          >
            + Add Reflection
          </button>
        </div>
      )}
    </div>
  );
};

export default DayPopup;