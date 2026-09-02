"use client";

import Link from "next/link";
import {
  Activity,
  FileText,
  HeartPulse,
  Home,
  LogOut,
  QrCode,
  Settings,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  name: string;
  email: string;
}

export default function DashboardSidebar({
  name,
  email,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] flex-col border-r border-white/[0.06] bg-[#0B100D] lg:flex">
      {/* Logo */}
      <div className="flex h-[88px] items-center px-7">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F7A4F] text-white shadow-[0_6px_20px_rgba(31,122,79,0.2)]">
            <HeartPulse size={19} />
          </div>

          <div>
            <p className="font-semibold tracking-tight">MediPass</p>

            <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-white/25">
              Medical passport
            </p>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-4 pt-5">
        <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/20">
          Overview
        </p>

        <SidebarItem
          href="/dashboard"
          icon={<Home size={18} />}
          label="Dashboard"
          active={pathname === "/dashboard"}
        />

        <SidebarItem
          href="/dashboard/health"
          icon={<Activity size={18} />}
          label="Health"
          active={pathname.startsWith("/dashboard/health")}
        />

        <SidebarItem
          href="/dashboard/timeline"
          icon={<FileText size={18} />}
          label="Timeline"
          active={pathname.startsWith("/dashboard/timeline")}
        />

        <SidebarItem
          href="/dashboard/share"
          icon={<QrCode size={18} />}
          label="Share"
          active={pathname.startsWith("/dashboard/share")}
        />

        <div className="my-6 h-px bg-white/[0.05]" />

        <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/20">
          Account
        </p>

        <SidebarItem
          href="/dashboard/profile"
          icon={<UserRound size={18} />}
          label="Profile"
          active={pathname.startsWith("/dashboard/profile")}
        />

        <SidebarItem
          href="/dashboard/settings"
          icon={<Settings size={18} />}
          label="Settings"
          active={pathname.startsWith("/dashboard/settings")}
        />
      </div>

      {/* User */}
      <div className="border-t border-white/[0.06] p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.025] p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1F7A4F]/15 text-[#62C58C]">
            <UserRound size={16} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white/75">{name}</p>

            <p className="truncate text-[10px] text-white/25">{email}</p>
          </div>
        </div>

        <form action="/auth/logout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-white/30 transition hover:bg-white/[0.04] hover:text-white/70"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}

function SidebarItem({
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
      className={`mb-1 flex h-11 items-center gap-3 rounded-xl px-3 text-xs font-medium transition ${
        active
          ? "bg-[#1F7A4F]/10 text-[#62C58C]"
          : "text-white/30 hover:bg-white/[0.035] hover:text-white/70"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
