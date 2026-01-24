import { render, screen, fireEvent } from '@testing-library/react';
import AdminMenuCard from '@/components/AdminMenuCard';

describe('AdminMenuCard', () => {
  const mockOnToggle = jest.fn();
  const mockItem = {
    id: '1',
    name: 'Test Menu Item',
    description: 'A delicious test item',
    price: 15,
    category: 'Test Category',
    image: '/test-image.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  };

  const defaultProps = {
    item: mockItem,
    available: true,
    onToggle: mockOnToggle,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders item details correctly', () => {
    render(<AdminMenuCard {...defaultProps} />);
    expect(screen.getByText('Test Menu Item')).toBeInTheDocument();
    expect(screen.getByText('$15')).toBeInTheDocument();
    expect(screen.getByText('A delicious test item')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    // Check for image
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Test Menu Item');
  });

  it('renders availability badge correctly', () => {
    render(<AdminMenuCard {...defaultProps} />);
    // "Available" appears in the badge and the select option
    expect(screen.getAllByText('Available').length).toBeGreaterThan(0);

    render(<AdminMenuCard {...defaultProps} available={false} />);
    expect(screen.getAllByText('Unavailable').length).toBeGreaterThan(0);
  });

  it('calls onToggle when status is changed', () => {
    render(<AdminMenuCard {...defaultProps} />);
    const select = screen.getByRole('combobox');
    
    // Change to unavailable
    fireEvent.change(select, { target: { value: 'no' } });
    expect(mockOnToggle).toHaveBeenCalledWith(false);

    // Change back to available
    fireEvent.change(select, { target: { value: 'yes' } });
    expect(mockOnToggle).toHaveBeenCalledWith(true);
  });
});
