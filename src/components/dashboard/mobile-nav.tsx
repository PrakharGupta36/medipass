// src/components/dashboard/mobile-nav.tsx

"use client";

import { playHoverSound, playSelectSound } from "@/lib/sounds";
import { motion, type Transition } from "framer-motion";
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

const springConfig: Transition = {
  type: "spring",
  stiffness: 550,
  damping: 35,
  mass: 0.5,
};

export default function MobileNav() {
  const pathname = usePathname();

  // Hide mobile nav entirely on assistant route to avoid input collision
  if (pathname.startsWith("/dashboard/assistant")) {
    return null;
  }

  const triggerHaptic = (pattern: number | number[] = 8) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      {/* Compact Bottom Sheet */}
      <div className="relative w-full rounded-t-[20px] border-t border-white/60 bg-[#F0EDE6]/80 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-8px_24px_rgba(18,19,18,0.1)] backdrop-blur-2xl backdrop-saturate-200">
        {/* Tight Icon Track */}
        <div className="no-scrollbar flex items-center justify-between gap-0.5 overflow-x-auto px-1">
          <CompactNavItem
            href="/dashboard"
            icon={<Home size={16} strokeWidth={2.2} />}
            label="Dashboard"
            active={pathname === "/dashboard"}
            onHaptic={() => triggerHaptic(8)}
          />

          <CompactNavItem
            href="/dashboard/health"
            icon={<Activity size={16} strokeWidth={2.2} />}
            label="Health Records"
            active={pathname.startsWith("/dashboard/health")}
            onHaptic={() => triggerHaptic(8)}
          />

          <CompactNavItem
            href="/dashboard/timeline"
            icon={<FileText size={16} strokeWidth={2.2} />}
            label="Timeline"
            active={pathname.startsWith("/dashboard/timeline")}
            onHaptic={() => triggerHaptic(8)}
          />

          <CompactNavItem
            href="/dashboard/assistant"
            icon={<Bot size={16} strokeWidth={2.2} />}
            label="AI Assistant"
            active={pathname.startsWith("/dashboard/assistant")}
            experimental
            onHaptic={() => triggerHaptic([8, 20, 8])}
          />

          <CompactNavItem
            href="/dashboard/share"
            icon={<QrCode size={16} strokeWidth={2.2} />}
            label="Share Record"
            active={pathname.startsWith("/dashboard/share")}
            onHaptic={() => triggerHaptic(8)}
          />

          <CompactNavItem
            href="/dashboard/profile"
            icon={<UserRound size={16} strokeWidth={2.2} />}
            label="Profile"
            active={pathname.startsWith("/dashboard/profile")}
            onHaptic={() => triggerHaptic(8)}
          />

          <CompactNavItem
            href="/dashboard/settings"
            icon={<Settings size={16} strokeWidth={2.2} />}
            label="Settings"
            active={pathname.startsWith("/dashboard/settings")}
            onHaptic={() => triggerHaptic(8)}
          />
        </div>
      </div>
    </nav>
  );
}

function CompactNavItem({
  href,
  icon,
  label,
  active,
  experimental = false,
  onHaptic,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  experimental?: boolean;
  onHaptic: () => void;
}) {
  const handleClick = () => {
    onHaptic();
    playSelectSound();
  };

  return (
    <Link
      href={href}
      aria-label={label}
      onClick={handleClick}
      onMouseEnter={playHoverSound}
      className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-transform active:scale-90"
    >
      {/* Micro Active Pill */}
      {active && (
        <motion.div
          layoutId="compactNavActive"
          transition={springConfig}
          className="absolute inset-0 rounded-xl bg-[#18392B] shadow-[0_2px_8px_rgba(24,57,43,0.3)]"
        />
      )}

      {/* Icon Container */}
      <div
        className={`relative z-10 flex items-center justify-center transition-colors duration-200 ${
          active ? "text-[#F8F6F0]" : "text-[#121312]/50 hover:text-[#121312]"
        }`}
      >
        {icon}

        {/* Experimental Indicator Dot */}
        {experimental && !active && (
          <span className="absolute -right-1 -top-1 flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18392B] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full border border-[#F0EDE6] bg-[#18392B]" />
          </span>
        )}
      </div>
    </Link>
  );
}
