// src/components/dashboard/email-verification-banner.tsx

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
    <div className="relative overflow-hidden rounded-2xl border border-[#B38029]/30 bg-[#FFFDF5] p-4 text-[#4A3710]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#B38029]/10 text-[#B38029]">
            <AlertTriangle size={16} />
          </div>

          <div>
            <p className="text-xs font-semibold">Email Unverified</p>
            <p className="mt-0.5 text-xs text-[#4A3710]/70">
              Please verify <span className="font-mono">{email}</span> to secure
              access.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/auth/verify-email?email=${encodeURIComponent(email)}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#B38029] px-3 font-mono text-xs font-semibold text-white transition hover:bg-[#966A20]"
          >
            <span>Verify</span>
            <ArrowRight size={13} />
          </Link>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-lg p-1.5 text-[#4A3710]/40 hover:bg-[#B38029]/10 hover:text-[#4A3710]"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
