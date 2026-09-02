"use client";

import { useState } from "react";
import {
  Bell,
  ChevronRight,
  Lock,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div>
      <div className="mb-7 lg:hidden">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#62C58C]">
          Account
        </p>

        <h1 className="mt-1 text-2xl font-semibold">Settings</h1>
      </div>

      <div className="max-w-3xl space-y-5">
        {/* Security */}
        <SettingsSection
          icon={<ShieldCheck size={18} />}
          title="Security"
          description="Manage how your MediPass account is protected."
        >
          <SettingsRow
            icon={<Lock size={16} />}
            title="Email verification"
            description="Recommended for protecting sensitive actions."
            right={
              <span className="rounded-full border border-[#D7A73A]/20 bg-[#D7A73A]/10 px-2.5 py-1 text-[9px] font-semibold text-[#D7A73A]">
                Not verified
              </span>
            }
          />

          <SettingsRow
            icon={<Lock size={16} />}
            title="Password"
            description="Change your account password."
            right={<ChevronRight size={16} />}
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection
          icon={<Bell size={18} />}
          title="Notifications"
          description="Choose which notifications you receive."
        >
          <SettingsRow
            icon={<Bell size={16} />}
            title="Account notifications"
            description="Important updates about your MediPass account."
            right={
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`relative h-6 w-11 rounded-full transition ${
                  notifications ? "bg-[#246B45]" : "bg-white/[0.1]"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    notifications ? "left-6" : "left-1"
                  }`}
                />
              </button>
            }
          />
        </SettingsSection>

        {/* Account */}
        <SettingsSection
          icon={<UserRound size={18} />}
          title="Account"
          description="Manage your MediPass account."
        >
          <SettingsRow
            icon={<UserRound size={16} />}
            title="Profile"
            description="Update your personal information."
            href="/dashboard/profile"
          />

          <SettingsRow
            icon={<LogOut size={16} />}
            title="Sign out"
            description="Sign out of your MediPass account."
            logout
          />
        </SettingsSection>

        {/* Danger */}
        <section className="rounded-[26px] border border-red-500/10 bg-red-500/[0.025] p-6">
          <p className="text-sm font-semibold text-red-300/80">Danger zone</p>

          <p className="mt-1 text-xs leading-5 text-white/25">
            Permanently delete your MediPass account and associated information.
          </p>

          <button className="mt-5 h-10 rounded-xl border border-red-400/15 px-4 text-xs font-semibold text-red-300/60 transition hover:bg-red-500/5 hover:text-red-300">
            Delete account
          </button>
        </section>
      </div>
    </div>
  );
}

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
    <section className="rounded-[26px] border border-white/[0.07] bg-[#111712]">
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1F7A4F]/10 text-[#62C58C]">
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold">{title}</p>

          <p className="mt-0.5 text-[10px] text-white/25">{description}</p>
        </div>
      </div>

      <div className="divide-y divide-white/[0.05]">{children}</div>
    </section>
  );
}

function SettingsRow({
  icon,
  title,
  description,
  right,
  href,
  logout,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  right?: React.ReactNode;
  href?: string;
  logout?: boolean;
}) {
  const content = (
    <div className="flex items-center gap-4 px-6 py-5 transition hover:bg-white/[0.015]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.025] text-white/30">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-white/65">{title}</p>

        <p className="mt-1 text-[10px] leading-5 text-white/25">
          {description}
        </p>
      </div>

      {right && <div className="shrink-0 text-white/25">{right}</div>}
    </div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  if (logout) {
    return (
      <form action="/auth/logout" method="post">
        <button type="submit" className="w-full text-left">
          {content}
        </button>
      </form>
    );
  }

  return content;
}
