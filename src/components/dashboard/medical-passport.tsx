import Link from "next/link";
import { ArrowUpRight, QrCode, ShieldCheck } from "lucide-react";

export default function MedicalPassport({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[26px] border border-[#55B981]/15 bg-[#14251B] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] sm:p-7">
      <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#2B8A5A]/15 blur-[80px]" />

      <div className="pointer-events-none absolute -bottom-24 -right-12 h-48 w-48 rounded-full border border-white/[0.04]" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-[#62C58C]" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#62C58C]">
                Medical Passport
              </p>
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
              {name}
            </h2>

            <p className="mt-1 text-xs text-white/30">{email}</p>
          </div>

          <Link
            href="/dashboard/share"
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] text-white/70 transition hover:bg-white/[0.09] hover:text-white"
          >
            <QrCode size={22} />
          </Link>
        </div>

        <div className="my-7 h-px bg-white/[0.07]" />

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <PassportField label="Status" value="Active" green />

          <PassportField label="Records" value="0" />

          <PassportField label="Sharing" value="Private" />

          <PassportField label="Updated" value="Just now" />
        </div>

        <Link
          href="/dashboard/share"
          className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#246B45] text-xs font-semibold text-white shadow-[0_8px_24px_rgba(36,107,69,0.18)] transition hover:bg-[#2B7A4F]"
        >
          <QrCode size={15} />
          Share medical passport
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  );
}

function PassportField({
  label,
  value,
  green = false,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div>
      <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/25">
        {label}
      </p>

      <p
        className={`mt-1 text-xs font-medium ${
          green ? "text-[#62C58C]" : "text-white/70"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
