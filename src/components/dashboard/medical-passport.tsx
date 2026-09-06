// src/components/dashboard/medical-passport.tsx

"use client";

import { DoubleBorderCard } from "@/components/ui/double-border-card";
import { ArrowUpRight, Fingerprint, QrCode } from "lucide-react";
import Link from "next/link";

export default function MedicalPassport({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  return (
    <DoubleBorderCard variant="light" className="w-full">
      <div className="relative z-10 flex flex-col justify-between h-full text-[#121312]">
        {/* Header Block */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Raised Monogram Seal */}

          {/* Identity Meta */}
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#18392B]/20 bg-[#18392B]/5 px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#18392B] shadow-[0_1px_2px_rgba(0,0,0,0.04)_inset]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#18392B] animate-pulse" />
              Verified Credential
            </span>

            <h2 className="mt-1 truncate font-serif text-2xl font-normal tracking-tight text-[#121312]">
              {name}
            </h2>

            <p className="truncate font-mono text-xs text-[#121312]/50">
              {email}
            </p>
          </div>

          {/* Tactile Inset QR Button Well */}
          <div className="p-1 rounded-2xl bg-[#E5DFD5] shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.12)_inset]">
            <Link
              href="/dashboard/share"
              aria-label="Share medical passport"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F0ECE6] text-[#121312] shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_4px_rgba(0,0,0,0.08)] transition-all active:scale-[0.96]"
            >
              <QrCode size={17} />
            </Link>
          </div>
        </div>

        {/* Carved Perforated Divider */}
        <div className="relative my-5 h-2 rounded-full bg-[#E3DDD3] shadow-[0_1px_2px_rgba(0,0,0,0.12)_inset,0_1px_0_rgba(255,255,255,0.8)]">
          <div
            className="h-full w-full opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(18,19,18,0.3) 0 4px, transparent 4px 10px)",
            }}
          />
        </div>

        {/* Biometric Status Row */}
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[#121312]/60">
          <div className="flex items-center gap-2">
            <span className="text-[#18392B]">
              <Fingerprint size={15} />
            </span>
            <span>Biometric Vault Active</span>
          </div>
          <span className="font-semibold text-[#18392B]">
            Hardware Encrypted
          </span>
        </div>

        {/* Inset Metric Fields Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          <PassportField label="Status" value="Active" highlight />
          <PassportField label="Records" value="0 Entries" />
          <PassportField label="Sharing" value="Encrypted" />
          <PassportField label="Updated" value="Just Now" />
        </div>

        {/* Tactile Push Button */}
        <Link
          href="/dashboard/share"
          className="group relative mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#18392B]/30 bg-gradient-to-b from-[#224f3c] via-[#18392B] to-[#10271d] font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_4px_12px_rgba(24,57,43,0.3)] transition-all active:scale-[0.98]"
        >
          <QrCode size={15} />
          <span>Share Medical Passport</span>
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </DoubleBorderCard>
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
    <div className="rounded-xl border border-black/5 bg-[#E6E0D6] p-2.5 shadow-[0_1px_0_rgba(255,255,255,0.8),0_1.5px_3px_rgba(0,0,0,0.08)_inset]">
      <p className="truncate font-mono text-[8px] uppercase tracking-wider text-[#121312]/50">
        {label}
      </p>
      <p
        className={`mt-0.5 truncate text-xs font-semibold tabular-nums ${
          highlight ? "text-[#18392B]" : "text-[#121312]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
