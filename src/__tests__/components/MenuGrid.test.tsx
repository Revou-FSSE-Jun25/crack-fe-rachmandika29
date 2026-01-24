import { render, screen } from '@testing-library/react';
import MenuGrid from '@/components/MenuGrid';

describe('MenuGrid', () => {
  it('renders children correctly', () => {
    render(
      <MenuGrid>
        <div data-testid="child">Child 1</div>
        <div data-testid="child">Child 2</div>
      </MenuGrid>
    );
    expect(screen.getAllByTestId('child')).toHaveLength(2);
  });

  it('applies custom class name', () => {
    const { container } = render(<MenuGrid className="custom-class">Content</MenuGrid>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
