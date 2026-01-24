import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '@/components/signupProcess';

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

describe('SignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<SignUp />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('submits form', async () => {
    render(<SignUp />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
