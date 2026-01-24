import { render, screen } from '@testing-library/react';
import FooterLanding from '@/components/FooterLanding';

describe('FooterLanding', () => {
  it('renders copyright text', () => {
    render(<FooterLanding />);
    expect(screen.getByText(/© 2025 DAHA\/R. All rights reserved./i)).toBeInTheDocument();
  });
});
