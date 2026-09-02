"use client";

import { AlertTriangle, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface EmailVerificationBannerProps {
  email: string;
}

export default function EmailVerificationBanner({
  email,
}: EmailVerificationBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!email || dismissed) {
    return null;
  }

  return (
    <div className="relative mb-5 overflow-hidden rounded-2xl border border-[#D7A73A]/20 bg-[#18160F]">
      {/* Left accent */}
      <div className="absolute inset-y-0 left-0 w-1 bg-[#D7A73A]" />

      <div className="flex flex-col gap-4 p-4 pl-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Message */}
        <div className="flex min-w-0 gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D7A73A]/10 text-[#D7A73A]">
            <AlertTriangle size={17} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-[#ECE8DB]">
              Your email isn&apos;t verified
            </p>

            <p className="mt-0.5 text-xs leading-5 text-[#958F7C]">
              Verify your email to keep your MediPass account secure.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 pl-12 sm:pl-0">
          <Link
            href={`/auth/verify-email?email=${encodeURIComponent(email)}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#D7A73A] px-3 text-xs font-semibold text-[#171309] transition hover:bg-[#E5B94F]"
          >
            Verify email
            <ArrowRight size={14} />
          </Link>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-lg p-2 text-[#706B5D] transition hover:bg-white/[0.05] hover:text-[#A9A392]"
            aria-label="Dismiss email verification warning"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
