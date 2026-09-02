import {
  Activity,
  FileText,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

export default function TimelinePage() {
  return (
    <div>
      <div className="mb-7 lg:hidden">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#62C58C]">
          Timeline
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Medical timeline
        </h1>
      </div>

      <section className="rounded-[26px] border border-white/[0.07] bg-[#111712]">
        <div className="border-b border-white/[0.06] px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
            History
          </p>

          <h2 className="mt-1 text-base font-semibold">Your medical journey</h2>

          <p className="mt-1 text-xs text-white/25">
            Important events and updates will appear here.
          </p>
        </div>

        <div className="relative px-6 py-8 sm:px-10">
          <div className="absolute bottom-8 left-[42px] top-8 w-px bg-white/[0.07] sm:left-[58px]" />

          <TimelineItem
            icon={<ShieldCheck size={16} />}
            title="MediPass created"
            description="Your medical passport was created."
            date="Today"
            active
          />

          <TimelineItem
            icon={<HeartPulse size={16} />}
            title="Health profile"
            description="Your health information will appear here when added."
            date="—"
          />

          <TimelineItem
            icon={<Stethoscope size={16} />}
            title="Doctor visits"
            description="Doctor visits and shared records will appear here."
            date="—"
          />

          <TimelineItem
            icon={<FileText size={16} />}
            title="Medical reports"
            description="Uploaded reports and documents will appear here."
            date="—"
          />
        </div>
      </section>
    </div>
  );
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
