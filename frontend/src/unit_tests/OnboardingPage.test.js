import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import OnboardingPage from '../pages/OnboardingPage';
import '@testing-library/jest-dom';

jest.mock('../features/Header/Header', () => () => <div>Header</div>);
jest.mock('../features/recordings/components/AudioRecorder', () => ({ 
  setIsRecording, onRecordingStart, onResult 
}) => (
  <div>
    <button onClick={onRecordingStart}>Start Recording</button>
    <button onClick={() => onResult({ emotion: 'happy', summary: 'Test summary' })}>
      Mock Result
    </button>
  </div>
));
jest.mock('../features/recordings/components/WaveAnimation', () => ({ isRecording }) => (
  <div>WaveAnimation {isRecording ? 'recording' : 'idle'}</div>
));
jest.mock('../features/recordings/components/RecordingCard', () => ({ result }) => (
  <div className="recording-card">RecordingCard: {result.emotion}</div>
));

describe('OnboardingPage', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
    jest.clearAllMocks();
  });

  it('renders the main header and subtitle', () => {
    render(<OnboardingPage />);
    expect(screen.getByText('Understand your emotions with every word.')).toBeInTheDocument();
    expect(screen.getByText('Your AI Voice Diary')).toBeInTheDocument();
    expect(screen.getByText(/listens, analyzes your tone/)).toBeInTheDocument();
  });

  it('displays feature cards', () => {
    render(<OnboardingPage />);
    expect(screen.getByText('Voice Journaling')).toBeInTheDocument();
    expect(screen.getByText('Emotion Analysis')).toBeInTheDocument();
    expect(screen.getByText('Mood Calendar')).toBeInTheDocument();
  });

  it('handles recording start and shows wave animation', () => {
    render(<OnboardingPage />);
    fireEvent.click(screen.getByText('Start Recording'));
    expect(screen.getByText('WaveAnimation recording')).toBeInTheDocument();
  });

  it('displays recording card after getting result', () => {
    render(<OnboardingPage />);
    fireEvent.click(screen.getByText('Mock Result'));
    expect(screen.getByText('RecordingCard: happy')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<OnboardingPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});