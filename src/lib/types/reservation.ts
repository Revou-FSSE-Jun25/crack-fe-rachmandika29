export type ReservationValues = {
  name: string;
  email: string;
  phone: string;
  notes?: string;
};

export type ReservationFormProps = {
  initial?: Partial<ReservationValues>;
  onSubmit: (values: ReservationValues) => void;
  pending?: boolean;
  className?: string;
};

export type ReservationSummaryCardProps = {
  dateIso: string | null;
  time: string | null;
  guests: number;
  onSubmit: () => void;
  disabled?: boolean;
  className?: string;
};

export type DatePickerCalendarProps = {
  availableDates?: string[];
  selected?: string | null;
  onSelect: (dateIso: string) => void;
  initialMonth?: Date;
  onMonthChange?: (monthStartIso: string) => void;
  className?: string;
};

export type Slot = {
  time: string;
  available: boolean;
  capacity?: number;
};

export type TimeSlotPickerProps = {
  slots: Slot[];
  selected?: string | null;
  onSelect: (time: string) => void;
  className?: string;
};

export type PartySizeSelectorProps = {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

