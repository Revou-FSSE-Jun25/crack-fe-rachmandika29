import { render, screen, fireEvent } from '@testing-library/react';
import MenuCard from '@/components/MenuCard';
import '@testing-library/jest-dom';

// Mock Next.js Image and Link
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>
}));

describe('MenuCard', () => {
  const mockItem = {
    id: 1,
    slug: 'burger',
    name: 'Burger',
    description: 'Tasty burger',
    price: 10,
    image: '/burger.jpg',
    category: 'Food',
    tags: ['meat'],
    popularity: 5
  };

  const mockHandlers = {
    onAdd: jest.fn(),
    onIncrement: jest.fn(),
    onDecrement: jest.fn()
  };

  it('renders item details correctly', () => {
    render(
      <MenuCard 
        item={mockItem} 
        quantity={0} 
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('Tasty burger')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', '/burger.jpg');
  });

  it('shows Add button when quantity is 0', () => {
    render(
      <MenuCard 
        item={mockItem} 
        quantity={0} 
        {...mockHandlers}
      />
    );

    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);
    expect(mockHandlers.onAdd).toHaveBeenCalled();
  });

  it('shows quantity controls when quantity > 0', () => {
    render(
      <MenuCard 
        item={mockItem} 
        quantity={2} 
        {...mockHandlers}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('+'));
    expect(mockHandlers.onIncrement).toHaveBeenCalled();

    fireEvent.click(screen.getByText('-'));
    expect(mockHandlers.onDecrement).toHaveBeenCalled();
  });
});
