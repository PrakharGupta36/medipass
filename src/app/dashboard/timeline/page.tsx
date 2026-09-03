import { createClient } from "@/lib/supabase/server";
import {
  AlertTriangle,
  FileText,
  HeartPulse,
  Pill,
  ShieldCheck,
  Syringe,
  Stethoscope,
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

  // Medical events
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

  // Medical reports
  for (const report of reports || []) {
    timeline.push({
      id: `report-${report.id}`,
      date: report.report_date || report.created_at.slice(0, 10),
      title: report.title,
      description: report.report_type || "Medical report",
      icon: <FileText size={16} />,
    });
  }

  // Profile creation
  if (profile) {
    timeline.push({
      id: "profile-created",
      date: profile.created_at.slice(0, 10),
      title: "MediPass created",
      description: "Your medical passport was created.",
      icon: <ShieldCheck size={16} />,
    });
  }

  timeline.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      {/* Mobile heading */}
      

      <section className="rounded-[26px] border border-white/[0.07] bg-[#111712]">
        <div className="border-b border-white/[0.06] px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
            History
          </p>

          <h2 className="mt-1 text-base font-semibold">Your medical journey</h2>

          <p className="mt-1 text-xs text-white/25">
            Your health records and medical events appear here automatically.
          </p>
        </div>

        <div className="relative px-6 py-8 sm:px-10">
          {timeline.length > 0 && (
            <div className="absolute bottom-8 left-[42px] top-8 w-px bg-white/[0.07] sm:left-[58px]" />
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
              />
            ))
          ) : (
            <div className="py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.025] text-white/20">
                <HeartPulse size={22} />
              </div>

              <h3 className="mt-4 text-sm font-medium text-white/60">
                Your timeline is empty
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-white/25">
                Add allergies, medications, conditions, vaccinations or medical
                reports and they will appear here.
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

  return date.toLocaleDateString(undefined, {
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
    <div className="relative flex gap-5 pb-9 last:pb-0">
      <div
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
          active
            ? "border-[#62C58C]/30 bg-[#1F7A4F] text-[#A7E1BE]"
            : "border-white/[0.08] bg-[#151B16] text-white/25"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1 pt-1">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium text-white/70">{title}</p>

          <span className="shrink-0 text-[10px] text-white/20">{date}</span>
        </div>

        <p className="mt-1 text-xs leading-5 text-white/30">{description}</p>
      </div>
    </div>
  );
}
