"use client";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export default function StepSection({ title, description, children, footer, className = "" }: Props) {
  return (
    <section className={`rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`} role="region" aria-labelledby={title.replace(/\s+/g, "-").toLowerCase()}>
      <div className="space-y-1">
        <h2 id={title.replace(/\s+/g, "-").toLowerCase()} className="text-sm font-medium">{title}</h2>
        {description && <p className="text-xs text-zinc-400">{description}</p>}
      </div>
      <div className="mt-3">
        {children}
      </div>
      {footer && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row items-center justify-between">
          {footer}
        </div>
      )}
    </section>
  );
}
