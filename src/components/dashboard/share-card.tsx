// src/components/dashboard/share-card.tsx

import { QrCode, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function ShareCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#18392B] bg-[#18392B] p-6 text-[#F8F6F0] shadow-[0_8px_32px_-8px_rgba(24,57,43,0.5)]">
      {/* Security-paper texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 14px)",
        }}
      />
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/[0.05] blur-2xl" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm">
            <Stethoscope size={20} />
          </div>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
        </div>

        <h3 className="mt-5 font-serif text-2xl font-normal">
          Ready to share?
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-[#F8F6F0]/70">
          Generate a single-use secure link or QR code to share your health
          history with your physician.
        </p>

        <Link
          href="/dashboard/share"
          className="group/btn mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 font-mono text-xs font-semibold uppercase tracking-wider text-[#18392B] transition-all duration-200 hover:bg-[#F0EDE6]"
        >
          <QrCode
            size={15}
            className="transition-transform duration-200 group-hover/btn:rotate-[8deg]"
          />
          <span>Open Sharing Hub</span>
        </Link>
      </div>
    </section>
  );
}
