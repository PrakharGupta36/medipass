"use client";

import Link from "next/link";
import { Activity, FileText, Home, QrCode, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(14px+env(safe-area-inset-bottom))] lg:hidden">
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center justify-between rounded-full border border-white/[0.10] bg-[#111712]/75 p-1.5 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150">
          <MobileNavItem
            href="/dashboard"
            icon={<Home size={18} />}
            label="Home"
            active={pathname === "/dashboard"}
          />

          <MobileNavItem
            href="/dashboard/health"
            icon={<Activity size={18} />}
            label="Health"
            active={pathname.startsWith("/dashboard/health")}
          />

          <MobileNavItem
            href="/dashboard/timeline"
            icon={<FileText size={18} />}
            label="Timeline"
            active={pathname.startsWith("/dashboard/timeline")}
          />

          <MobileNavItem
            href="/dashboard/share"
            icon={<QrCode size={18} />}
            label="Share"
            active={pathname.startsWith("/dashboard/share")}
          />

          <MobileNavItem
            href="/dashboard/profile"
            icon={<UserRound size={18} />}
            label="Profile"
            active={pathname.startsWith("/dashboard/profile")}
          />
        </div>
      </div>
    </nav>
  );
}

function MobileNavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`relative flex h-12 flex-1 items-center justify-center rounded-full transition-all duration-200 active:scale-95 ${
        active
          ? "bg-[#1F7A4F]/20 text-[#62C58C]"
          : "text-white/35 hover:bg-white/[0.05] hover:text-white/70"
      }`}
    >
      {active && (
        <span className="absolute inset-1 rounded-full bg-[#1F7A4F]/10 blur-md" />
      )}

      <span className="relative z-10">{icon}</span>
    </Link>
  );
}
