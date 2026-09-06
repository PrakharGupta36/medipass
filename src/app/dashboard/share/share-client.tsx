"use client";

import { DoubleBorderCard } from "@/components/ui/double-border-card";
import { playHoverSound, playSelectSound, playToggleSound } from "@/lib/sounds";
import { toast } from "@/lib/toast";
import { play } from "cuelume";
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

const springPhysics = {
  type: "spring" as const,
  stiffness: 380,
  damping: 28,
  mass: 0.8,
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

  const cardRef = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 20 });
  const y = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(y, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-3, 3]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current || window.matchMedia("(pointer: coarse)").matches)
      return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  function generate() {
    play("loading");
    const form = new FormData();
    form.set("duration", duration);

    Object.entries(permissions).forEach(([key, value]) => {
      if (value) form.set(key, "on");
    });

    startTransition(async () => {
      try {
        const result = await createShareSession(form);
        setToken(result.token);
        setExpiresAt(result.expiresAt);
        toast.success("Temporary access pass generated");
        play("ready");
      } catch {
        toast.error("Failed to generate pass");
        play("error");
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
    play("success");
    setTimeout(() => setCopied(false), 2000);
  }

  function toggle(key: keyof typeof permissions) {
    const willBeEnabled = !permissions[key];
    playToggleSound(willBeEnabled);
    setPermissions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 text-[#121312] antialiased">
      {/* 1. PASS GENERATOR & STAGE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springPhysics}
      >
        <DoubleBorderCard variant="light" className="p-5 sm:p-6">
          <div className="border-b border-black/5 pb-3.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#18392B]" />
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#121312]/60">
                Secure Sharing Protocol
              </p>
            </div>
            <h1 className="mt-1 font-serif text-xl font-normal leading-tight text-[#121312] sm:text-2xl">
              Temporary Access Pass
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-[#121312]/70 sm:text-sm">
              Generate a time-bound QR pass or link. Only explicitly selected
              categories below are unsealed.
            </p>
          </div>

          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative my-4 flex flex-col items-center justify-center rounded-xl border border-black/5 bg-[#EAE4DA]/50 p-5 sm:p-6"
          >
            <div className="relative flex aspect-square w-full max-w-[170px] items-center justify-center rounded-xl border border-black/10 bg-white p-3.5 shadow-xs sm:max-w-[200px]">
              <AnimatePresence mode="wait">
                {pending ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="h-7 w-7 rounded-full border-2 border-[#18392B] border-t-transparent"
                    />
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#18392B]">
                      Minting...
                    </span>
                  </motion.div>
                ) : token ? (
                  <motion.div
                    key="qr"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full w-full"
                  >
                    <QRCodeSVG
                      value={link}
                      size={180}
                      style={{ width: "100%", height: "100%" }}
                      includeMargin
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-center text-[#121312]/40"
                  >
                    <QrCode strokeWidth={1.2} className="h-14 w-14" />
                    <span className="mt-2 font-mono text-xs font-medium uppercase tracking-widest">
                      Pass Unissued
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-lg border border-black/5 bg-white/80 px-3 py-1 font-mono text-xs font-semibold text-[#121312]/70">
              <Clock3 size={13} className="text-[#18392B]" />
              {expiresAt
                ? `Expires ${new Date(expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : "No Active Session"}
            </div>
          </motion.div>

          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {token ? (
                <motion.div
                  key="controls-active"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <button
                    type="button"
                    onClick={copyLink}
                    data-cuelume-press="press"
                    data-cuelume-release="release"
                    className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#18392B] font-mono text-xs font-semibold text-[#F8F6F0] transition hover:bg-[#10271d]"
                  >
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    <span>{copied ? "Copied" : "Copy Link"}</span>
                  </button>
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    data-cuelume-press="press"
                    data-cuelume-release="release"
                    className="flex h-10 items-center justify-center gap-2 rounded-lg border border-black/10 bg-white font-mono text-xs font-semibold text-[#121312] transition hover:bg-gray-50"
                  >
                    <ExternalLink size={15} />
                    <span>Open Pass</span>
                  </a>
                </motion.div>
              ) : (
                <motion.button
                  key="controls-generate"
                  disabled={pending}
                  onClick={generate}
                  whileTap={{ scale: 0.98 }}
                  data-cuelume-press="press"
                  data-cuelume-release="release"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#18392B] font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] transition hover:bg-[#10271d] disabled:opacity-50"
                >
                  <Sparkles size={15} />
                  <span>{pending ? "Generating..." : "Generate QR Pass"}</span>
                </motion.button>
              )}
            </AnimatePresence>

            <div className="mt-12 rounded-xl border border-black/20 bg-[#E6E0D6]/40 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#121312]">
                  Access Duration
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#121312]/50">
                  Auto-expires
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 rounded-lg bg-white p-1 shadow-inner">
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
                      onMouseEnter={playHoverSound}
                      onClick={() => {
                        playSelectSound();
                        setDuration(fullValue);
                      }}
                      className={`relative rounded-md py-1.5 font-mono text-xs font-semibold transition-colors ${
                        active
                          ? "text-[#F8F6F0]"
                          : "text-[#121312]/60 hover:text-[#121312]"
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="durationActive"
                          transition={springPhysics}
                          className="absolute inset-0 rounded-md bg-[#18392B]"
                        />
                      )}
                      <span className="relative z-10">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </DoubleBorderCard>
      </motion.div>

      {/* 2. VAULT SCOPE PERMISSIONS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springPhysics, delay: 0.05 }}
      >
        <DoubleBorderCard variant="light" className="p-5 sm:p-6">
          <div className="flex items-center gap-3 border-b border-black/5 pb-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/5 bg-[#E6E0D6] text-[#18392B]">
              <Lock size={16} />
            </div>
            <div>
              <h2 className="font-serif text-lg font-medium text-[#121312]">
                Vault Scope Permissions
              </h2>
              <p className="font-mono text-[9px] font-medium uppercase tracking-wider text-[#121312]/50">
                Toggle allowed record categories
              </p>
            </div>
          </div>

          <div className="mt-3.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              ["basic_profile", "Basic Profile Data"],
              ["allergies", "Allergies & Sensitivities"],
              ["medications", "Active Prescriptions"],
              ["conditions", "Logged Medical Conditions"],
              ["vaccinations", "Immunization Record"],
              ["reports", "Full Diagnostic Reports"],
            ].map(([key, label]) => {
              const enabled = permissions[key as keyof typeof permissions];

              return (
                <button
                  type="button"
                  key={key}
                  onMouseEnter={playHoverSound}
                  onClick={() => toggle(key as keyof typeof permissions)}
                  className="flex min-h-[42px] items-center justify-between rounded-lg border border-black/5 bg-white/80 px-3.5 py-2 text-left transition hover:bg-white"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <ShieldCheck
                      size={16}
                      className={`shrink-0 ${enabled ? "text-[#18392B]" : "text-[#121312]/30"}`}
                    />
                    <span className="truncate font-mono text-xs font-semibold text-[#121312]">
                      {label}
                    </span>
                  </div>

                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors ${
                      enabled
                        ? "bg-[#18392B] text-white"
                        : "border border-black/10 bg-[#E6E0D6] text-[#121312]/30"
                    }`}
                  >
                    {enabled ? (
                      <Check size={12} strokeWidth={2.5} />
                    ) : (
                      <X size={12} strokeWidth={2} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </DoubleBorderCard>
      </motion.div>

      {/* 3. RECENT SHARES LOG */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springPhysics, delay: 0.1 }}
      >
        <RecentShares sessions={sessions} />
      </motion.div>
    </div>
  );
}
