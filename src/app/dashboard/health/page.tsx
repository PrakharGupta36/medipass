/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  AlertTriangle,
  ChevronRight,
  Droplets,
  ExternalLink,
  FileText,
  HeartPulse,
  Pill,
  Plus,
  ShieldAlert,
  Syringe,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { deleteHealthItem } from "./actions";

export default async function HealthPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [
    { data: profile },
    { data: allergies },
    { data: conditions },
    { data: medications },
    { data: vaccinations },
    { data: reports },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),

    supabase
      .from("allergies")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("conditions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("medications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("vaccinations")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false }),

    supabase
      .from("medical_reports")
      .select("*")
      .eq("user_id", user.id)
      .order("report_date", {
        ascending: false,
        nullsFirst: false,
      })
      .order("created_at", {
        ascending: false,
      }),
  ]);

  const emergencyAdded = Boolean(
    profile?.emergency_contact_name || profile?.emergency_contact_phone,
  );

  return (
    <div className="relative w-full">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 right-10 h-80 w-80 rounded-full bg-[#1F7A4F]/[0.035] blur-[120px]" />

      {/* ------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------ */}

      <section className="relative mb-5 overflow-hidden rounded-[26px] border border-white/[0.07] bg-[#111712] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.12)] sm:p-7">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#62C58C] shadow-[0_0_7px_rgba(98,197,140,0.4)]" />

              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#62C58C]/60">
                Health profile
              </p>
            </div>

            <h1 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-white">
              Your medical information
            </h1>

            <p className="mt-2 max-w-xl text-[10px] leading-5 text-white/25 sm:text-xs">
              Keep important health information in one place. Every item is
              stored securely against your account.
            </p>
          </div>

          <Link
            href="/dashboard/health/add"
            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#246B45] px-4 text-xs font-semibold text-white shadow-[0_7px_20px_rgba(36,107,69,0.14)] transition hover:bg-[#2C7D53] hover:shadow-[0_9px_25px_rgba(36,107,69,0.2)] active:scale-[0.98]"
          >
            <Plus size={15} />
            Add information
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------ */}
      {/* Health overview */}
      {/* ------------------------------------------------ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <HealthCard
          icon={<Droplets size={19} />}
          title="Blood group"
          description="Your blood type"
          value={profile?.blood_group || "Not added"}
          href="/dashboard/profile"
        />

        <HealthCard
          icon={<AlertTriangle size={19} />}
          title="Allergies"
          description="Known allergies"
          value={allergies?.length ? `${allergies.length} added` : "None added"}
        />

        <HealthCard
          icon={<Pill size={19} />}
          title="Medications"
          description="Current medications"
          value={
            medications?.length
              ? `${medications.length} recorded`
              : "None added"
          }
        />

        <HealthCard
          icon={<HeartPulse size={19} />}
          title="Conditions"
          description="Medical conditions"
          value={
            conditions?.length ? `${conditions.length} recorded` : "None added"
          }
        />

        <HealthCard
          icon={<Syringe size={19} />}
          title="Vaccinations"
          description="Vaccination history"
          value={
            vaccinations?.length
              ? `${vaccinations.length} recorded`
              : "None added"
          }
        />

        <HealthCard
          icon={<ShieldAlert size={19} />}
          title="Emergency"
          description="Emergency information"
          value={emergencyAdded ? "Added" : "Not added"}
          href="/dashboard/profile"
        />
      </div>

      {/* ------------------------------------------------ */}
      {/* Record lists */}
      {/* ------------------------------------------------ */}

      <RecordList title="Allergies" items={allergies || []} type="allergy" />

      <RecordList
        title="Conditions"
        items={conditions || []}
        type="condition"
      />

      <RecordList
        title="Medications"
        items={medications || []}
        type="medication"
      />

      <RecordList
        title="Vaccinations"
        items={vaccinations || []}
        type="vaccination"
      />

      {/* ------------------------------------------------ */}
      {/* Medical reports */}
      {/* ------------------------------------------------ */}

      <section className="relative mt-5 overflow-hidden rounded-[26px] border border-white/[0.07] bg-[#111712] shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
        {/* Top reflection */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        {/* Green ambient light */}
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-[#62C58C]/[0.025] blur-3xl" />

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/[0.055] px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#62C58C]/10 bg-[#1F7A4F]/10 text-[#62C58C]">
              <FileText size={17} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white/80">
                  Medical reports
                </p>

                {reports && reports.length > 0 && (
                  <span className="rounded-full border border-[#62C58C]/10 bg-[#1F7A4F]/10 px-2 py-0.5 font-mono text-[7px] text-[#62C58C]/70">
                    {reports.length}
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-[9px] text-white/20">
                Prescriptions, laboratory reports and documents
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/health/reports/add"
            className="group flex h-9 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.015] px-3 text-[10px] font-medium text-white/40 transition hover:border-[#62C58C]/20 hover:bg-[#1F7A4F]/10 hover:text-[#62C58C]"
          >
            <Plus
              size={13}
              className="transition-transform group-hover:rotate-90"
            />
            Add
          </Link>
        </div>

        {/* Reports */}
        {reports && reports.length > 0 ? (
          <div className="divide-y divide-white/[0.04]">
            {reports.map((report) => (
              <MedicalReportRow key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/15">
              <FileText size={18} />
            </div>

            <p className="mt-4 text-xs font-medium text-white/35">
              No medical reports yet
            </p>

            <p className="mt-1 max-w-sm text-[9px] leading-5 text-white/15">
              Upload your first prescription, laboratory report or medical
              document to keep it with your record.
            </p>

            <Link
              href="/dashboard/health/reports/add"
              className="mt-5 flex h-9 items-center gap-2 rounded-xl border border-[#62C58C]/15 bg-[#1F7A4F]/10 px-3 text-[10px] font-medium text-[#62C58C]/70 transition hover:bg-[#1F7A4F]/15 hover:text-[#62C58C]"
            >
              <Plus size={13} />
              Upload first report
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

/* ================================================== */
/* Medical report row */
/* ================================================== */

function MedicalReportRow({ report }: { report: any }) {
  return (
    <Link
      href={`/api/medical-reports/${report.id}/view`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 px-5 py-4 transition hover:bg-white/[0.02] sm:px-6"
    >
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#62C58C]/10 bg-[#1F7A4F]/10 text-[#62C58C] transition group-hover:border-[#62C58C]/20 group-hover:bg-[#1F7A4F]/15">
        <FileText size={16} />
      </div>

      {/* Information */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-white/65 transition group-hover:text-white/85">
          {report.title}
        </p>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-[9px] text-white/20">
            {report.report_type || "Medical report"}
          </span>

          <span className="h-0.5 w-0.5 rounded-full bg-white/15" />

          <span className="font-mono text-[8px] text-white/15">
            {formatReportDate(report.report_date)}
          </span>
        </div>
      </div>

      {/* Open indicator */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/10 transition group-hover:bg-[#1F7A4F]/10 group-hover:text-[#62C58C]">
        <ExternalLink size={14} />
      </div>
    </Link>
  );
}

/* ================================================== */
/* Health card */
/* ================================================== */

function HealthCard({
  icon,
  title,
  description,
  value,
  href = "/dashboard/health",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#111712] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition hover:border-[#62C58C]/20 hover:bg-[#141B16]"
    >
      {/* Top reflection */}
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.045] to-transparent" />

      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#62C58C]/10 bg-[#1F7A4F]/10 text-[#62C58C] transition group-hover:bg-[#1F7A4F]/15">
          {icon}
        </div>

        <ChevronRight
          size={16}
          className="text-white/10 transition group-hover:translate-x-0.5 group-hover:text-[#62C58C]"
        />
      </div>

      <p className="mt-6 text-sm font-medium text-white/75">{title}</p>

      <p className="mt-1 text-xs text-white/25">{description}</p>

      <p className="mt-5 text-[10px] font-medium text-[#62C58C]/70">{value}</p>
    </Link>
  );
}

/* ================================================== */
/* Record list */
/* ================================================== */

function RecordList({
  title,
  items,
  type,
}: {
  title: string;
  items: any[];
  type: "allergy" | "condition" | "medication" | "vaccination";
}) {
  if (!items.length) return null;

  return (
    <section className="relative mt-5 overflow-hidden rounded-[26px] border border-white/[0.07] bg-[#111712] shadow-[0_18px_60px_rgba(0,0,0,0.1)]">
      {/* Header */}
      <div className="border-b border-white/[0.055] px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#62C58C]/60" />

          <p className="text-sm font-semibold text-white/75">{title}</p>
        </div>

        <p className="mt-1 text-[9px] text-white/20">
          {items.length} record
          {items.length === 1 ? "" : "s"}
        </p>
      </div>

      {/* Records */}
      <div className="divide-y divide-white/[0.04]">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-6 py-4 transition hover:bg-white/[0.015]"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white/65">{item.name}</p>

              <p className="mt-1 text-[10px] text-white/20">
                {item.reaction ||
                  item.dosage ||
                  item.status ||
                  item.date ||
                  "Recorded"}
              </p>
            </div>

            <form
              action={async () => {
                "use server";
                await deleteHealthItem(type, item.id);
              }}
            >
              <button
                type="submit"
                className="rounded-lg p-2 text-white/15 transition hover:bg-red-500/10 hover:text-red-300"
                aria-label={`Delete ${item.name}`}
              >
                <Trash2 size={14} />
              </button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================================================== */
/* Date formatter */
/* ================================================== */

function formatReportDate(value: string | null | undefined) {
  if (!value) return "No date";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
