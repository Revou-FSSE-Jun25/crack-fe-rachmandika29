import { render } from '@testing-library/react';
import Spinner from '@/components/Spinner';
import '@testing-library/jest-dom';

describe('Spinner', () => {
  it('renders default md size correctly', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass('h-5 w-5');
    expect(container.firstChild).toHaveClass('animate-spin');
  });

  it('renders sm size correctly', () => {
    const { container } = render(<Spinner size="sm" />);
    expect(container.firstChild).toHaveClass('h-4 w-4');
  });

  it('renders lg size correctly', () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.firstChild).toHaveClass('h-8 w-8');
  });

  it('applies custom className', () => {
    const { container } = render(<Spinner className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
