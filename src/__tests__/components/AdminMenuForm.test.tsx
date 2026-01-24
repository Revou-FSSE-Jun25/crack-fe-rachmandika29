import { render, screen, fireEvent } from '@testing-library/react';
import AdminMenuForm from '@/components/AdminMenuForm';

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
        cb();
        return { ok: true };
      },
    };
  },
}));

describe('AdminMenuForm', () => {
  const defaultProps = {
    existingSlugs: ['existing-slug'],
    categories: ['Starters', 'Mains'],
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<AdminMenuForm {...defaultProps} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Slug')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('handles name change and auto-slug generation', () => {
    render(<AdminMenuForm {...defaultProps} />);
    
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Item' } });
    expect(mockSetValue).toHaveBeenCalledWith('name', 'New Item');
    expect(mockSetValue).toHaveBeenCalledWith('slug', 'new-item');
  });

  it('handles category selection', () => {
    render(<AdminMenuForm {...defaultProps} />);
    
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Mains' } });
    expect(mockSetValue).toHaveBeenCalledWith('category', 'Mains');
  });

  it('submits the form', () => {
    render(<AdminMenuForm {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it('displays pending state', () => {
    render(<AdminMenuForm {...defaultProps} pending={true} />);
    expect(screen.getByRole('button', { name: 'Creating...' })).toBeDisabled();
  });
});
