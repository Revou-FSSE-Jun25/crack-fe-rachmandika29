import { render, screen, fireEvent } from '@testing-library/react';
import RescheduleRequestCard from '@/components/RescheduleRequestCard';

describe('RescheduleRequestCard', () => {
  const request = {
    id: '1',
    bookingId: 'b1',
    currentDateIso: '2023-01-01',
    currentTime: '18:00',
    requestedDateIso: '2023-01-02',
    requestedTime: '19:00',
    guests: 2,
    reason: 'Change of plans',
    status: 'pending' as const,
    createdAt: new Date(),
  };

  const defaultProps = {
    request,
    onAccept: jest.fn(),
    onReject: jest.fn(),
    onView: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<RescheduleRequestCard {...defaultProps} />);
    expect(screen.getByText('Reschedule Request')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText(/"Change of plans"/)).toBeInTheDocument();
  });

  it('calls action handlers', () => {
    render(<RescheduleRequestCard {...defaultProps} />);
    
    fireEvent.click(screen.getByText('View'));
    expect(defaultProps.onView).toHaveBeenCalledWith(request);

    fireEvent.click(screen.getByText('Reject'));
    expect(defaultProps.onReject).toHaveBeenCalledWith(request);

    fireEvent.click(screen.getByText('Accept'));
    expect(defaultProps.onAccept).toHaveBeenCalledWith(request);
  });
});
