import { render, screen, fireEvent } from '@testing-library/react';
import PartySizeSelector from '@/components/PartySizeSelector';

describe('PartySizeSelector', () => {
  const defaultProps = {
    value: 2,
    onChange: jest.fn(),
    min: 1,
    max: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<PartySizeSelector {...defaultProps} />);
    expect(screen.getByText('Party Size')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Min 1, Max 10')).toBeInTheDocument();
  });

  it('increments value', () => {
    render(<PartySizeSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('+'));
    expect(defaultProps.onChange).toHaveBeenCalledWith(3);
  });

  it('decrements value', () => {
    render(<PartySizeSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('-'));
    expect(defaultProps.onChange).toHaveBeenCalledWith(1);
  });

  it('disables increment button at max', () => {
    render(<PartySizeSelector {...defaultProps} value={10} />);
    expect(screen.getByText('+')).toBeDisabled();
  });

  it('disables decrement button at min', () => {
    render(<PartySizeSelector {...defaultProps} value={1} />);
    expect(screen.getByText('-')).toBeDisabled();
  });
});
