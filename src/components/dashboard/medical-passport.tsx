// src/components/dashboard/medical-passport.tsx

import { ArrowUpRight, Fingerprint, QrCode, ShieldCheck } from "lucide-react";
import Link from "next/link";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function MedicalPassport({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const initials = getInitials(name);

  return (
    <section className="group relative overflow-hidden rounded-2xl border border-[#121312]/10 bg-gradient-to-br from-white to-[#FBFAF6] shadow-[0_4px_28px_-6px_rgba(18,19,18,0.06)] transition-all duration-300 hover:border-[#121312]/20 hover:shadow-[0_10px_40px_-8px_rgba(18,19,18,0.1)] sm:rounded-3xl">
      <div className="relative p-4 sm:p-6 lg:p-7">
        {/* Identity */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Monogram seal */}
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#18392B] font-serif text-base text-[#F8F6F0] shadow-inner sm:h-16 sm:w-16 sm:rounded-2xl sm:text-xl">
            {initials}

            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#18392B] text-white sm:h-5 sm:w-5">
              <ShieldCheck size={9} strokeWidth={2.5} className="sm:hidden" />
              <ShieldCheck
                size={11}
                strokeWidth={2.5}
                className="hidden sm:block"
              />
            </span>
          </div>

          {/* User information */}
          <div className="min-w-0 flex-1">
            <span className="block truncate font-mono text-[8px] uppercase tracking-[0.16em] text-[#18392B] sm:text-[9px] sm:tracking-[0.2em]">
              Verified Digital Credential
            </span>

            <h2 className="mt-1 truncate font-serif text-xl font-normal tracking-tight text-[#121312] sm:mt-1.5 sm:text-2xl lg:text-3xl">
              {name}
            </h2>

            <p className="mt-0.5 truncate font-mono text-[10px] text-[#121312]/40 sm:text-xs">
              {email}
            </p>
          </div>

          {/* QR action */}
          <Link
            href="/dashboard/share"
            aria-label="Share medical passport"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#121312]/10 bg-[#F8F6F0] text-[#121312] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#121312] hover:bg-[#121312] hover:text-[#F8F6F0] sm:h-11 sm:w-11"
          >
            <QrCode size={17} strokeWidth={1.8} />
          </Link>
        </div>

        {/* Perforated stub divider */}
        <div className="relative my-5 sm:my-6">
          <div
            className="h-px w-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(18,19,18,0.16) 0 4px, transparent 4px 9px)",
            }}
          />

          <div className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F8F6F0]" />

          <div className="absolute right-0 top-1/2 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F8F6F0]" />
        </div>

        {/* Security status */}
        <div className="flex flex-col gap-2.5 font-mono text-[8px] uppercase tracking-[0.14em] text-[#121312]/50 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between sm:text-[9px] sm:tracking-[0.16em]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center text-[#18392B]">
              <Fingerprint size={14} className="animate-pulse" />
            </span>

            <span>Biometric Lock: Enabled</span>
          </div>

          <span className="pl-5 text-[#18392B] min-[400px]:pl-0">
            Active State
          </span>
        </div>

        {/* Passport fields */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:grid-cols-4 sm:gap-3">
          <PassportField label="Status" value="Active" highlight />

          <PassportField label="Records" value="0 Entries" />

          <PassportField label="Sharing" value="Controlled" />

          <PassportField label="Updated" value="Just Now" />
        </div>

        {/* Share button */}
        <Link
          href="/dashboard/share"
          className="group/btn mt-4 flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#18392B] px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#F8F6F0] shadow-sm transition-all duration-200 hover:bg-[#122A20] sm:mt-6 sm:h-12 sm:px-4 sm:text-xs sm:tracking-wider"
        >
          <QrCode size={14} className="shrink-0 sm:h-[15px] sm:w-[15px]" />

          <span className="truncate">Share Medical Passport</span>

          <ArrowUpRight
            size={14}
            className="shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 sm:h-[15px] sm:w-[15px]"
          />
        </Link>
      </div>
    </section>
  );
}

function PassportField({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-[#121312]/5 bg-[#F8F6F0] p-2.5 transition-colors hover:border-[#121312]/15 sm:rounded-xl sm:p-3">
      <p className="truncate font-mono text-[7px] uppercase tracking-[0.12em] text-[#121312]/40 sm:text-[8px] sm:tracking-[0.16em]">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-[10px] font-semibold tabular-nums sm:text-xs ${
          highlight ? "text-[#18392B]" : "text-[#121312]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
