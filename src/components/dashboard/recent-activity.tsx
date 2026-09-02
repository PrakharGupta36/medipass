import Link from "next/link";

export default function RecentActivity() {
  return (
    <section className="rounded-[26px] border border-white/[0.07] bg-[#111712]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
            Activity
          </p>

          <h2 className="mt-1 text-base font-semibold">Recent activity</h2>
        </div>

        <Link
          href="/dashboard/timeline"
          className="text-xs font-medium text-[#62C58C]"
        >
          Timeline
        </Link>
      </div>

      <ActivityRow
        title="MediPass created"
        description="Your medical passport is ready."
        date="Today"
        active
      />

      <ActivityRow
        title="No medical records yet"
        description="Add your first health record."
        date="—"
      />
    </section>
  );
}

function ActivityRow({
  title,
  description,
  date,
  active = false,
}: {
  title: string;
  description: string;
  date: string;
  active?: boolean;
}) {
  return (
    <div className="flex gap-3.5 border-b border-white/[0.06] px-6 py-5 last:border-b-0">
      <div className="pt-1.5">
        <div
          className={`h-2 w-2 rounded-full ${
            active
              ? "bg-[#55B981] shadow-[0_0_10px_rgba(85,185,129,0.5)]"
              : "bg-white/15"
          }`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs font-medium text-white/70">{title}</p>

          <span className="shrink-0 text-[9px] text-white/20">{date}</span>
        </div>

        <p className="mt-1 text-[11px] leading-5 text-white/30">
          {description}
        </p>
      </div>
    </div>
  );
}
