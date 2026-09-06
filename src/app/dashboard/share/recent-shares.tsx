"use client";

import { DoubleBorderCard } from "@/components/ui/double-border-card";
import { playHoverSound, playSelectSound } from "@/lib/sounds";
import { play } from "cuelume";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  ChevronRight,
  Clock3,
  History,
  Loader2,
  ShieldAlert,
  X,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { revokeShareSession } from "./actions";

type Session = {
  id: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
  permissions: Record<string, boolean>;
};

const microSpring = {
  type: "spring" as const,
  stiffness: 500,
  damping: 32,
};

export default function RecentShares({ sessions }: { sessions: Session[] }) {
  const [open, setOpen] = useState(false);
  const [now] = useState(() => Date.now());

  const getStatus = (session: Session, currentTime: number) => {
    if (session.revoked_at) return "Revoked";
    if (new Date(session.expires_at).getTime() > currentTime) return "Active";
    return "Expired";
  };

  if (!sessions.length) return null;

  const latest = sessions[0];
  const status = getStatus(latest, now);
  const remainingCount = sessions.length - 1;

  const handleOpenModal = () => {
    playSelectSound();
    setOpen(true);
  };

  const handleCloseModal = () => {
    play("droplet");
    setOpen(false);
  };

  return (
    <>
      <DoubleBorderCard variant="light" className="w-full p-3.5 sm:p-5">
        <div className="w-full">
          {/* Header Section */}
          <div className="flex flex-col justify-between border-b border-black/10 pb-5 gap-4 sm:flex-row">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/5 bg-[#E6E0D6] text-[#18392B]">
                <History size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-serif text-2xl font-semibold leading-tight text-[#121312] sm:text-lg">
                  Recent Shares
                </h2>
                <p className="truncate font-mono text-xs font-medium uppercase tracking-wider text-[#121312]/50">
                  Latest access logs
                </p>
              </div>
            </div>

            <button
              type="button"
              onMouseEnter={playHoverSound}
              onClick={handleOpenModal}
              data-cuelume-press="press"
              data-cuelume-release="release"
              className="flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-black/10 bg-white px-2.5 font-mono text-[11px] font-semibold text-[#121312] shadow-2xs transition hover:bg-gray-50 active:scale-[0.98]"
            >
              <History size={12} className="text-[#121312]/60" />
              <span className="text-xs">Full History</span>
            </button>
          </div>

          {/* Latest Session Inset Box */}
          <div className="mt-4 rounded-xl border border-black/5 bg-[#EAE4DA]/50 p-3 shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] sm:p-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs transition-all ${
                    status === "Active"
                      ? "border border-[#18392B]/20 bg-[#18392B] text-white"
                      : status === "Revoked"
                        ? "border border-red-200 bg-red-100 text-red-700"
                        : "border border-black/10 bg-[#D8D1C5] text-[#121312]/50"
                  }`}
                >
                  {status === "Active" ? (
                    <Check size={13} strokeWidth={2.5} />
                  ) : status === "Revoked" ? (
                    <ShieldAlert size={13} />
                  ) : (
                    <Clock3 size={13} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#121312]">
                      {status}
                    </p>
                    {status === "Active" && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18392B] opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#18392B]" />
                      </span>
                    )}
                  </div>
                  <p className="truncate font-mono text-[10px] text-[#121312]/60">
                    Issued {formatDate(latest.created_at)}
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-md border border-black/5 bg-white px-2 py-0.5 font-mono text-[8px] font-bold tracking-widest text-[#121312]/50 shadow-2xs">
                LATEST
              </span>
            </div>

            {/* Inset Footer - Responsive Flex Wrap */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-black/5 pt-2 font-mono text-[10px]">
              <span className="truncate text-[#121312]/60">
                {status === "Active"
                  ? `Expires ${formatDate(latest.expires_at)}`
                  : "Access Terminated"}
              </span>

              <span className="shrink-0 font-semibold uppercase tracking-wider text-[#121312]/50">
                {getPermissionCount(latest.permissions)} Categories Unsealed
              </span>
            </div>
          </div>
        </div>

        {remainingCount > 0 && (
          <button
            type="button"
            onMouseEnter={playHoverSound}
            onClick={handleOpenModal}
            data-cuelume-press="press"
            data-cuelume-release="release"
            className="group mt-2.5 flex w-full items-center justify-center gap-1 rounded-lg border border-black/5 bg-white/60 py-2 font-mono text-xs font-semibold text-[#121312]/70 transition hover:bg-white hover:text-[#18392B] active:scale-[0.99]"
          >
            <span className="text-sm">
              + {remainingCount} Previous{" "}
              {remainingCount === 1 ? "Session" : "Sessions"}
            </span>
            <ChevronRight
              size={12}
              className="text-[#121312]/40 transition-transform group-hover:translate-x-0.5 group-hover:text-[#18392B]"
            />
          </button>
        )}
      </DoubleBorderCard>

      {/* History Modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-[#121312]/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="relative z-10 flex h-full max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-[#F8F6F0] shadow-2xl ring-1 ring-black/10"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-black/10 bg-white px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/5 bg-[#E6E0D6] text-[#18392B]">
                    <History size={14} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-[#121312]">
                      Share History Log
                    </h3>
                    <p className="font-mono text-[9px] font-medium uppercase tracking-wider text-[#121312]/50">
                      {sessions.length}{" "}
                      {sessions.length === 1 ? "Session" : "Sessions"} Recorded
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onMouseEnter={playHoverSound}
                  onClick={handleCloseModal}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/10 bg-[#F3EFE9] text-[#121312]/60 transition hover:bg-[#121312] hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto p-3 [scrollbar-width:thin]">
                {sessions.map((session) => (
                  <SessionRow key={session.id} session={session} now={now} />
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function SessionRow({ session, now }: { session: Session; now: number }) {
  const [isPending, startTransition] = useTransition();

  const sessionStatus = useMemo(() => {
    if (session.revoked_at) return "Revoked";
    if (new Date(session.expires_at).getTime() > now) return "Active";
    return "Expired";
  }, [session.revoked_at, session.expires_at, now]);

  const isActive = sessionStatus === "Active";

  const handleRevoke = () => {
    play("loading");
    startTransition(async () => {
      try {
        await revokeShareSession(session.id);
        play("droplet");
      } catch {
        play("error");
      }
    });
  };

  return (
    <motion.div
      layout
      transition={microSpring}
      className={`rounded-xl border bg-white p-2.5 shadow-2xs transition-colors ${
        isActive ? "border-[#18392B]/30" : "border-black/5"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors ${
            sessionStatus === "Active"
              ? "bg-[#18392B] text-white"
              : sessionStatus === "Revoked"
                ? "bg-red-600 text-white"
                : "border border-black/10 bg-[#E6E0D6] text-[#121312]/40"
          }`}
        >
          {sessionStatus === "Active" ? (
            <Check size={12} strokeWidth={2.5} />
          ) : sessionStatus === "Revoked" ? (
            <AlertCircle size={12} />
          ) : (
            <Clock3 size={12} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-bold text-[#121312]">{sessionStatus}</p>
            {isActive && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#18392B]" />
            )}
          </div>
          <p className="truncate font-mono text-[9px] text-[#121312]/50">
            Created {formatDate(session.created_at)}
          </p>
        </div>

        {isActive && (
          <button
            type="button"
            onMouseEnter={playHoverSound}
            onClick={handleRevoke}
            disabled={isPending}
            className="flex h-6 items-center gap-1 rounded-md border border-red-200 bg-red-50/80 px-2 font-mono text-[9px] font-bold uppercase tracking-wider text-red-700 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 size={10} className="animate-spin" />
            ) : (
              <span>Revoke</span>
            )}
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-black/5 pt-1.5 font-mono text-[9px]">
        <span className="font-medium text-[#121312]/60">
          {getPermissionCount(session.permissions)} Categories Authorized
        </span>
        <span className="font-bold uppercase tracking-wider text-[#121312]/40">
          {sessionStatus === "Active"
            ? `Expires ${formatDate(session.expires_at)}`
            : sessionStatus.toUpperCase()}
        </span>
      </div>
    </motion.div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getPermissionCount(permissions: Record<string, boolean>) {
  return Object.values(permissions).filter(Boolean).length;
}
