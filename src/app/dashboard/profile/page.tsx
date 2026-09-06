// src/app/dashboard/profile/page.tsx

import { createClient } from "@/lib/supabase/server";
import {
  CalendarDays,
  CheckCircle2,
  Droplets,
  Mail,
  Phone,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { updateProfile } from "./actions";
import {
  MotionCard,
  MotionStat,
  ProfileClientContainer,
  SubmitFooter,
} from "./profile-client";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const name =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "";

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <ProfileClientContainer>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        {/* Identity Card */}
        <MotionCard className="flex flex-col justify-between rounded-3xl border border-[#121312]/10 bg-white/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md sm:p-8">
          <div>
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#18392B]/20 bg-[#F8F6F0] text-[#18392B] shadow-inner sm:h-24 sm:w-24">
                <UserRound size={36} strokeWidth={1.5} className="sm:hidden" />
                <UserRound
                  size={42}
                  strokeWidth={1.5}
                  className="hidden sm:block"
                />
                <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#18392B]" />
              </div>

              <h1 className="mt-4 font-serif text-xl font-normal text-[#121312] sm:text-2xl">
                {name}
              </h1>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="rounded-full border border-[#18392B]/15 bg-[#18392B]/5 px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-[#18392B]">
                  Verified Account
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3.5 border-t border-[#121312]/10 pt-6 sm:mt-8 sm:space-y-4">
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

          <div className="mt-8 rounded-2xl border border-[#121312]/5 bg-[#F8F6F0]/60 p-3.5 text-center">
            <p className="font-mono text-[8px] uppercase tracking-wider text-[#121312]/50">
              MediPass Vault Status
            </p>
            <div className="mt-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#18392B]">
              <CheckCircle2 size={13} />
              <span>Sovereign Zero-Knowledge Active</span>
            </div>
          </div>
        </MotionCard>

        {/* Personal Information Form */}
        <MotionCard className="rounded-3xl border border-[#121312]/10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="border-b border-[#121312]/10 px-5 py-4.5 sm:px-8 sm:py-5">
            <h2 className="font-serif text-base font-normal text-[#121312] sm:text-lg">
              Personal Information
            </h2>

            <p className="font-mono text-[8px] uppercase tracking-wider text-[#121312]/40 sm:text-[9px]">
              Primary identification data for medical emergencies
            </p>
          </div>

          <form action={updateProfile}>
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:gap-5 sm:p-8">
              <FormField
                label="Full Name"
                name="full_name"
                defaultValue={profile?.full_name || name}
                placeholder="Your full name"
              />

              <div>
                <label className="mb-1.5 block font-mono text-[8px] font-semibold uppercase tracking-wider text-[#121312]/50 sm:text-[9px]">
                  Email Address
                </label>

                <div className="flex h-10 items-center gap-2 rounded-xl border border-[#121312]/10 bg-[#F8F6F0]/60 px-3.5 sm:h-11">
                  <Mail size={14} className="shrink-0 text-[#121312]/30" />

                  <span className="truncate text-xs font-medium text-[#121312]/60">
                    {user.email}
                  </span>
                </div>

                <p className="mt-1 font-mono text-[8px] text-[#121312]/40 sm:text-[9px]">
                  Managed via authentication settings
                </p>
              </div>

              <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                defaultValue={profile?.phone || ""}
                placeholder="+91 98765 43210"
              />

              <FormField
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                defaultValue={profile?.date_of_birth || ""}
              />

              <div className="sm:col-span-2">
                <label className="mb-1.5 block font-mono text-[8px] font-semibold uppercase tracking-wider text-[#121312]/50 sm:text-[9px]">
                  Blood Group
                </label>

                <select
                  name="blood_group"
                  defaultValue={profile?.blood_group || ""}
                  className="h-10 w-full rounded-xl border border-[#121312]/10 bg-white px-3.5 text-xs text-[#121312] outline-none transition focus:border-[#18392B] focus:ring-1 focus:ring-[#18392B] sm:h-11"
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
            <div className="border-t border-[#121312]/10 px-5 py-5 sm:px-8 sm:py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F6F0] text-[#18392B] shadow-xs">
                  <ShieldAlert size={18} />
                </div>

                <div>
                  <h3 className="font-serif text-sm font-normal text-[#121312] sm:text-base">
                    Emergency Contact
                  </h3>

                  <p className="font-mono text-[8px] uppercase tracking-wider text-[#121312]/40 sm:text-[9px]">
                    Primary contact for medical field responders
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5">
                <FormField
                  label="Contact Name"
                  name="emergency_contact_name"
                  defaultValue={profile?.emergency_contact_name || ""}
                  placeholder="Full name"
                />

                <FormField
                  label="Contact Phone"
                  name="emergency_contact_phone"
                  type="tel"
                  defaultValue={profile?.emergency_contact_phone || ""}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <SubmitFooter />
          </form>
        </MotionCard>
      </div>
    </ProfileClientContainer>
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
        className="mb-1.5 block font-mono text-[8px] font-semibold uppercase tracking-wider text-[#121312]/50 sm:text-[9px]"
      >
        {label}
      </label>

      <div className="relative">
        {type === "tel" && (
          <Phone
            size={14}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#121312]/30"
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={`h-10 w-full rounded-xl border border-[#121312]/10 bg-white pr-3.5 text-xs text-[#121312] outline-none transition placeholder:text-[#121312]/30 focus:border-[#18392B] focus:ring-1 focus:ring-[#18392B] sm:h-11 ${
            type === "tel" ? "pl-10" : "pl-3.5"
          }`}
        />
      </div>
    </div>
  );
}
