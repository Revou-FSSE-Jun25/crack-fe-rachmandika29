import { render, screen } from '@testing-library/react';
import AvailabilityBadge from '@/components/AvailabilityBadge';
import '@testing-library/jest-dom';

describe('AvailabilityBadge', () => {
  it('renders available variant correctly', () => {
    render(<AvailabilityBadge variant="available" />);
    const badge = screen.getByText('Available');
    expect(badge).toBeInTheDocument();
    expect(badge.parentElement).toHaveClass('border-green-400');
  });

  it('renders limited variant correctly', () => {
    render(<AvailabilityBadge variant="limited" />);
    const badge = screen.getByText('Limited');
    expect(badge).toBeInTheDocument();
    expect(badge.parentElement).toHaveClass('border-yellow-400');
  });

  it('renders full variant correctly', () => {
    render(<AvailabilityBadge variant="full" />);
    const badge = screen.getByText('Full');
    expect(badge).toBeInTheDocument();
    expect(badge.parentElement).toHaveClass('border-red-400');
  });

  it('renders custom label', () => {
    render(<AvailabilityBadge variant="available" label="Custom Label" />);
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('renders capacity when provided', () => {
    render(<AvailabilityBadge variant="available" capacity={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
