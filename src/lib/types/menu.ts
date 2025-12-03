export type MenuItem = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  popularity: number;
};

export type Quantities = Record<string, number>;

export type OrderSummaryItem = {
  slug: string;
  name: string;
  price: number;
};

export type OrderSummaryProps = {
  items: OrderSummaryItem[];
  quantities: Quantities;
  onIncrement: (slug: string) => void;
  onDecrement: (slug: string) => void;
  className?: string;
};

export type MenuCardProps = {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
};

export type MenuGridProps = {
  children: React.ReactNode;
  className?: string;
};

export type SearchBarProps = {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  categories?: string[];
  selectedCategory?: string | null;
  onSelectCategory?: (c: string | null) => void;
};

export type AdminMenuCardProps = {
  item: MenuItem;
  available: boolean;
  onToggle: (v: boolean) => void;
  className?: string;
};

