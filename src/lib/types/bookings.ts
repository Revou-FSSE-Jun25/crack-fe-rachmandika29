export type BookingItem = {
  slug: string;
  name: string;
  price: number;
  qty: number;
};

export type BookingStatus = "upcoming" | "confirmed" | "cancelled";

export type Booking = {
  id: string;
  email: string;
  dateIso: string;
  time: string;
  guests: number;
  status: BookingStatus;
  items: BookingItem[];
  notes?: string;
  subtotal?: number;
};

export type BookingsHeaderProps = {
  title?: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
};

export type BookingsFilterStatus = "all" | "upcoming" | "confirmed" | "cancelled";

export type BookingsFilterBarProps = {
  status: BookingsFilterStatus;
  onStatusChange: (s: BookingsFilterStatus) => void;
  search: string;
  onSearchChange: (v: string) => void;
  startDate?: string | null;
  endDate?: string | null;
  onStartDateChange?: (v: string | null) => void;
  onEndDateChange?: (v: string | null) => void;
  className?: string;
};

export type BookingCardProps = {
  booking: Booking;
  onViewDetails: (b: Booking) => void;
  onCancel?: (b: Booking) => void;
  onReschedule?: (b: Booking) => void;
  className?: string;
};

export type UpcomingBookingsListProps = {
  bookings: Booking[];
  loading?: boolean;
  error?: string | null;
  onViewDetails: (b: Booking) => void;
  onCancel?: (b: Booking) => void;
  onReschedule?: (b: Booking) => void;
  className?: string;
  empty?: React.ReactNode;
};

export type BookingDetailModalProps = {
  open: boolean;
  booking: Booking | null;
  onClose: () => void;
  onCancel?: (b: Booking) => void;
  onReschedule?: (b: Booking) => void;
  className?: string;
};
