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
    <aside
      className="
        fixed inset-y-0 left-0 z-40 hidden w-[258px] lg:flex
        flex-col
        border-r border-white/[0.07]
        bg-[#090E0B]/95
        text-white
      "
    >
      {/* Very subtle glass wash */}
      <div className="pointer-events-none absolute inset-0 bg-white/[0.008]" />

      {/* =========================================================
          BRAND
      ========================================================== */}

      <div className="relative px-5 pt-6">
        <Link
          href="/dashboard"
          data-cuelume-hover="tick"
          data-cuelume-press
          data-cuelume-release
          className="
            group
            flex items-center gap-3
            rounded-2xl
            border border-white/[0.06]
            bg-white/[0.025]
            px-3.5 py-3
            shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]
            transition-all duration-200
            hover:bg-white/[0.04]
            hover:border-white/[0.09]
            active:scale-[0.985]
          "
        >
          {/* Medical mark */}
          <div
            className="
              relative
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-[13px]
              bg-[#1F7A4F]
              text-white
              shadow-[0_7px_22px_rgba(31,122,79,0.18)]
            "
          >
            <HeartPulse size={19} strokeWidth={1.8} className="relative z-10" />

            <span className="absolute inset-0 rounded-[13px] border border-white/[0.12]" />
            <span className="absolute inset-x-2 top-0 h-px bg-white/[0.16]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-semibold tracking-[-0.02em]">
                MediPass
              </p>

              <span className="h-1.5 w-1.5 rounded-full bg-[#62C58C] shadow-[0_0_7px_rgba(98,197,140,0.45)]" />
            </div>

            <p className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.18em] text-white/25">
              Medical passport
            </p>
          </div>
        </Link>
      </div>

      {/* =========================================================
          NAVIGATION
      ========================================================== */}

      <div className="relative flex-1 overflow-y-auto px-4 pt-8">
        <SidebarSectionLabel>Record</SidebarSectionLabel>

        <SidebarItem
          href="/dashboard"
          icon={<Home size={17} strokeWidth={1.8} />}
          label="Dashboard"
          active={pathname === "/dashboard"}
        />

        <SidebarItem
          href="/dashboard/health"
          icon={<Activity size={17} strokeWidth={1.8} />}
          label="Health"
          active={pathname.startsWith("/dashboard/health")}
        />

        <SidebarItem
          href="/dashboard/timeline"
          icon={<FileText size={17} strokeWidth={1.8} />}
          label="Timeline"
          active={pathname.startsWith("/dashboard/timeline")}
        />

        <div className="my-7 px-3">
          <div className="h-px bg-white/[0.055]" />
        </div>

        <SidebarSectionLabel>Access</SidebarSectionLabel>

        <SidebarItem
          href="/dashboard/share"
          icon={<QrCode size={17} strokeWidth={1.8} />}
          label="Share medical record"
          active={pathname.startsWith("/dashboard/share")}
          important
        />

        <div className="my-7 px-3">
          <div className="h-px bg-white/[0.055]" />
        </div>

        <SidebarSectionLabel>Account</SidebarSectionLabel>

        <SidebarItem
          href="/dashboard/profile"
          icon={<UserRound size={17} strokeWidth={1.8} />}
          label="Profile"
          active={pathname.startsWith("/dashboard/profile")}
        />

        <SidebarItem
          href="/dashboard/settings"
          icon={<Settings size={17} strokeWidth={1.8} />}
          label="Settings"
          active={pathname.startsWith("/dashboard/settings")}
        />
      </div>

      {/* =========================================================
          USER / PASSPORT FOOTER
      ========================================================== */}

      <div className="relative border-t border-white/[0.065] p-4">
        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border border-white/[0.065]
            bg-[#0E1511]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]
          "
        >
          {/* Top edge */}
          <div className="absolute inset-x-4 top-0 h-px bg-white/[0.08]" />

          <div className="flex items-center gap-3 px-3.5 py-3.5">
            {/* Avatar / identity mark */}
            <div
              className="
                relative
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-full
                border border-[#62C58C]/20
                bg-[#1F7A4F]/10
                text-[#62C58C]
              "
            >
              <UserRound size={15} strokeWidth={1.8} />

              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-[#0E1511] bg-[#62C58C]" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-white/75">
                {name}
              </p>

              <p className="mt-0.5 truncate text-[9px] text-white/25">
                {email}
              </p>
            </div>
          </div>

          <div className="border-t border-white/[0.05]">
            <form action="/auth/logout" method="post">
              <button
                type="submit"
                data-cuelume-hover="tick"
                data-cuelume-press
                data-cuelume-release
                className="
                  group
                  flex w-full
                  items-center gap-2.5
                  px-3.5 py-3
                  text-[10px]
                  font-medium
                  text-white/25
                  transition-all duration-200
                  hover:bg-white/[0.035]
                  hover:text-white/65
                  active:bg-white/[0.055]
                "
              >
                <LogOut
                  size={15}
                  strokeWidth={1.8}
                  className="transition-transform duration-200 group-hover:-translate-x-0.5"
                />

                <span>Sign out</span>
              </button>
            </form>
          </div>
        </div>

        {/* Tiny product metadata */}
        <div className="mt-3 flex items-center justify-between px-1">
          <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-white/15">
            Personal record
          </span>

          <span className="font-mono text-[7px] text-white/15">v1.0</span>
        </div>
      </div>
    </aside>
  );
}

/* ===============================================================
   SECTION LABEL
================================================================ */

function SidebarSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2.5 flex items-center gap-2 px-3">
      <span className="h-[3px] w-[3px] rounded-full bg-[#62C58C]/50" />

      <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/20">
        {children}
      </p>
    </div>
  );
}

/* ===============================================================
   NAV ITEM
================================================================ */

function SidebarItem({
  href,
  icon,
  label,
  active,
  important = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  important?: boolean;
}) {
  return (
    <Link
      href={href}
      data-cuelume-hover="tick"
      data-cuelume-press
      data-cuelume-release
      className={`
        group
        relative
        mb-1
        flex
        h-11
        items-center
        gap-3
        overflow-hidden
        rounded-[13px]
        px-3
        text-[11px]
        font-medium
        transition-all
        duration-200
        active:scale-[0.985]

        ${
          active
            ? "border border-white/[0.07] bg-white/[0.055] text-[#72D39A] shadow-[inset_0_1px_0_rgba(255,255,255,0.045),inset_0_-5px_12px_rgba(0,0,0,0.12)]"
            : "border border-transparent text-white/30 hover:bg-white/[0.035] hover:text-white/65"
        }

        ${important && !active ? "text-white/40" : ""}
      `}
    >
      {/* Active vertical indicator */}
      {active && (
        <span
          className="
            absolute
            left-0
            top-2.5
            h-6
            w-[2px]
            rounded-r-full
            bg-[#62C58C]
            shadow-[0_0_10px_rgba(98,197,140,0.4)]
          "
        />
      )}

      {/* Active inner highlight */}
      {active && (
        <span
          className="
            pointer-events-none
            absolute
            inset-[1px]
            rounded-[12px]
            border
            border-white/[0.025]
          "
        />
      )}

      {/* Icon housing */}
      <span
        className={`
          relative
          z-10
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-[9px]
          transition-all
          duration-200

          ${
            active
              ? "bg-[#1F7A4F]/15 text-[#62C58C]"
              : "bg-white/[0.025] text-white/25 group-hover:bg-white/[0.045] group-hover:text-white/55"
          }
        `}
      >
        {icon}
      </span>

      <span className="relative z-10 truncate">{label}</span>

      {/* Share gets a tiny visual affordance */}
      {important && (
        <span
          className={`
            ml-auto
            h-1.5
            w-1.5
            shrink-0
            rounded-full
            transition-all
            ${
              active
                ? "bg-[#62C58C] shadow-[0_0_8px_rgba(98,197,140,0.55)]"
                : "bg-white/15 group-hover:bg-[#62C58C]/50"
            }
          `}
        />
      )}
    </Link>
  );
}
