import {
  AlertTriangle,
  ChevronRight,
  Droplets,
  FileText,
  HeartPulse,
  Pill,
  Plus,
  ShieldAlert,
  Syringe,
} from "lucide-react";
import Link from "next/link";

export default function HealthPage() {
  return (
    <div>
      {/* Mobile title */}
      <div className="mb-7 lg:hidden">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#62C58C]">
          Health
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Medical information
        </h1>
      </div>

      {/* Overview */}
      <section className="mb-5 rounded-[26px] border border-white/[0.07] bg-[#111712] p-6 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
              Health profile
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              Your medical information
            </h2>

            <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
              Keep important health information in one place. You can update
              these details whenever you need.
            </p>
          </div>

          <Link
            href="/dashboard/health/add"
            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#246B45] px-4 text-xs font-semibold text-white transition hover:bg-[#2B7A4F]"
          >
            <Plus size={15} />
            Add information
          </Link>
        </div>
      </section>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <HealthSection
          icon={<Droplets size={19} />}
          title="Blood group"
          description="Your blood type"
        />

        <HealthSection
          icon={<AlertTriangle size={19} />}
          title="Allergies"
          description="Known allergies"
        />

        <HealthSection
          icon={<Pill size={19} />}
          title="Medications"
          description="Current medications"
        />

        <HealthSection
          icon={<HeartPulse size={19} />}
          title="Conditions"
          description="Medical conditions"
        />

        <HealthSection
          icon={<Syringe size={19} />}
          title="Vaccinations"
          description="Vaccination history"
        />

        <HealthSection
          icon={<ShieldAlert size={19} />}
          title="Emergency"
          description="Emergency information"
        />
      </div>

      {/* Reports */}
      <section className="mt-5 rounded-[26px] border border-white/[0.07] bg-[#111712]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1F7A4F]/10 text-[#62C58C]">
              <FileText size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold">Medical reports</p>

              <p className="mt-0.5 text-[10px] text-white/25">
                Upload prescriptions, reports and documents
              </p>
            </div>
          </div>

          <button className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.07] px-3 text-xs font-medium text-white/50 transition hover:bg-white/[0.04] hover:text-white">
            <Plus size={14} />
            Add
          </button>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.025] text-white/20">
            <FileText size={22} />
          </div>

          <h3 className="mt-4 text-sm font-medium text-white/60">
            No medical reports yet
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-white/25">
            Upload your first medical document to keep everything together.
          </p>
        </div>
      </section>
    </div>
  );
}

function HealthSection({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href="/dashboard/health"
      className="group rounded-[22px] border border-white/[0.07] bg-[#111712] p-5 transition hover:border-[#62C58C]/20 hover:bg-[#141B16]"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F7A4F]/10 text-[#62C58C]">
          {icon}
        </div>

        <ChevronRight
          size={16}
          className="text-white/15 transition group-hover:translate-x-0.5 group-hover:text-[#62C58C]"
        />
      </div>

      <p className="mt-6 text-sm font-medium text-white/75">{title}</p>

      <p className="mt-1 text-xs text-white/25">{description}</p>

      <p className="mt-5 text-[10px] font-medium text-white/20">Not added</p>
    </Link>
  );
}
