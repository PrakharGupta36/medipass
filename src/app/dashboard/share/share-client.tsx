// src/app/dashboard/share/share-client.tsx

"use client";

import { useState, useTransition } from "react";
import {
  Check,
  Clock3,
  Copy,
  ExternalLink,
  Lock,
  QrCode,
  ShieldCheck,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { createShareSession } from "./actions";
import RecentShares from "./recent-shares";

type Session = {
  id: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
  permissions: Record<string, boolean>;
};

export default function ShareClient({ sessions }: { sessions: Session[] }) {
  const [duration, setDuration] = useState("15 minutes");

  const [token, setToken] = useState<string | null>(null);

  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  const [pending, startTransition] = useTransition();

  const [permissions, setPermissions] = useState({
    basic_profile: true,
    allergies: true,
    medications: true,
    conditions: true,
    vaccinations: false,
    reports: false,
  });

  function generate() {
    const form = new FormData();

    form.set("duration", duration);

    Object.entries(permissions).forEach(([key, value]) => {
      if (value) {
        form.set(key, "on");
      }
    });

    startTransition(async () => {
      const result = await createShareSession(form);

      setToken(result.token);
      setExpiresAt(result.expiresAt);
    });
  }

  const link =
    token && typeof window !== "undefined"
      ? `${window.location.origin}/share/${token}`
      : "";

  async function copyLink() {
    if (!link) return;

    await navigator.clipboard.writeText(link);

    setCopied(true);

    setTimeout(() => setCopied(false), 1800);
  }

  function toggle(key: keyof typeof permissions) {
    setPermissions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <div>
      <div className="grid items-start gap-5 xl:grid-cols-2">
        {/* ================================================= */}
        {/* LEFT — QR + ACCESS DURATION */}
        {/* ================================================= */}

        <section className="rounded-[26px] border border-white/[0.07] bg-[#111712] p-6 sm:p-8">
          {/* Header */}
          <div className="mb-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#62C58C]">
              Secure sharing
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Give a doctor temporary access
            </h2>

            <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
              Generate a short-lived QR code. Medical data stays in the
              database; the QR contains only a random access token.
            </p>
          </div>

          {/* QR */}
          <div className="flex flex-col items-center rounded-[22px] border border-white/[0.07] bg-[#0C110E] px-6 py-10">
            <div className="flex h-56 w-56 items-center justify-center rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
              {token ? (
                <QRCodeSVG
                  value={link}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#111111"
                  includeMargin
                />
              ) : (
                <QrCode size={180} strokeWidth={1.2} className="text-[#111]" />
              )}
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-white/30">
              <Clock3 size={14} />

              {expiresAt
                ? `Expires ${new Date(expiresAt).toLocaleString()}`
                : "No active share yet"}
            </div>
          </div>

          {/* Actions */}
          {token ? (
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button
                onClick={copyLink}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#246B45] text-xs font-semibold transition hover:bg-[#2C7D53]"
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

              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.07] text-xs font-semibold text-white/55 transition hover:border-[#62C58C]/20 hover:text-[#62C58C]"
              >
                <ExternalLink size={14} />
                Open doctor view
              </a>
            </div>
          ) : (
            <button
              disabled={pending}
              onClick={generate}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#246B45] text-xs font-semibold transition hover:bg-[#2C7D53] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Generating secure link…" : "Generate secure QR"}
            </button>
          )}

          {/* ================================================= */}
          {/* ACCESS DURATION */}
          {/* ================================================= */}

          <div className="mt-5 rounded-[22px] border border-white/[0.07] bg-[#0C110E] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F7A4F]/10 text-[#62C58C]">
                <Clock3 size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold">Access duration</p>

                <p className="mt-0.5 text-[10px] text-white/25">
                  The link automatically expires.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {["15 minutes", "1 hour", "24 hours"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDuration(item)}
                  className={[
                    "rounded-xl border px-2 py-3 text-[10px] font-medium transition",
                    duration === item
                      ? "border-[#62C58C]/25 bg-[#1F7A4F]/10 text-[#62C58C]"
                      : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:border-white/[0.1] hover:text-white/45",
                  ].join(" ")}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* RIGHT — ACCESS CONTROL + HISTORY */}
        {/* ================================================= */}

        <section className="space-y-5">
          {/* Shared information */}
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
              {[
                ["basic_profile", "Basic profile"],
                ["allergies", "Allergies"],
                ["medications", "Medications"],
                ["conditions", "Conditions"],
                ["vaccinations", "Vaccinations"],
                ["reports", "Medical reports"],
              ].map(([key, label]) => {
                const enabled = permissions[key as keyof typeof permissions];

                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => toggle(key as keyof typeof permissions)}
                    className="group flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3 text-left transition hover:border-white/[0.09] hover:bg-white/[0.035]"
                  >
                    <span className="text-xs text-white/55 transition group-hover:text-white/70">
                      {label}
                    </span>

                    <span
                      className={[
                        "flex h-5 w-5 items-center justify-center rounded-full transition",
                        enabled
                          ? "bg-[#1F7A4F]/20 text-[#62C58C]"
                          : "bg-white/[0.05] text-white/15",
                      ].join(" ")}
                    >
                      {enabled ? <Check size={12} /> : <X size={12} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        

          {/* Recent shares */}
          <RecentShares sessions={sessions} />
        </section>
      </div>
    </div>
  );
}
