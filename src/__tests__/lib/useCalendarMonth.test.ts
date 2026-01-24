import { renderHook, act } from '@testing-library/react';
import { useCalendarMonth } from '@/lib/hooks/useCalendarMonth';

describe('useCalendarMonth', () => {
  it('initializes with current month or provided month', () => {
    const initialMonth = new Date(2023, 0, 15); // Jan 2023
    const { result } = renderHook(() => useCalendarMonth({ initialMonth }));
    
    expect(result.current.month.getMonth()).toBe(0); // Jan
    expect(result.current.month.getFullYear()).toBe(2023);
    expect(result.current.monthLabel).toBe('January 2023');
  });

  it('calculates days correctly', () => {
    // Jan 2023 has 31 days, starts on Sunday (0)
    const initialMonth = new Date(2023, 0, 1);
    const { result } = renderHook(() => useCalendarMonth({ initialMonth }));

    expect(result.current.count).toBe(31);
    expect(result.current.firstDay).toBe(0); // Sunday
    expect(result.current.leading.length).toBe(0);
    expect(result.current.days.length).toBe(31);
  });

  it('navigates to next month', () => {
    const initialMonth = new Date(2023, 0, 1);
    const onMonthChange = jest.fn();
    const { result } = renderHook(() => useCalendarMonth({ initialMonth, onMonthChange }));

    act(() => {
      result.current.next();
    });

    expect(result.current.month.getMonth()).toBe(1); // Feb
    expect(onMonthChange).toHaveBeenCalledWith('2023-02-01');
  });

  it('navigates to prev month', () => {
    const initialMonth = new Date(2023, 0, 1);
    const onMonthChange = jest.fn();
    const { result } = renderHook(() => useCalendarMonth({ initialMonth, onMonthChange }));

    act(() => {
      result.current.prev();
    });

    expect(result.current.month.getMonth()).toBe(11); // Dec
    expect(result.current.month.getFullYear()).toBe(2022);
    expect(onMonthChange).toHaveBeenCalledWith('2022-12-01');
  });
});
