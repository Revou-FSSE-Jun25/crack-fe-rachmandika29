import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/components/SearchBar';
import '@testing-library/jest-dom';

describe('SearchBar', () => {
  const mockHandlers = {
    onChange: jest.fn(),
    onClear: jest.fn(),
    onSelectCategory: jest.fn()
  };

  it('renders input with value', () => {
    render(
      <SearchBar 
        value="test query" 
        {...mockHandlers}
      />
    );

    expect(screen.getByDisplayValue('test query')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    render(
      <SearchBar 
        value="" 
        {...mockHandlers}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Search menu...'), {
      target: { value: 'pizza' }
    });
    expect(mockHandlers.onChange).toHaveBeenCalledWith('pizza');
  });

  it('enables Clear button only when there is a query', () => {
    const { rerender } = render(
      <SearchBar 
        value="" 
        {...mockHandlers}
      />
    );
    expect(screen.getByText('Clear')).toBeDisabled();

    rerender(
      <SearchBar 
        value="something" 
        {...mockHandlers}
      />
    );
    const clearBtn = screen.getByText('Clear');
    expect(clearBtn).not.toBeDisabled();
    
    fireEvent.click(clearBtn);
    expect(mockHandlers.onClear).toHaveBeenCalled();
  });

  it('renders categories and handles selection', () => {
    const categories = ['Food', 'Drinks'];
    render(
      <SearchBar 
        value="" 
        {...mockHandlers}
        categories={categories}
        selectedCategory="Food"
      />
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Drinks')).toBeInTheDocument();

    // Check active state style
    expect(screen.getByText('Food')).toHaveClass('bg-white');
    expect(screen.getByText('Drinks')).not.toHaveClass('bg-white');

    fireEvent.click(screen.getByText('Drinks'));
    expect(mockHandlers.onSelectCategory).toHaveBeenCalledWith('Drinks');

    fireEvent.click(screen.getByText('All'));
    expect(mockHandlers.onSelectCategory).toHaveBeenCalledWith(null);
  });
});
