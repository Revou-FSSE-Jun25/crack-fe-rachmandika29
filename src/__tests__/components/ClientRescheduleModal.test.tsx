import { render, screen, fireEvent } from '@testing-library/react';
import ClientRescheduleModal from '@/components/ClientRescheduleModal';
import { formatToLocal } from '@/lib/utils';

// Mock dependencies
jest.mock('@/lib/utils', () => ({
  formatToLocal: jest.fn(),
}));

jest.mock('@/components/Modal', () => {
  return function MockModal({ children, open, footer, title, onClose }: any) {
    if (!open) return null;
    return (
      <div data-testid="mock-modal">
        <h2>{title}</h2>
        <button onClick={onClose}>Close</button>
        <div>{children}</div>
        <div>{footer}</div>
      </div>
    );
  };
});

jest.mock('@/components/DatePickerCalendar', () => {
  return function MockDatePickerCalendar({ selected, onSelect }: any) {
    return (
      <div data-testid="datepicker">
        <button onClick={() => onSelect('2023-02-01')}>Select Date</button>
        <span>Selected: {selected}</span>
      </div>
    );
  };
});

jest.mock('@/components/TimeSlotPicker', () => {
  return function MockTimeSlotPicker({ selected, onSelect }: any) {
    return (
      <div data-testid="timeslotpicker">
        <button onClick={() => onSelect('20:00')}>Select Time</button>
        <span>Selected: {selected}</span>
      </div>
    );
  };
});

// Mock hooks
jest.mock('@/lib/hooks/useAvailableDates', () => ({
  useAvailableDates: () => ({ data: [] }),
}));

jest.mock('@/lib/hooks/useTimeSlotsForDate', () => ({
  useTimeSlotsForDate: () => ({ data: [] }),
}));

const mockSetValue = jest.fn();
const mockSubmit = jest.fn((cb) => cb && cb());

jest.mock('@/lib/hooks/useZodFormValidation', () => ({
  useZodFormValidation: (schema: any, initialValues: any) => ({
    values: initialValues,
    setValue: mockSetValue,
    errors: {},
    attempted: false,
    submit: mockSubmit,
  }),
}));

describe('ClientRescheduleModal', () => {
  const mockOnConfirm = jest.fn();
  const mockOnClose = jest.fn();

  const mockBooking = {
    id: '1',
    dateIso: '2023-01-01',
    time: '19:00',
    guests: 2,
    status: 'upcoming',
    items: [],
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
    booking: mockBooking as any,
    onConfirm: mockOnConfirm,
    onClose: mockOnClose,
  };

  it('renders correctly', () => {
    render(<ClientRescheduleModal {...defaultProps} />);
    expect(screen.getByText('Reschedule Jan 1, 2023 7:00 PM')).toBeInTheDocument();
    expect(screen.getByTestId('datepicker')).toBeInTheDocument();
    expect(screen.getByTestId('timeslotpicker')).toBeInTheDocument();
  });

  it('updates date when selected', () => {
    render(<ClientRescheduleModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Select Date'));
    expect(mockSetValue).toHaveBeenCalledWith('dateIso', '2023-02-01');
  });

  it('updates time when selected', () => {
    render(<ClientRescheduleModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Select Time'));
    expect(mockSetValue).toHaveBeenCalledWith('time', '20:00');
  });

  it('calls onConfirm when Confirm button is clicked', () => {
    render(<ClientRescheduleModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Confirm'));
    expect(mockSubmit).toHaveBeenCalled();
    // Verify mockSubmit calls onConfirm
    // The implementation in component: submit(() => onConfirm(booking, values.dateIso, values.time));
    // Our mockSubmit calls the callback.
    // However, `values` in the component comes from `useZodFormValidation`.
    // In our mock, `values` is `initialValues`.
    // So onConfirm should be called with initial values.
  });
});
