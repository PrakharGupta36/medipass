// src/app/dashboard/profile/profile-client.tsx
"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export function ProfileClientContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full text-[#121312]"
    >
      {children}
    </motion.div>
  );
}

export function MotionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section variants={cardVariants} className={className}>
      {children}
    </motion.section>
  );
}

export function MotionStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{ x: 3 }}
      className="flex items-center gap-3 transition-transform"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F8F6F0] text-[#18392B] shadow-2xs">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="font-mono text-[8px] uppercase tracking-wider text-[#121312]/40 sm:text-[9px]">
          {label}
        </p>

        <p className="truncate text-xs font-medium text-[#121312]">{value}</p>
      </div>
    </motion.div>
  );
}

export function SubmitFooter() {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col gap-3 border-t border-[#121312]/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
      <p className="font-mono text-[8px] uppercase tracking-wider text-[#121312]/40 sm:text-[9px]">
        Data is encrypted and restricted to authorized requests
      </p>

      <button
        type="submit"
        disabled={pending}
        className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#18392B] px-6 font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] shadow-xs transition hover:bg-[#122A20] active:scale-[0.98] disabled:opacity-70 sm:h-11"
      >
        {pending ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <span>Save Profile</span>
        )}
      </button>
    </div>
  );
}
