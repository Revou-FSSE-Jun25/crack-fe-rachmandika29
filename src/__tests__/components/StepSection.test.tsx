import { render, screen } from '@testing-library/react';
import StepSection from '@/components/StepSection';

describe('StepSection', () => {
  const defaultProps = {
    title: 'Personal Info',
    description: 'Enter details',
  };

  it('renders correctly', () => {
    render(
      <StepSection {...defaultProps}>
        <div>Content</div>
      </StepSection>
    );
    expect(screen.getByText('Personal Info')).toBeInTheDocument();
    expect(screen.getByText('Enter details')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(
      <StepSection {...defaultProps} footer={<button>Next</button>}>
        <div>Content</div>
      </StepSection>
    );
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});
