import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ChevronRight,
  FileText,
  Pill,
} from "lucide-react";

export default function HealthOverview() {
  return (
    <section className="rounded-[26px] border border-white/[0.07] bg-[#111712] p-6 sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
            Health
          </p>

          <h2 className="mt-1 text-base font-semibold">Medical information</h2>
        </div>

        <Link
          href="/dashboard/health"
          className="flex items-center gap-1 text-xs font-medium text-[#62C58C]"
        >
          View all
          <ChevronRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <HealthCard icon={<AlertTriangle size={17} />} label="Allergies" />

        <HealthCard icon={<Pill size={17} />} label="Medications" />

        <HealthCard icon={<Activity size={17} />} label="Conditions" />

        <HealthCard icon={<FileText size={17} />} label="Reports" />
      </div>
    </section>
  );
}

function HealthCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Link
      href="/dashboard/health"
      className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:border-white/[0.1] hover:bg-white/[0.035]"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F7A4F]/10 text-[#55B981]">
        {icon}
      </div>

      <p className="mt-4 text-xs font-medium text-white/65">{label}</p>

      <p className="mt-1 text-[10px] text-white/25">Not added</p>
    </Link>
  );
}
