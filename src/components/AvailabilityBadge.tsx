"use client";

type Variant = "available" | "limited" | "full";

type Props = {
  variant: Variant;
  label?: string;
  capacity?: number;
  className?: string;
};

export default function AvailabilityBadge({ variant, label, capacity, className = "" }: Props) {
  const text = label || (variant === "available" ? "Available" : variant === "limited" ? "Limited" : "Full");
  const base = "inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-xs";
  const theme = variant === "available" ? "border-green-400 text-green-300" : variant === "limited" ? "border-yellow-400 text-yellow-300" : "border-red-400 text-red-300";
  return (
    <span className={`${base} ${theme} ${className}`}>
      <span>{text}</span>
      {typeof capacity === "number" && <span className="opacity-80">{capacity}</span>}
    </span>
  );
}

