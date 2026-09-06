/* eslint-disable react-hooks/purity */
"use client";

import { DoubleBorderCard } from "@/components/ui/double-border-card";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock3, History, ShieldAlert, X } from "lucide-react";
import { useState } from "react";

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
  damping: 30,
};

const modalSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 28,
};

export default function RecentShares({ sessions }: { sessions: Session[] }) {
  const [open, setOpen] = useState(false);

  if (!sessions.length) return null;

  const latest = sessions[0];

  const getStatus = (session: Session) => {
    if (session.revoked_at) return "Revoked";
    if (new Date(session.expires_at).getTime() > Date.now()) return "Active";
    return "Expired";
  };

  const status = getStatus(latest);
  const remainingCount = sessions.length - 1;

  return (
    <>
      <DoubleBorderCard
        variant="light"
        className="flex h-full flex-col justify-between p-3 sm:p-4"
      >
        <div>
          <div className="flex flex-wrap flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-black/5 pb-2.5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <History size={14} className="shrink-0 text-[#18392B]" />
                <h2 className="truncate font-serif text-xl font-normal leading-tight tracking-tight text-[#121312] sm:text-base">
                  Recent Shares
                </h2>
              </div>
              <p className="truncate font-mono text-xs font-medium uppercase leading-tight tracking-widest text-[#121312]/45">
                Latest temporary access logs
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-7 shrink-0 items-center gap-1 rounded-lg border border-black/10 bg-gradient-to-b from-white to-[#F3EFE9] px-2 font-mono text-[10px] font-semibold text-[#121312] shadow-sm transition hover:border-black/20 sm:px-2.5 sm:text-[11px] w-full "
            >
              <History size={12} className="shrink-0" />
              <span className="whitespace-nowrap text-xs">Full History</span>
            </motion.button>
          </div>

          <div className="mt-3 rounded-lg border border-black/10 bg-gradient-to-b from-[#EAE4DA] to-[#E0D9CE] p-2.5 shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.05)_inset] sm:p-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border shadow-sm transition-colors ${
                  status === "Active"
                    ? "border-[#18392B]/30 bg-[#18392B] text-white"
                    : "border-black/10 bg-[#D8D1C5] text-[#121312]/50"
                }`}
              >
                {status === "Active" ? (
                  <Check size={13} strokeWidth={2.5} />
                ) : (
                  <Clock3 size={13} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-semibold leading-tight tracking-tight text-[#121312]">
                    {status}
                  </p>
                  {status === "Active" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#18392B] shadow-[0_0_4px_rgba(24,57,43,0.6)]" />
                  )}
                </div>
                <p className="font-mono text-[11px] leading-tight tabular-nums text-[#121312]/60">
                  {formatDate(latest.created_at)}
                </p>
              </div>

              <span className="shrink-0 rounded-md bg-white/80 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-widest text-[#121312]/45 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]">
                LATEST
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-black/5 pt-1.5 font-mono text-[11px]">
              <span className="tabular-nums text-[#121312]/60">
                {status === "Active"
                  ? `Expires ${formatDate(latest.expires_at)}`
                  : "Access Ended"}
              </span>

              <span className="font-semibold uppercase tracking-widest text-[#121312]/45 tabular-nums">
                {getPermissionCount(latest.permissions)} Categories
              </span>
            </div>
          </div>
        </div>

        {remainingCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setOpen(true)}
            className="mt-3 w-full text-center font-mono text-[11px] font-semibold tabular-nums text-[#121312]/60 transition hover:text-[#18392B]"
          >
            + {remainingCount} Previous{" "}
            {remainingCount === 1 ? "Session" : "Sessions"}
          </motion.button>
        )}
      </DoubleBorderCard>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#121312]/50 p-3 backdrop-blur-sm sm:p-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 8 }}
              transition={modalSpring}
              className="w-full max-w-md"
            >
              <DoubleBorderCard
                variant="light"
                className="flex max-h-[80vh] flex-col overflow-hidden p-0 shadow-2xl sm:max-h-[75vh]"
              >
                <div className="flex shrink-0 items-center justify-between border-b border-black/10 bg-gradient-to-b from-white to-[#F8F6F0] px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/5 bg-[#E6E0D6] text-[#18392B]">
                      <History size={14} />
                    </div>

                    <div>
                      <h3 className="font-serif text-sm font-normal leading-tight tracking-tight text-[#121312] sm:text-base">
                        Share History Log
                      </h3>
                      <p className="font-mono text-[9px] font-medium uppercase leading-tight tracking-widest text-[#121312]/45 tabular-nums">
                        {sessions.length}{" "}
                        {sessions.length === 1 ? "Session" : "Sessions"} Total
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg border border-black/10 bg-[#F3EFE9] text-[#121312]/60 transition hover:bg-[#121312] hover:text-white sm:h-7 sm:w-7"
                    aria-label="Close share history"
                  >
                    <X size={13} />
                  </motion.button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto bg-[#F8F6F0]/40 p-3 [scrollbar-width:thin]">
                  <div className="space-y-1.5">
                    {sessions.map((session) => {
                      const sessionStatus = getStatus(session);

                      return (
                        <motion.div
                          key={session.id}
                          layout
                          transition={microSpring}
                          className="rounded-lg border border-black/10 bg-gradient-to-b from-white to-[#F8F6F0] p-2.5 shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border shadow-sm transition-colors ${
                                sessionStatus === "Active"
                                  ? "border-[#18392B]/30 bg-[#18392B] text-white"
                                  : sessionStatus === "Revoked"
                                    ? "border-red-300 bg-red-600 text-white"
                                    : "border-black/10 bg-[#E6E0D6] text-[#121312]/40"
                              }`}
                            >
                              {sessionStatus === "Active" ? (
                                <Check size={12} strokeWidth={2.5} />
                              ) : sessionStatus === "Revoked" ? (
                                <ShieldAlert size={12} />
                              ) : (
                                <Clock3 size={12} />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <p className="text-[11px] font-semibold leading-tight text-[#121312]">
                                  {sessionStatus}
                                </p>
                                {sessionStatus === "Active" && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#18392B]" />
                                )}
                              </div>
                              <p className="font-mono text-[9px] font-medium leading-tight text-[#121312]/50 tabular-nums">
                                Created {formatDate(session.created_at)}
                              </p>
                            </div>

                            {!session.revoked_at &&
                              new Date(session.expires_at).getTime() >
                                Date.now() && (
                                <form
                                  action={() => revokeShareSession(session.id)}
                                >
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="rounded-md border border-red-300 bg-red-50 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-red-700 transition hover:bg-red-600 hover:text-white"
                                  >
                                    Revoke
                                  </motion.button>
                                </form>
                              )}
                          </div>

                          <div className="mt-1.5 flex items-center justify-between border-t border-black/5 pt-1.5 font-mono text-[9px]">
                            <span className="font-semibold text-[#121312]/60 tabular-nums">
                              {getPermissionCount(session.permissions)}{" "}
                              Categories
                            </span>

                            <span className="font-bold uppercase tracking-widest text-[#121312]/40 tabular-nums">
                              {sessionStatus === "Active"
                                ? `Expires ${formatDate(session.expires_at)}`
                                : sessionStatus.toUpperCase()}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </DoubleBorderCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
