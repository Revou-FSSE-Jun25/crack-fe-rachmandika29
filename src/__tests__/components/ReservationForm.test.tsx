import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReservationForm from '@/components/ReservationForm';

// Mock useZodFormValidation
const mockSubmit = jest.fn();
const mockValidateField = jest.fn();
const mockSetValue = jest.fn();

jest.mock('@/lib/hooks/useZodFormValidation', () => ({
  useZodFormValidation: (schema: any, initialValues: any) => {
    return {
      values: initialValues,
      setValue: mockSetValue,
      errors: {},
      attempted: false,
      validateField: mockValidateField,
      submit: (cb: any) => {
        cb(initialValues);
        return { ok: true };
      },
    };
  },
}));

describe('ReservationForm', () => {
  const defaultProps = {
    initial: {
      name: '',
      email: '',
      phone: '',
      notes: '',
    },
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<ReservationForm {...defaultProps} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('handles input changes', () => {
    render(<ReservationForm {...defaultProps} />);
    
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
    expect(mockSetValue).toHaveBeenCalledWith('name', 'John Doe');

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    expect(mockSetValue).toHaveBeenCalledWith('email', 'john@example.com');
  });

  it('submits the form', () => {
    render(<ReservationForm {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    // The mock implementation of submit calls the callback immediately
    // so onSubmit should be called
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it('displays pending state', () => {
    render(<ReservationForm {...defaultProps} pending={true} />);
    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
  });
});
