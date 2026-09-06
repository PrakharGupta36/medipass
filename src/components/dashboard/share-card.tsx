// src/components/dashboard/share-card.tsx

"use client";

import { QrCode, Stethoscope } from "lucide-react";
import Link from "next/link";
import { DoubleBorderCard } from "@/components/ui/double-border-card";

export default function ShareCard() {
  return (
    <DoubleBorderCard variant="emerald" className="w-full text-[#F8F6F0]">
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-gradient-to-b from-white/20 to-white/5 text-white shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_3px_6px_rgba(0,0,0,0.2)]">
            <Stethoscope size={18} />
          </div>

          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          </span>
        </div>

        <div className="mt-5">
          <p className="font-mono text-[9px] uppercase tracking-wider text-emerald-200/70">
            Instant Authorization
          </p>
          <h3 className="mt-1 font-serif text-2xl font-normal text-white">
            Ready to share?
          </h3>

          <p className="mt-1.5 text-xs leading-relaxed text-emerald-100/80">
            Generate a single-use secure link or QR code for instant provider
            access.
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-[#0c1f17] p-1 shadow-[0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)_inset]">
          <Link
            href="/dashboard/share"
            className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/40 bg-gradient-to-b from-white via-[#F6F3ED] to-[#EBE5DB] font-mono text-xs font-semibold uppercase tracking-wider text-[#122b20] shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_4px_10px_rgba(0,0,0,0.2)] transition-all active:scale-[0.98]"
          >
            <QrCode size={15} />
            <span>Open Sharing Hub</span>
          </Link>
        </div>
      </div>
    </DoubleBorderCard>
  );
}
