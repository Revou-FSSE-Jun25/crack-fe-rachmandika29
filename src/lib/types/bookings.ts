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

