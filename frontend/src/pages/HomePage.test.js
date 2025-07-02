import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import '@testing-library/jest-dom';


jest.mock('../features/recordings/components/AudioRecorder', () => ({ 
  setIsRecording, onResult 
}) => (
  <div>
    <button onClick={() => setIsRecording(true)}>Start Recording</button>
    <button onClick={() => onResult({ emotion: 'happy', summary: 'Test summary' })}>
      Mock Result
    </button>
  </div>
));

jest.mock('../features/recordings/components/WaveAnimation', () => ({ isRecording }) => (
  <div>{isRecording ? 'Recording...' : 'Idle'}</div>
));

jest.mock('../features/recordings/components/RecordingCard', () => ({ result }) => (
  <div>RecordingCard: {result.emotion}</div>
));

jest.mock('../features/calendar/components/MoodCalendar', () => () => (
  <div>Calendar View</div>
));

// Мок для useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('HomePage Component', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
    Storage.prototype.getItem = jest.fn(() => JSON.stringify([]));
    global.scrollTo = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders core UI elements', () => {
    render(<HomePage />);
    expect(screen.getByText('Your AI Voice Diary')).toBeInTheDocument();
    expect(screen.getByText('Create your first record today')).toBeInTheDocument();
  });

  test('displays random prompt', () => {
    render(<HomePage />);
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
    const promptElement = screen.getByText(/How was your day|What did you feel today|What made you happy or upset|What are you thinking about right now|What events were important to you today|Is there anything you'd like to let go of|What are you proud of today|What caused you stress or anxiety/);
    expect(prompts).toContain(promptElement.textContent);
  });

  test('handles recording flow', async () => {
    render(<HomePage />);
    
    fireEvent.click(screen.getByText('Start Recording'));
    expect(screen.getByText('Recording...')).toBeInTheDocument();
    
    await act(async () => {
      fireEvent.click(screen.getByText('Mock Result'));
    });
    
    expect(screen.getByText('RecordingCard: happy')).toBeInTheDocument();
    expect(global.scrollTo).toHaveBeenCalled();
  });

  test('shows day count', () => {
    Storage.prototype.getItem.mockReturnValue(JSON.stringify(['2023-07-01', '2023-07-02']));
    render(<HomePage />);
    expect(screen.getByText(/Day 2\/30/)).toBeInTheDocument();
  });

  test('toggles calendar', () => {
    render(<HomePage />);
    
    fireEvent.click(screen.getByText(/Day \d+\/30/));
    expect(screen.getByText('Calendar View')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('✕'));
    expect(screen.queryByText('Calendar View')).not.toBeInTheDocument();
  });

  test('navigates to profile', () => {
    render(<HomePage />);
    fireEvent.click(screen.getByText('Your profile'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });
});