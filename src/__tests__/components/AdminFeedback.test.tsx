import { render, screen, fireEvent } from '@testing-library/react';
import AdminFeedback from '@/components/AdminFeedback';

// Mock SubmissionFeedback
jest.mock('@/components/SubmissionFeedback', () => {
  return function MockSubmissionFeedback({ open, kind, message, onClose }: any) {
    if (!open) return null;
    return (
      <div data-testid="submission-feedback">
        <span>{kind}</span>
        <span>{message}</span>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

describe('AdminFeedback', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    open: true,
    kind: 'success' as const,
    message: 'Operation successful',
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(<AdminFeedback {...defaultProps} />);
    expect(screen.getByTestId('submission-feedback')).toBeInTheDocument();
    expect(screen.getByText('success')).toBeInTheDocument();
    expect(screen.getByText('Operation successful')).toBeInTheDocument();
  });

  it('renders nothing when closed', () => {
    render(<AdminFeedback {...defaultProps} open={false} />);
    expect(screen.queryByTestId('submission-feedback')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<AdminFeedback {...defaultProps} />);
    fireEvent.click(screen.getByText('Close'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
