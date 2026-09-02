"use client";

import Link from "next/link";
import { QrCode, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/health": "Health",
  "/dashboard/timeline": "Timeline",
  "/dashboard/share": "Share",
  "/dashboard/profile": "Profile",
  "/dashboard/settings": "Settings",
};

export default function DashboardHeader({ name }: { name: string }) {
  const pathname = usePathname();

  const title = titles[pathname] || "Dashboard";

  return (
    <header className="hidden border-b border-white/[0.06] bg-[#0B100D]/80 backdrop-blur-xl lg:block">
      <div className="flex h-[88px] items-center justify-between px-8 xl:px-10">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
            {title}
          </p>

          <h1 className="mt-1 text-lg font-semibold tracking-tight">
            {pathname === "/dashboard" ? `Welcome back, ${name}` : title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/share"
            className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs font-semibold text-white/60 transition hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white"
          >
            <QrCode size={15} />
            Share passport
          </Link>

          <Link
            href="/dashboard/profile"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-white/40 transition hover:bg-white/[0.05] hover:text-white"
          >
            <UserRound size={17} />
          </Link>
        </div>
      </div>
    </header>
  );
}
