type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function Spinner({ size = "md", className }: SpinnerProps) {
  let sizeClass = "h-5 w-5";
  if (size === "sm") sizeClass = "h-4 w-4";
  if (size === "lg") sizeClass = "h-8 w-8";
  const base = `inline-block rounded-full border-2 border-white/40 border-t-transparent animate-spin ${sizeClass}`;
  return <div className={className ? `${base} ${className}` : base} />;
}

