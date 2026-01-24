import { render, screen } from '@testing-library/react';
import StepIndicator from '@/components/StepIndicator';

describe('StepIndicator', () => {
  const steps = [
    { label: 'Step 1' },
    { label: 'Step 2' },
    { label: 'Step 3' },
  ];

  it('renders correctly', () => {
    render(<StepIndicator steps={steps} current={2} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    
    // Step 1 should be completed styling (white text)
    expect(screen.getByText('Step 1')).toHaveClass('text-white');
    // Step 2 should be active styling (white text)
    expect(screen.getByText('Step 2')).toHaveClass('text-white');
    // Step 3 should be pending styling (zinc-400)
    expect(screen.getByText('Step 3')).toHaveClass('text-zinc-400');
  });
});
