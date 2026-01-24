import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '@/components/signinProcess';

// Mock dependencies
const mockSubmit = jest.fn().mockResolvedValue({ ok: true });
jest.mock('@/lib/hooks/useAuthRequest', () => ({
  useAuthRequest: () => ({
    submit: mockSubmit,
    pending: false,
    serverError: null,
    clearError: jest.fn(),
  }),
}));

jest.mock('@/lib/hooks/useRedirectAfterAuth', () => ({
  useRedirectAfterAuth: () => ({ redirect: jest.fn() }),
}));

jest.mock('@/lib/hooks/useFocusOnError', () => ({
  useFocusOnError: () => ({ focusFirstInvalid: jest.fn() }),
}));

describe('SignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<SignIn />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('submits form', async () => {
    render(<SignIn />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
      });
    });
  });
});
