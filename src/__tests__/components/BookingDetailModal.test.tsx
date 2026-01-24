import { render, screen, fireEvent } from '@testing-library/react';
import BookingDetailModal from '@/components/BookingDetailModal';
import { formatToLocal } from '@/lib/utils';

// Mock utils
jest.mock('@/lib/utils', () => ({
  formatToLocal: jest.fn(),
}));

// Mock Modal
jest.mock('@/components/Modal', () => {
  return function MockModal({ children, open, footer, title, onClose }: any) {
    if (!open) return null;
    return (
      <div data-testid="mock-modal">
        <h2>{title}</h2>
        <button onClick={onClose}>Dismiss</button>
        <div>{children}</div>
        <div>{footer}</div>
      </div>
    );
  };
});

describe('BookingDetailModal', () => {
  const mockOnClose = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnReschedule = jest.fn();

  const mockBooking = {
    id: '1',
    dateIso: '2023-01-01',
    time: '19:00',
    guests: 4,
    status: 'upcoming' as const,
    subtotal: 100,
    items: [
      { slug: 'item-1', name: 'Item 1', price: 50, qty: 1 },
      { slug: 'item-2', name: 'Item 2', price: 50, qty: 1 },
    ],
    notes: 'Allergic to peanuts',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '1234567890',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (formatToLocal as jest.Mock).mockReturnValue({
      date: 'Jan 1, 2023',
      time: '7:00 PM',
      full: 'Jan 1, 2023 7:00 PM',
    });
  });

  const defaultProps = {
    open: true,
    booking: mockBooking,
    onClose: mockOnClose,
    onCancel: mockOnCancel,
    onReschedule: mockOnReschedule,
  };

  it('renders booking details', () => {
    render(<BookingDetailModal {...defaultProps} />);
    expect(screen.getByText('Jan 1, 2023 7:00 PM • 4 guests')).toBeInTheDocument();
    expect(screen.getByText('Allergic to peanuts')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument(); // Subtotal
  });

  it('calls actions correctly', () => {
    render(<BookingDetailModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Dismiss'));
    expect(mockOnClose).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalledWith(mockBooking);

    fireEvent.click(screen.getByText('Reschedule'));
    expect(mockOnReschedule).toHaveBeenCalledWith(mockBooking);
  });
});
