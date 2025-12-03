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

export type RescheduleRequestStatus = "pending" | "accepted" | "rejected";

export type RescheduleRequest = {
  id: string;
  bookingId: string;
  currentDateIso: string;
  currentTime: string;
  requestedDateIso: string;
  requestedTime: string;
  guests: number;
  status: RescheduleRequestStatus;
  reason?: string;
  adminNote?: string;
};

export type RescheduleRequestCardProps = {
  request: RescheduleRequest;
  onAccept: (r: RescheduleRequest) => void;
  onReject: (r: RescheduleRequest) => void;
  onView?: (r: RescheduleRequest) => void;
  className?: string;
};

export type RescheduleRequestsListProps = {
  requests: RescheduleRequest[];
  loading?: boolean;
  error?: string | null;
  onAccept: (r: RescheduleRequest) => void;
  onReject: (r: RescheduleRequest) => void;
  onView?: (r: RescheduleRequest) => void;
  className?: string;
  empty?: React.ReactNode;
};

export type RescheduleDecisionModalProps = {
  open: boolean;
  request: RescheduleRequest | null;
  onConfirm: (dateIso: string, time: string, note?: string) => void;
  onCancel: () => void;
  className?: string;
};
