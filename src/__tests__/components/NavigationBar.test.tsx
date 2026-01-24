import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NavigationBar from '@/components/NavigationBar';
import { useRouter, usePathname } from 'next/navigation';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('NavigationBar', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  it('renders public links when not authenticated', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ authenticated: false, role: null, email: null }),
    });

    render(<NavigationBar />);
    
    // Wait for effect
    await waitFor(() => {
      // Use getAllByText because links appear in both desktop and mobile menus
      const signInLinks = screen.getAllByText('Sign In');
      expect(signInLinks.length).toBeGreaterThan(0);
      const signUpLinks = screen.getAllByText('Sign Up');
      expect(signUpLinks.length).toBeGreaterThan(0);
    });
  });

  it('renders user links when authenticated as user', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ authenticated: true, role: 'user', email: 'user@example.com' }),
    });

    render(<NavigationBar />);
    
    await waitFor(() => {
      const dashboardLinks = screen.getAllByText('Dashboard');
      expect(dashboardLinks.length).toBeGreaterThan(0);
      const signOutButtons = screen.getAllByText('Sign Out');
      expect(signOutButtons.length).toBeGreaterThan(0);
    });
  });

  it('renders admin links when authenticated as admin', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ authenticated: true, role: 'admin', email: 'admin@example.com' }),
    });

    render(<NavigationBar />);
    
    await waitFor(() => {
      const adminLinks = screen.getAllByText('Admin');
      expect(adminLinks.length).toBeGreaterThan(0);
    });
  });

  it('handles sign out', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ // Initial status check
        ok: true,
        json: async () => ({ authenticated: true, role: 'user', email: 'user@example.com' }),
      })
      .mockResolvedValueOnce({ // Sign out request
        ok: true,
      });

    render(<NavigationBar />);
    
    await waitFor(() => screen.getAllByText('Sign Out'));
    
    // Click sign out (use desktop one)
    const signOutBtn = screen.getAllByText('Sign Out')[0];
    fireEvent.click(signOutBtn);
    
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/signin');
    });
  });
});
