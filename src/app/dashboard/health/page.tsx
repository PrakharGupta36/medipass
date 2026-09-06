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
    <div className="relative w-full space-y-6 text-[#121312]">
      {/* Header Banner */}
      <DoubleBorderCard variant="light" className="w-full">
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#18392B] shadow-[0_0_4px_rgba(24,57,43,0.4)]" />
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#121312]/40">
                Medical Records
              </p>
            </div>

            <h1 className="mt-1.5 font-serif text-3xl font-normal tracking-tight text-[#121312] sm:text-4xl">
              Health Profile
            </h1>

            <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-[#121312]/60 sm:text-sm">
              Keep important medical information, clinical history, and
              diagnostic records organized in one encrypted vault.
            </p>
          </div>

          <Link
            href="/dashboard/health/add"
            className="group relative flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#18392B]/30 bg-gradient-to-b from-[#224f3c] via-[#18392B] to-[#10271d] px-5 font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_4px_12px_rgba(24,57,43,0.25)] transition-all active:scale-[0.98]"
          >
            <Plus size={16} />
            <span>Add Information</span>
          </Link>
        </div>
      </DoubleBorderCard>

      {/* Health Overview Grid */}
      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
        <HealthCard
          icon={<Droplets size={17} />}
          title="Blood Group"
          description="Primary type"
          value={profile?.blood_group || "Not Added"}
          href="/dashboard/profile"
        />

        <HealthCard
          icon={<AlertTriangle size={17} />}
          title="Allergies"
          description="Known allergens"
          value={allergies?.length ? `${allergies.length} Added` : "None Added"}
        />

        <HealthCard
          icon={<Pill size={17} />}
          title="Medications"
          description="Active prescriptions"
          value={
            medications?.length
              ? `${medications.length} Recorded`
              : "None Added"
          }
        />

        <HealthCard
          icon={<HeartPulse size={17} />}
          title="Conditions"
          description="Diagnosed conditions"
          value={
            conditions?.length ? `${conditions.length} Recorded` : "None Added"
          }
        />

        <HealthCard
          icon={<Syringe size={17} />}
          title="Vaccinations"
          description="Immunization logs"
          value={
            vaccinations?.length
              ? `${vaccinations.length} Recorded`
              : "None Added"
          }
        />

        <HealthCard
          icon={<ShieldAlert size={17} />}
          title="Emergency Contact"
          description="First response info"
          value={emergencyAdded ? "Added" : "Not Added"}
          href="/dashboard/profile"
        />
      </div>

      {/* Item Lists */}
      <div className="space-y-6">
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
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-2xl bg-[#E6E0D6] shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.08)_inset]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] text-[#18392B] shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_4px_rgba(0,0,0,0.05)]">
                <FileText size={18} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-normal text-[#121312]">
                  Medical Reports
                </h2>

                {reports && reports.length > 0 && (
                  <span className="rounded-md border border-[#18392B]/20 bg-[#18392B]/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-[#18392B] shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                    {reports.length}
                  </span>
                )}
              </div>

              <p className="font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
                Prescriptions, laboratory tests, and clinical documents
              </p>
            </div>
          </div>

          <div className="p-1 rounded-xl bg-[#E6E0D6] shadow-[0_1px_0_rgba(255,255,255,0.8),0_1.5px_3px_rgba(0,0,0,0.08)_inset]">
            <Link
              href="/dashboard/health/reports/add"
              className="group flex h-9 items-center gap-1.5 rounded-lg border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] px-3 font-mono text-xs font-semibold text-[#121312] shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_4px_rgba(0,0,0,0.05)] transition-all active:scale-[0.97]"
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
        <div className="mt-2 rounded-2xl border border-black/5 bg-[#E6E0D6] p-2 shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.08)_inset]">
          {reports && reports.length > 0 ? (
            <div className="flex flex-col gap-2">
              {reports.map((report) => (
                <MedicalReportRow key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] px-6 py-12 text-center shadow-[0_1px_0_rgba(255,255,255,1)_inset]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/5 bg-[#E6E0D6] text-[#121312]/30 shadow-[0_1px_2px_rgba(0,0,0,0.12)_inset,0_1px_0_rgba(255,255,255,0.8)]">
                <FileText size={20} />
              </div>

              <p className="mt-4 font-serif text-lg font-normal text-[#121312]">
                No medical reports added yet
              </p>

              <p className="mt-1 max-w-sm font-mono text-xs text-[#121312]/50">
                Upload your prescriptions, diagnostic reports, or medical
                letters to attach them to your profile.
              </p>

              <Link
                href="/dashboard/health/reports/add"
                className="mt-5 flex h-9 items-center gap-2 rounded-xl border border-[#18392B]/30 bg-gradient-to-b from-[#224f3c] via-[#18392B] to-[#10271d] px-4 font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_3px_8px_rgba(24,57,43,0.25)] transition-all active:scale-[0.98]"
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
      className="group flex items-center gap-4 rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] p-3.5 shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_4px_rgba(0,0,0,0.04)] transition-all active:scale-[0.99]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/5 bg-[#E6E0D6] text-[#18392B] shadow-[0_1px_0_rgba(255,255,255,0.8),0_1.5px_3px_rgba(0,0,0,0.08)_inset] transition-all duration-300 group-hover:scale-105">
        <FileText size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-[#121312]">
          {report.title}
        </p>

        <div className="mt-0.5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
          <span>{report.report_type || "Medical Report"}</span>
          <span>•</span>
          <span>{formatReportDate(report.report_date)}</span>
        </div>
      </div>

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/5 bg-white text-[#121312]/40 shadow-[0_1px_0_rgba(255,255,255,1)_inset] transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-[#18392B] group-hover:text-white">
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
    <div className="p-1 rounded-2xl bg-[#E6E0D6] shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.08)_inset]">
      <Link
        href={href}
        className="group relative flex flex-col justify-between rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] p-4 shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_3px_6px_rgba(0,0,0,0.04)] transition-all active:scale-[0.98]"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/5 bg-gradient-to-b from-[#1C4031] to-[#122B20] text-[#F8F6F0] shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_2px_4px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover:scale-105">
            {icon}
          </div>

          <ChevronRight
            size={15}
            className="text-[#121312]/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#121312]"
          />
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-[#121312]">{title}</p>

          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
            {description}
          </p>

          <p className="mt-3 font-mono text-xs font-semibold text-[#18392B]">
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
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#18392B] shadow-[0_0_4px_rgba(24,57,43,0.4)]" />
          <h3 className="font-serif text-lg font-normal text-[#121312]">
            {title}
          </h3>
        </div>

        <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#121312]/40">
          {items.length} {items.length === 1 ? "Record" : "Records"}
        </span>
      </div>

      {/* Recessed Container */}
      <div className="mt-1 rounded-2xl border border-black/5 bg-[#E6E0D6] p-2 shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.08)_inset]">
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_4px_rgba(0,0,0,0.04)]"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#121312]">
                  {item.name}
                </p>

                <p className="mt-0.5 font-mono text-[10px] text-[#121312]/50">
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
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/5 bg-white text-[#121312]/30 shadow-[0_1px_0_rgba(255,255,255,1)_inset] transition-colors hover:bg-red-50 hover:text-red-600 active:scale-95"
                  aria-label={`Delete ${item.name}`}
                >
                  <Trash2 size={14} />
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
