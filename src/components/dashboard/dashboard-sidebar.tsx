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
      animate={{ width: collapsed ? 70 : 260 }}
      transition={springConfig}
      className="
        fixed inset-y-0 left-0 z-40 hidden lg:flex
        flex-col border-r border-[#121312]/10
        bg-[#F0EDE6]/90 backdrop-blur-xl text-[#121312]
        shadow-[10px_0_30px_rgba(18,19,18,0.02)]
      "
    >
      {/* BRAND HEADER & TOGGLE */}
      <div className="relative px-4 pt-6">
        <Link
          href="/dashboard"
          onClick={playSelectSound}
          onMouseEnter={playHoverSound}
          className="
      group flex h-22 w-full
      items-center justify-center
      overflow-hidden
      rounded-[28px]
    "
        >
          <motion.div
            animate={{
              width: collapsed ? 0 : 190,
              height: collapsed ? 0 : 256,
            }}
            transition={springConfig}
            className="relative shrink-0"
          >
            <Image
              src="/logo.png"
              alt="MediPass"
              fill
              sizes="190px"
              className="
          object-contain
          transition-transform duration-300
          group-hover:scale-[1.03]
        "
              priority
            />
          </motion.div>
        </Link>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          onMouseEnter={playHoverSound}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="
      absolute -right-3 top-14
      flex h-6 w-6 items-center justify-center
      rounded-full
      border border-[#121312]/15
      bg-[#F0EDE6]
      text-[#121312]/60
      shadow-sm
      transition-colors
      hover:bg-white
      hover:text-[#121312]
    "
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={springConfig}
          >
            <ChevronLeft size={13} strokeWidth={2.5} />
          </motion.div>
        </motion.button>
      </div>
      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-3 pt-6">
        {/* RECORD */}
         <SidebarSectionLabel collapsed={collapsed}>Record</SidebarSectionLabel>

        <SidebarItem
          href="/dashboard"
          icon={<Home size={17} strokeWidth={1.8} />}
          label="Dashboard"
          active={pathname === "/dashboard"}
          collapsed={collapsed}
        />

        <SidebarItem
          href="/dashboard/health"
          icon={<Activity size={17} strokeWidth={1.8} />}
          label="Health Records"
          active={pathname.startsWith("/dashboard/health")}
          collapsed={collapsed}
        />

        <SidebarItem
          href="/dashboard/timeline"
          icon={<FileText size={17} strokeWidth={1.8} />}
          label="Timeline"
          active={pathname.startsWith("/dashboard/timeline")}
          collapsed={collapsed}
        />

        <SidebarDivider />

        {/* EXPERIMENTAL */}
        <SidebarSectionLabel collapsed={collapsed}>
          Experimental
        </SidebarSectionLabel>

        <SidebarItem
          href="/dashboard/assistant"
          icon={<Bot size={17} strokeWidth={1.8} />}
          label="AI Assistant"
          active={pathname.startsWith("/dashboard/assistant")}
          experimental
          collapsed={collapsed}
        />

        <SidebarDivider />

        {/* ACCESS CONTROL */}
        <SidebarSectionLabel collapsed={collapsed}>
          Access Control
        </SidebarSectionLabel>

        <SidebarItem
          href="/dashboard/share"
          icon={<QrCode size={17} strokeWidth={1.8} />}
          label="Share Record"
          active={pathname.startsWith("/dashboard/share")}
          important
          collapsed={collapsed}
        />

        <SidebarDivider />

        {/* ACCOUNT */}
        <SidebarSectionLabel collapsed={collapsed}>Account</SidebarSectionLabel>

        <SidebarItem
          href="/dashboard/profile"
          icon={<UserRound size={17} strokeWidth={1.8} />}
          label="Profile Details"
          active={pathname.startsWith("/dashboard/profile")}
          collapsed={collapsed}
        />

        <SidebarItem
          href="/dashboard/settings"
          icon={<Settings size={17} strokeWidth={1.8} />}
          label="Settings"
          active={pathname.startsWith("/dashboard/settings")}
          collapsed={collapsed}
        />
      </div>

      {/* USER FOOTER */}
      <div className="border-t border-[#121312]/10 p-3">
        <div className="overflow-hidden rounded-2xl border border-[#121312]/10 bg-white/70">
          {/* USER */}
          <div className="flex items-center gap-3 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#18392B]/10 text-[#18392B]">
              <UserRound size={15} strokeWidth={1.8} />
            </div>

            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-xs font-semibold text-[#121312]">
                    {name}
                  </p>

                  <p className="truncate font-mono text-[9px] text-[#121312]/40">
                    {email}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SIGN OUT */}
          <div className="border-t border-[#121312]/10">
            <form action="/auth/logout" method="post">
              <button
                type="submit"
                onClick={playSelectSound}
                onMouseEnter={playHoverSound}
                className="
                  flex w-full items-center gap-2.5
                  px-3 py-2.5
                  font-mono text-[10px] uppercase tracking-wider
                  text-[#121312]/50
                  transition-colors
                  hover:bg-[#121312]/5 hover:text-[#121312]
                "
              >
                <LogOut size={14} strokeWidth={1.8} className="shrink-0" />

                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Sign Out
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </form>
          </div>
        </div>

        {/* FOOTER META */}
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="
                mt-3 flex items-center justify-between
                px-1 font-mono text-[8px]
                uppercase tracking-[0.16em]
                text-[#121312]/30
              "
            >
              <span>Personal Vault</span>
              <span>v2.4</span>
            </motion.div>
          )}
        </AnimatePresence>
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
    <div className="mb-2 flex h-4 items-center gap-2 px-2">
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
    <div className="my-4 px-2">
      <div className="h-px bg-[#121312]/10" />
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
        group relative mb-1 flex h-10
        items-center rounded-xl px-2.5
        text-xs font-medium
        transition-colors duration-200
        ${active ? "text-white" : "text-[#121312]/70 hover:text-[#121312]"}
      `}
    >
      {/* ACTIVE BACKGROUND */}
      {active && (
        <motion.div
          layoutId="sidebarActiveBackground"
          transition={springConfig}
          className="
            absolute inset-0 rounded-xl
            bg-[#18392B] shadow-sm
          "
        />
      )}

      {/* ICON */}
      <span
        className={`
          relative z-10 flex h-6 w-6
          shrink-0 items-center justify-center
          rounded-md transition-colors duration-200
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
              relative z-10 ml-3
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
                  border border-[#18392B]/15
                  bg-[#18392B]/5
                  px-1.5 py-0.5
                  font-mono text-[7px]
                  font-semibold uppercase
                  tracking-[0.08em]
                  text-[#18392B]/60
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
