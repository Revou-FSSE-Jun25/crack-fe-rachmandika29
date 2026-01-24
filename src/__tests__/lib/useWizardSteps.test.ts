import { renderHook, act } from '@testing-library/react';
import { useWizardSteps } from '@/lib/hooks/useWizardSteps';

describe('useWizardSteps', () => {
  it('initializes correctly', () => {
    const { result } = renderHook(() => useWizardSteps({ total: 3 }));
    expect(result.current.step).toBe(1);
    expect(result.current.total).toBe(3);
  });

  it('navigates next and back', () => {
    const { result } = renderHook(() => useWizardSteps({ total: 3 }));

    act(() => {
      result.current.next();
    });
    expect(result.current.step).toBe(2);

    act(() => {
      result.current.back();
    });
    expect(result.current.step).toBe(1);
  });

  it('respects boundaries', () => {
    const { result } = renderHook(() => useWizardSteps({ total: 2 }));

    act(() => {
      result.current.back();
    });
    expect(result.current.step).toBe(1);

    act(() => {
      result.current.next();
      result.current.next();
      result.current.next();
    });
    expect(result.current.step).toBe(2);
  });

  it('respects guards', () => {
    const guards = [
      () => true, // Guard for step 1 -> 2
      () => false, // Guard for step 2 -> 3
    ];
    const { result } = renderHook(() => useWizardSteps({ total: 3, guards }));

    // Step 1 -> 2 (Guard is true)
    expect(result.current.canNext).toBe(true);
    act(() => {
      result.current.next();
    });
    expect(result.current.step).toBe(2);

    // Step 2 -> 3 (Guard is false)
    expect(result.current.canNext).toBe(false);
    act(() => {
      result.current.next();
    });
    expect(result.current.step).toBe(2); // Should not advance
  });
});
