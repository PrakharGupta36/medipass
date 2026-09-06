// src/components/dashboard/recent-activity.tsx

"use client";

import Link from "next/link";
import { DoubleBorderCard } from "@/components/ui/double-border-card";

const EVENTS = [
  {
    title: "MediPass Created",
    description: "Your security credentials and vault keys were generated.",
    date: "Today",
    active: true,
  },
  {
    title: "No Medical Records",
    description: "Add your first health log to populate your medical record.",
    date: "—",
    active: false,
  },
];

export default function RecentActivity() {
  return (
    <DoubleBorderCard variant="light" className="w-full">
      {/* Header Block */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#121312]/40">
            System Events
          </p>
          <h2 className="mt-0.5 font-serif text-xl font-normal text-[#121312]">
            Recent Activity
          </h2>
        </div>

        {/* Tactile Inset Button */}
        <div className="p-1 rounded-xl bg-[#E6E0D6] shadow-[0_1px_0_rgba(255,255,255,0.8),0_1.5px_3px_rgba(0,0,0,0.08)_inset]">
          <Link
            href="/dashboard/timeline"
            className="flex items-center justify-center rounded-lg border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] px-3 py-1.5 font-mono text-xs font-semibold text-[#18392B] shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_4px_rgba(0,0,0,0.05)] transition-all active:scale-[0.97]"
          >
            View Full Log
          </Link>
        </div>
      </div>

      {/* Recessed Activity Track */}
      <div className="mt-2 rounded-2xl border border-black/5 bg-[#E6E0D6] p-4 shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.08)_inset]">
        <div className="flex flex-col gap-3">
          {EVENTS.map((event, i) => (
            <div
              key={event.title}
              className="relative flex items-start gap-3.5 rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] p-3 shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_5px_rgba(0,0,0,0.04)]"
            >
              {/* Timeline Connector Line */}
              {i < EVENTS.length - 1 && (
                <span className="absolute left-[23px] top-9 h-[calc(100%+12px)] w-0.5 bg-[#121312]/15 z-0" />
              )}

              {/* Recessed LED Indicator Well */}
              <div className="relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E0D9CE] shadow-[0_1px_2px_rgba(0,0,0,0.15)_inset,0_1px_0_rgba(255,255,255,0.8)]">
                <div
                  className={`h-2 w-2 rounded-full ${
                    event.active
                      ? "bg-[#18392B] shadow-[0_0_6px_rgba(24,57,43,0.6),0_1px_0_rgba(255,255,255,0.4)_inset]"
                      : "bg-[#121312]/30 shadow-[0_1px_0_rgba(255,255,255,0.2)_inset]"
                  }`}
                />
              </div>

              {/* Event Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-[#121312]">
                    {event.title}
                  </p>
                  <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
                    {event.date}
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-[#121312]/60">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DoubleBorderCard>
  );
}
