import { createClient } from "@/lib/supabase/server";
import { CalendarDays, Mail, Phone, UserRound } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";

  return (
    <div>
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
              value={user?.email || "Not added"}
            />

            <ProfileStat
              icon={<CalendarDays size={16} />}
              label="Member since"
              value="Today"
            />
          </div>
        </section>

        {/* Personal details */}
        <section className="rounded-[26px] border border-white/[0.07] bg-[#111712]">
          <div className="border-b border-white/[0.06] px-6 py-5">
            <p className="text-sm font-semibold">Personal information</p>

            <p className="mt-1 text-[10px] text-white/25">
              Information used for your medical passport.
            </p>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <ProfileField label="Full name" value={name} />

            <ProfileField label="Email address" value={user?.email || ""} />

            <ProfileField
              label="Phone number"
              value="Not added"
              icon={<Phone size={14} />}
            />

            <ProfileField label="Date of birth" value="Not added" />
          </div>

          <div className="border-t border-white/[0.06] px-6 py-5">
            <button className="h-10 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-xs font-semibold text-white/55 transition hover:bg-white/[0.05] hover:text-white">
              Edit profile
            </button>
          </div>
        </section>
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

function ProfileField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.1em] text-white/25">
        {label}
      </label>

      <div className="flex h-11 items-center gap-2 rounded-xl border border-white/[0.07] bg-[#0C110E] px-3.5">
        {icon && <span className="text-white/25">{icon}</span>}

        <span className="truncate text-xs text-white/55">{value}</span>
      </div>
    </div>
  );
}
