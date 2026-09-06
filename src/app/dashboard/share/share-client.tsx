// src/app/dashboard/share/share-client.tsx

"use client";

import { DoubleBorderCard } from "@/components/ui/double-border-card";
import { toast } from "@/lib/toast";
import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Check,
  Clock3,
  Copy,
  ExternalLink,
  Lock,
  QrCode,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState, useTransition } from "react";
import { createShareSession } from "./actions";
import RecentShares from "./recent-shares";

type Session = {
  id: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
  permissions: Record<string, boolean>;
};

// Fluid Spring Configuration
const springPhysics = {
  type: "spring" as const,
  stiffness: 380,
  damping: 28,
  mass: 0.8,
};

const microSpring = {
  type: "spring" as const,
  stiffness: 500,
  damping: 25,
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

  // 3D Card Tilt Effects
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 20 });
  const y = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  function generate() {
    const form = new FormData();
    form.set("duration", duration);

    Object.entries(permissions).forEach(([key, value]) => {
      if (value) {
        form.set(key, "on");
      }
    });

    startTransition(async () => {
      try {
        const result = await createShareSession(form);
        setToken(result.token);
        setExpiresAt(result.expiresAt);
        toast.success("Temporary access pass generated");
      } catch {
        toast.error("Failed to generate pass");
      }
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
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  function toggle(key: keyof typeof permissions) {
    setPermissions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <div className="w-full text-[#121312]">
      <div className="grid items-start gap-6 xl:grid-cols-2">
        {/* =====================================================
            LEFT — SKEUOMORPHIC PASS CREATOR & QR STAGE
        ====================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springPhysics}
        >
          <DoubleBorderCard variant="light" className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6 border-b border-black/5 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#18392B] shadow-[0_0_4px_rgba(24,57,43,0.5)]" />
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#121312]/50">
                  Secure Sharing Protocol
                </p>
              </div>

              <h1 className="mt-1 font-serif text-2xl font-normal text-[#121312]">
                Temporary Access Pass
              </h1>

              <p className="mt-1 font-mono text-xs leading-relaxed text-[#121312]/60">
                Generate a time-bound QR code or access link. Vault items remain
                encrypted; only explicitly selected permission categories are
                unsealed.
              </p>
            </div>

            {/* 3D Dynamic Interactive Skeuomorphic QR Vault */}
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative flex flex-col items-center rounded-2xl border border-black/10 bg-gradient-to-b from-[#EAE4DA] to-[#E0D9CE] p-6 shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_6px_rgba(0,0,0,0.06)_inset]"
            >
              {/* Sunken Physical Card Tray */}
              <motion.div
                layout
                transition={springPhysics}
                className="relative flex h-56 w-56 items-center justify-center rounded-2xl border border-black/10 bg-white p-4 shadow-[0_2px_5px_rgba(0,0,0,0.08)_inset,0_1px_0_rgba(255,255,255,0.9)]"
              >
                <AnimatePresence mode="wait">
                  {pending ? (
                    /* Loading State */
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={microSpring}
                      className="flex flex-col items-center justify-center gap-3"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          ease: "linear",
                        }}
                        className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#18392B] border-t-transparent text-[#18392B]"
                      />
                      <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#18392B]">
                        Minting Vault Pass...
                      </p>
                    </motion.div>
                  ) : token ? (
                    /* Active QR State */
                    <motion.div
                      key="qr-active"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={springPhysics}
                      className="relative flex items-center justify-center"
                    >
                      <QRCodeSVG
                        value={link}
                        size={180}
                        bgColor="#ffffff"
                        fgColor="#121312"
                        includeMargin
                      />
                    </motion.div>
                  ) : (
                    /* Inactive QR State */
                    <motion.div
                      key="qr-empty"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={microSpring}
                      className="flex flex-col items-center justify-center text-center"
                    >
                      <QrCode
                        size={130}
                        strokeWidth={1}
                        className="text-[#121312]/20"
                      />
                      <span className="mt-2 font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
                        Pass Unissued
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Expiration Timer Banner */}
              <motion.div
                layout
                className="mt-4 flex items-center gap-2 rounded-lg border border-black/5 bg-white/60 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#121312]/70 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]"
              >
                <Clock3 size={13} className="text-[#18392B]" />
                {expiresAt
                  ? `Expires ${new Date(expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                  : "No active session"}
              </motion.div>
            </motion.div>

            {/* Action CTAs */}
            <div className="mt-5">
              <AnimatePresence mode="wait">
                {token ? (
                  <motion.div
                    key="active-controls"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={springPhysics}
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    {/* Copy Link Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={copyLink}
                      className="relative flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#18392B]/30 bg-gradient-to-b from-[#224f3c] via-[#18392B] to-[#10271d] font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_2px_4px_rgba(24,57,43,0.3)] transition"
                    >
                      <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.span
                            key="copied"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={microSpring}
                            className="flex items-center gap-2"
                          >
                            <Check size={15} />
                            <span>Link Copied</span>
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={microSpring}
                            className="flex items-center gap-2"
                          >
                            <Copy size={15} />
                            <span>Copy Link</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {/* Open View Link */}
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-gradient-to-b from-white to-[#F3EFE9] font-mono text-xs font-semibold uppercase tracking-wider text-[#121312] shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_1px_3px_rgba(0,0,0,0.08)] transition hover:border-black/20"
                    >
                      <ExternalLink size={14} />
                      <span>Open View</span>
                    </motion.a>
                  </motion.div>
                ) : (
                  <motion.button
                    key="generate-control"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={pending}
                    onClick={generate}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#18392B]/30 bg-gradient-to-b from-[#224f3c] via-[#18392B] to-[#10271d] font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_2px_4px_rgba(24,57,43,0.3)] transition disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Sparkles size={15} />
                    <span>
                      {pending ? "Minting Pass…" : "Generate QR Pass"}
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Skeuomorphic Duration Selector */}
            <div className="mt-6 rounded-2xl border border-black/10 bg-[#E6E0D6] p-4 shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_5px_rgba(0,0,0,0.06)_inset]">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/5 bg-white text-[#18392B] shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_1px_2px_rgba(0,0,0,0.05)]">
                  <Clock3 size={16} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#121312]">
                    Access Duration
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-[#121312]/50">
                    Automatic expiration timer
                  </p>
                </div>
              </div>

              {/* Sunken Sliding Pill Track */}
              <div className="relative mt-3 grid grid-cols-3 gap-1 rounded-xl border border-black/10 bg-white p-1 shadow-[0_2px_4px_rgba(0,0,0,0.08)_inset]">
                {["15 minutes", "1 hour", "24 hours"].map((item) => {
                  const active = duration === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setDuration(item)}
                      className="relative z-10 py-1.5 font-mono text-xs font-semibold transition-colors"
                      style={{
                        color: active ? "#F8F6F0" : "rgba(18, 19, 18, 0.6)",
                      }}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeDurationPill"
                          transition={springPhysics}
                          className="absolute inset-0 z-[-1] rounded-lg border border-[#18392B]/30 bg-gradient-to-b from-[#224f3c] to-[#18392B] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_1px_3px_rgba(0,0,0,0.2)]"
                        />
                      )}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </DoubleBorderCard>
        </motion.div>

        {/* =====================================================
            RIGHT — SKEUOMORPHIC PERMISSIONS & HISTORY
        ====================================================== */}
        <section className="space-y-6">
          {/* Shared Information Permissions Panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springPhysics, delay: 0.1 }}
          >
            <DoubleBorderCard variant="light" className="p-6 sm:p-8">
              <div className="flex items-center gap-3 border-b border-black/5 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/5 bg-[#E6E0D6] text-[#18392B] shadow-[0_1px_2px_rgba(0,0,0,0.12)_inset,0_1px_0_rgba(255,255,255,0.8)]">
                  <Lock size={18} />
                </div>

                <div>
                  <h2 className="font-serif text-lg font-normal text-[#121312]">
                    Vault Scope Permissions
                  </h2>
                  <p className="font-mono text-[9px] font-medium uppercase tracking-wider text-[#121312]/50">
                    Explicitly toggle unsealed data categories
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {[
                  ["basic_profile", "Basic Profile Data"],
                  ["allergies", "Allergies & Sensitivities"],
                  ["medications", "Active Prescriptions"],
                  ["conditions", "Logged Medical Conditions"],
                  ["vaccinations", "Immunization Record"],
                  ["reports", "Full Diagnostic Reports"],
                ].map(([key, label], idx) => {
                  const enabled = permissions[key as keyof typeof permissions];

                  return (
                    <motion.button
                      type="button"
                      key={key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...microSpring, delay: idx * 0.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggle(key as keyof typeof permissions)}
                      className="group flex w-full items-center justify-between rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F8F6F0] px-4 py-3 text-left shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_1px_3px_rgba(0,0,0,0.04)] transition hover:border-black/15 hover:shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_6px_rgba(0,0,0,0.06)]"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck
                          size={15}
                          className={
                            enabled ? "text-[#18392B]" : "text-[#121312]/30"
                          }
                        />
                        <span className="font-mono text-xs font-semibold text-[#121312]">
                          {label}
                        </span>
                      </div>

                      {/* Tactile Skeuomorphic Toggle Indicator */}
                      <motion.span
                        layout
                        transition={microSpring}
                        className={[
                          "flex h-5 w-5 items-center justify-center rounded-lg border transition-all",
                          enabled
                            ? "border-[#18392B]/30 bg-gradient-to-b from-[#224f3c] to-[#18392B] text-[#F8F6F0] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_1px_2px_rgba(0,0,0,0.2)]"
                            : "border-black/10 bg-[#E6E0D6] text-[#121312]/30 shadow-[0_1px_2px_rgba(0,0,0,0.08)_inset]",
                        ].join(" ")}
                      >
                        <AnimatePresence mode="wait">
                          {enabled ? (
                            <motion.span
                              key="enabled"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={microSpring}
                            >
                              <Check size={12} strokeWidth={2.5} />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="disabled"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={microSpring}
                            >
                              <X size={12} strokeWidth={2} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.span>
                    </motion.button>
                  );
                })}
              </div>
            </DoubleBorderCard>
          </motion.div>

          {/* Recent Shares Log */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springPhysics, delay: 0.2 }}
          >
            <RecentShares sessions={sessions} />
          </motion.div>
        </section>
      </div>
    </div>
  );
}
