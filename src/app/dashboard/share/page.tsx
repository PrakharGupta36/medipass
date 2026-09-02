"use client";

import {
  Check,
  Clock3,
  Copy,
  Lock,
  QrCode,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";

export default function SharePage() {
  const [duration, setDuration] = useState("15 minutes");
  const [copied, setCopied] = useState(false);

  function copyLink() {
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div>
      <div className="mb-7 lg:hidden">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#62C58C]">
          Sharing
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Share your medical passport
        </h1>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        {/* QR */}
        <section className="rounded-[26px] border border-white/[0.07] bg-[#111712] p-6 sm:p-8">
          <div className="mb-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#62C58C]">
              Secure sharing
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Give a doctor temporary access
            </h2>

            <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
              Generate a temporary QR code that lets a doctor view the medical
              information you choose to share.
            </p>
          </div>

          <div className="flex flex-col items-center rounded-[22px] border border-white/[0.07] bg-[#0C110E] px-6 py-10">
            <div className="flex h-56 w-56 items-center justify-center rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
              <QrCode size={180} strokeWidth={1.2} className="text-[#111]" />
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-white/30">
              <Clock3 size={14} />
              Expires in {duration}
            </div>
          </div>

          <button
            onClick={copyLink}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#246B45] text-xs font-semibold text-white transition hover:bg-[#2B7A4F]"
          >
            {copied ? (
              <>
                <Check size={15} />
                Link copied
              </>
            ) : (
              <>
                <Copy size={15} />
                Copy secure link
              </>
            )}
          </button>
        </section>

        {/* Settings */}
        <section className="space-y-5">
          <div className="rounded-[26px] border border-white/[0.07] bg-[#111712] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F7A4F]/10 text-[#62C58C]">
                <Clock3 size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold">Access duration</p>

                <p className="text-[10px] text-white/25">
                  The link automatically expires.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {["15 minutes", "1 hour", "24 hours"].map((item) => (
                <button
                  key={item}
                  onClick={() => setDuration(item)}
                  className={`rounded-xl border px-2 py-3 text-[10px] font-medium transition ${
                    duration === item
                      ? "border-[#62C58C]/25 bg-[#1F7A4F]/10 text-[#62C58C]"
                      : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:bg-white/[0.04]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[26px] border border-white/[0.07] bg-[#111712] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F7A4F]/10 text-[#62C58C]">
                <Lock size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold">Shared information</p>

                <p className="text-[10px] text-white/25">
                  Choose what the doctor can see.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <Permission label="Basic profile" />
              <Permission label="Allergies" />
              <Permission label="Medications" />
              <Permission label="Conditions" />
              <Permission label="Medical reports" />
            </div>
          </div>

          <div className="rounded-[26px] border border-[#62C58C]/10 bg-[#102018] p-6">
            <div className="flex gap-3">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-[#62C58C]"
              />

              <div>
                <p className="text-sm font-medium">You&apos;re in control</p>

                <p className="mt-1 text-xs leading-5 text-white/30">
                  Your medical information is never embedded directly into the
                  QR code. The QR only contains a temporary access token.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Permission({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
      <div className="flex items-center gap-2.5">
        <UserRound size={14} className="text-white/25" />

        <span className="text-xs text-white/55">{label}</span>
      </div>

      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1F7A4F]/20 text-[#62C58C]">
        <Check size={12} />
      </div>
    </div>
  );
}
