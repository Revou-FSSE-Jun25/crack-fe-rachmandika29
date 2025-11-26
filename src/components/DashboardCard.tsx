"use client";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  href: string;
};

export default function DashboardCard({ title, description, href }: Props) {
  return (
    <Link href={href} className="block h-full">
      <div className="h-full flex flex-col rounded-md border border-white/10 bg-zinc-900/50 overflow-hidden hover:bg-zinc-900/70 transition-colors">
        <div className="aspect-video bg-black/50" />
        <div className="p-4 space-y-2 flex-1">
          <h3 className="font-semibold line-clamp-1">{title}</h3>
          <p className="text-sm text-zinc-400 line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  );
}
