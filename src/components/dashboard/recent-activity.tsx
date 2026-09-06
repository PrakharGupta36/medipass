// src/components/dashboard/recent-activity.tsx

import Link from "next/link";

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
    <section className="rounded-3xl border border-[#121312]/10 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between border-b border-[#121312]/10 px-6 py-5">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#121312]/40">
            System Events
          </p>
          <h2 className="mt-0.5 font-serif text-xl font-normal text-[#121312]">
            Recent Activity
          </h2>
        </div>

        <Link
          href="/dashboard/timeline"
          className="font-mono text-xs font-medium text-[#18392B] transition-colors hover:underline"
        >
          View Full Log
        </Link>
      </div>

      <div className="px-6 py-2">
        {EVENTS.map((event, i) => (
          <div key={event.title} className="relative flex gap-4 py-4">
            {i < EVENTS.length - 1 && (
              <span className="absolute left-[3px] top-6 h-[calc(100%-8px)] w-px bg-[#121312]/10" />
            )}

            <div className="relative pt-1.5">
              <div
                className={`relative z-10 h-[7px] w-[7px] rounded-full ring-4 ring-white ${
                  event.active ? "bg-[#18392B]" : "bg-[#121312]/25"
                }`}
              />
            </div>

            <div className="min-w-0 flex-1 pb-1">
              <div className="flex items-start justify-between gap-4">
                <p className="text-xs font-semibold text-[#121312]">
                  {event.title}
                </p>
                <span className="shrink-0 font-mono text-[9px] text-[#121312]/40">
                  {event.date}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#121312]/60">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
