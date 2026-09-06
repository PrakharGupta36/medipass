// src/app/dashboard/settings/settings-client.tsx

"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  ChevronRight,
  Loader2,
  Lock,
  LogOut,
  Mail,
  ShieldCheck,
  Trash2,
  UserRound,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  resendVerificationEmail,
  sendPasswordReset,
  updateNotifications,
} from "./actions";

// Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 24,
    },
  },
};

export default function SettingsClient({
  email,
  emailVerified,
  notificationsEnabled,
}: {
  email: string;
  emailVerified: boolean;
  notificationsEnabled: boolean;
}) {
  const [notifications, setNotifications] = useState(notificationsEnabled);
  const [savingNotifications, startNotificationTransition] = useTransition();
  const [sendingPasswordReset, startPasswordTransition] = useTransition();
  const [resendingVerification, startVerificationTransition] = useTransition();

  function handleNotificationChange() {
    const nextValue = !notifications;
    setNotifications(nextValue);

    startNotificationTransition(async () => {
      try {
        await updateNotifications(nextValue);

        toast.success(
          nextValue ? "Notifications enabled" : "Notifications disabled",
        );
      } catch (error) {
        setNotifications(!nextValue);

        toast.error("Could not update notifications", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  function handlePasswordReset() {
    startPasswordTransition(async () => {
      try {
        await sendPasswordReset();

        toast.success("Password reset email sent", {
          description: "Check your inbox for a secure password reset link.",
        });
      } catch (error) {
        toast.error("Could not send reset email", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  function handleVerification() {
    startVerificationTransition(async () => {
      try {
        await resendVerificationEmail();

        toast.success("Verification email sent", {
          description: "Check your inbox for the verification link.",
        });
      } catch (error) {
        toast.error("Could not send verification email", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full text-[#121312] space-y-6 sm:space-y-8"
    >
      {/* SETTINGS SECTIONS CONTAINER */}
      <div className="space-y-6 sm:space-y-8">
        {/* SECURITY & VERIFICATION */}
        <SettingsSection
          icon={<ShieldCheck size={18} />}
          title="Security & Verification"
          description="Protect access credentials and manage authorization."
        >
          <SettingsRow
            icon={<Mail size={16} />}
            title="Email Verification"
            description={
              emailVerified
                ? "Your email address has been successfully verified."
                : "Verify your email to ensure uninterrupted passport access."
            }
            right={
              emailVerified ? (
                <StatusBadge type="success">
                  <Check size={10} />
                  Verified
                </StatusBadge>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleVerification}
                  disabled={resendingVerification}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-xl border border-[#121312]/15 bg-[#F8F6F0] px-3 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#121312] shadow-2xs transition hover:border-[#121312] hover:bg-[#121312] hover:text-[#F8F6F0] disabled:cursor-wait disabled:opacity-50"
                >
                  {resendingVerification ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </motion.button>
              )
            }
          />

          <SettingsRow
            icon={<Lock size={16} />}
            title="Password Reset"
            description={
              sendingPasswordReset
                ? "Dispatching password reset instructions..."
                : "Send a secure recovery link to update your account password."
            }
            action
            onClick={handlePasswordReset}
            right={
              sendingPasswordReset ? (
                <Loader2 size={15} className="animate-spin text-[#18392B]" />
              ) : (
                <ChevronRight size={15} />
              )
            }
          />
        </SettingsSection>

        {/* PROFILE & SESSION */}
        <SettingsSection
          icon={<UserRound size={18} />}
          title="Profile & Session"
          description="Manage personal details and active passport sessions."
        >
          <SettingsRow
            icon={<UserRound size={16} />}
            title="Profile Settings"
            description="Edit full name, emergency contact details, and vital parameters."
            href="/dashboard/profile"
            right={<ChevronRight size={15} />}
          />

          <SettingsRow
            icon={<LogOut size={16} />}
            title="Sign Out"
            description="Terminate current session and sign out of this device."
            logout
            right={<ChevronRight size={15} />}
          />
        </SettingsSection>
      </div>

      {/* DANGER ZONE (Enhanced Double Border) */}
      <motion.section
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-b from-red-50/60 to-red-50/20 p-5 ring-1 ring-red-500/10 shadow-[0_4px_20px_-4px_rgba(239,68,68,0.05),0_0_0_1px_rgba(239,68,68,0.1)_inset] backdrop-blur-xs sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-200/80 bg-red-100/80 text-red-700 shadow-2xs">
            <Trash2 size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-red-600">
                Danger Zone
              </span>
              <span className="h-1 w-1 rounded-full bg-red-400" />
              <span className="font-mono text-[8px] uppercase tracking-wider text-red-500/80 sm:text-[9px]">
                Irreversible
              </span>
            </div>

            <h2 className="mt-1 font-serif text-lg font-normal text-[#121312] sm:text-xl">
              Delete Account
            </h2>

            <p className="mt-1 font-mono text-xs text-[#121312]/60 leading-relaxed">
              Permanently purge your MediPass medical vault, timeline logs, and
              sharing keys.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-red-200/60 pt-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-5">
          <motion.button
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-red-200/80 bg-white/80 px-4 font-mono text-[9px] font-semibold uppercase tracking-wider text-red-400 opacity-60 shadow-2xs cursor-not-allowed sm:w-auto"
          >
            <ShieldAlert size={12} />
            Delete Account
          </motion.button>

          <span className="font-mono text-[8px] uppercase tracking-widest text-[#121312]/40 sm:text-[9px]">
            Protected Workflow
          </span>
        </div>
      </motion.section>

      {/* FOOTER */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-3 border-t border-[#121312]/10 pt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-6"
      >
        <div>
          <p className="font-mono text-[8px] uppercase tracking-widest text-[#121312]/40 sm:text-[9px]">
            Active Account
          </p>

          <p className="font-mono text-xs font-medium text-[#121312]/70 sm:text-sm">
            {email}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#18392B]/15 bg-[#18392B]/5 px-3 py-1.5 self-start sm:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18392B] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#18392B]" />
          </span>

          <span className="font-mono text-[8px] uppercase tracking-wider text-[#18392B] sm:text-[9px]">
            Zero-Knowledge Encrypted
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ===============================================================
   SECTION
================================================================ */

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      variants={itemVariants}
      className="relative overflow-hidden rounded-3xl border border-[#121312]/10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.03),0_0_0_1px_rgba(18,19,18,0.02)_inset] backdrop-blur-md"
    >
      {/* Heading */}
      <div className="flex items-center gap-3.5 border-b border-[#121312]/10 bg-[#F8F6F0]/30 px-5 py-4 sm:px-8 sm:py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#18392B]/10 bg-[#F8F6F0] text-[#18392B] shadow-2xs">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-base font-normal text-[#121312] sm:text-lg">
            {title}
          </h2>

          <p className="truncate font-mono text-[8px] uppercase tracking-wider text-[#121312]/40 sm:text-[9px]">
            {description}
          </p>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#121312]/5">{children}</div>
    </motion.section>
  );
}

/* ===============================================================
   ROW
================================================================ */

function SettingsRow({
  icon,
  title,
  description,
  right,
  href,
  logout,
  action,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  right?: React.ReactNode;
  href?: string;
  logout?: boolean;
  action?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <div className="group relative flex min-h-[72px] w-full items-center gap-3.5 px-5 py-4 transition-all duration-200 hover:bg-[#F8F6F0]/50 sm:gap-4 sm:px-8">
      {/* Icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#121312]/5 bg-[#F8F6F0] text-[#121312]/50 shadow-2xs transition-all duration-200 group-hover:scale-105 group-hover:border-[#18392B]/20 group-hover:bg-[#18392B] group-hover:text-white">
        {icon}
      </div>

      {/* Title & Description */}
      <div className="min-w-0 flex-1 pr-1">
        <p className="text-xs font-semibold text-[#121312] transition-colors group-hover:text-[#18392B]">
          {title}
        </p>

        <p className="mt-0.5 max-w-2xl text-xs leading-relaxed text-[#121312]/60">
          {description}
        </p>
      </div>

      {/* Action Element */}
      {right && (
        <div className="flex shrink-0 items-center gap-2 text-[#121312]/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#121312]">
          {right}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:bg-[#F8F6F0]"
      >
        {content}
      </Link>
    );
  }

  if (logout) {
    return (
      <form action="/auth/logout" method="post">
        <button
          type="submit"
          className="block w-full text-left focus-visible:outline-none focus-visible:bg-[#F8F6F0]"
        >
          {content}
        </button>
      </form>
    );
  }

  if (action) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left focus-visible:outline-none focus-visible:bg-[#F8F6F0]"
      >
        {content}
      </button>
    );
  }

  return <div>{content}</div>;
}

/* ===============================================================
   STATUS BADGE
================================================================ */

function StatusBadge({
  children,
}: {
  children: React.ReactNode;
  type: "success";
}) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-xl border border-[#18392B]/20 bg-[#18392B]/10 px-2.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#18392B] shadow-2xs">
      {children}
    </span>
  );
}
