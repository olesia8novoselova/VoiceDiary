import React from 'react';
import { render, screen } from '@testing-library/react';
import RecordingCard from '../features/recordings/components/RecordingCard';
import '@testing-library/jest-dom';

describe('RecordingCard Component', () => {
  const mockResult = {
    emotion: 'happy',
    summary: 'You were feeling joyful and energetic today.',
    record_date: '2023-07-15T14:30:00Z',
    insights: {
      emotional_dynamics: 'Positive throughout the day',
      key_triggers: ['Meeting with friends', 'Completed project'],
      physical_reaction: 'Increased energy and positive body language',
      coping_strategies: {
        effective: 'Taking short breaks',
        ineffective: 'Late night working'
      },
      recommendations: [
        'Exercise: Try 30 minutes of yoga',
        'Social: Schedule more friend time'
      ]
    }
  };

  test('renders nothing when no result is provided', () => {
    const { container } = render(<RecordingCard result={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders all main sections with happy emotion', () => {
    render(<RecordingCard result={mockResult} />);
    
    expect(screen.getByText('Your Emotional Report')).toBeInTheDocument();
    expect(screen.getByText('happy')).toBeInTheDocument();
    expect(screen.getByText('happy')).toHaveClass('positive');
    
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText(/joyful and energetic today/)).toBeInTheDocument();
    
    expect(screen.getByText('Emotional Analysis')).toBeInTheDocument();
    expect(screen.getByText('📈 Pattern')).toBeInTheDocument();
    expect(screen.getByText('Positive throughout the day')).toBeInTheDocument();
    expect(screen.getByText('🔑 Key Triggers')).toBeInTheDocument();
    expect(screen.getByText('Meeting with friends')).toBeInTheDocument();
    expect(screen.getByText('Completed project')).toBeInTheDocument();
    
    expect(screen.getByText('Physical Response')).toBeInTheDocument();
    expect(screen.getByText('Increased energy and positive body language')).toBeInTheDocument();
    
    expect(screen.getByText('Coping Strategies')).toBeInTheDocument();
    expect(screen.getByText('✅ Effective')).toBeInTheDocument();
    expect(screen.getByText('Taking short breaks')).toBeInTheDocument();
    expect(screen.getByText('❌ Ineffective')).toBeInTheDocument();
    expect(screen.getByText('Late night working')).toBeInTheDocument();
    
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Exercise: Try 30 minutes of yoga')).toBeInTheDocument();
    expect(screen.getByText('Social: Schedule more friend time')).toBeInTheDocument();
    
    expect(screen.getByText(/Recorded:/)).toBeInTheDocument();
    expect(screen.getByText('AI-generated, for reference only')).toBeInTheDocument();
  });

  test('applies correct emotion pill class for different emotions', () => {
    const emotions = [
      { emotion: 'happy', expectedClass: 'positive' },
      { emotion: 'surprised', expectedClass: 'positive' },
      { emotion: 'sad', expectedClass: 'negative' },
      { emotion: 'fearful', expectedClass: 'negative' },
      { emotion: 'disgust', expectedClass: 'negative' },
      { emotion: 'angry', expectedClass: 'aggressive' },
      { emotion: 'neutral', expectedClass: 'neutral' }
    ];

    emotions.forEach(({ emotion, expectedClass }) => {
      const { unmount } = render(<RecordingCard result={{ ...mockResult, emotion }} />);
      const pill = screen.getByText(emotion);
      expect(pill).toHaveClass(expectedClass);
      unmount();
    });
  });

  test('renders multiple key triggers correctly', () => {
    const resultWithMultipleTriggers = {
      ...mockResult,
      insights: {
        ...mockResult.insights,
        key_triggers: ['Trigger 1', 'Trigger 2', 'Trigger 3']
      }
    };
    
    render(<RecordingCard result={resultWithMultipleTriggers} />);
    expect(screen.getByText('Trigger 1')).toBeInTheDocument();
    expect(screen.getByText('Trigger 2')).toBeInTheDocument();
    expect(screen.getByText('Trigger 3')).toBeInTheDocument();
  });

  test('does not render coping strategies section when none are provided', () => {
    const resultWithoutStrategies = {
      ...mockResult,
      insights: {
        ...mockResult.insights,
        coping_strategies: {}
      }
    };
    
    render(<RecordingCard result={resultWithoutStrategies} />);
    expect(screen.queryByText('Coping Strategies')).not.toBeInTheDocument();
  });

  test('shows processing message when insights are missing', () => {
    const resultWithoutInsights = {
      ...mockResult,
      insights: null
    };
    
    render(<RecordingCard result={resultWithoutInsights} />);
    expect(screen.getByText('Detailed analysis is being processed...')).toBeInTheDocument();
  });
});