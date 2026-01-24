import { render, screen, fireEvent, act } from '@testing-library/react';
import HeroLanding from '@/components/HeroLanding';
import { useRouter } from 'next/navigation';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('HeroLanding', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders main content', () => {
    render(<HeroLanding />);
    expect(screen.getByText('Streamlined Restaurant Scheduling Solutions')).toBeInTheDocument();
    expect(screen.getByText('Reserve Table')).toBeInTheDocument();
    expect(screen.getByText('Explore Our Menu')).toBeInTheDocument();
  });

  it('navigates to signin if not authenticated', () => {
    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });

    render(<HeroLanding />);
    fireEvent.click(screen.getByText('Reserve Table'));
    expect(mockPush).toHaveBeenCalledWith('/signin?callbackUrl=%2Fdashboard%2Freservation');
  });

  it('navigates to target if authenticated', () => {
    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'auth_token=123',
    });

    render(<HeroLanding />);
    fireEvent.click(screen.getByText('Reserve Table'));
    expect(mockPush).toHaveBeenCalledWith('/dashboard/reservation');
  });
});
