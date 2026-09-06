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

import { DoubleBorderCard } from "@/components/ui/double-border-card";
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
    <div className="relative w-full space-y-4 sm:space-y-6 text-[#121312]">
      {/* Header Banner */}
      <DoubleBorderCard variant="light" className="w-full">
        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#18392B] shadow-[0_0_4px_rgba(24,57,43,0.4)]" />
              <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-[#121312]/40 sm:text-[9px]">
                Medical Records
              </p>
            </div>

            <h1 className="mt-1 font-serif text-2xl font-normal tracking-tight text-[#121312] sm:mt-1.5 sm:text-4xl">
              Health Profile
            </h1>

            <p className="mt-1 max-w-xl text-xs leading-relaxed text-[#121312]/60 sm:mt-1.5 sm:text-sm">
              Keep important medical information, clinical history, and
              diagnostic records organized in one encrypted vault.
            </p>
          </div>

          <Link
            href="/dashboard/health/add"
            className="group relative flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-[#18392B]/30 bg-gradient-to-b from-[#224f3c] via-[#18392B] to-[#10271d] px-4 font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_4px_12px_rgba(24,57,43,0.25)] transition-all active:scale-[0.98] sm:h-11 sm:w-auto sm:px-5"
          >
            <Plus size={16} />
            <span>Add Information</span>
          </Link>
        </div>
      </DoubleBorderCard>

      {/* Health Overview Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 xl:grid-cols-3">
        <HealthCard
          icon={<Droplets size={16} />}
          title="Blood Group"
          description="Primary type"
          value={profile?.blood_group || "Not Added"}
          href="/dashboard/profile"
        />

        <HealthCard
          icon={<AlertTriangle size={16} />}
          title="Allergies"
          description="Known allergens"
          value={allergies?.length ? `${allergies.length} Added` : "None Added"}
        />

        <HealthCard
          icon={<Pill size={16} />}
          title="Medications"
          description="Active prescriptions"
          value={
            medications?.length
              ? `${medications.length} Recorded`
              : "None Added"
          }
        />

        <HealthCard
          icon={<HeartPulse size={16} />}
          title="Conditions"
          description="Diagnosed conditions"
          value={
            conditions?.length ? `${conditions.length} Recorded` : "None Added"
          }
        />

        <HealthCard
          icon={<Syringe size={16} />}
          title="Vaccinations"
          description="Immunization logs"
          value={
            vaccinations?.length
              ? `${vaccinations.length} Recorded`
              : "None Added"
          }
        />

        <HealthCard
          icon={<ShieldAlert size={16} />}
          title="Emergency Contact"
          description="First response info"
          value={emergencyAdded ? "Added" : "Not Added"}
          href="/dashboard/profile"
        />
      </div>

      {/* Item Lists */}
      <div className="space-y-4 sm:space-y-6">
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
      </div>

      {/* Medical Reports Vault Section */}
      <DoubleBorderCard variant="light" className="w-full">
        {/* Section Header */}
        <div className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="shrink-0 rounded-2xl bg-[#E6E0D6] p-1 shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.08)_inset]">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] text-[#18392B] shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_4px_rgba(0,0,0,0.05)] sm:h-10 sm:w-10">
                <FileText size={16} className="sm:hidden" />
                <FileText size={18} className="hidden sm:block" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base font-normal text-[#121312] sm:text-xl">
                  Medical Reports
                </h2>

                {reports && reports.length > 0 && (
                  <span className="rounded-md border border-[#18392B]/20 bg-[#18392B]/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#18392B] shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                    {reports.length}
                  </span>
                )}
              </div>

              <p className="line-clamp-1 font-mono text-[8px] uppercase tracking-wider text-[#121312]/40 sm:text-[9px]">
                Prescriptions, laboratory tests, and clinical documents
              </p>
            </div>
          </div>

          {/* Header CTA Button */}
          <div className="w-full rounded-xl bg-[#E6E0D6] p-1 shadow-[0_1px_0_rgba(255,255,255,0.8),0_1.5px_3px_rgba(0,0,0,0.08)_inset] sm:w-auto">
            <Link
              href="/dashboard/health/reports/add"
              className="group flex h-8 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] px-3 font-mono text-xs font-semibold text-[#121312] shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_4px_rgba(0,0,0,0.05)] transition-all active:scale-[0.97] sm:h-9 sm:w-auto"
            >
              <Plus
                size={14}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
              <span>Add Report</span>
            </Link>
          </div>
        </div>

        {/* Reports Inset Housing */}
        <div className="mt-2 rounded-2xl border border-black/5 bg-[#E6E0D6] p-1.5 shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.08)_inset] sm:p-2">
          {reports && reports.length > 0 ? (
            <div className="flex flex-col gap-1.5 sm:gap-2">
              {reports.map((report) => (
                <MedicalReportRow key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] px-4 py-8 text-center shadow-[0_1px_0_rgba(255,255,255,1)_inset] sm:px-6 sm:py-12">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/5 bg-[#E6E0D6] text-[#121312]/30 shadow-[0_1px_2px_rgba(0,0,0,0.12)_inset,0_1px_0_rgba(255,255,255,0.8)] sm:h-12 sm:w-12">
                <FileText size={18} className="sm:hidden" />
                <FileText size={20} className="hidden sm:block" />
              </div>

              <p className="mt-3 font-serif text-base font-normal text-[#121312] sm:mt-4 sm:text-lg">
                No medical reports added yet
              </p>

              <p className="mt-1 max-w-sm font-mono text-[11px] text-[#121312]/50 sm:text-xs">
                Upload your prescriptions, diagnostic reports, or medical
                letters to attach them to your profile.
              </p>

              <Link
                href="/dashboard/health/reports/add"
                className="mt-4 flex h-9 items-center justify-center gap-2 rounded-xl border border-[#18392B]/30 bg-gradient-to-b from-[#224f3c] via-[#18392B] to-[#10271d] px-4 font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_3px_8px_rgba(24,57,43,0.25)] transition-all active:scale-[0.98] sm:mt-5"
              >
                <Plus size={14} />
                <span>Upload First Report</span>
              </Link>
            </div>
          )}
        </div>
      </DoubleBorderCard>
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
      className="group flex items-center gap-2.5 rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] p-2.5 shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_4px_rgba(0,0,0,0.04)] transition-all active:scale-[0.99] sm:gap-4 sm:p-3.5"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-black/5 bg-[#E6E0D6] text-[#18392B] shadow-[0_1px_0_rgba(255,255,255,0.8),0_1.5px_3px_rgba(0,0,0,0.08)_inset] transition-all duration-300 group-hover:scale-105 sm:h-10 sm:w-10">
        <FileText size={16} className="sm:hidden" />
        <FileText size={18} className="hidden sm:block" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-[#121312]">
          {report.title}
        </p>

        <div className="mt-0.5 flex flex-wrap items-center gap-1 font-mono text-[8px] uppercase tracking-wider text-[#121312]/40 sm:gap-2 sm:text-[9px]">
          <span>{report.report_type || "Medical Report"}</span>
          <span className="hidden sm:inline">•</span>
          <span>{formatReportDate(report.report_date)}</span>
        </div>
      </div>

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-black/5 bg-white text-[#121312]/40 shadow-[0_1px_0_rgba(255,255,255,1)_inset] transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-[#18392B] group-hover:text-white sm:h-8 sm:w-8">
        <ExternalLink size={13} className="sm:hidden" />
        <ExternalLink size={14} className="hidden sm:block" />
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
    <div className="rounded-2xl bg-[#E6E0D6] p-1 shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.08)_inset]">
      <Link
        href={href}
        className="group relative flex h-full flex-col justify-between rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] p-3 shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_3px_6px_rgba(0,0,0,0.04)] transition-all active:scale-[0.98] sm:p-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-black/5 bg-gradient-to-b from-[#1C4031] to-[#122B20] text-[#F8F6F0] shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_2px_4px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover:scale-105 sm:h-9 sm:w-9">
            {icon}
          </div>

          <ChevronRight
            size={14}
            className="text-[#121312]/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#121312] sm:size-[15px]"
          />
        </div>

        <div className="mt-3 sm:mt-4">
          <p className="truncate text-xs font-semibold text-[#121312]">
            {title}
          </p>

          <p className="mt-0.5 truncate font-mono text-[8px] uppercase tracking-wider text-[#121312]/40 sm:text-[9px]">
            {description}
          </p>

          <p className="mt-2 truncate font-mono text-[11px] font-semibold text-[#18392B] sm:mt-3 sm:text-xs">
            {value}
          </p>
        </div>
      </Link>
    </div>
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
    <DoubleBorderCard variant="light" className="w-full">
      <div className="flex items-center justify-between pb-2.5 sm:pb-3">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#18392B] shadow-[0_0_4px_rgba(24,57,43,0.4)]" />
          <h3 className="font-serif text-base font-normal text-[#121312] sm:text-lg">
            {title}
          </h3>
        </div>

        <span className="font-mono text-[8px] font-semibold uppercase tracking-wider text-[#121312]/40 sm:text-[9px]">
          {items.length} {items.length === 1 ? "Record" : "Records"}
        </span>
      </div>

      {/* Recessed Container */}
      <div className="mt-1 rounded-2xl border border-black/5 bg-[#E6E0D6] p-1.5 shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.08)_inset] sm:p-2">
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] px-3 py-2.5 shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_4px_rgba(0,0,0,0.04)] sm:gap-4 sm:px-4 sm:py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#121312]">
                  {item.name}
                </p>

                <p className="mt-0.5 truncate font-mono text-[9px] text-[#121312]/50 sm:text-[10px]">
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
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-black/5 bg-white text-[#121312]/30 shadow-[0_1px_0_rgba(255,255,255,1)_inset] transition-colors hover:bg-red-50 hover:text-red-600 active:scale-95 sm:h-8 sm:w-8"
                  aria-label={`Delete ${item.name}`}
                >
                  <Trash2 size={13} className="sm:hidden" />
                  <Trash2 size={14} className="hidden sm:block" />
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </DoubleBorderCard>
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
