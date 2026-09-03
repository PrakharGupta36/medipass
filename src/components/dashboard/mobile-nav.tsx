"use client";

import Link from "next/link";
import {
  Activity,
  FileText,
  Home,
  QrCode,
  Settings,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed inset-x-0 bottom-0 z-50
        px-3
        pb-[calc(12px+env(safe-area-inset-bottom))]
        lg:hidden
      "
    >
      <div className="mx-auto w-full max-w-[430px]">
        {/* Physical glass housing */}
        <div
          className="
            relative
            overflow-hidden
            rounded-full
            border border-white/[0.12]
            bg-[#101612]/80
            p-1.5
            shadow-[0_20px_60px_rgba(0,0,0,0.55)]
            backdrop-blur-2xl
            backdrop-saturate-150

            before:pointer-events-none
            before:absolute
            before:inset-[1px]
            before:rounded-[22px]
            before:border
            before:border-white/[0.035]

            after:pointer-events-none
            after:absolute
            after:left-[10%]
            after:right-[10%]
            after:top-0
            after:h-px
            after:bg-white/[0.12]
          "
        >
          {/* Subtle glass reflection */}
          <div
            className="
              pointer-events-none
              absolute
              inset-x-8
              top-0
              h-8
              rounded-full
              bg-white/[0.025]
              blur-xl
            "
          />

          <div className="relative z-10 flex items-center gap-1">
            <MobileNavItem
              href="/dashboard"
              icon={<Home size={18} strokeWidth={1.8} />}
              label="Home"
              active={pathname === "/dashboard"}
            />

            <MobileNavItem
              href="/dashboard/health"
              icon={<Activity size={18} strokeWidth={1.8} />}
              label="Health"
              active={pathname.startsWith("/dashboard/health")}
            />

            <MobileNavItem
              href="/dashboard/timeline"
              icon={<FileText size={18} strokeWidth={1.8} />}
              label="Timeline"
              active={pathname.startsWith("/dashboard/timeline")}
            />

            {/* Primary action */}
            <MobileNavItem
              href="/dashboard/share"
              icon={<QrCode size={19} strokeWidth={1.9} />}
              label="Share"
              active={pathname.startsWith("/dashboard/share")}
              primary
            />

            <MobileNavItem
              href="/dashboard/profile"
              icon={<UserRound size={18} strokeWidth={1.8} />}
              label="Profile"
              active={pathname.startsWith("/dashboard/profile")}
            />

            {/* Small divider before account settings */}
            <div className="mx-0.5 h-7 w-px bg-white/[0.08]" />

            <MobileNavItem
              href="/dashboard/settings"
              icon={<Settings size={17} strokeWidth={1.8} />}
              label="Settings"
              active={pathname.startsWith("/dashboard/settings")}
              settings
            />
          </div>
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
  primary = false,
  settings = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  primary?: boolean;
  settings?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      data-cuelume-hover="tick"
      data-cuelume-press
      data-cuelume-release
      className={`
        group
        relative
        flex
        h-[46px]
        min-w-0
        flex-1
        items-center
        justify-center
        rounded-[17px]
        transition-all
        duration-200
        ease-out

        active:scale-[0.94]

        ${
          active
            ? primary
              ? "bg-[#1F7A4F]/25 text-[#72D39A]"
              : "bg-white/[0.075] text-[#72D39A]"
            : "text-white/35 hover:bg-white/[0.045] hover:text-white/70"
        }

        ${settings ? "max-w-[44px]" : ""}
      `}
    >
      {/* Inset active surface */}
      {active && (
        <>
          <span
            className="
              pointer-events-none
              absolute
              inset-[2px]
              rounded-[15px]
              border
              border-white/[0.07]
              shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-4px_10px_rgba(0,0,0,0.18)]
            "
          />

          <span
            className="
              pointer-events-none
              absolute
              bottom-[4px]
              left-1/2
              h-[2px]
              w-4
              -translate-x-1/2
              rounded-full
              bg-[#62C58C]
              shadow-[0_0_10px_rgba(98,197,140,0.55)]
            "
          />
        </>
      )}

      {/* Hover sheen */}
      <span
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-[17px]
          bg-gradient-to-b
          from-white/[0.035]
          to-transparent
          opacity-0
          transition-opacity
          group-hover:opacity-100
        "
      />

      {/* Icon */}
      <span className="relative z-10 transition-transform duration-200 group-active:translate-y-px">
        {icon}
      </span>
    </Link>
  );
}
