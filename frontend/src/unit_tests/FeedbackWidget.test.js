import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import FeedbackWidget from '../features/recordings/components/FeedbackWidget';

describe('FeedbackWidget', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders the initial feedback question and instruction', () => {
    render(<FeedbackWidget onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText('How accurate was this analysis?')).toBeInTheDocument();
    expect(screen.getByText('Click to submit your rating')).toBeInTheDocument();
  });

  it('displays all rating options with emojis and labels', () => {
    render(<FeedbackWidget onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText('😠')).toBeInTheDocument();
    expect(screen.getByText('Very Poor')).toBeInTheDocument();
    expect(screen.getByText('😕')).toBeInTheDocument();
    expect(screen.getByText('Poor')).toBeInTheDocument();
    expect(screen.getByText('😐')).toBeInTheDocument();
    expect(screen.getByText('Average')).toBeInTheDocument();
    expect(screen.getByText('🙂')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('😊')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  it('calls onSubmit with the selected rating when a rating is clicked', () => {
    render(<FeedbackWidget onSubmit={mockOnSubmit} />);
    
    const ratingButton = screen.getByLabelText('Good');
    fireEvent.click(ratingButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith(4);
  });

  it('shows the thank you message after a rating is submitted', () => {
    render(<FeedbackWidget onSubmit={mockOnSubmit} />);
    
    const ratingButton = screen.getByLabelText('Excellent');
    fireEvent.click(ratingButton);
    
    expect(screen.getByText('Thank you for your feedback! ❤️')).toBeInTheDocument();
    expect(screen.queryByText('How accurate was this analysis?')).not.toBeInTheDocument();
  });

  it('applies active class when hovering over a rating', () => {
    render(<FeedbackWidget onSubmit={mockOnSubmit} />);
    
    const ratingButton = screen.getByLabelText('Average');
    fireEvent.mouseEnter(ratingButton);
    
    expect(ratingButton).toHaveClass('active');
  });

  it('removes active class when mouse leaves a rating', () => {
    render(<FeedbackWidget onSubmit={mockOnSubmit} />);
    
    const ratingButton = screen.getByLabelText('Average');
    fireEvent.mouseEnter(ratingButton);
    fireEvent.mouseLeave(ratingButton);
    
    expect(ratingButton).not.toHaveClass('active');
  });

 
});