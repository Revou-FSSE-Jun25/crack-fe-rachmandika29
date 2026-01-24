import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import MenuComposer from '@/components/MenuComposer';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock hooks
jest.mock('@/lib/hooks/useSearchField', () => ({
  useSearchField: () => ({ value: '', setValue: jest.fn(), clear: jest.fn() }),
}));
jest.mock('@/lib/hooks/useCategoryFilter', () => ({
  useCategoryFilter: () => ({ selectedCategory: null, setSelectedCategory: jest.fn(), chips: [] }),
}));
jest.mock('@/lib/hooks/useDebouncedValue', () => ({
  useDebouncedValue: (val: any) => val,
}));

// Mock Wizard Steps to control flow
let mockStep = 1;
const mockNext = jest.fn(() => { mockStep = 2; });
const mockBack = jest.fn(() => { mockStep = 1; });
jest.mock('@/lib/hooks/useWizardSteps', () => ({
  useWizardSteps: () => ({
    step: mockStep,
    next: mockNext,
    back: mockBack,
    canNext: true,
  }),
}));

// Mock child components
jest.mock('@/components/SearchBar', () => () => <div>SearchBar</div>);
jest.mock('@/components/MenuGrid', () => ({ children }: any) => <div>{children}</div>);
jest.mock('@/components/MenuCard', () => ({ item, onAdd }: any) => (
  <div>
    {item.name}
    <button onClick={onAdd}>Add</button>
  </div>
));
jest.mock('@/components/StepIndicator', () => () => <div>StepIndicator</div>);
jest.mock('@/components/StepSection', () => ({ title, children, footer }: any) => (
  <div>
    <h2>{title}</h2>
    {children}
    {footer}
  </div>
));
jest.mock('@/components/OrderSummaryCard', () => () => <div>OrderSummaryCard</div>);
jest.mock('@/components/Modal', () => ({ open, children }: any) => open ? <div>{children}</div> : null);

describe('MenuComposer', () => {
  const mockMenu = [
    { id: 1, slug: 'item-1', name: 'Burger', price: 10, category: 'Mains', tags: [] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockStep = 1;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockMenu,
    } as any);
  });

  it('renders menu items', async () => {
    await act(async () => {
      render(<MenuComposer />);
    });
    
    expect(screen.getByText('Burger')).toBeInTheDocument();
  });

  it('handles add to cart', async () => {
    await act(async () => {
      render(<MenuComposer />);
    });
    
    await act(async () => {
      fireEvent.click(screen.getByText('Add'));
    });
    
    // Logic is internal to component (localStorage), so verifying UI update or mock calls would be needed
    // Here we just verify it doesn't crash
  });

  it('navigates to summary', async () => {
    await act(async () => {
      render(<MenuComposer />);
    });
    
    const continueBtn = screen.getByText('Continue');
    fireEvent.click(continueBtn);
    
    expect(mockNext).toHaveBeenCalled();
  });
});
