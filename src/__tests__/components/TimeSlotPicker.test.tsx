import { render, screen, fireEvent } from '@testing-library/react';
import TimeSlotPicker from '@/components/TimeSlotPicker';
import '@testing-library/jest-dom';

// Mock formatToLocal since it uses browser locale
jest.mock('@/lib/utils', () => ({
  formatToLocal: (date: string, time: string) => ({
    date: date,
    time: `${time} Local`,
    full: `${date} ${time} Local`
  })
}));

describe('TimeSlotPicker', () => {
  const mockSlots = [
    { time: '10:00', available: true, capacity: 5 },
    { time: '11:00', available: false, capacity: 0 },
    { time: '12:00', available: true, capacity: 3 }
  ];
  
  const mockOnSelect = jest.fn();

  it('renders available slots correctly', () => {
    render(
      <TimeSlotPicker 
        slots={mockSlots} 
        onSelect={mockOnSelect} 
      />
    );

    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('11:00')).toBeInTheDocument();
    expect(screen.getByText('12:00')).toBeInTheDocument();
  });

  it('formats time when dateIso is provided', () => {
    render(
      <TimeSlotPicker 
        slots={mockSlots} 
        onSelect={mockOnSelect} 
        dateIso="2024-01-01"
      />
    );

    expect(screen.getByText('10:00 Local')).toBeInTheDocument();
  });

  it('handles slot selection', () => {
    render(
      <TimeSlotPicker 
        slots={mockSlots} 
        onSelect={mockOnSelect} 
      />
    );

    fireEvent.click(screen.getByText('10:00'));
    expect(mockOnSelect).toHaveBeenCalledWith('10:00');
  });

  it('disables unavailable slots', () => {
    render(
      <TimeSlotPicker 
        slots={mockSlots} 
        onSelect={mockOnSelect} 
      />
    );

    const unavailableSlot = screen.getByText('11:00').closest('button');
    expect(unavailableSlot).toBeDisabled();
    
    if (unavailableSlot) {
      fireEvent.click(unavailableSlot);
    }
    expect(mockOnSelect).not.toHaveBeenCalledWith('11:00');
  });

  it('highlights selected slot', () => {
    render(
      <TimeSlotPicker 
        slots={mockSlots} 
        onSelect={mockOnSelect}
        selected="10:00"
      />
    );

    const selectedButton = screen.getByText('10:00').closest('button');
    expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
    expect(selectedButton).toHaveClass('bg-white');
  });
});
