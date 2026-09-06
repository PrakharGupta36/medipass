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
    <div className="relative w-full text-[#121312]">
      {/* Header */}
      <section className="animate-tumble-in relative mb-8 overflow-hidden rounded-3xl border border-[#121312]/10 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] sm:p-8">
        <div className="animate-shimmer pointer-events-none absolute inset-0" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#18392B]" />
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#121312]/40">
                Medical Records
              </p>
            </div>

            <h1
              className="animate-reveal-mask mt-2 font-serif text-3xl font-normal tracking-tight text-[#121312] sm:text-4xl"
              style={{ animationDelay: "150ms" }}
            >
              Health Profile
            </h1>

            <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#121312]/60 sm:text-sm">
              Keep important medical information, clinical history, and
              diagnostic records organized in one encrypted vault.
            </p>
          </div>

          <Link
            href="/dashboard/health/add"
            className="animate-glow-ring flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#18392B] px-5 font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] shadow-sm transition-all hover:scale-[1.03] hover:bg-[#122A20]"
          >
            <Plus size={16} />
            <span>Add Information</span>
          </Link>
        </div>
      </section>

      {/* Health Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <HealthCard
          index={0}
          icon={<Droplets size={18} />}
          title="Blood Group"
          description="Primary type"
          value={profile?.blood_group || "Not Added"}
          href="/dashboard/profile"
        />

        <HealthCard
          index={1}
          icon={<AlertTriangle size={18} />}
          title="Allergies"
          description="Known allergens"
          value={allergies?.length ? `${allergies.length} Added` : "None Added"}
        />

        <HealthCard
          index={2}
          icon={<Pill size={18} />}
          title="Medications"
          description="Active prescriptions"
          value={
            medications?.length
              ? `${medications.length} Recorded`
              : "None Added"
          }
        />

        <HealthCard
          index={3}
          icon={<HeartPulse size={18} />}
          title="Conditions"
          description="Diagnosed conditions"
          value={
            conditions?.length ? `${conditions.length} Recorded` : "None Added"
          }
        />

        <HealthCard
          index={4}
          icon={<Syringe size={18} />}
          title="Vaccinations"
          description="Immunization logs"
          value={
            vaccinations?.length
              ? `${vaccinations.length} Recorded`
              : "None Added"
          }
        />

        <HealthCard
          index={5}
          icon={<ShieldAlert size={18} />}
          title="Emergency Contact"
          description="First response info"
          value={emergencyAdded ? "Added" : "Not Added"}
          href="/dashboard/profile"
        />
      </div>

      {/* Record Lists */}
      <div className="mt-6 space-y-6">
        <RecordList
          title="Allergies"
          items={allergies || []}
          type="allergy"
          sectionDelay={80}
        />
        <RecordList
          title="Conditions"
          items={conditions || []}
          type="condition"
          sectionDelay={140}
        />
        <RecordList
          title="Medications"
          items={medications || []}
          type="medication"
          sectionDelay={200}
        />
        <RecordList
          title="Vaccinations"
          items={vaccinations || []}
          type="vaccination"
          sectionDelay={260}
        />
      </div>

      {/* Medical Reports */}
      <section
        className="animate-rise-in relative mt-8 rounded-3xl border border-[#121312]/10 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)]"
        style={{ animationDelay: "320ms" }}
      >
        <div className="relative flex items-center justify-between border-b border-[#121312]/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div
              className="animate-pop-in flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F6F0] text-[#18392B]"
              style={{ animationDelay: "420ms" }}
            >
              <FileText size={18} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-normal text-[#121312]">
                  Medical Reports
                </h2>

                {reports && reports.length > 0 && (
                  <span
                    className="animate-count-badge-in rounded-md border border-[#18392B]/20 bg-[#18392B]/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-[#18392B]"
                    style={{ animationDelay: "480ms" }}
                  >
                    {reports.length}
                  </span>
                )}
              </div>

              <p className="font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
                Prescriptions, laboratory tests, and clinical documents
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/health/reports/add"
            className="group flex h-9 items-center gap-2 rounded-xl border border-[#121312]/10 bg-[#F8F6F0] px-3.5 font-mono text-xs font-medium text-[#121312] transition hover:bg-[#18392B] hover:text-[#F8F6F0]"
          >
            <Plus
              size={14}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
            <span>Add Report</span>
          </Link>
        </div>

        {reports && reports.length > 0 ? (
          <div className="divide-y divide-[#121312]/5">
            {reports.map((report, i) => (
              <MedicalReportRow key={report.id} report={report} index={i} />
            ))}
          </div>
        ) : (
          <div
            className="animate-rise-in flex flex-col items-center justify-center px-6 py-14 text-center"
            style={{ animationDelay: "420ms" }}
          >
            <div
              className="animate-pop-in flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F6F0] text-[#121312]/30"
              style={{ animationDelay: "500ms" }}
            >
              <FileText size={20} />
            </div>

            <p className="mt-4 font-serif text-lg font-normal text-[#121312]">
              No medical reports added yet
            </p>

            <p className="mt-1 max-w-sm font-mono text-xs text-[#121312]/40">
              Upload your prescriptions, diagnostic reports, or medical letters
              to attach them to your profile.
            </p>

            <Link
              href="/dashboard/health/reports/add"
              className="mt-6 flex h-9 items-center gap-2 rounded-xl bg-[#18392B] px-4 font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] transition hover:scale-105 hover:bg-[#122A20]"
            >
              <Plus size={14} />
              <span>Upload First Report</span>
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

function MedicalReportRow({ report, index }: { report: any; index: number }) {
  return (
    <Link
      href={`/api/medical-reports/${report.id}/view`}
      target="_blank"
      rel="noopener noreferrer"
      className="animate-slide-in-left group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[#F8F6F0]/60"
      style={{ animationDelay: `${420 + index * 70}ms` }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F6F0] text-[#18392B] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#18392B] group-hover:text-white">
        <FileText size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-[#121312]">
          {report.title}
        </p>

        <div className="mt-1 flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
          <span>{report.report_type || "Medical Report"}</span>
          <span>•</span>
          <span>{formatReportDate(report.report_date)}</span>
        </div>
      </div>

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#121312]/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-[#121312] group-hover:text-white">
        <ExternalLink size={14} />
      </div>
    </Link>
  );
}

/* ================================================== */
/* Health card */
/* ================================================== */

function HealthCard({
  index,
  icon,
  title,
  description,
  value,
  href = "/dashboard/health",
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  value: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="hover-tilt animate-tumble-in group relative overflow-hidden rounded-2xl border border-[#121312]/10 bg-white p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] hover:border-[#121312]/30 hover:shadow-lg"
      style={{ animationDelay: `${120 + index * 80}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8F6F0] text-[#18392B] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#18392B] group-hover:text-white">
          {icon}
        </div>

        <ChevronRight
          size={16}
          className="text-[#121312]/20 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#121312]"
        />
      </div>

      <p className="mt-5 text-xs font-semibold text-[#121312]">{title}</p>

      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
        {description}
      </p>

      <p className="mt-4 font-mono text-xs font-semibold text-[#18392B]">
        {value}
      </p>
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
  sectionDelay = 0,
}: {
  title: string;
  items: any[];
  type: "allergy" | "condition" | "medication" | "vaccination";
  sectionDelay?: number;
}) {
  if (!items.length) return null;

  return (
    <section
      className="animate-rise-in rounded-3xl border border-[#121312]/10 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)]"
      style={{ animationDelay: `${sectionDelay}ms` }}
    >
      <div className="border-b border-[#121312]/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#18392B]" />
            <h3 className="font-serif text-lg font-normal text-[#121312]">
              {title}
            </h3>
          </div>

          <span className="font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
            {items.length} {items.length === 1 ? "Record" : "Records"}
          </span>
        </div>
      </div>

      <div className="divide-y divide-[#121312]/5">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="animate-slide-in-left flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-[#F8F6F0]/50"
            style={{ animationDelay: `${sectionDelay + 60 + i * 50}ms` }}
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
                className="rounded-lg p-2 text-[#121312]/30 transition-colors hover:bg-red-50 hover:text-red-600"
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
