import { render, screen, fireEvent } from '@testing-library/react';
import UpcomingBookingsList from '@/components/UpcomingBookingsList';

// Mock BookingCard
jest.mock('@/components/BookingCard', () => {
  return function MockBookingCard({ booking, onViewDetails }: any) {
    return (
      <div data-testid="booking-card" onClick={() => onViewDetails(booking)}>
        {booking.id}
      </div>
    );
  };
});

describe('UpcomingBookingsList', () => {
  const mockOnViewDetails = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnReschedule = jest.fn();

  const mockBookings = [
    { id: '1', dateIso: '2023-01-01', time: '19:00', status: 'upcoming', items: [] },
    { id: '2', dateIso: '2023-01-02', time: '20:00', status: 'confirmed', items: [] },
  ];

  const defaultProps = {
    bookings: mockBookings as any[],
    onViewDetails: mockOnViewDetails,
    onCancel: mockOnCancel,
    onReschedule: mockOnReschedule,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    render(<UpcomingBookingsList {...defaultProps} loading={true} />);
    expect(screen.getByText('Loading bookings…')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<UpcomingBookingsList {...defaultProps} error="Failed to fetch" />);
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<UpcomingBookingsList {...defaultProps} bookings={[]} />);
    expect(screen.getByText('No upcoming bookings')).toBeInTheDocument();
  });

  it('renders custom empty state', () => {
    render(
      <UpcomingBookingsList
        {...defaultProps}
        bookings={[]}
        empty={<div>Custom Empty</div>}
      />
    );
    expect(screen.getByText('Custom Empty')).toBeInTheDocument();
  });

  it('renders booking cards', () => {
    render(<UpcomingBookingsList {...defaultProps} />);
    expect(screen.getAllByTestId('booking-card')).toHaveLength(2);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
