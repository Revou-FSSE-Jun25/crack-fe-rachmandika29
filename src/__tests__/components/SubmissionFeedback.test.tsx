import { render, screen, fireEvent } from '@testing-library/react';
import SubmissionFeedback from '@/components/SubmissionFeedback';

describe('SubmissionFeedback', () => {
  const defaultProps = {
    open: true,
    kind: 'success' as const,
    message: 'Operation successful',
    onClose: jest.fn(),
  };

  it('renders success message', () => {
    render(<SubmissionFeedback {...defaultProps} />);
    expect(screen.getByText('Operation successful')).toBeInTheDocument();
    // Check styling class presence indirectly or just assume correct if rendering
  });

  it('renders error message', () => {
    render(<SubmissionFeedback {...defaultProps} kind="error" message="Failed" />);
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('returns null when not open', () => {
    const { container } = render(<SubmissionFeedback {...defaultProps} open={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('handles close', () => {
    render(<SubmissionFeedback {...defaultProps} />);
    fireEvent.click(screen.getByText('Close'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
