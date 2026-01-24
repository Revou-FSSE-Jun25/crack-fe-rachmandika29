import { render, screen } from '@testing-library/react';
import BookingsHeader from '@/components/BookingsHeader';

describe('BookingsHeader', () => {
  it('renders default title and description', () => {
    render(<BookingsHeader />);
    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('Your upcoming reservations')).toBeInTheDocument();
  });

  it('renders custom title and description', () => {
    render(<BookingsHeader title="My Bookings" description="History" />);
    expect(screen.getByText('My Bookings')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('renders action button', () => {
    render(
      <BookingsHeader
        action={<button>New Reservation</button>}
      />
    );
    expect(screen.getByText('New Reservation')).toBeInTheDocument();
  });
});
