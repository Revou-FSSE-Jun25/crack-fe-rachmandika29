import { render, screen, fireEvent, act } from '@testing-library/react';
import BookingsFilterBar from '@/components/BookingsFilterBar';

// Mock useDebouncedValue
jest.mock('@/lib/hooks/useDebouncedValue', () => ({
  useDebouncedValue: (value: any) => value, // Return value immediately for testing
}));

describe('BookingsFilterBar', () => {
  const mockOnStatusChange = jest.fn();
  const mockOnSearchChange = jest.fn();
  const mockOnStartDateChange = jest.fn();
  const mockOnEndDateChange = jest.fn();

  const defaultProps = {
    status: 'all' as const,
    onStatusChange: mockOnStatusChange,
    search: '',
    onSearchChange: mockOnSearchChange,
    startDate: '',
    endDate: '',
    onStartDateChange: mockOnStartDateChange,
    onEndDateChange: mockOnEndDateChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all inputs', () => {
    render(<BookingsFilterBar {...defaultProps} />);
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('calls onStatusChange when status changes', () => {
    render(<BookingsFilterBar {...defaultProps} />);
    // Select by role combobox which is usually the select element
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'confirmed' } });
    expect(mockOnStatusChange).toHaveBeenCalledWith('confirmed');
  });

  it('calls onSearchChange when search input changes', () => {
    render(<BookingsFilterBar {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Find bookings');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('John');
  });

  it('calls date change handlers', () => {
    const { container } = render(<BookingsFilterBar {...defaultProps} />);
    
    // Find inputs by type date
    // This is a bit brittle but works if we assume order
    const dateInputs = container.querySelectorAll('input[type="date"]');
    
    if (dateInputs.length >= 2) {
      fireEvent.change(dateInputs[0], { target: { value: '2023-01-01' } });
      expect(mockOnStartDateChange).toHaveBeenCalledWith('2023-01-01');

      fireEvent.change(dateInputs[1], { target: { value: '2023-01-31' } });
      expect(mockOnEndDateChange).toHaveBeenCalledWith('2023-01-31');
    } else {
      throw new Error('Date inputs not found');
    }
  });
});
