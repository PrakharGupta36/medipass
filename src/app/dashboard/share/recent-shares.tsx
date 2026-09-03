/* eslint-disable react-hooks/purity */
"use client";

import { Check, Clock3, History, X } from "lucide-react";
import { useState } from "react";

import { revokeShareSession } from "./actions";

type Session = {
  id: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
  permissions: Record<string, boolean>;
};

export default function RecentShares({ sessions }: { sessions: Session[] }) {
  const [open, setOpen] = useState(false);

  if (!sessions.length) {
    return null;
  }

  const latest = sessions[0];

  const getStatus = (session: Session) => {
    if (session.revoked_at) {
      return "Revoked";
    }

    if (new Date(session.expires_at).getTime() > Date.now()) {
      return "Active";
    }

    return "Expired";
  };

  const status = getStatus(latest);

  return (
    <>
      {/* ================================================= */}
      {/* Compact recent share card */}
      {/* ================================================= */}

      <section className="rounded-[26px] border border-white/[0.07] bg-[#111712] p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <History size={15} className="text-[#62C58C]" />

              <p className="text-sm font-semibold">Recent shares</p>
            </div>

            <p className="mt-1 text-[10px] text-white/20">
              Your latest access sessions
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 text-[9px] font-medium text-white/35 transition hover:border-[#62C58C]/15 hover:bg-[#1F7A4F]/10 hover:text-[#62C58C]"
          >
            <History size={12} />
            View history
          </button>
        </div>

        {/* Latest share */}
        <div className="mt-5 rounded-2xl border border-white/[0.05] bg-[#0C110E] p-4">
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div
              className={[
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                status === "Active"
                  ? "bg-[#1F7A4F]/10 text-[#62C58C]"
                  : "bg-white/[0.03] text-white/20",
              ].join(" ")}
            >
              {status === "Active" ? <Check size={15} /> : <Clock3 size={15} />}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-white/60">{status}</p>

                {status === "Active" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#62C58C] shadow-[0_0_6px_rgba(98,197,140,0.5)]" />
                )}
              </div>

              <p className="mt-1 text-[9px] text-white/20">
                {formatDate(latest.created_at)}
              </p>
            </div>

            <span className="shrink-0 font-mono text-[8px] text-white/10">
              LATEST
            </span>
          </div>

          {/* Expiry */}
          <div className="mt-3 flex items-center justify-between border-t border-white/[0.04] pt-3">
            <span className="text-[9px] text-white/15">
              {status === "Active"
                ? `Expires ${formatDate(latest.expires_at)}`
                : "Access ended"}
            </span>

            <span className="font-mono text-[8px] text-white/10">
              {getPermissionCount(latest.permissions)} categories
            </span>
          </div>
        </div>

        {/* History count */}
        {sessions.length > 1 && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-3 w-full text-center text-[9px] text-white/15 transition hover:text-[#62C58C]/70"
          >
            + {sessions.length - 1} previous{" "}
            {sessions.length - 1 === 1 ? "share" : "shares"}
          </button>
        )}
      </section>

      {/* ================================================= */}
      {/* History overlay */}
      {/* ================================================= */}

      {open && (
        <div
          className="fixed inset-0  z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div className="flex h-[420px] w-full max-w-lg flex-col overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#101611] shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
            {/* Header — fixed */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-5 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F7A4F]/10 text-[#62C58C]">
                    <History size={15} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Share history</p>

                    <p className="mt-0.5 text-[9px] text-white/20">
                      {sessions.length} access{" "}
                      {sessions.length === 1 ? "session" : "sessions"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-white/25 transition hover:bg-white/[0.05] hover:text-white/60"
                aria-label="Close share history"
              >
                <X size={14} />
              </button>
            </div>

            {/* History — ONLY THIS SCROLLS */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 [scrollbar-color:rgba(98,197,140,0.18)_transparent] [scrollbar-width:thin]">
              <div className="space-y-2">
                {sessions.map((session) => {
                  const sessionStatus = getStatus(session);

                  return (
                    <div
                      key={session.id}
                      className="rounded-2xl border border-white/[0.05] bg-[#0C110E] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={[
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                            sessionStatus === "Active"
                              ? "bg-[#1F7A4F]/10 text-[#62C58C]"
                              : sessionStatus === "Revoked"
                                ? "bg-red-500/[0.07] text-red-300/50"
                                : "bg-white/[0.03] text-white/20",
                          ].join(" ")}
                        >
                          {sessionStatus === "Active" ? (
                            <Check size={14} />
                          ) : (
                            <Clock3 size={14} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium text-white/55">
                              {sessionStatus}
                            </p>

                            {sessionStatus === "Active" && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[#62C58C]" />
                            )}
                          </div>

                          <p className="mt-1 text-[9px] text-white/20">
                            Created {formatDate(session.created_at)}
                          </p>
                        </div>

                        {!session.revoked_at &&
                          new Date(session.expires_at).getTime() >
                            Date.now() && (
                            <form
                              action={async () => {
                                await revokeShareSession(session.id);
                              }}
                            >
                              <button
                                type="submit"
                                className="rounded-lg border border-red-400/[0.08] px-2.5 py-1.5 text-[8px] font-medium text-red-300/40 transition hover:border-red-400/15 hover:bg-red-500/[0.06] hover:text-red-300/70"
                              >
                                Revoke
                              </button>
                            </form>
                          )}
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-white/[0.04] pt-3">
                        <span className="text-[8px] text-white/15">
                          {getPermissionCount(session.permissions)} categories
                          shared
                        </span>

                        <span className="font-mono text-[8px] text-white/10">
                          {sessionStatus === "Active"
                            ? `EXPIRES ${formatDate(session.expires_at)}`
                            : sessionStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

/* ======================================================== */
/* Helpers */
/* ======================================================== */

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getPermissionCount(permissions: Record<string, boolean>) {
  return Object.values(permissions).filter(Boolean).length;
}
