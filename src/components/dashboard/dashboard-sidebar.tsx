// src/components/dashboard/dashboard-sidebar.tsx

"use client";

import { AnimatePresence, motion, type Transition } from "framer-motion";
import {
  Activity,
  Bot,
  ChevronLeft,
  FileText,
  Home,
  LogOut,
  QrCode,
  Settings,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { playHoverSound, playSelectSound, playToggleSound } from "@/lib/sounds";
import { bind } from "cuelume";

interface DashboardSidebarProps {
  name: string;
  email: string;
  collapsed: boolean;
  onToggle: () => void;
}

const springConfig: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 32,
  mass: 0.8,
};

export default function DashboardSidebar({
  name,
  email,
  collapsed,
  onToggle,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    bind();
  }, []);

  const handleToggle = () => {
    onToggle();
    playToggleSound(!collapsed);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={springConfig}
      className="
        fixed inset-y-0 left-0 z-40 hidden lg:flex
        flex-col border-r border-black/10
        bg-[#FAF8F5]
        text-[#121312] p-2
        shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,1px_0_0_rgba(255,255,255,0.6)_inset]
      "
    >
      {/* Top Edge Specular Reflection */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      {/* BRAND HEADER & TOGGLE */}
      <div className="relative px-1 pt-3 pb-2">
        <Link
          href="/dashboard"
          onClick={playSelectSound}
          onMouseEnter={playHoverSound}
          className="
            group flex h-28 w-full
            items-center justify-center
            overflow-hidden rounded-2xl
            scale-85
            transition-all duration-200 hover:border-black/10
          "
        >
          <motion.div
            animate={{
              width: collapsed ? 0 : 190,
              height: collapsed ? 0 : 190,
            }}
            transition={springConfig}
            className="relative shrink-0"
          >
            <Image
              src="/logo-2.png"
              alt="MediPass"
              fill
              sizes="190px"
              className="
                object-contain
                transition-transform duration-300
                group-hover:scale-[1.02]
              "
              priority
            />
          </motion.div>
        </Link>

        {/* Tactile Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          onMouseEnter={playHoverSound}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="
            absolute -right-3 top-8
            z-20 flex h-6 w-6 items-center justify-center
            rounded-full
            border border-black/10
            bg-gradient-to-b from-white to-[#F0ECE6]
            text-[#121312]/70
            shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_4px_rgba(0,0,0,0.08)]
            transition-all hover:text-[#121312]
          "
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={springConfig}
          >
            <ChevronLeft size={12} strokeWidth={2.5} />
          </motion.div>
        </motion.button>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-1 pt-4 space-y-0.5">
        <SidebarSectionLabel collapsed={collapsed}>Record</SidebarSectionLabel>

        <SidebarItem
          href="/dashboard"
          icon={<Home size={16} strokeWidth={2} />}
          label="Dashboard"
          active={pathname === "/dashboard"}
          collapsed={collapsed}
        />

        <SidebarItem
          href="/dashboard/health"
          icon={<Activity size={16} strokeWidth={2} />}
          label="Health Records"
          active={pathname.startsWith("/dashboard/health")}
          collapsed={collapsed}
        />

        <SidebarItem
          href="/dashboard/timeline"
          icon={<FileText size={16} strokeWidth={2} />}
          label="Timeline"
          active={pathname.startsWith("/dashboard/timeline")}
          collapsed={collapsed}
        />

        <SidebarDivider />

        <SidebarSectionLabel collapsed={collapsed}>
          Experimental
        </SidebarSectionLabel>

        <SidebarItem
          href="/dashboard/assistant"
          icon={<Bot size={16} strokeWidth={2} />}
          label="AI Assistant"
          active={pathname.startsWith("/dashboard/assistant")}
          experimental
          collapsed={collapsed}
        />

        <SidebarDivider />

        <SidebarSectionLabel collapsed={collapsed}>
          Access Control
        </SidebarSectionLabel>

        <SidebarItem
          href="/dashboard/share"
          icon={<QrCode size={16} strokeWidth={2} />}
          label="Share Record"
          active={pathname.startsWith("/dashboard/share")}
          important
          collapsed={collapsed}
        />

        <SidebarDivider />

        <SidebarSectionLabel collapsed={collapsed}>Account</SidebarSectionLabel>

        <SidebarItem
          href="/dashboard/profile"
          icon={<UserRound size={16} strokeWidth={2} />}
          label="Profile Details"
          active={pathname.startsWith("/dashboard/profile")}
          collapsed={collapsed}
        />

        <SidebarItem
          href="/dashboard/settings"
          icon={<Settings size={16} strokeWidth={2} />}
          label="Settings"
          active={pathname.startsWith("/dashboard/settings")}
          collapsed={collapsed}
        />
      </div>

      {/* USER FOOTER */}
      <div className="pt-2 px-1">
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-b from-white to-[#F5F2EC] shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_4px_rgba(0,0,0,0.03)]">
          {/* USER INFO */}
          <div
            className={`
              flex items-center transition-all duration-300
              ${collapsed ? "justify-center p-2" : "gap-3 p-2.5"}
            `}
          >
            <motion.div
              animate={{
                width: collapsed ? 36 : 32,
                height: collapsed ? 36 : 32,
              }}
              transition={springConfig}
              className="
                flex shrink-0 items-center justify-center
                rounded-xl
                border border-black/10
                bg-gradient-to-b from-[#1C4031] to-[#122B20]
                text-[#F8F6F0]
                shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_2px_4px_rgba(0,0,0,0.15)]
              "
            >
              <motion.div
                animate={{ scale: collapsed ? 1.05 : 1 }}
                transition={springConfig}
              >
                <UserRound size={collapsed ? 18 : 15} strokeWidth={2} />
              </motion.div>
            </motion.div>

            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-xs font-semibold text-[#121312]">
                    {name}
                  </p>
                  <p className="truncate font-mono text-[9px] text-[#121312]/50">
                    {email}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SIGN OUT */}
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={springConfig}
                className="overflow-hidden border-t border-black/5 bg-[#FAF8F5]/60"
              >
                <form action="/auth/logout" method="post">
                  <button
                    type="submit"
                    onClick={playSelectSound}
                    onMouseEnter={playHoverSound}
                    className="
                      flex w-full items-center gap-2.5
                      px-3 py-2 font-mono text-xs
                      font-semibold text-[#121312]/50
                      transition-colors hover:bg-black/5 hover:text-[#121312]
                    "
                  >
                    <LogOut size={13} strokeWidth={2} className="shrink-0" />
                    <span className="text-xs">Sign Out</span>
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        
      </div>
    </motion.aside>
  );
}

/* -------------------------------------------------------------------------- */
/* SECTION LABEL */
/* -------------------------------------------------------------------------- */

function SidebarSectionLabel({
  children,
  collapsed,
}: {
  children: React.ReactNode;
  collapsed: boolean;
}) {
  return (
    <div className="mt-2 mb-1 flex h-4 items-center gap-2 px-2">
      {!collapsed && (
        <span className="h-1 w-1 shrink-0 rounded-full bg-[#18392B]" />
      )}

      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              truncate font-mono text-[9px]
              font-semibold uppercase
              tracking-[0.2em] text-[#121312]/40
            "
          >
            {children}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* DIVIDER */
/* -------------------------------------------------------------------------- */

function SidebarDivider() {
  return (
    <div className="my-2 px-2">
      <div className="h-px bg-black/5 shadow-[0_1px_0_rgba(255,255,255,0.8)]" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SIDEBAR ITEM */
/* -------------------------------------------------------------------------- */

function SidebarItem({
  href,
  icon,
  label,
  active,
  important = false,
  experimental = false,
  collapsed,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  important?: boolean;
  experimental?: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={playSelectSound}
      onMouseEnter={playHoverSound}
      title={collapsed ? label : undefined}
      className={`
        group relative flex h-9
        items-center rounded-xl px-2.5
        text-xs font-semibold transition-all duration-150 active:scale-[0.98]
        ${
          active
            ? "border border-[#18392B]/20 bg-gradient-to-b from-[#1C4031] via-[#18392B] to-[#122B20] text-[#F8F6F0] shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_2px_5px_rgba(24,57,43,0.2)]"
            : "border border-transparent text-[#121312]/65 hover:border-black/5 hover:bg-white/60 hover:text-[#121312] hover:shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]"
        }
      `}
    >
      {/* ICON */}
      <span
        className={`
          relative z-10 flex h-5 w-5
          shrink-0 items-center justify-center
          transition-colors duration-200
          ${
            active
              ? "text-white"
              : "text-[#121312]/50 group-hover:text-[#121312]"
          }
        `}
      >
        {icon}
      </span>

      {/* LABEL */}
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.15 }}
            className="
              relative z-10 ml-2.5
              flex min-w-0 flex-1
              items-center justify-between
            "
          >
            <span className="truncate">{label}</span>

            {/* IMPORTANT INDICATOR */}
            {important && !active && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#18392B]" />
            )}

            {/* EXPERIMENTAL / BETA */}
            {experimental && !active && (
              <span
                className="
                  rounded-full
                  border border-[#18392B]/20
                  bg-[#18392B]/5
                  px-1.5 py-0.5
                  font-mono text-[7px]
                  font-semibold uppercase
                  tracking-[0.08em]
                  text-[#18392B]
                "
              >
                Beta
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}
