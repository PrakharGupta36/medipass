// src/components/ui/double-border-card.tsx

"use client";

import { motion } from "framer-motion";
import React from "react";

interface DoubleBorderCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "light" | "emerald";
}

export function DoubleBorderCard({
  children,
  className = "",
  variant = "light",
}: DoubleBorderCardProps) {
  const isEmerald = variant === "emerald";

  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`
        group relative rounded-[28px] p-1.5 transition-all duration-300
        /* Non-aggressive Double Border Architecture */
        border border-black/10
        shadow-[0_1px_0px_rgba(255,255,255,0.9)_inset,0_-1px_1px_rgba(0,0,0,0.04)_inset,0_10px_25px_-8px_rgba(18,19,18,0.08),0_4px_10px_-2px_rgba(18,19,18,0.04)]
        ${
          isEmerald
            ? "bg-gradient-to-b from-[#1c4031] via-[#163528] to-[#10291e]"
            : "bg-gradient-to-b from-[#FAF8F5] via-[#F4F0EA] to-[#EAE4DC]"
        }
        ${className}
      `}
    >
      {/* Outer Hairline Frame (Double Border Ring #2) */}
      <div
        className={`pointer-events-none absolute inset-[2px] rounded-[26px] border ${
          isEmerald ? "border-white/10" : "border-white/70"
        } shadow-[0_1px_1px_rgba(255,255,255,0.8)]`}
      />

      {/* Top Specular Rim Reflection */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px ${
          isEmerald
            ? "bg-gradient-to-r from-transparent via-white/20 to-transparent"
            : "bg-gradient-to-r from-transparent via-white/80 to-transparent"
        }`}
      />

      {/* Internal Content Surface */}
      <div className="relative z-10 h-full w-full rounded-[23px] p-5 sm:p-6">
        {children}
      </div>
    </motion.div>
  );
}
