import Link from "next/link";
import { QrCode, Stethoscope } from "lucide-react";

export default function ShareCard() {
  return (
    <section className="relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-[#111712] p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#1F7A4F]/10 blur-[50px]" />

      <div className="relative">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1F7A4F]/10 text-[#62C58C]">
          <Stethoscope size={20} />
        </div>

        <h3 className="mt-5 text-base font-semibold">Ready to see a doctor?</h3>

        <p className="mt-2 text-xs leading-5 text-white/30">
          Share your medical history securely with a doctor in seconds.
        </p>

        <Link
          href="/dashboard/share"
          className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#55B981]/20 bg-[#1F7A4F]/10 text-xs font-semibold text-[#62C58C] transition hover:bg-[#1F7A4F]/15"
        >
          <QrCode size={14} />
          Open sharing
        </Link>
      </div>
    </section>
  );
}
