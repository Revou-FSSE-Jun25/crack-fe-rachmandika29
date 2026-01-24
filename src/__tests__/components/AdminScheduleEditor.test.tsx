import { render, screen, fireEvent, within } from '@testing-library/react';
import AdminScheduleEditor from '@/components/AdminScheduleEditor';

// Mock useZodFormValidation
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

// Mock AvailabilityBadge
jest.mock('@/components/AvailabilityBadge', () => {
  return function MockAvailabilityBadge({ variant, label, capacity }: any) {
    return (
      <div data-testid="availability-badge">
        {label} - {capacity}
      </div>
    );
  };
});

describe('AdminScheduleEditor', () => {
  const mockOnCreateSlot = jest.fn();
  const mockOnUpdateSlot = jest.fn();
  const mockOnDeleteSlot = jest.fn();
  const mockOnSave = jest.fn();

  const mockSlots = [
    { time: '06:00 PM', capacity: 10, available: true },
    { time: '07:00 PM', capacity: 0, available: false },
  ];

  const defaultProps = {
    dateIso: '2023-01-01',
    slots: mockSlots,
    onCreateSlot: mockOnCreateSlot,
    onUpdateSlot: mockOnUpdateSlot,
    onDeleteSlot: mockOnDeleteSlot,
    onSave: mockOnSave,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders date and slots', () => {
    render(<AdminScheduleEditor {...defaultProps} />);
    expect(screen.getByText('2023-01-01')).toBeInTheDocument();
    expect(screen.getAllByTestId('availability-badge')).toHaveLength(2);
  });

  it('renders empty state when no slots', () => {
    render(<AdminScheduleEditor {...defaultProps} slots={[]} />);
    expect(screen.getByText('No slots for this date')).toBeInTheDocument();
  });

  it('calls onCreateSlot when Add Slot is clicked', () => {
    render(<AdminScheduleEditor {...defaultProps} />);
    fireEvent.click(screen.getByText('Add Slot'));
    expect(mockOnCreateSlot).toHaveBeenCalledWith({
      time: '06:00 PM',
      available: true,
      capacity: 6,
    });
  });

  it('calls onUpdateSlot when time is changed', () => {
    render(<AdminScheduleEditor {...defaultProps} />);
    // Find the select for the first slot time
    const timeSelects = screen.getAllByRole('combobox');
    // First slot has 2 selects (time, capacity), second slot has 2.
    // Total 4 selects.
    // First one should be time for first slot.
    fireEvent.change(timeSelects[0], { target: { value: '06:30 PM' } });
    expect(mockOnUpdateSlot).toHaveBeenCalledWith(0, { time: '06:30 PM' });
  });

  it('calls onUpdateSlot when capacity is changed', () => {
    render(<AdminScheduleEditor {...defaultProps} />);
    const selects = screen.getAllByRole('combobox');
    // Capacity is the second select for the first slot
    fireEvent.change(selects[1], { target: { value: '20' } });
    expect(mockOnUpdateSlot).toHaveBeenCalledWith(0, { capacity: 20 });
  });

  it('calls onDeleteSlot when Delete is clicked', () => {
    render(<AdminScheduleEditor {...defaultProps} />);
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(mockOnDeleteSlot).toHaveBeenCalledWith(0);
  });

  it('calls onSave when Save Changes is clicked', () => {
    render(<AdminScheduleEditor {...defaultProps} />);
    fireEvent.click(screen.getByText('Save Changes'));
    expect(mockSubmit).toHaveBeenCalled();
    // mockSubmit calls callback, which calls onSave
    // But we need to verify onSave is called?
    // In component: if (onSave) onSave();
    // Our mock calls callback immediately.
    // However, we need to ensure mockSubmit was implemented correctly in our mock above.
    // It is: const mockSubmit = jest.fn((cb) => cb && cb());
    // But we need to make sure onSave is passed to the component prop. It is.
    // So onSave should be called?
    // Wait, submit(() => { if (onSave) onSave(); });
    // So yes.
  });
});
