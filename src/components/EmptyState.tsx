"use client";

type Props = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export default function EmptyState({ title = "No data", description = "Nothing to show yet", action, className = "" }: Props) {
  return (
    <div className={`rounded-md border border-white/10 bg-zinc-900/50 p-6 text-center ${className}`}>
      <div className="space-y-2">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-sm text-zinc-400">{description}</div>
      </div>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}

