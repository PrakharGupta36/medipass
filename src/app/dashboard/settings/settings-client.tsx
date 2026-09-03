"use client";

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
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  resendVerificationEmail,
  sendPasswordReset,
  updateNotifications,
} from "./actions";

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
    <div className="w-full">
      {/* =========================================================
          INTRO
      ========================================================== */}

      {/* <div className="mb-7 sm:mb-9">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#62C58C] shadow-[0_0_8px_rgba(98,197,140,0.45)]" />

          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#62C58C]/65">
            Account settings
          </p>
        </div>

        <div className="mt-3 flex items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
              Settings
            </h1>

            <p className="mt-2 max-w-lg text-xs leading-5 text-white/30 sm:text-sm">
              Manage your account, security and MediPass preferences.
            </p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/15">
              MEDIPASS
            </span>

            <span className="h-px w-6 bg-white/[0.08]" />

            <span className="font-mono text-[8px] text-white/15">01</span>
          </div>
        </div>
      </div> */}

      {/* =========================================================
          SETTINGS
      ========================================================== */}

      <div className="space-y-5">
        <SettingsSection
          
          icon={<ShieldCheck size={17} strokeWidth={1.7} />}
          title="Security"
          description="Protect access to your medical information."
        >
          <SettingsRow
            icon={<Mail size={16} strokeWidth={1.7} />}
            title="Email verification"
            description={
              emailVerified
                ? "Your email address is verified."
                : "Verify your email to help protect your account."
            }
            right={
              emailVerified ? (
                <StatusBadge type="success">
                  <Check size={10} />
                  Verified
                </StatusBadge>
              ) : (
                <button
                  type="button"
                  onClick={handleVerification}
                  disabled={resendingVerification}
                  data-cuelume-hover="tick"
                  data-cuelume-press
                  data-cuelume-release
                  className="
                    inline-flex h-8 items-center justify-center gap-1.5
                    rounded-lg
                    border border-[#D7A73A]/20
                    bg-[#D7A73A]/[0.07]
                    px-3
                    font-mono text-[8px] font-medium uppercase
                    tracking-[0.08em]
                    text-[#D7A73A]
                    transition-all
                    hover:border-[#D7A73A]/30
                    hover:bg-[#D7A73A]/[0.11]
                    disabled:cursor-wait
                    disabled:opacity-50
                  "
                >
                  {resendingVerification ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </button>
              )
            }
          />

          <SettingsRow
            icon={<Lock size={16} strokeWidth={1.7} />}
            title="Password"
            description={
              sendingPasswordReset
                ? "Sending a secure password reset link..."
                : "Send a secure link to change your password."
            }
            action
            onClick={handlePasswordReset}
            right={
              sendingPasswordReset ? (
                <Loader2 size={15} className="animate-spin text-[#62C58C]" />
              ) : (
                <ChevronRight size={15} />
              )
            }
          />
        </SettingsSection>

        <SettingsSection
          
          icon={<Bell size={17} strokeWidth={1.7} />}
          title="Notifications"
          description="Control how MediPass keeps you informed."
        >
          <SettingsRow
            icon={<Bell size={16} strokeWidth={1.7} />}
            title="Account notifications"
            description={
              notifications
                ? "Important updates about your MediPass account are enabled."
                : "Account notifications are currently turned off."
            }
            right={
              <button
                type="button"
                disabled={savingNotifications}
                aria-label="Toggle account notifications"
                aria-pressed={notifications}
                onClick={handleNotificationChange}
                data-cuelume-toggle
                className={`
                  relative
                  h-7
                  w-12
                  shrink-0
                  rounded-full
                  border
                  p-0.5
                  transition-all
                  duration-200
                  ${
                    notifications
                      ? "border-[#62C58C]/30 bg-[#246B45] shadow-[0_0_16px_rgba(36,107,69,0.18)]"
                      : "border-white/[0.09] bg-white/[0.06]"
                  }
                  disabled:cursor-wait
                  disabled:opacity-60
                `}
              >
                <span
                  className={`
                    absolute
                    top-1/2
                    h-5
                    w-5
                    -translate-y-1/2
                    rounded-full
                    bg-[#F4F7F4]
                    shadow-[0_2px_6px_rgba(0,0,0,0.3)]
                    transition-all
                    duration-200
                    ${notifications ? "left-[25px]" : "left-1"}
                  `}
                />
              </button>
            }
          />
        </SettingsSection>

        <SettingsSection
         
          icon={<UserRound size={17} strokeWidth={1.7} />}
          title="Account"
          description="Manage your personal MediPass information."
        >
          <SettingsRow
            icon={<UserRound size={16} strokeWidth={1.7} />}
            title="Profile"
            description="Update your name, contact details and emergency information."
            href="/dashboard/profile"
            right={<ChevronRight size={15} />}
          />

          <SettingsRow
            icon={<LogOut size={16} strokeWidth={1.7} />}
            title="Sign out"
            description="Sign out of your current MediPass session."
            logout
            right={<ChevronRight size={15} />}
          />
        </SettingsSection>
      </div>

      {/* =========================================================
          DANGER
      ========================================================== */}

      <section
        className="
          relative
          mt-8
          overflow-hidden
          rounded-2xl
          border border-red-400/[0.10]
          bg-red-950/[0.08]
        "
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/[0.025] to-transparent" />

        <div className="relative p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div
              className="
                flex h-10 w-10
                shrink-0
                items-center justify-center
                rounded-xl
                border border-red-400/10
                bg-red-500/[0.05]
                text-red-300/60
              "
            >
              <Trash2 size={16} strokeWidth={1.6} />
            </div>

            <div className="min-w-0">
              <p className="font-mono text-[8px] font-medium uppercase tracking-[0.18em] text-red-300/45">
                Danger zone
              </p>

              <h2 className="mt-2 text-sm font-medium text-white/70">
                Delete account
              </h2>

              <p className="mt-1 max-w-xl text-[10px] leading-5 text-white/25">
                Permanently remove your MediPass account and associated medical
                information.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="
              mt-5
              h-9
              rounded-lg
              border border-red-400/10
              bg-red-500/[0.025]
              px-3
              font-mono text-[8px]
              font-medium uppercase
              tracking-[0.1em]
              text-red-300/30
            "
          >
            Delete account
          </button>

          <p className="mt-3 font-mono text-[7px] uppercase tracking-[0.08em] text-white/10">
            Secure deletion workflow required
          </p>
        </div>
      </section>

      {/* =========================================================
          ACCOUNT FOOTER
      ========================================================== */}

      <div className="mt-8 flex items-center justify-between border-t border-white/[0.05] pt-4">
        <div>
          <p className="font-mono text-[7px] uppercase tracking-[0.15em] text-white/10">
            Signed in as
          </p>

          <p className="mt-1 text-[10px] text-white/25">{email}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#62C58C]/60" />

          <span className="font-mono text-[7px] uppercase tracking-[0.12em] text-white/10">
            Secure
          </span>
        </div>
      </div>
    </div>
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
    <section
      className="
        overflow-hidden
        rounded-[22px]
        border border-white/[0.07]
        bg-[#111712]/80
        shadow-[0_14px_40px_rgba(0,0,0,0.16)]
        backdrop-blur-xl
      "
    >
      {/* Section heading */}
      <div className="flex items-center gap-4 border-b border-white/[0.06] px-5 py-4 sm:px-6">
        {/* <span className="font-mono text-[8px] tracking-[0.12em] text-white/15">
          {number}
        </span> */}

        <div
          className="
            flex h-8 w-8
            shrink-0
            items-center justify-center
            rounded-[10px]
            border border-[#62C58C]/15
            bg-[#1F7A4F]/[0.08]
            text-[#62C58C]
          "
        >
          {icon}
        </div>

        <div className="min-w-0">
          <h2 className="text-xs font-semibold text-white/75">{title}</h2>

          <p className="mt-0.5 truncate text-[9px] text-white/22">
            {description}
          </p>
        </div>
      </div>

      {/* Rows */}
      <div>{children}</div>
    </section>
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
    <div
      className="
        group
        flex
        min-h-[78px]
        w-full
        items-center
        gap-3.5
        px-5
        py-4
        transition-all
        duration-200
        hover:bg-white/[0.025]
        sm:px-6
      "
    >
      {/* Icon */}
      <div
        className="
          flex h-9 w-9
          shrink-0
          items-center justify-center
          rounded-[10px]
          border border-white/[0.06]
          bg-white/[0.02]
          text-white/25
          shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]
          transition-all
          duration-200
          group-hover:border-[#62C58C]/15
          group-hover:bg-[#1F7A4F]/[0.06]
          group-hover:text-[#62C58C]
        "
      >
        {icon}
      </div>

      {/* Copy */}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-white/65 transition group-hover:text-white/80">
          {title}
        </p>

        <p className="mt-1 max-w-2xl text-[9px] leading-4 text-white/22">
          {description}
        </p>
      </div>

      {/* Action */}
      {right && (
        <div className="flex shrink-0 items-center gap-2 text-white/20 transition group-hover:text-white/35">
          {right}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        data-cuelume-hover="tick"
        data-cuelume-press
        data-cuelume-release
        className="
          block
          border-b border-white/[0.05]
          last:border-b-0
        "
      >
        {content}
      </Link>
    );
  }

  if (logout) {
    return (
      <form
        action="/auth/logout"
        method="post"
        data-cuelume-press
        data-cuelume-release
        className="border-b border-white/[0.05] last:border-b-0"
      >
        <button type="submit" className="block w-full text-left">
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
        data-cuelume-hover="tick"
        data-cuelume-press
        data-cuelume-release
        className="
          block
          w-full
          border-b
          border-white/[0.05]
          text-left
          last:border-b-0
        "
      >
        {content}
      </button>
    );
  }

  return (
    <div className="border-b border-white/[0.05] last:border-b-0">
      {content}
    </div>
  );
}

/* ===============================================================
   STATUS BADGE
================================================================ */

function StatusBadge({
  children,
  type,
}: {
  children: React.ReactNode;
  type: "success";
}) {
  return (
    <span
      className="
        inline-flex
        h-7
        items-center
        gap-1.5
        rounded-lg
        border border-[#62C58C]/15
        bg-[#62C58C]/[0.05]
        px-2.5
        font-mono
        text-[8px]
        uppercase
        tracking-[0.08em]
        text-[#62C58C]
      "
    >
      {children}
    </span>
  );
}
