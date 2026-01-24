import { renderHook, act } from '@testing-library/react';
import { useZodFormValidation } from '@/lib/hooks/useZodFormValidation';
import { z } from 'zod';

describe('useZodFormValidation', () => {
  const schema = z.object({
    name: z.string().min(1, 'Required'),
    age: z.number().min(18, 'Must be 18'),
  });

  const initial = { name: '', age: 0 };

  it('initializes correctly', () => {
    const { result } = renderHook(() => useZodFormValidation(schema, initial));
    expect(result.current.values).toEqual(initial);
    expect(result.current.errors).toEqual({});
    expect(result.current.attempted).toBe(false);
  });

  it('updates values', () => {
    const { result } = renderHook(() => useZodFormValidation(schema, initial));
    act(() => {
      result.current.setValue('name', 'John');
    });
    expect(result.current.values.name).toBe('John');
  });

  it('validates single field', () => {
    const { result } = renderHook(() => useZodFormValidation(schema, initial));
    act(() => {
      result.current.validateField('name');
    });
    expect(result.current.errors.name).toBe('Required');

    act(() => {
      result.current.setValue('name', 'John');
    });

    act(() => {
      result.current.validateField('name');
    });
    
    expect(result.current.errors.name).toBeUndefined();
  });

  it('submits successfully when valid', () => {
    const { result } = renderHook(() => useZodFormValidation(schema, initial));
    const onSubmit = jest.fn();

    act(() => {
      result.current.setValue('name', 'John');
      result.current.setValue('age', 20);
    });

    act(() => {
      const res = result.current.submit(onSubmit);
      expect(res.ok).toBe(true);
    });

    expect(onSubmit).toHaveBeenCalledWith({ name: 'John', age: 20 });
    expect(result.current.errors).toEqual({});
  });

  it('fails submission when invalid', () => {
    const { result } = renderHook(() => useZodFormValidation(schema, initial));
    const onSubmit = jest.fn();

    act(() => {
      const res = result.current.submit(onSubmit);
      expect(res.ok).toBe(false);
      expect(res.firstErrorKey).toBe('name');
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.attempted).toBe(true);
    expect(result.current.errors.name).toBe('Required');
    expect(result.current.errors.age).toBe('Must be 18');
  });
});
