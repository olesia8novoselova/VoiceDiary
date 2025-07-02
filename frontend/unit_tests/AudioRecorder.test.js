import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AudioRecorder from './AudioRecorder';
import '@testing-library/jest-dom';


jest.mock('react-icons/fa', () => ({
  FaMicrophone: () => <div>MicIcon</div>,
  FaPause: () => <div>PauseIcon</div>,
  FaStop: () => <div>StopIcon</div>,
  FaTrash: () => <div>TrashIcon</div>,
  FaCheck: () => <div>CheckIcon</div>,
  FaExclamationTriangle: () => <div>WarningIcon</div>,
  FaPlay: () => <div>PlayIcon</div>,
}));

jest.mock('../hooks/useAudioRecorder', () => ({
  __esModule: true,
  default: jest.fn(),
}));


describe('AudioRecorder Component', () => {
  const mockSetIsRecording = jest.fn();
  const mockOnRecordingStart = jest.fn();
  const mockOnResult = jest.fn();

  const mockUseAudioRecorder = (overrides = {}) => ({
    isRecording: false,
    isPaused: false,
    recordTime: 0,
    audioBlob: null,
    permission: 'granted',
    showControls: false,
    isLoading: false,
    showDeleteConfirm: false,
    isActionInProgress: false,
    togglePause: jest.fn(),
    cancelRecording: jest.fn(),
    handleDeleteClick: jest.fn(),
    handleDeleteCancel: jest.fn(),
    saveRecording: jest.fn(),
    formatTime: (seconds) => `00:${seconds < 10 ? '0' + seconds : seconds}`,
    handleMainButtonClick: jest.fn(),
    stopRecording: jest.fn(),
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders basic recorder UI', () => {
    const useAudioRecorder = require('../hooks/useAudioRecorder');
    useAudioRecorder.default.mockImplementation(() => mockUseAudioRecorder());
    
    render(
      <AudioRecorder 
        setIsRecording={mockSetIsRecording}
        onRecordingStart={mockOnRecordingStart}
        onResult={mockOnResult}
      />
    );

    expect(screen.getByText('MicIcon')).toBeInTheDocument();
    expect(screen.queryByText('PauseIcon')).not.toBeInTheDocument();
  });

  test('shows permission denied banner when permission is denied', () => {
    const useAudioRecorder = require('../hooks/useAudioRecorder');
    useAudioRecorder.default.mockImplementation(() => 
      mockUseAudioRecorder({ permission: 'denied' })
    );
    
    render(<AudioRecorder setIsRecording={mockSetIsRecording} />);
    
    expect(screen.getByText('WarningIcon')).toBeInTheDocument();
    expect(screen.getByText(/Microphone access is blocked/)).toBeInTheDocument();
  });

  test('shows recording controls when recording starts', () => {
    const useAudioRecorder = require('../hooks/useAudioRecorder');
    useAudioRecorder.default.mockImplementation(() => 
      mockUseAudioRecorder({ 
        isRecording: true,
        showControls: true,
        recordTime: 5 
      })
    );
    
    render(<AudioRecorder setIsRecording={mockSetIsRecording} />);
    
    expect(screen.getByText('00:05')).toBeInTheDocument();
    expect(screen.getByText('PauseIcon')).toBeInTheDocument();
    expect(screen.getByText('StopIcon')).toBeInTheDocument();
  });

  test('shows loading state during analysis', () => {
    const useAudioRecorder = require('../hooks/useAudioRecorder');
    useAudioRecorder.default.mockImplementation(() => 
      mockUseAudioRecorder({ isLoading: true })
    );
    
    render(<AudioRecorder setIsRecording={mockSetIsRecording} />);
    
    expect(screen.getByText(/Voice recording is being analyzed/)).toBeInTheDocument();
  });

  test('shows save/delete buttons after recording', async () => {
    const useAudioRecorder = require('../hooks/useAudioRecorder');
    useAudioRecorder.default.mockImplementation(() => 
      mockUseAudioRecorder({ audioBlob: {} })
    );
    
    render(<AudioRecorder setIsRecording={mockSetIsRecording} />);
    
    expect(screen.getByText('TrashIcon')).toBeInTheDocument();
    expect(screen.getByText('CheckIcon')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('shows delete confirmation when delete clicked', async () => {
    const user = userEvent.setup();
    const useAudioRecorder = require('../hooks/useAudioRecorder');
    const mockHandleDeleteClick = jest.fn();
    
    useAudioRecorder.default.mockImplementation(() => 
      mockUseAudioRecorder({ 
        audioBlob: {},
        handleDeleteClick: mockHandleDeleteClick
      })
    );
    
    render(<AudioRecorder setIsRecording={mockSetIsRecording} />);
    
    await act(async () => {
      await user.click(screen.getByText('TrashIcon'));
    });
    
    expect(mockHandleDeleteClick).toHaveBeenCalled();
  });


  test('calls stopRecording when stop button clicked', async () => {
    const user = userEvent.setup();
    const useAudioRecorder = require('../hooks/useAudioRecorder');
    const mockStopRecording = jest.fn();
    
    useAudioRecorder.default.mockImplementation(() => 
      mockUseAudioRecorder({ 
        isRecording: true,
        showControls: true,
        stopRecording: mockStopRecording
      })
    );
    
    render(<AudioRecorder setIsRecording={mockSetIsRecording} />);
    
    await act(async () => {
      await user.click(screen.getByText('StopIcon'));
    });
    
    expect(mockStopRecording).toHaveBeenCalled();
  });
}); 