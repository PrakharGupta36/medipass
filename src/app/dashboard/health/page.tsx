/* eslint-disable @typescript-eslint/no-explicit-any */
// Move to: src/app/dashboard/health/page.tsx

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronRight,
  Droplets,
  FileText,
  HeartPulse,
  Pill,
  Plus,
  ShieldAlert,
  Syringe,
  Trash2,
} from "lucide-react";
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
      .order("created_at", { ascending: false }),
    supabase
      .from("conditions")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("medications")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("vaccinations")
      .select("*")
      .order("date", { ascending: false }),
    supabase
      .from("medical_reports")
      .select("*")
      .order("report_date", { ascending: false }),
  ]);

  const emergencyAdded = Boolean(
    profile?.emergency_contact_name || profile?.emergency_contact_phone,
  );

  return (
    <div>
      <div className="mb-7 lg:hidden">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#62C58C]">
          Health
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Medical information
        </h1>
      </div>

      <section className="mb-5 rounded-[26px] border border-white/[0.07] bg-[#111712] p-6 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
              Health profile
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              Your medical information
            </h2>
            <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
              Keep important health information in one place. Every item is
              stored against your account.
            </p>
          </div>
          <Link
            href="/dashboard/health/add"
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#246B45] px-4 text-xs font-semibold"
          >
            <Plus size={15} /> Add information
          </Link>
        </div>
      </section>

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

      <section className="mt-5 rounded-[26px] border border-white/[0.07] bg-[#111712]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1F7A4F]/10 text-[#62C58C]">
              <FileText size={17} />
            </div>
            <div>
              <p className="text-sm font-semibold">Medical reports</p>
              <p className="mt-0.5 text-[10px] text-white/25">
                Upload prescriptions, reports and documents
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/health/reports/add"
            className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.07] px-3 text-xs font-medium text-white/50"
          >
            <Plus size={14} /> Add
          </Link>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {reports?.length ? (
            reports.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-6 py-4">
                <FileText size={17} className="text-[#62C58C]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-white/65">{r.title}</p>
                  <p className="mt-1 text-[10px] text-white/25">
                    {r.report_type || "Medical report"} ·{" "}
                    {r.report_date || "No date"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-xs text-white/25">
              No medical reports yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

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
      className="group rounded-[22px] border border-white/[0.07] bg-[#111712] p-5 transition hover:border-[#62C58C]/20 hover:bg-[#141B16]"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F7A4F]/10 text-[#62C58C]">
          {icon}
        </div>
        <ChevronRight
          size={16}
          className="text-white/15 group-hover:text-[#62C58C]"
        />
      </div>
      <p className="mt-6 text-sm font-medium text-white/75">{title}</p>
      <p className="mt-1 text-xs text-white/25">{description}</p>
      <p className="mt-5 text-[10px] font-medium text-[#62C58C]/70">{value}</p>
    </Link>
  );
}

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
    <section className="mt-5 rounded-[26px] border border-white/[0.07] bg-[#111712]">
      <div className="border-b border-white/[0.06] px-6 py-5">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-[10px] text-white/25">
          {items.length} record{items.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="divide-y divide-white/[0.05]">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 px-6 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white/65">{item.name}</p>
              <p className="mt-1 text-[10px] text-white/25">
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
                className="rounded-lg p-2 text-white/20 hover:bg-red-500/10 hover:text-red-300"
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
