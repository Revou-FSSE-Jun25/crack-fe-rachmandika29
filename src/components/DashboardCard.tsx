"use client";
import Link from "next/link";
import Image from "next/image";
import type { DashboardCardProps } from "@/lib/types/ui";

export default function DashboardCard({ title, description, href, imageSrc }: DashboardCardProps) {
  return (
    <Link href={href} className="block h-full group">
      <div className="h-full flex flex-col rounded-md border border-white/10 bg-zinc-900/50 overflow-hidden hover:bg-zinc-900/70 transition-colors">
        <div className="relative aspect-video bg-black/50">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : null}
        </div>
        <div className="p-4 space-y-2 flex-1">
          <h3 className="font-semibold line-clamp-1">{title}</h3>
          <p className="text-sm text-zinc-400 line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  );
}
