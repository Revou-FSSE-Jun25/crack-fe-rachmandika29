import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '@/components/Modal';

// Mock useEscapeToClose hook
jest.mock('@/lib/hooks/useEscapeToClose', () => ({
  useEscapeToClose: jest.fn(),
}));

describe('Modal', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    title: 'Test Modal',
    children: <div>Modal Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when open is false', () => {
    render(<Modal {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders correctly when open is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <Modal
        {...defaultProps}
        footer={<button>Footer Action</button>}
      />
    );
    expect(screen.getByText('Footer Action')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<Modal {...defaultProps} />);
    const backdrop = screen.getByLabelText('Close');
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
