// src/components/dashboard/health-overview.tsx

"use client";

import { DoubleBorderCard } from "@/components/ui/double-border-card";
import {
  Activity,
  AlertTriangle,
  ChevronRight,
  FileText,
  Pill,
} from "lucide-react";
import Link from "next/link";

const ITEMS = [
  {
    icon: AlertTriangle,
    label: "Allergies",
    accent: "from-amber-500 to-amber-700",
  },
  { icon: Pill, label: "Medications", accent: "from-blue-500 to-blue-700" },
  {
    icon: Activity,
    label: "Conditions",
    accent: "from-emerald-600 to-emerald-800",
  },
  { icon: FileText, label: "Reports", accent: "from-stone-500 to-stone-700" },
] as const;

export default function HealthOverview() {
  return (
    <DoubleBorderCard variant="light" className="w-full">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#121312]/40">
            Diagnostics
          </p>
          <h2 className="mt-0.5 font-serif text-xl font-normal text-[#121312]">
            Health Overview
          </h2>
        </div>

        <Link
          href="/dashboard/health"
          className="group flex items-center gap-1 font-mono text-xs font-medium text-[#18392B] hover:underline"
        >
          View All
          <ChevronRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
        {ITEMS.map(({ icon: Icon, label, accent }) => (
          <div
            key={label}
            className="rounded-2xl border border-black/5 bg-[#E6E0D6] p-0.5 shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,.1)_inset]"
          >
            <Link
              href="/dashboard/health"
              className="group flex flex-col items-start rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] p-3 shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_3px_6px_rgba(0,0,0,0.05)] transition-all active:scale-[0.97]"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-b ${accent} text-white shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_2px_4px_rgba(0,0,0,0.15)]`}
              >
                <Icon size={16} />
              </div>
              <p className="mt-2.5 text-xs font-semibold text-[#121312]">
                {label}
              </p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
                0 Items
              </p>
            </Link>
          </div>
        ))}
      </div>
    </DoubleBorderCard>
  );
}
