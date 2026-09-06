/* eslint-disable react-hooks/set-state-in-effect */
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
import { useEffect, useRef, useState, useTransition } from "react";
import { createShareSession } from "./actions";
import RecentShares from "./recent-shares";

type Session = {
  id: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
  permissions: Record<string, boolean>;
};

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
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const [permissions, setPermissions] = useState({
    basic_profile: true,
    allergies: true,
    medications: true,
    conditions: true,
    vaccinations: false,
    reports: false,
  });

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const cardRef = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 20 });
  const y = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (isTouchDevice || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  }

  function handleMouseLeave() {
    if (isTouchDevice) return;
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
    <div className="w-full text-[#121312] antialiased">
      <div className="grid items-start gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-5">
        {/* LEFT — PASS CREATOR & QR STAGE */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springPhysics}
        >
          <DoubleBorderCard variant="light" className="p-3.5 sm:p-5 lg:p-6">
            <div className="mb-3 border-b border-black/5 pb-3 sm:mb-4">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#18392B] shadow-[0_0_4px_rgba(24,57,43,0.5)]" />
                <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-[#121312]/50">
                  Secure Sharing Protocol
                </p>
              </div>

              <h1 className="mt-1 font-serif text-lg font-normal leading-tight tracking-tight text-[#121312] sm:text-xl">
                Temporary Access Pass
              </h1>

              <p className="mt-1 font-sans text-[12px] leading-relaxed text-[#121312]/70 sm:text-[13px]">
                Generate a time-bound QR code or access link. Vault items remain
                encrypted; only explicitly selected permission categories are
                unsealed.
              </p>
            </div>

            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX: isTouchDevice ? 0 : rotateX,
                rotateY: isTouchDevice ? 0 : rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative flex flex-col items-center rounded-xl border border-black/10 bg-gradient-to-b from-[#EAE4DA] to-[#E0D9CE] p-3 shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_6px_rgba(0,0,0,0.06)_inset] sm:p-4"
            >
              <motion.div
                layout
                transition={springPhysics}
                className="relative flex aspect-square w-full max-w-[170px] items-center justify-center rounded-xl border border-black/10 bg-white p-3 shadow-[0_2px_5px_rgba(0,0,0,0.08)_inset,0_1px_0_rgba(255,255,255,0.9)] xs:max-w-[190px] sm:max-w-[210px] sm:p-4"
              >
                <AnimatePresence mode="wait">
                  {pending ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={microSpring}
                      className="flex flex-col items-center justify-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          ease: "linear",
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#18392B] border-t-transparent text-[#18392B] sm:h-9 sm:w-9"
                      />
                      <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#18392B]">
                        Minting Vault Pass...
                      </p>
                    </motion.div>
                  ) : token ? (
                    <motion.div
                      key="qr-active"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={springPhysics}
                      className="relative flex h-full w-full items-center justify-center p-1"
                    >
                      <QRCodeSVG
                        value={link}
                        size={180}
                        style={{ width: "100%", height: "100%" }}
                        bgColor="#ffffff"
                        fgColor="#121312"
                        includeMargin
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="qr-empty"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={microSpring}
                      className="flex flex-col items-center justify-center text-center"
                    >
                      <QrCode
                        strokeWidth={1}
                        className="h-16 w-16 text-[#121312]/20 sm:h-20 sm:w-20"
                      />
                      <span className="mt-1.5 font-mono text-[9px] font-medium uppercase tracking-widest text-[#121312]/40">
                        Pass Unissued
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                layout
                className="mt-3 flex items-center gap-1.5 rounded-lg border border-black/5 bg-white/60 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#121312]/70 tabular-nums shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]"
              >
                <Clock3 size={12} className="text-[#18392B]" />
                {expiresAt
                  ? `Expires ${new Date(expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                  : "No active session"}
              </motion.div>
            </motion.div>

            <div className="mt-3 sm:mt-4">
              <AnimatePresence mode="wait">
                {token ? (
                  <motion.div
                    key="active-controls"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={springPhysics}
                    className="grid grid-cols-2 gap-2 sm:gap-2.5"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={copyLink}
                      className="relative flex h-9 items-center justify-center gap-1.5 overflow-hidden rounded-xl border border-[#18392B]/30 bg-gradient-to-b from-[#224f3c] via-[#18392B] to-[#10271d] font-mono text-[10px] font-semibold uppercase tracking-wider text-[#F8F6F0] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_2px_4px_rgba(24,57,43,0.3)] transition sm:h-10 sm:gap-2 sm:text-[11px]"
                    >
                      <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.span
                            key="copied"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={microSpring}
                            className="flex items-center gap-1.5"
                          >
                            <Check size={13} />
                            <span>Link Copied</span>
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={microSpring}
                            className="flex items-center gap-1.5"
                          >
                            <Copy size={13} />
                            <span>Copy Link</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-black/10 bg-gradient-to-b from-white to-[#F3EFE9] font-mono text-[10px] font-semibold uppercase tracking-wider text-[#121312] shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_1px_3px_rgba(0,0,0,0.08)] transition hover:border-black/20 sm:h-10 sm:text-[11px]"
                    >
                      <ExternalLink size={12} />
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
                    className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-[#18392B]/30 bg-gradient-to-b from-[#224f3c] via-[#18392B] to-[#10271d] font-mono text-[10px] font-semibold uppercase tracking-wider text-[#F8F6F0] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_2px_4px_rgba(24,57,43,0.3)] transition disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:text-[11px]"
                  >
                    <Sparkles size={13} />
                    <span>
                      {pending ? "Minting Pass…" : "Generate QR Pass"}
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Duration Selector */}
            <div className="mt-3 rounded-xl border border-black/10 bg-[#E6E0D6] p-2.5 shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_5px_rgba(0,0,0,0.06)_inset] sm:mt-4 sm:p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-black/5 bg-white text-[#18392B] shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_1px_2px_rgba(0,0,0,0.05)] sm:h-7 sm:w-7">
                  <Clock3 size={13} />
                </div>

                <div>
                  <p className="text-[11px] font-semibold leading-tight text-[#121312]">
                    Access Duration
                  </p>
                  <p className="font-mono text-[8px] font-medium uppercase leading-tight tracking-widest text-[#121312]/45">
                    Automatic expiration timer
                  </p>
                </div>
              </div>

              <div className="relative mt-2 grid grid-cols-3 gap-1 rounded-lg border border-black/10 bg-white p-1 shadow-[0_2px_4px_rgba(0,0,0,0.08)_inset]">
                {[
                  { label: "15 min", fullValue: "15 minutes" },
                  { label: "1 hour", fullValue: "1 hour" },
                  { label: "24 hours", fullValue: "24 hours" },
                ].map(({ label, fullValue }) => {
                  const active = duration === fullValue;

                  return (
                    <button
                      key={fullValue}
                      type="button"
                      onClick={() => setDuration(fullValue)}
                      className="relative z-10 flex min-h-[32px] items-center justify-center rounded-md px-1 py-1 text-center font-mono text-[10px] font-semibold leading-tight tabular-nums transition-colors sm:text-[11px]"
                      style={{
                        color: active ? "#F8F6F0" : "rgba(18, 19, 18, 0.65)",
                      }}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeDurationPill"
                          transition={springPhysics}
                          className="absolute inset-0 z-[-1] rounded-md border border-[#18392B]/30 bg-gradient-to-b from-[#224f3c] to-[#18392B] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_1px_3px_rgba(0,0,0,0.2)]"
                        />
                      )}
                      <span className="whitespace-nowrap">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </DoubleBorderCard>
        </motion.div>

        {/* RIGHT — PERMISSIONS & RECENT SHARES */}
        <section className="space-y-3 sm:space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springPhysics, delay: 0.1 }}
          >
            <DoubleBorderCard variant="light" className="p-3.5 sm:p-5 lg:p-6">
              <div className="flex items-center gap-2 border-b border-black/5 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-black/5 bg-[#E6E0D6] text-[#18392B] shadow-[0_1px_2px_rgba(0,0,0,0.12)_inset,0_1px_0_rgba(255,255,255,0.8)] sm:h-9 sm:w-9">
                  <Lock size={15} />
                </div>

                <div>
                  <h2 className="font-serif text-sm font-normal leading-tight tracking-tight text-[#121312] sm:text-base">
                    Vault Scope Permissions
                  </h2>
                  <p className="font-mono text-[8px] font-medium uppercase leading-tight tracking-widest text-[#121312]/45">
                    Explicitly toggle unsealed data categories
                  </p>
                </div>
              </div>

              <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
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
                      className="group flex min-h-[40px] w-full items-center justify-between rounded-lg border border-black/5 bg-gradient-to-b from-white to-[#F8F6F0] px-3 py-2 text-left shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_1px_3px_rgba(0,0,0,0.04)] transition hover:border-black/15 hover:shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_6px_rgba(0,0,0,0.06)]"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <ShieldCheck
                          size={14}
                          className={`shrink-0 ${
                            enabled ? "text-[#18392B]" : "text-[#121312]/30"
                          }`}
                        />
                        <span className="truncate font-mono text-[10px] font-semibold text-[#121312] sm:text-[11px]">
                          {label}
                        </span>
                      </div>

                      <motion.span
                        layout
                        transition={microSpring}
                        className={[
                          "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-all",
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
                              <Check size={11} strokeWidth={2.5} />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="disabled"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={microSpring}
                            >
                              <X size={11} strokeWidth={2} />
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
