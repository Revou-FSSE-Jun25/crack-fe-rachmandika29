"use client";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  href: string;
};

export default function DashboardCard({ title, description, href }: Props) {
  return (
    <Link href={href} className="block">
      <div className="rounded-md border border-white/10 bg-zinc-900/50 overflow-hidden hover:bg-zinc-900/70 transition-colors">
        <div className="aspect-video bg-black/50" />
        <div className="p-4 space-y-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
      </div>
    </Link>
  );
}
