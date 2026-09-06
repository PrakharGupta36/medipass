// src/app/dashboard/timeline/page.tsx

import { DoubleBorderCard } from "@/components/ui/double-border-card";
import { createClient } from "@/lib/supabase/server";
import {
  AlertTriangle,
  FileText,
  HeartPulse,
  Pill,
  ShieldCheck,
  Stethoscope,
  Syringe,
} from "lucide-react";

type TimelineEntry = {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

export default async function TimelinePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [{ data: profile }, { data: events }, { data: reports }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("created_at, full_name")
        .eq("id", user.id)
        .maybeSingle(),

      supabase
        .from("medical_events")
        .select("id,event_type,title,description,event_date,created_at")
        .eq("user_id", user.id)
        .order("event_date", {
          ascending: false,
        }),

      supabase
        .from("medical_reports")
        .select("id,title,report_type,report_date,created_at")
        .eq("user_id", user.id)
        .order("report_date", {
          ascending: false,
        }),
    ]);

  const timeline: TimelineEntry[] = [];

  for (const event of events || []) {
    let icon: React.ReactNode;

    switch (event.event_type) {
      case "allergy":
        icon = <AlertTriangle size={15} />;
        break;
      case "medication":
        icon = <Pill size={15} />;
        break;
      case "vaccination":
        icon = <Syringe size={15} />;
        break;
      case "condition":
        icon = <HeartPulse size={15} />;
        break;
      case "doctor_visit":
        icon = <Stethoscope size={15} />;
        break;
      default:
        icon = <HeartPulse size={15} />;
    }

    timeline.push({
      id: `event-${event.id}`,
      date: event.event_date || event.created_at.slice(0, 10),
      title: event.title,
      description: event.description || "Medical information was updated.",
      icon,
    });
  }

  for (const report of reports || []) {
    timeline.push({
      id: `report-${report.id}`,
      date: report.report_date || report.created_at.slice(0, 10),
      title: report.title,
      description: report.report_type || "Medical report",
      icon: <FileText size={15} />,
    });
  }

  if (profile) {
    timeline.push({
      id: "profile-created",
      date: profile.created_at.slice(0, 10),
      title: "MediPass Created",
      description:
        "Your security credentials and medical profile were generated.",
      icon: <ShieldCheck size={15} />,
    });
  }

  timeline.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="w-full max-w-[1200px] text-[#121312]">
      <DoubleBorderCard variant="light" className="w-full">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-black/5 pb-3.5 sm:pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#18392B] shadow-[0_0_4px_rgba(24,57,43,0.4)]" />
              <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-[#121312]/40 sm:text-[9px]">
                Medical History
              </p>
            </div>

            <h1 className="mt-1 font-serif text-2xl font-normal text-[#121312] sm:mt-1.5 sm:text-4xl">
              Timeline Log
            </h1>

            <p className="mt-1 max-w-xl font-mono text-[11px] text-[#121312]/60 sm:text-xs">
              Chronological log of diagnostic reports, prescriptions, and health
              updates.
            </p>
          </div>

          <div className="relative hidden h-4 w-4 items-center justify-center rounded-full bg-[#E0D9CE] shadow-[0_1px_2px_rgba(0,0,0,0.15)_inset,0_1px_0_rgba(255,255,255,0.8)] sm:flex">
            <div className="h-1.5 w-1.5 rounded-full bg-[#18392B] shadow-[0_0_4px_rgba(24,57,43,0.6)]" />
          </div>
        </div>

        {/* Timeline Content */}
        <div className="mt-4 rounded-2xl border border-black/5 bg-[#E6E0D6] p-2.5 shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.08)_inset] sm:mt-6 sm:p-6">
          {timeline.length > 0 ? (
            <div className="relative">
              {/* Vertical Guide Rail */}
              <div className="absolute bottom-6 left-[17px] top-6 w-[2px] rounded-full bg-gradient-to-b from-black/10 via-black/10 to-transparent shadow-[1px_0_0_rgba(255,255,255,0.8)] sm:left-[21px]" />

              <div className="space-y-2.5 sm:space-y-3">
                {timeline.map((item, index) => (
                  <TimelineItem
                    key={item.id}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    date={formatDate(item.date)}
                    active={index === 0}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] px-4 py-8 text-center shadow-[0_1px_0_rgba(255,255,255,1)_inset] sm:px-6 sm:py-12">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/5 bg-[#E6E0D6] text-[#121312]/30 shadow-[0_1px_2px_rgba(0,0,0,0.12)_inset,0_1px_0_rgba(255,255,255,0.8)] sm:h-12 sm:w-12">
                <HeartPulse size={18} className="sm:hidden" />
                <HeartPulse size={20} className="hidden sm:block" />
              </div>

              <h2 className="mt-3 font-serif text-base font-normal text-[#121312] sm:mt-4 sm:text-lg">
                Your timeline is empty
              </h2>

              <p className="mt-1 max-w-sm font-mono text-[11px] text-[#121312]/50 sm:text-xs">
                Add allergies, medications, conditions, vaccinations, or medical
                reports to view your historical logs.
              </p>
            </div>
          )}
        </div>
      </DoubleBorderCard>
    </div>
  );
}

function formatDate(value: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function TimelineItem({
  icon,
  title,
  description,
  date,
  active = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  date: string;
  active?: boolean;
}) {
  return (
    <div className="group relative flex items-start gap-2.5 rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] p-3 shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_4px_rgba(0,0,0,0.04)] transition-all sm:gap-4 sm:p-3.5">
      {/* Icon Node */}
      <div className="relative z-10 shrink-0 rounded-xl bg-[#E6E0D6] p-0.5 shadow-[0_1px_0_rgba(255,255,255,0.8),0_1.5px_3px_rgba(0,0,0,0.08)_inset]">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-300 sm:h-9 sm:w-9 ${
            active
              ? "border-[#18392B]/30 bg-gradient-to-b from-[#224f3c] via-[#18392B] to-[#10271d] text-[#F8F6F0] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_2px_6px_rgba(24,57,43,0.3)]"
              : "border-black/5 bg-white text-[#18392B] shadow-[0_1px_0_rgba(255,255,255,1)_inset]"
          }`}
        >
          {icon}
        </div>
      </div>

      {/* Item Body */}
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <p className="font-sans text-xs font-semibold leading-snug text-[#121312] sm:text-sm">
            {title}
          </p>

          <span className="shrink-0 font-mono text-[8px] uppercase tracking-wider text-[#121312]/40 sm:text-[9px]">
            {date}
          </span>
        </div>

        <p className="mt-1 font-mono text-[11px] leading-relaxed text-[#121312]/60 sm:text-xs">
          {description}
        </p>
      </div>
    </div>
  );
}
