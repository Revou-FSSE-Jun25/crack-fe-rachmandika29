import { render, screen, fireEvent } from '@testing-library/react';
import DatePickerCalendar from '@/components/DatePickerCalendar';

// Mock useCalendarMonth
const mockPrev = jest.fn();
const mockNext = jest.fn();

jest.mock('@/lib/hooks/useCalendarMonth', () => ({
  useCalendarMonth: () => ({
    month: new Date(2023, 0, 1),
    monthLabel: 'January 2023',
    leading: [],
    days: [1, 2, 3],
    prev: mockPrev,
    next: mockNext,
  }),
}));

describe('DatePickerCalendar', () => {
  const defaultProps = {
    availableDates: ['2023-01-01', '2023-01-03'],
    selected: '2023-01-01',
    onSelect: jest.fn(),
    initialMonth: new Date(2023, 0, 1),
    onMonthChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<DatePickerCalendar {...defaultProps} />);
    expect(screen.getByText('January 2023')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('handles navigation', () => {
    render(<DatePickerCalendar {...defaultProps} />);
    fireEvent.click(screen.getByText('Prev'));
    expect(mockPrev).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Next'));
    expect(mockNext).toHaveBeenCalled();
  });

  it('handles date selection', () => {
    render(<DatePickerCalendar {...defaultProps} />);
    // 3rd is available
    fireEvent.click(screen.getByText('3'));
    expect(defaultProps.onSelect).toHaveBeenCalledWith('2023-01-03');
  });

  it('disables unavailable dates', () => {
    render(<DatePickerCalendar {...defaultProps} />);
    // 2nd is not in availableDates
    const day2 = screen.getByText('2');
    expect(day2).toBeDisabled();
    fireEvent.click(day2);
    expect(defaultProps.onSelect).not.toHaveBeenCalled();
  });

  it('highlights selected date', () => {
    render(<DatePickerCalendar {...defaultProps} />);
    const day1 = screen.getByText('1');
    expect(day1).toHaveAttribute('aria-pressed', 'true');
  });
});
