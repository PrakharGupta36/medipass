// src/app/dashboard/timeline/page.tsx

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
    <div className="w-full text-[#121312]">
      <section className="animate-rise-in rounded-3xl border border-[#121312]/10 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)]">
        <div className="border-b border-[#121312]/10 px-6 py-5 sm:px-8">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#121312]/40">
            Medical History
          </p>

          <h1 className="mt-1 font-serif text-2xl font-normal text-[#121312] sm:text-3xl">
            Timeline Log
          </h1>

          <p className="mt-1 font-mono text-xs text-[#121312]/50">
            Chronological log of diagnostic reports, prescriptions, and health
            updates.
          </p>
        </div>

        <div className="relative px-6 py-8 sm:px-10">
          {timeline.length > 0 && (
            <div
              className="animate-grow-line absolute bottom-10 left-[41px] top-10 w-px bg-[#121312]/10 sm:left-[57px]"
              style={{ animationDelay: "150ms" }}
            />
          )}

          {timeline.length > 0 ? (
            timeline.map((item, index) => (
              <TimelineItem
                key={item.id}
                icon={item.icon}
                title={item.title}
                description={item.description}
                date={formatDate(item.date)}
                active={index === 0}
                delay={220 + index * 90}
              />
            ))
          ) : (
            <div
              className="animate-rise-in py-16 text-center"
              style={{ animationDelay: "150ms" }}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F6F0] text-[#121312]/30">
                <HeartPulse size={20} />
              </div>

              <h2 className="mt-4 font-serif text-lg font-normal text-[#121312]">
                Your timeline is empty
              </h2>

              <p className="mx-auto mt-1 max-w-sm font-mono text-xs text-[#121312]/40">
                Add allergies, medications, conditions, vaccinations, or medical
                reports to view your historical logs.
              </p>
            </div>
          )}
        </div>
      </section>
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
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  date: string;
  active?: boolean;
  delay?: number;
}) {
  return (
    <div
      className="animate-rise-in relative flex gap-5 pb-8 last:pb-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`animate-pop-in relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
          active
            ? "border-[#18392B] bg-[#18392B] text-[#F8F6F0]"
            : "border-[#121312]/10 bg-[#F8F6F0] text-[#121312]/60"
        }`}
        style={{ animationDelay: `${delay + 120}ms` }}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1 pt-1">
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs font-semibold text-[#121312]">{title}</p>

          <span className="font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
            {date}
          </span>
        </div>

        <p className="mt-1 text-xs text-[#121312]/60 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
