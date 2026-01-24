import { render, screen } from '@testing-library/react';
import DashboardCard from '@/components/DashboardCard';

describe('DashboardCard', () => {
  const defaultProps = {
    title: 'Bookings',
    description: 'Manage bookings',
    href: '/admin/bookings',
  };

  it('renders correctly without image', () => {
    render(<DashboardCard {...defaultProps} />);
    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('Manage bookings')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/admin/bookings');
  });

  it('renders correctly with image', () => {
    render(<DashboardCard {...defaultProps} imageSrc="/test.jpg" />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Bookings');
  });
});
