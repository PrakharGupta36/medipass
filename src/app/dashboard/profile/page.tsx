import { createClient } from "@/lib/supabase/server";
import {
  CalendarDays,
  Droplets,
  Mail,
  Phone,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { updateProfile } from "./actions";

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
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div>
      {/* Mobile heading */}
      <div className="mb-7 lg:hidden">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#62C58C]">
          Account
        </p>

        <h1 className="mt-1 text-2xl font-semibold">Your profile</h1>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
        {/* Identity */}
        <section className="rounded-[26px] border border-white/[0.07] bg-[#111712] p-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#62C58C]/20 bg-[#1F7A4F]/10 text-[#62C58C]">
              <UserRound size={38} strokeWidth={1.5} />
            </div>

            <h2 className="mt-5 text-xl font-semibold">{name}</h2>

            <p className="mt-1 text-xs text-white/25">MediPass member</p>
          </div>

          <div className="mt-8 border-t border-white/[0.06] pt-6">
            <ProfileStat
              icon={<Mail size={16} />}
              label="Email"
              value={user.email || "Not added"}
            />

            <ProfileStat
              icon={<CalendarDays size={16} />}
              label="Member since"
              value={memberSince}
            />

            <ProfileStat
              icon={<Droplets size={16} />}
              label="Blood group"
              value={profile?.blood_group || "Not added"}
            />
          </div>
        </section>

        {/* Personal information */}
        <section className="rounded-[26px] border border-white/[0.07] bg-[#111712]">
          <div className="border-b border-white/[0.06] px-6 py-5">
            <p className="text-sm font-semibold">Personal information</p>

            <p className="mt-1 text-[10px] text-white/25">
              Information used for your medical passport.
            </p>
          </div>

          <form action={updateProfile}>
            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <FormField
                label="Full name"
                name="full_name"
                defaultValue={profile?.full_name || name}
                placeholder="Your full name"
              />

              <div>
                <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.1em] text-white/25">
                  Email address
                </label>

                <div className="flex h-11 items-center gap-2 rounded-xl border border-white/[0.07] bg-[#0C110E] px-3.5">
                  <Mail size={14} className="shrink-0 text-white/25" />

                  <span className="truncate text-xs text-white/45">
                    {user.email}
                  </span>
                </div>

                <p className="mt-1.5 text-[9px] text-white/20">
                  Email is managed by your account.
                </p>
              </div>

              <FormField
                label="Phone number"
                name="phone"
                type="tel"
                defaultValue={profile?.phone || ""}
                placeholder="e.g. +91 98765 43210"
              />

              <FormField
                label="Date of birth"
                name="date_of_birth"
                type="date"
                defaultValue={profile?.date_of_birth || ""}
              />

              <div className="sm:col-span-2">
                <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.1em] text-white/25">
                  Blood group
                </label>

                <select
                  name="blood_group"
                  defaultValue={profile?.blood_group || ""}
                  className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#0C110E] px-3.5 text-xs text-white/60 outline-none transition focus:border-[#62C58C]/30 focus:ring-2 focus:ring-[#62C58C]/10"
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

            {/* Emergency */}
            <div className="border-t border-white/[0.06] px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D7A73A]/10 text-[#D7A73A]">
                  <ShieldAlert size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold">Emergency contact</p>

                  <p className="mt-1 text-[10px] leading-5 text-white/25">
                    Someone a doctor can contact in an emergency.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Contact name"
                  name="emergency_contact_name"
                  defaultValue={profile?.emergency_contact_name || ""}
                  placeholder="Emergency contact"
                />

                <FormField
                  label="Contact phone"
                  name="emergency_contact_phone"
                  type="tel"
                  defaultValue={profile?.emergency_contact_phone || ""}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/[0.06] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] leading-5 text-white/20">
                Your information is stored in your private medical profile.
              </p>

              <button
                type="submit"
                className="h-10 rounded-xl bg-[#246B45] px-5 text-xs font-semibold text-white transition hover:bg-[#2C7D53]"
              >
                Save profile
              </button>
            </div>
          </form>
        </section>
      </div>
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
        className="mb-2 block text-[10px] font-medium uppercase tracking-[0.1em] text-white/25"
      >
        {label}
      </label>

      <div className="relative">
        {type === "tel" && (
          <Phone
            size={14}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={`h-11 w-full rounded-xl border border-white/[0.07] bg-[#0C110E] pr-3.5 text-xs text-white/70 outline-none transition placeholder:text-white/15 focus:border-[#62C58C]/30 focus:ring-2 focus:ring-[#62C58C]/10 ${
            type === "tel" ? "pl-10" : "pl-3.5"
          }`}
        />
      </div>
    </div>
  );
}

function ProfileStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="mb-5 flex gap-3 last:mb-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.03] text-white/30">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-[0.12em] text-white/20">
          {label}
        </p>

        <p className="mt-1 truncate text-xs text-white/55">{value}</p>
      </div>
    </div>
  );
}
