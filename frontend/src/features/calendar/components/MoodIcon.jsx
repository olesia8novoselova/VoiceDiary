const moodOptions = [
  { value: 'joy', emoji: '😊', label: 'Joy', color: '#2ed573' },
  { value: 'surprise', emoji: '😲', label: 'Surprise', color: '#2ed573' },
  { value: 'sadness', emoji: '😢', label: 'Sadness', color: '#bdd5ee' },
  { value: 'fear', emoji: '😨', label: 'Fear', color: '#bdd5ee' },
  { value: 'disgust', emoji: '🤢', label: 'Disgust', color: '#bdd5ee' },
  { value: 'anger', emoji: '😠', label: 'Anger', color: '#ff4757' },
  { value: 'neutral', emoji: '😐', label: 'Neutral', color: '#ffa500' }
];

export const MoodIcon = ({ mood }) => {
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
      style={{ color: currentMood.color }}
    >
      {currentMood.emoji}
    </span>
  );
};