// src/app/dashboard/profile/profile-client.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Droplets,
  Loader2,
  Mail,
  Phone,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

type Profile = {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  blood_group?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
};

type User = {
  id: string;
  email?: string;
  user_metadata?: { full_name?: string };
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 400, damping: 28 },
  },
};

export function ProfileClient({
  initialProfile,
  user,
  memberSince,
  updateProfileAction,
}: {
  initialProfile: Profile | null;
  user: User;
  memberSince: string;
  updateProfileAction: (formData: FormData) => Promise<void>;
}) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime:profile:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setProfile(null);
          } else {
            setProfile(payload.new as Profile);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id, supabase]);

  const name =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex min-h-[calc(100vh-6rem)] w-full flex-col text-[#121312]"
    >
      <div className="grid flex-1 gap-6 xl:grid-cols-[0.85fr_1.15fr] xl:items-stretch">
        {/* Identity Card */}
        <MotionCard className="flex h-full flex-col justify-between">
          <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/90 text-[#18392B] shadow-[0_6px_16px_rgba(0,0,0,0.08),0_2px_0_rgba(255,255,255,1)_inset,0_-2px_4px_rgba(0,0,0,0.05)_inset] sm:h-24 sm:w-24">
                <UserRound size={32} strokeWidth={1.5} className="sm:hidden" />
                <UserRound
                  size={40}
                  strokeWidth={1.5}
                  className="hidden sm:block"
                />
                <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#18392B] shadow-sm" />
              </div>

              <h1 className="mt-4 font-serif text-xl font-normal text-[#121312] sm:text-2xl drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                {name}
              </h1>

              <div className="mt-2 flex items-center gap-1.5">
                <span className="rounded-full border border-[#18392B]/20 bg-gradient-to-b from-[#F5F2EA] to-[#E3DDD0] px-3 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-[#18392B] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.9)_inset]">
                  Verified Account
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4 border-t border-[#121312]/10 pt-6 shadow-[0_1px_0_rgba(255,255,255,0.9)] sm:space-y-5">
              <MotionStat
                icon={<Mail size={15} />}
                label="Email Address"
                value={user.email || "Not added"}
              />

              <MotionStat
                icon={<CalendarDays size={15} />}
                label="Member Since"
                value={memberSince}
              />

              <MotionStat
                icon={<Droplets size={15} />}
                label="Blood Group"
                value={profile?.blood_group || "Not added"}
              />
            </div>

           
          </div>
        </MotionCard>

        {/* Personal Information Form */}
        <MotionCard className="flex h-full flex-col justify-between">
          <div className="border-b border-[#121312]/10 bg-gradient-to-b from-black/[0.01] to-black/[0.03] px-6 py-5 rounded-t-[22px] sm:px-8">
            <h2 className="font-serif text-lg font-normal text-[#121312] drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
              Personal Information
            </h2>

            <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#121312]/50 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
              Primary identification data for medical emergencies
            </p>
          </div>

          <form
            action={updateProfileAction}
            className="flex flex-1 flex-col justify-between"
          >
            <div className="flex-1 space-y-6 p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  key={`full_name_${profile?.full_name}`}
                  label="Full Name"
                  name="full_name"
                  defaultValue={profile?.full_name || name}
                  placeholder="Your full name"
                />

                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-[#121312]/60 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                    Email Address
                  </label>

                  <div className="flex h-10 items-center gap-2 rounded-xl border border-black/10 bg-[#EFECE4] px-3.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.8)]">
                    <Mail size={14} className="shrink-0 text-[#121312]/40" />

                    <span className="truncate text-xs font-semibold text-[#121312]/70">
                      {user.email}
                    </span>
                  </div>

                  <p className="mt-1 font-mono text-[10px] text-[#121312]/40">
                    Managed via authentication settings
                  </p>
                </div>

                <FormField
                  key={`phone_${profile?.phone}`}
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  defaultValue={profile?.phone || ""}
                  placeholder="+91 98765 43210"
                />

                <FormField
                  key={`dob_${profile?.date_of_birth}`}
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  defaultValue={profile?.date_of_birth || ""}
                />

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-[#121312]/60 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                    Blood Group
                  </label>

                  <select
                    key={`blood_${profile?.blood_group}`}
                    name="blood_group"
                    defaultValue={profile?.blood_group || ""}
                    className="h-10 w-full rounded-xl border border-black/10 bg-[#FAF9F5] px-3.5 text-xs font-medium text-[#121312] outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.8)] transition focus:border-[#18392B] focus:ring-1 focus:ring-[#18392B]"
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A−</option>
                    <option value="B+">B+</option>
                    <option value="B-">B−</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB−</option>
                    <option value="O+">O+</option>
                    <option value="O-">O−</option>
                  </select>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border-t border-[#121312]/10 pt-6 shadow-[0_1px_0_rgba(255,255,255,0.9)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-gradient-to-b from-[#F9F7F2] to-[#E5E0D5] text-[#18392B] shadow-[0_2px_4px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.9)_inset]">
                    <ShieldAlert size={16} />
                  </div>

                  <div>
                    <h3 className="font-serif text-base font-normal text-[#121312] drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                      Emergency Contact
                    </h3>

                    <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#121312]/50 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                      Primary contact for medical field responders
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <FormField
                    key={`ec_name_${profile?.emergency_contact_name}`}
                    label="Contact Name"
                    name="emergency_contact_name"
                    defaultValue={profile?.emergency_contact_name || ""}
                    placeholder="Full name"
                  />

                  <FormField
                    key={`ec_phone_${profile?.emergency_contact_phone}`}
                    label="Contact Phone"
                    name="emergency_contact_phone"
                    type="tel"
                    defaultValue={profile?.emergency_contact_phone || ""}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <SubmitFooter />
          </form>
        </MotionCard>
      </div>
    </motion.div>
  );
}

function MotionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={cardVariants}
      className={`relative rounded-3xl border border-white/60 bg-gradient-to-b from-[#FAF8F5] via-[#F4F1EA] to-[#EAE6DD] p-1 shadow-[0_12px_28px_-6px_rgba(18,19,18,0.12),0_2px_6px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] ${className}`}
    >
      <div className="h-full w-full rounded-[22px] border border-[#121312]/10 bg-[#FBF9F5]/70 backdrop-blur-md">
        {children}
      </div>
    </motion.section>
  );
}

function MotionStat({
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
      whileHover={{ x: 2 }}
      className="flex items-center gap-3 transition-transform"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-gradient-to-b from-[#F9F7F2] to-[#E5E0D5] text-[#18392B] shadow-[0_2px_4px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.9)_inset]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#121312]/50 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
          {label}
        </p>
        <p className="truncate text-xs font-bold text-[#121312]">{value}</p>
      </div>
    </motion.div>
  );
}

function SubmitFooter() {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col gap-3.5 border-t border-[#121312]/10 bg-gradient-to-b from-black/[0.01] to-black/[0.03] px-6 py-4 rounded-b-[22px] sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#121312]/50 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
        Data is encrypted and restricted to authorized requests
      </p>

      <button
        type="submit"
        disabled={pending}
        className="relative flex h-10 items-center justify-center gap-2 rounded-xl border border-[#0F261C] bg-gradient-to-b from-[#23503C] via-[#18392B] to-[#10271D] px-6 font-mono text-xs font-bold uppercase tracking-wider text-[#F8F6F0] shadow-[0_4px_10px_rgba(24,57,43,0.35),0_1px_0_rgba(255,255,255,0.25)_inset,0_-1px_2px_rgba(0,0,0,0.4)_inset] transition hover:brightness-110 active:scale-[0.98] active:shadow-[0_1px_2px_rgba(0,0,0,0.4)_inset] disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            <span className="text-sm">Saving...</span>
          </>
        ) : (
          <span className="text-sm">Save Profile</span>
        )}
      </button>
    </div>
  );
}

function FormField({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-[#121312]/60 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]"
      >
        {label}
      </label>

      <div className="relative">
        {type === "tel" && (
          <Phone
            size={14}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#121312]/40"
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={`h-10 w-full rounded-xl border border-black/10 bg-[#FAF9F5] pr-3.5 text-xs font-medium text-[#121312] outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.8)] transition placeholder:text-[#121312]/30 focus:border-[#18392B] focus:ring-1 focus:ring-[#18392B] ${
            type === "tel" ? "pl-10" : "pl-3.5"
          }`}
        />
      </div>
    </div>
  );
}
