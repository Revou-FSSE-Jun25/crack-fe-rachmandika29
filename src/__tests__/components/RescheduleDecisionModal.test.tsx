import { render, screen, fireEvent } from '@testing-library/react';
import RescheduleDecisionModal from '@/components/RescheduleDecisionModal';

// Mock dependencies
jest.mock('@/components/Modal', () => ({ children, title, footer }: any) => (
  <div role="dialog">
    <h2>{title}</h2>
    {children}
    {footer}
  </div>
));
jest.mock('@/components/DatePickerCalendar', () => () => <div data-testid="calendar">Calendar</div>);
jest.mock('@/components/TimeSlotPicker', () => () => <div data-testid="time-picker">TimePicker</div>);
jest.mock('@/lib/hooks/useAvailableDates', () => ({ useAvailableDates: () => ({ data: [] }) }));
jest.mock('@/lib/hooks/useTimeSlotsForDate', () => ({ useTimeSlotsForDate: () => ({ data: [] }) }));

const mockSubmit = jest.fn();
const mockSetValue = jest.fn();
jest.mock('@/lib/hooks/useZodFormValidation', () => ({
  useZodFormValidation: (schema: any, initialValues: any) => ({
    values: initialValues,
    setValue: mockSetValue,
    errors: {},
    attempted: false,
    submit: (cb: any) => { cb(); return { ok: true }; },
  }),
}));

describe('RescheduleDecisionModal', () => {
  const defaultProps = {
    open: true,
    request: {
      id: '1',
      bookingId: 'b1',
      currentDateIso: '2023-01-01',
      currentTime: '18:00',
      requestedDateIso: '2023-01-02',
      requestedTime: '19:00',
      guests: 2,
      reason: 'Reason',
      status: 'pending' as const,
      createdAt: new Date(),
    },
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<RescheduleDecisionModal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Accept Reschedule')).toBeInTheDocument();
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
    expect(screen.getByTestId('time-picker')).toBeInTheDocument();
    expect(screen.getByText('Note to client (optional)')).toBeInTheDocument();
  });

  it('returns null if not open', () => {
    const { container } = render(<RescheduleDecisionModal {...defaultProps} open={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('handles confirm', () => {
    render(<RescheduleDecisionModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Confirm'));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('handles cancel', () => {
    render(<RescheduleDecisionModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('handles note input', () => {
    render(<RescheduleDecisionModal {...defaultProps} />);
    const textarea = screen.getByRole('textbox'); // textarea is a textbox role implicitly or explicitly
    fireEvent.change(textarea, { target: { value: 'Approved' } });
    expect(mockSetValue).toHaveBeenCalledWith('note', 'Approved');
  });
});
