import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import BookingsComposer from '@/components/BookingsComposer';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

// Mock hooks
const mockRefresh = jest.fn();
jest.mock('@/lib/hooks/useBookings', () => ({
  useBookings: () => ({
    data: [
      {
        id: '1',
        dateIso: '2023-01-01',
        time: '18:00',
        guests: 2,
        status: 'confirmed',
        items: [{ name: 'Burger' }],
      },
    ],
    loading: false,
    error: null,
    refresh: mockRefresh,
  }),
}));

const mockSubmit = jest.fn().mockResolvedValue({ ok: true });
jest.mock('@/lib/hooks/useAuthRequest', () => ({
  useAuthRequest: () => ({
    submit: mockSubmit,
  }),
}));

// Mock child components to simplify testing
jest.mock('@/components/BookingsHeader', () => () => <div>BookingsHeader</div>);
jest.mock('@/components/BookingsFilterBar', () => ({ onSearchChange }: any) => (
  <input data-testid="search" onChange={(e) => onSearchChange(e.target.value)} />
));
jest.mock('@/components/UpcomingBookingsList', () => ({ bookings, onCancel }: any) => (
  <div>
    {bookings.map((b: any) => (
      <div key={b.id}>
        {b.status} - {b.guests}
        <button onClick={() => onCancel(b)}>Cancel</button>
      </div>
    ))}
  </div>
));
jest.mock('@/components/BookingDetailModal', () => () => null);
jest.mock('@/components/ClientRescheduleModal', () => () => null);

describe('BookingsComposer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ email: 'test@example.com' }),
    } as any);
  });

  it('renders correctly', async () => {
    await act(async () => {
      render(<BookingsComposer />);
    });
    expect(screen.getByText('BookingsHeader')).toBeInTheDocument();
    expect(screen.getByText('confirmed - 2')).toBeInTheDocument();
  });

  it('handles cancellation', async () => {
    await act(async () => {
      render(<BookingsComposer />);
    });
    
    await act(async () => {
      fireEvent.click(screen.getByText('Cancel'));
    });

    expect(mockSubmit).toHaveBeenCalledWith({ id: '1' });
    expect(mockRefresh).toHaveBeenCalled();
  });
});
