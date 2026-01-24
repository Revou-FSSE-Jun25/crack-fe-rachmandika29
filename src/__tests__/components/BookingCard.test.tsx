import { render, screen, fireEvent } from '@testing-library/react';
import BookingCard from '@/components/BookingCard';
import { formatToLocal } from '@/lib/utils';

// Mock utils
jest.mock('@/lib/utils', () => ({
  formatToLocal: jest.fn(),
}));

describe('BookingCard', () => {
  const mockOnViewDetails = jest.fn();
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
    notes: '',
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
    booking: mockBooking,
    onViewDetails: mockOnViewDetails,
    onCancel: mockOnCancel,
    onReschedule: mockOnReschedule,
  };

  it('renders booking details correctly', () => {
    render(<BookingCard {...defaultProps} />);
    expect(screen.getByText('upcoming')).toBeInTheDocument();
    expect(screen.getByText('Jan 1, 2023')).toBeInTheDocument();
    expect(screen.getByText('7:00 PM')).toBeInTheDocument();
    expect(screen.getByText('4 guests')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('Item 1 × 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2 × 1')).toBeInTheDocument();
  });

  it('calls onViewDetails when clicked', () => {
    render(<BookingCard {...defaultProps} />);
    fireEvent.click(screen.getByText('View Details'));
    expect(mockOnViewDetails).toHaveBeenCalledWith(mockBooking);
  });

  it('calls onCancel when clicked', () => {
    render(<BookingCard {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalledWith(mockBooking);
  });

  it('calls onReschedule when clicked', () => {
    render(<BookingCard {...defaultProps} />);
    fireEvent.click(screen.getByText('Reschedule'));
    expect(mockOnReschedule).toHaveBeenCalledWith(mockBooking);
  });

  it('disables buttons when loading', () => {
    render(<BookingCard {...defaultProps} cancelling={true} rescheduling={true} />);
    expect(screen.getByText('Cancelling...')).toBeDisabled();
    expect(screen.getByText('Rescheduling...')).toBeDisabled();
  });
});
