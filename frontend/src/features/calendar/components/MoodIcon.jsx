const moodOptions = [
  { value: 'happy', emoji: '😊', label: 'Happy', color: '#2ed573' },
  { value: 'surprised', emoji: '😲', label: 'Surprised', color: '#2ed573' },
  { value: 'sad', emoji: '😢', label: 'Sad', color: '#bdd5ee' },
  { value: 'fearful', emoji: '😨', label: 'Fearful', color: '#bdd5ee' },
  { value: 'disgust', emoji: '🤢', label: 'Disgust', color: '#bdd5ee' },
  { value: 'angry', emoji: '😠', label: 'Angry', color: '#ff4757' },
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