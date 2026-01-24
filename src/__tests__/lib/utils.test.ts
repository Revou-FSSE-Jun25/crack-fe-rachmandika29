import { formatToLocal } from '@/lib/utils';

describe('formatToLocal', () => {
  // Save original methods
  const originalToLocaleDateString = Date.prototype.toLocaleDateString;
  const originalToLocaleTimeString = Date.prototype.toLocaleTimeString;

  beforeAll(() => {
    // Mock Date methods to return consistent values for testing
    // This simulates a specific locale environment
    Date.prototype.toLocaleDateString = jest.fn(() => 'Jan 1, 2024');
    Date.prototype.toLocaleTimeString = jest.fn(() => '10:00 AM');
  });

  afterAll(() => {
    // Restore original methods
    Date.prototype.toLocaleDateString = originalToLocaleDateString;
    Date.prototype.toLocaleTimeString = originalToLocaleTimeString;
  });

  it('formats valid date and time correctly', () => {
    const result = formatToLocal('2024-01-01', '10:00');
    
    expect(result).toEqual({
      date: 'Jan 1, 2024',
      time: '10:00 AM',
      full: 'Jan 1, 2024 • 10:00 AM'
    });
  });

  it('handles invalid dates gracefully', () => {
    const result = formatToLocal('invalid-date', '10:00');
    
    expect(result).toEqual({
      date: 'invalid-date',
      time: '10:00',
      full: 'invalid-date • 10:00'
    });
  });
});
