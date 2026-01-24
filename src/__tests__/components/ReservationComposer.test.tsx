import { render, screen, fireEvent, act } from '@testing-library/react';
import ReservationComposer from '@/components/ReservationComposer';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock hooks
let mockStep = 1;
const mockNext = jest.fn(() => { mockStep++; });
const mockBack = jest.fn(() => { mockStep--; });
const mockSetStep = jest.fn((s) => { mockStep = s; });

jest.mock('@/lib/hooks/useWizardSteps', () => ({
  useWizardSteps: () => ({
    step: mockStep,
    setStep: mockSetStep,
    next: mockNext,
    back: mockBack,
    canNext: true,
  }),
}));

jest.mock('@/lib/hooks/useAvailableDates', () => ({
  useAvailableDates: () => ({ data: ['2023-01-01'] }),
}));

jest.mock('@/lib/hooks/useTimeSlotsForDate', () => ({
  useTimeSlotsForDate: () => ({ data: ['18:00'] }),
}));

const mockSubmit = jest.fn().mockResolvedValue({ ok: true });
jest.mock('@/lib/hooks/useAuthRequest', () => ({
  useAuthRequest: () => ({ submit: mockSubmit }),
}));

// Mock components
jest.mock('@/components/DatePickerCalendar', () => ({ onSelect }: any) => (
  <button onClick={() => onSelect('2023-01-01')}>Select Date</button>
));
jest.mock('@/components/TimeSlotPicker', () => ({ onSelect }: any) => (
  <button onClick={() => onSelect('18:00')}>Select Time</button>
));
jest.mock('@/components/PartySizeSelector', () => ({ onChange }: any) => (
  <button onClick={() => onChange(4)}>Select Guests</button>
));
jest.mock('@/components/ReservationForm', () => ({ onSubmit }: any) => (
  <button onClick={() => onSubmit({ name: 'Test', email: 'test@test.com', phone: '123' })}>Submit Form</button>
));
jest.mock('@/components/ReservationSummaryCard', () => ({ onSubmit }: any) => (
  <button onClick={onSubmit}>Confirm Reservation</button>
));
jest.mock('@/components/StepIndicator', () => () => <div>StepIndicator</div>);
jest.mock('@/components/StepSection', () => ({ children, footer }: any) => (
  <div>
    {children}
    {footer}
  </div>
));
jest.mock('@/components/Modal', () => ({ open, children }: any) => open ? <div>{children}</div> : null);

describe('ReservationComposer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStep = 1;
  });

  it('renders correctly', () => {
    render(<ReservationComposer />);
    expect(screen.getByText('Select Date')).toBeInTheDocument();
  });

  it('handles flow', async () => {
    const { rerender } = render(<ReservationComposer />);

    // Step 1: Select Date
    fireEvent.click(screen.getByText('Select Date'));
    
    // Step 2
    mockStep = 2;
    rerender(<ReservationComposer />);
    expect(screen.getByText('Select Time')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Select Time'));
    
    // Step 3
    mockStep = 3;
    rerender(<ReservationComposer />);
    expect(screen.getByText('Select Guests')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Select Guests'));

    // Step 4
    mockStep = 4;
    rerender(<ReservationComposer />);
    expect(screen.getByText('Submit Form')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Submit Form'));

    // Step 5
    mockStep = 5;
    rerender(<ReservationComposer />);
    expect(screen.getByText('Confirm Reservation')).toBeInTheDocument();
    
    // Submit
    await act(async () => {
      fireEvent.click(screen.getByText('Confirm Reservation'));
    });
    
    expect(mockSubmit).toHaveBeenCalled();
  });
});
