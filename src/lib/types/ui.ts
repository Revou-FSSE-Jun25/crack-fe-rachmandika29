export type Step = { label: string };

export type StepIndicatorProps = {
  steps: Step[];
  current: number;
  className?: string;
};

export type StepSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export type SubmissionFeedbackKind = "success" | "error" | "info";

export type SubmissionFeedbackProps = {
  open: boolean;
  kind: SubmissionFeedbackKind;
  message: string;
  onClose?: () => void;
  className?: string;
};

export type EmptyStateProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export type AvailabilityBadgeVariant = "available" | "limited" | "full";

export type AvailabilityBadgeProps = {
  variant: AvailabilityBadgeVariant;
  label?: string;
  capacity?: number;
  className?: string;
};

export type DashboardCardProps = {
  title: string;
  description: string;
  href: string;
};

import type { Slot } from "@/lib/types/reservation";

export type AdminToolbarProps = {
  startDate?: string | null;
  endDate?: string | null;
  onStartDateChange?: (v: string | null) => void;
  onEndDateChange?: (v: string | null) => void;
  onRefresh?: () => void;
  className?: string;
};

export type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
};

export type AdminFeedbackProps = {
  open: boolean;
  kind: SubmissionFeedbackKind;
  message: string;
  onClose?: () => void;
  className?: string;
};

export type AdminScheduleEditorProps = {
  dateIso: string | null;
  slots: Slot[];
  onCreateSlot: (slot: Slot) => void;
  onUpdateSlot: (index: number, patch: Partial<Slot>) => void;
  onDeleteSlot: (index: number) => void;
  totalSeats?: number;
  onTotalSeatsChange?: (n: number) => void;
  onSave?: () => void;
  pending?: boolean;
  error?: string | null;
  className?: string;
};

