import { render, screen, fireEvent } from '@testing-library/react';
import ReservationSummaryCard from '@/components/ReservationSummaryCard';

describe('ReservationSummaryCard', () => {
  const defaultProps = {
    dateIso: '2023-01-01',
    time: '18:00',
    guests: 2,
    onSubmit: jest.fn(),
  };

  it('renders correctly', () => {
    render(<ReservationSummaryCard {...defaultProps} />);
    expect(screen.getByText('Reservation Summary')).toBeInTheDocument();
    expect(screen.getByText('2 guests')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reserve' })).toBeEnabled();
  });

  it('disables button when incomplete', () => {
    render(<ReservationSummaryCard {...defaultProps} dateIso="" />);
    expect(screen.getByRole('button', { name: 'Reserve' })).toBeDisabled();
  });

  it('displays loading state', () => {
    render(<ReservationSummaryCard {...defaultProps} loading={true} />);
    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
  });

  it('handles submit', () => {
    render(<ReservationSummaryCard {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Reserve' }));
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
});
