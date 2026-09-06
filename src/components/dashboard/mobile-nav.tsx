// src/components/dashboard/mobile-nav.tsx

"use client";

import {
  Activity,
  Bot,
  FileText,
  Home,
  QrCode,
  Settings,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, type Transition } from "framer-motion";
import { playHoverSound, playSelectSound } from "@/lib/sounds";

const springConfig: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.8,
};

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-3 lg:hidden">
      {/* Instagram-style rounded pill glass container */}
      <div
        className="
        flex items-center gap-1.5 overflow-x-auto rounded-full
        border border-white/40 bg-[#F0EDE6]/80 p-2
        shadow-[0_12px_32px_rgba(18,19,18,0.12)]
        backdrop-blur-xl backdrop-saturate-150
        no-scrollbar max-w-full
      "
      >
        {/* Dashboard */}
        <MobileNavItem
          href="/dashboard"
          icon={<Home size={17} strokeWidth={2} />}
          label="Dashboard"
          active={pathname === "/dashboard"}
        />

        {/* Health */}
        <MobileNavItem
          href="/dashboard/health"
          icon={<Activity size={17} strokeWidth={2} />}
          label="Health Records"
          active={pathname.startsWith("/dashboard/health")}
        />

        {/* Timeline */}
        <MobileNavItem
          href="/dashboard/timeline"
          icon={<FileText size={17} strokeWidth={2} />}
          label="Timeline"
          active={pathname.startsWith("/dashboard/timeline")}
        />

        {/* Experimental AI */}
        <MobileNavItem
          href="/dashboard/assistant"
          icon={<Bot size={17} strokeWidth={2} />}
          label="AI Assistant"
          active={pathname.startsWith("/dashboard/assistant")}
          experimental
        />

        {/* Share */}
        <MobileNavItem
          href="/dashboard/share"
          icon={<QrCode size={17} strokeWidth={2} />}
          label="Share Record"
          active={pathname.startsWith("/dashboard/share")}
        />

        {/* Profile */}
        <MobileNavItem
          href="/dashboard/profile"
          icon={<UserRound size={17} strokeWidth={2} />}
          label="Profile"
          active={pathname.startsWith("/dashboard/profile")}
        />

        {/* Settings */}
        <MobileNavItem
          href="/dashboard/settings"
          icon={<Settings size={17} strokeWidth={2} />}
          label="Settings"
          active={pathname.startsWith("/dashboard/settings")}
        />
      </div>
    </nav>
  );
}

function MobileNavItem({
  href,
  icon,
  label,
  active,
  experimental = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  experimental?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      onClick={playSelectSound}
      onMouseEnter={playHoverSound}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
    >
      {/* Active Pill Background */}
      {active && (
        <motion.div
          layoutId="instagramPillActiveBg"
          transition={springConfig}
          className="absolute inset-0 rounded-full bg-[#18392B] shadow-md shadow-[#18392B]/20"
        />
      )}

      {/* Bordered Icon Badge Container */}
      <div
        className={`
          relative z-10 flex h-8 w-8 items-center justify-center rounded-full
          border transition-all duration-300
          ${
            active
              ? "border-white/30 bg-white/10 text-white"
              : "border-[#121312]/15 bg-white/40 text-[#121312]/60 hover:border-[#121312]/30 hover:bg-white hover:text-[#121312]"
          }
        `}
      >
        {icon}

        {/* Experimental indicator */}
        {experimental && !active && (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-[#F0EDE6] bg-[#18392B]" />
        )}
      </div>
    </Link>
  );
}
