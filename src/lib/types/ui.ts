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

