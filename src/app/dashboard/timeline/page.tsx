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
        icon = <AlertTriangle size={16} />;
        break;
      case "medication":
        icon = <Pill size={16} />;
        break;
      case "vaccination":
        icon = <Syringe size={16} />;
        break;
      case "condition":
        icon = <HeartPulse size={16} />;
        break;
      case "doctor_visit":
        icon = <Stethoscope size={16} />;
        break;
      default:
        icon = <HeartPulse size={16} />;
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
      icon: <FileText size={16} />,
    });
  }

  if (profile) {
    timeline.push({
      id: "profile-created",
      date: profile.created_at.slice(0, 10),
      title: "MediPass Created",
      description:
        "Your security credentials and medical profile were generated.",
      icon: <ShieldCheck size={16} />,
    });
  }

  timeline.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="w-full max-w-[1200px] text-[#121312]">
      <DoubleBorderCard variant="light" className="w-full">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-black/5 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#18392B] shadow-[0_0_4px_rgba(24,57,43,0.4)]" />
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#121312]/40">
                Medical History
              </p>
            </div>

            <h1 className="mt-1.5 font-serif text-3xl font-normal text-[#121312] sm:text-4xl">
              Timeline Log
            </h1>

            <p className="mt-1 max-w-xl font-mono text-xs text-[#121312]/60">
              Chronological log of diagnostic reports, prescriptions, and health
              updates.
            </p>
          </div>

          <div className="relative hidden sm:flex h-4 w-4 items-center justify-center rounded-full bg-[#E0D9CE] shadow-[0_1px_2px_rgba(0,0,0,0.15)_inset,0_1px_0_rgba(255,255,255,0.8)]">
            <div className="h-1.5 w-1.5 rounded-full bg-[#18392B] shadow-[0_0_4px_rgba(24,57,43,0.6)]" />
          </div>
        </div>

        {/* Timeline Content */}
        <div className="mt-6 rounded-2xl border border-black/5 bg-[#E6E0D6] p-4 sm:p-6 shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.08)_inset]">
          {timeline.length > 0 ? (
            <div className="relative">
              {/* Vertical Guide Rail */}
              <div className="absolute bottom-6 left-[19px] top-6 w-[2px] rounded-full bg-gradient-to-b from-black/10 via-black/10 to-transparent shadow-[1px_0_0_rgba(255,255,255,0.8)]" />

              <div className="space-y-3">
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
            <div className="flex flex-col items-center justify-center rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] px-6 py-12 text-center shadow-[0_1px_0_rgba(255,255,255,1)_inset]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/5 bg-[#E6E0D6] text-[#121312]/30 shadow-[0_1px_2px_rgba(0,0,0,0.12)_inset,0_1px_0_rgba(255,255,255,0.8)]">
                <HeartPulse size={20} />
              </div>

              <h2 className="mt-4 font-serif text-lg font-normal text-[#121312]">
                Your timeline is empty
              </h2>

              <p className="mt-1 max-w-sm font-mono text-xs text-[#121312]/50">
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
    <div className="group relative flex items-start gap-4 rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] p-3.5 shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_4px_rgba(0,0,0,0.04)] transition-all">
      {/* Icon Node */}
      <div className="relative z-10 p-0.5 rounded-xl bg-[#E6E0D6] shadow-[0_1px_0_rgba(255,255,255,0.8),0_1.5px_3px_rgba(0,0,0,0.08)_inset]">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <p className="text-xs font-semibold text-[#121312]">{title}</p>

          <span className="font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
            {date}
          </span>
        </div>

        <p className="mt-1 font-mono text-xs text-[#121312]/60 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
