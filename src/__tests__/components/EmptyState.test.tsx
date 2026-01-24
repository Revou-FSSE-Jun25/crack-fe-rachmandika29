import { render, screen } from '@testing-library/react';
import EmptyState from '@/components/EmptyState';
import '@testing-library/jest-dom';

describe('EmptyState', () => {
  it('renders default text', () => {
    render(<EmptyState />);
    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(screen.getByText('Nothing to show yet')).toBeInTheDocument();
  });

  it('renders custom title and description', () => {
    render(<EmptyState title="Custom Title" description="Custom Description" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Description')).toBeInTheDocument();
  });

  it('renders action content', () => {
    render(
      <EmptyState 
        action={<button>Retry</button>}
      />
    );
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });
});
