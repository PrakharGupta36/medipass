// src/components/dashboard/health-overview.tsx

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ChevronRight,
  FileText,
  Pill,
} from "lucide-react";

const ITEMS = [
  { icon: AlertTriangle, label: "Allergies", accent: "#B3542B" },
  { icon: Pill, label: "Medications", accent: "#2B5DB3" },
  { icon: Activity, label: "Conditions", accent: "#18392B" },
  { icon: FileText, label: "Reports", accent: "#7A6A4F" },
] as const;

export default function HealthOverview() {
  return (
    <section className="rounded-3xl border border-[#121312]/10 bg-[#EFECE6] p-6 sm:p-7">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#121312]/40">
            Diagnostics
          </p>
          <h2 className="mt-1 font-serif text-xl font-normal text-[#121312]">
            Health Overview
          </h2>
        </div>

        <Link
          href="/dashboard/health"
          className="flex items-center gap-1 font-mono text-xs font-medium text-[#18392B] transition-transform hover:translate-x-0.5 hover:underline"
        >
          View All
          <ChevronRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ITEMS.map(({ icon: Icon, label, accent }) => (
          <Link
            key={label}
            href="/dashboard/health"
            className="group relative overflow-hidden rounded-2xl border border-[#121312]/10 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#121312]/20 hover:shadow-[0_8px_24px_-8px_rgba(18,19,18,0.12)]"
          >
            <span
              className="absolute inset-y-0 left-0 w-[3px] opacity-0 transition-opacity group-hover:opacity-100"
              style={{ backgroundColor: accent }}
            />
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition-transform duration-200 group-hover:scale-105"
              style={{ backgroundColor: accent }}
            >
              <Icon size={16} />
            </div>
            <p className="mt-3 text-xs font-semibold text-[#121312]">{label}</p>
            <p className="mt-0.5 font-mono text-[9px] text-[#121312]/40">
              0 items
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
