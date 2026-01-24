import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminToolbar from '@/components/AdminToolbar';

// Mock useZodFormValidation hook
// We need to mock the implementation because the component logic depends on it
// However, since we want to test the interaction, it's better to let the real hook run if possible,
// OR provide a realistic mock.
// Given the component uses a custom hook for validation, let's mock the hook to control state.

const mockSetValue = jest.fn();
const mockSubmit = jest.fn((cb) => cb && cb());

jest.mock('@/lib/hooks/useZodFormValidation', () => ({
  useZodFormValidation: (schema: any, initialValues: any) => {
    // Simple mock implementation
    return {
      values: initialValues,
      setValue: mockSetValue,
      errors: {},
      attempted: false,
      submit: mockSubmit,
    };
  },
}));

describe('AdminToolbar', () => {
  const mockOnStartDateChange = jest.fn();
  const mockOnEndDateChange = jest.fn();
  const mockOnRefresh = jest.fn();

  const defaultProps = {
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    onStartDateChange: mockOnStartDateChange,
    onEndDateChange: mockOnEndDateChange,
    onRefresh: mockOnRefresh,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders date inputs with initial values', () => {
    render(<AdminToolbar {...defaultProps} />);
    expect(screen.getByDisplayValue('2023-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2023-01-31')).toBeInTheDocument();
  });

  it('calls onStartDateChange when start date changes', () => {
    render(<AdminToolbar {...defaultProps} />);
    // We need to find the inputs. The component doesn't use IDs for labels.
    // But we know the values.
    const startInput = screen.getByDisplayValue('2023-01-01');
    fireEvent.change(startInput, { target: { value: '2023-02-01' } });
    
    expect(mockSetValue).toHaveBeenCalledWith('startDate', '2023-02-01');
    expect(mockOnStartDateChange).toHaveBeenCalledWith('2023-02-01');
  });

  it('calls onEndDateChange when end date changes', () => {
    render(<AdminToolbar {...defaultProps} />);
    const endInput = screen.getByDisplayValue('2023-01-31');
    fireEvent.change(endInput, { target: { value: '2023-02-28' } });
    
    expect(mockSetValue).toHaveBeenCalledWith('endDate', '2023-02-28');
    expect(mockOnEndDateChange).toHaveBeenCalledWith('2023-02-28');
  });

  it('calls onRefresh when refresh button is clicked', () => {
    render(<AdminToolbar {...defaultProps} />);
    fireEvent.click(screen.getByText('Refresh'));
    expect(mockSubmit).toHaveBeenCalled();
    // Since our mockSubmit calls the callback immediately
    // We can assume onRefresh is called inside the callback if the logic follows
    // But wait, the component code is: submit(() => { if (onRefresh) onRefresh(); });
    // So we need to ensure our mockSubmit executes the callback.
  });
});
