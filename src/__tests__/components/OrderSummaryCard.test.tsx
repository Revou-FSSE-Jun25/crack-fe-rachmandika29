import { render, screen, fireEvent } from '@testing-library/react';
import OrderSummaryCard from '@/components/OrderSummaryCard';

describe('OrderSummaryCard', () => {
  const mockOnIncrement = jest.fn();
  const mockOnDecrement = jest.fn();

  const mockItems = [
    {
      id: 1,
      slug: 'item-1',
      name: 'Item 1',
      description: 'Desc 1',
      price: 10,
      image: '/img1.jpg',
      category: 'Cat 1',
      tags: [],
      popularity: 0,
    },
    {
      id: 2,
      slug: 'item-2',
      name: 'Item 2',
      description: 'Desc 2',
      price: 20,
      image: '/img2.jpg',
      category: 'Cat 2',
      tags: [],
      popularity: 0,
    },
  ];

  const mockQuantities = {
    'item-1': 2,
    'item-2': 1,
  };

  const defaultProps = {
    items: mockItems,
    quantities: mockQuantities,
    onIncrement: mockOnIncrement,
    onDecrement: mockOnDecrement,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when quantities are empty', () => {
    render(<OrderSummaryCard {...defaultProps} quantities={{}} />);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('renders selected items and subtotal', () => {
    render(<OrderSummaryCard {...defaultProps} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    
    // Subtotal: 10*2 + 20*1 = 40
    expect(screen.getByText('$40')).toBeInTheDocument();
  });

  it('calls increment/decrement handlers', () => {
    render(<OrderSummaryCard {...defaultProps} />);
    
    // Find buttons for Item 1
    const buttons = screen.getAllByRole('button');
    // Order: - (item1), + (item1), - (item2), + (item2)
    // Wait, let's look at structure:
    // <button>-</button> <div>qty</div> <button>+</button>
    
    // Let's use more specific queries if possible, or just index
    const minusButtons = screen.getAllByText('-');
    const plusButtons = screen.getAllByText('+');

    fireEvent.click(minusButtons[0]);
    expect(mockOnDecrement).toHaveBeenCalledWith('item-1');

    fireEvent.click(plusButtons[0]);
    expect(mockOnIncrement).toHaveBeenCalledWith('item-1');
  });
});
