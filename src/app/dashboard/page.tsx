// Move to: src/app/dashboard/page.tsx

import EmailVerificationBanner from "@/components/dashboard/email-verification-banner";
import { createClient } from "@/lib/supabase/server";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  FileText,
  HeartPulse,
  Pill,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [
    { data: profile },
    { count: allergyCount },
    { count: conditionCount },
    { count: medicationCount },
    { count: reportCount },
    { data: events },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("allergies").select("id", { count: "exact", head: true }),
    supabase.from("conditions").select("id", { count: "exact", head: true }),
    supabase
      .from("medications")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("medical_reports")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("medical_events")
      .select("id,title,description,event_type,event_date")
      .order("event_date", { ascending: false })
      .limit(4),
  ]);

  const name =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "there";
  const totalRecords =
    (allergyCount || 0) +
    (conditionCount || 0) +
    (medicationCount || 0) +
    (reportCount || 0);

  return (
    <>
      {user.email && !user.email_confirmed_at && (
        <EmailVerificationBanner email={user.email} />
      )}

      <div className="mb-7 lg:hidden">
        <p className="text-sm text-white/30">Welcome back,</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
          {name}
        </h1>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <section className="rounded-[26px] border border-white/[0.07] bg-[#111712] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">
                Medical passport
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                {name}
              </h2>
              <p className="mt-1 text-xs text-white/30">{user.email}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1F7A4F]/15 text-[#62C58C]">
              <HeartPulse size={20} />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat
              label="Blood group"
              value={profile?.blood_group || "Not added"}
            />
            <Stat label="Allergies" value={String(allergyCount || 0)} />
            <Stat label="Medications" value={String(medicationCount || 0)} />
            <Stat label="Records" value={String(totalRecords)} />
          </div>

          <Link
            href="/dashboard/health"
            className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#62C58C]"
          >
            Complete health profile <ArrowRight size={14} />
          </Link>
        </section>

        <section className="rounded-[26px] border border-white/[0.07] bg-[#111712] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">
                Health overview
              </p>
              <h2 className="mt-2 text-base font-semibold">Your records</h2>
            </div>
            <Activity size={18} className="text-[#62C58C]" />
          </div>

          <div className="mt-6 space-y-2">
            <MiniStat
              icon={<AlertTriangle size={15} />}
              label="Allergies"
              value={allergyCount || 0}
            />
            <MiniStat
              icon={<HeartPulse size={15} />}
              label="Conditions"
              value={conditionCount || 0}
            />
            <MiniStat
              icon={<Pill size={15} />}
              label="Active medications"
              value={medicationCount || 0}
            />
            <MiniStat
              icon={<FileText size={15} />}
              label="Medical reports"
              value={reportCount || 0}
            />
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
        <section className="rounded-[26px] border border-white/[0.07] bg-[#111712] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">
                Activity
              </p>
              <h2 className="mt-2 text-base font-semibold">
                Recent medical activity
              </h2>
            </div>
            <Link
              href="/dashboard/timeline"
              className="text-xs text-white/30 hover:text-white"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {events?.length ? (
              events.map((event) => (
                <div key={event.id} className="flex gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1F7A4F]/10 text-[#62C58C]">
                    <CalendarDays size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white/65">
                      {event.title}
                    </p>
                    <p className="mt-1 text-[10px] text-white/25">
                      {event.description || event.event_type} ·{" "}
                      {event.event_date}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-white/[0.07] p-6 text-center">
                <p className="text-xs text-white/40">
                  No medical activity yet.
                </p>
                <Link
                  href="/dashboard/health"
                  className="mt-2 inline-block text-[10px] text-[#62C58C]"
                >
                  Add your first record
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[26px] border border-[#62C58C]/10 bg-[#102018] p-6">
          <QrCode size={20} className="text-[#62C58C]" />
          <h2 className="mt-4 text-base font-semibold">Share your passport</h2>
          <p className="mt-2 text-xs leading-5 text-white/30">
            Give a doctor temporary access to the information you choose.
          </p>
          <Link
            href="/dashboard/share"
            className="mt-6 flex h-10 items-center justify-center gap-2 rounded-xl bg-[#246B45] text-xs font-semibold"
          >
            Create secure share <ArrowRight size={14} />
          </Link>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-white/25">
            <ShieldCheck size={13} className="text-[#62C58C]" />
            Your data stays under your control.
          </div>
        </section>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0C110E] p-3">
      <p className="text-[9px] uppercase tracking-[0.12em] text-white/20">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-white/65">{value}</p>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-3">
      <span className="text-[#62C58C]">{icon}</span>
      <span className="flex-1 text-xs text-white/45">{label}</span>
      <span className="text-xs font-semibold text-white/65">{value}</span>
    </div>
  );
}
