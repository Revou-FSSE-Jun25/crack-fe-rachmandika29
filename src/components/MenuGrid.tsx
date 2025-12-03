"use client";
import type { MenuGridProps } from "@/lib/types/menu";

export default function MenuGrid({ children, className = "" }: MenuGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr ${className}`}>{children}</div>
  );
}
