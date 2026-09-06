// src/components/dashboard/dashboard-shell.tsx

"use client";

import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import MobileNav from "@/components/dashboard/mobile-nav";
import { motion, type Transition } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface DashboardShellProps {
  children: React.ReactNode;
  name: string;
  email: string;
}

const springConfig: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 32,
  mass: 0.8,
};

export default function DashboardShell({
  children,
  name,
  email,
}: DashboardShellProps) {
  const pathname = usePathname();
  const isAssistantPage = pathname === "/dashboard/assistant";

  // Elevate collapse state to synchronize layout padding
  const [collapsed, setCollapsed] = useState(false);

  return (
    <main className="min-h-screen bg-[#F8F6F0] text-[#121312] selection:bg-[#121312] selection:text-[#F8F6F0]">
      {/* Micro-dot Background Canvas */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#121312 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Controlled Sidebar */}
      <DashboardSidebar
        name={name}
        email={email}
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />

      {/* Smooth Animated Content Canvas */}
      <motion.div
        initial={false}
        animate={{
          paddingLeft: collapsed ? 80 : 260,
        }}
        transition={springConfig}
        className="relative w-full transition-none max-lg:!pl-0"
      >
        <div
          className={
            isAssistantPage
              ? "h-screen w-full overflow-hidden"
              : "mx-auto w-full max-w-[1400px] px-5 pb-32 pt-8 sm:px-8 md:px-10 lg:pb-12 lg:pt-12"
          }
        >
          {children}
        </div>
      </motion.div>

      <MobileNav />
    </main>
  );
}
