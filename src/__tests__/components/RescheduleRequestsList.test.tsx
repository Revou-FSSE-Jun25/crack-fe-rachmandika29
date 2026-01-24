import { render, screen } from '@testing-library/react';
import RescheduleRequestsList from '@/components/RescheduleRequestsList';

describe('RescheduleRequestsList', () => {
  const requests = [
    {
      id: '1',
      bookingId: 'b1',
      currentDateIso: '2023-01-01',
      currentTime: '18:00',
      requestedDateIso: '2023-01-02',
      requestedTime: '19:00',
      guests: 2,
      reason: 'Reason 1',
      status: 'pending' as const,
      createdAt: new Date(),
    },
    {
      id: '2',
      bookingId: 'b2',
      currentDateIso: '2023-01-03',
      currentTime: '18:00',
      requestedDateIso: '2023-01-04',
      requestedTime: '19:00',
      guests: 4,
      reason: 'Reason 2',
      status: 'pending' as const,
      createdAt: new Date(),
    },
  ];

  const defaultProps = {
    requests,
    onAccept: jest.fn(),
    onReject: jest.fn(),
  };

  it('renders loading state', () => {
    render(<RescheduleRequestsList {...defaultProps} loading={true} />);
    expect(screen.getByText('Loading requests…')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<RescheduleRequestsList {...defaultProps} error="Failed to load" />);
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<RescheduleRequestsList {...defaultProps} requests={[]} />);
    expect(screen.getByText('No reschedule requests')).toBeInTheDocument();
  });

  it('renders custom empty state', () => {
    render(<RescheduleRequestsList {...defaultProps} requests={[]} empty={<span>Custom Empty</span>} />);
    expect(screen.getByText('Custom Empty')).toBeInTheDocument();
  });

  it('renders list of requests', () => {
    render(<RescheduleRequestsList {...defaultProps} />);
    expect(screen.getByText(/"Reason 1"/)).toBeInTheDocument();
    expect(screen.getByText(/"Reason 2"/)).toBeInTheDocument();
  });
});
