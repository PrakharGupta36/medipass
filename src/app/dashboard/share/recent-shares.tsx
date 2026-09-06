// src/app/dashboard/share/recent-shares.tsx

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
      {/* Compact Recent Share Card */}
      <section className="rounded-3xl border border-[#121312]/10 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <History size={16} className="text-[#18392B]" />
              <h2 className="font-serif text-lg font-normal text-[#121312]">
                Recent Shares
              </h2>
            </div>

            <p className="font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
              Latest temporary access logs
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-8 items-center gap-1.5 rounded-xl border border-[#121312]/10 bg-[#F8F6F0] px-3 font-mono text-[10px] font-medium text-[#121312] transition hover:bg-[#18392B] hover:text-[#F8F6F0]"
          >
            <History size={12} />
            <span>Full History</span>
          </button>
        </div>

        {/* Latest Share */}
        <div className="mt-5 rounded-2xl border border-[#121312]/10 bg-[#F8F6F0]/40 p-4">
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div
              className={[
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                status === "Active"
                  ? "bg-[#18392B] text-[#F8F6F0]"
                  : "bg-[#121312]/10 text-[#121312]/40",
              ].join(" ")}
            >
              {status === "Active" ? <Check size={15} /> : <Clock3 size={15} />}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-[#121312]">{status}</p>

                {status === "Active" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#18392B]" />
                )}
              </div>

              <p className="font-mono text-[9px] text-[#121312]/50">
                {formatDate(latest.created_at)}
              </p>
            </div>

            <span className="font-mono text-[9px] font-semibold tracking-wider text-[#121312]/30">
              LATEST
            </span>
          </div>

          {/* Expiry */}
          <div className="mt-3 flex items-center justify-between border-t border-[#121312]/5 pt-3 font-mono text-[9px]">
            <span className="text-[#121312]/50">
              {status === "Active"
                ? `Expires ${formatDate(latest.expires_at)}`
                : "Access Ended"}
            </span>

            <span className="text-[#121312]/40 uppercase tracking-wider">
              {getPermissionCount(latest.permissions)} Categories
            </span>
          </div>
        </div>

        {/* History count */}
        {sessions.length > 1 && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 w-full text-center font-mono text-[10px] text-[#121312]/40 transition hover:text-[#18392B]"
          >
            + {sessions.length - 1} Previous{" "}
            {sessions.length - 1 === 1 ? "Session" : "Sessions"}
          </button>
        )}
      </section>

      {/* History Overlay Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#121312]/40 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div className="flex h-[460px] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-[#121312]/10 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#121312]/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8F6F0] text-[#18392B]">
                  <History size={16} />
                </div>

                <div>
                  <h3 className="font-serif text-lg font-normal text-[#121312]">
                    Share History
                  </h3>

                  <p className="font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
                    {sessions.length} Access{" "}
                    {sessions.length === 1 ? "Session" : "Sessions"} Total
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#121312]/10 bg-[#F8F6F0] text-[#121312]/50 transition hover:bg-[#121312] hover:text-white"
                aria-label="Close share history"
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal Scroll Body */}
            <div className="min-h-0 flex-1 overflow-y-auto p-6 [scrollbar-width:thin]">
              <div className="space-y-3">
                {sessions.map((session) => {
                  const sessionStatus = getStatus(session);

                  return (
                    <div
                      key={session.id}
                      className="rounded-2xl border border-[#121312]/10 bg-[#F8F6F0]/30 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={[
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                            sessionStatus === "Active"
                              ? "bg-[#18392B] text-[#F8F6F0]"
                              : sessionStatus === "Revoked"
                                ? "bg-red-100 text-red-700"
                                : "bg-[#121312]/10 text-[#121312]/40",
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
                            <p className="text-xs font-semibold text-[#121312]">
                              {sessionStatus}
                            </p>

                            {sessionStatus === "Active" && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[#18392B]" />
                            )}
                          </div>

                          <p className="mt-0.5 font-mono text-[9px] text-[#121312]/40">
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
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-red-600 transition hover:bg-red-600 hover:text-white"
                              >
                                Revoke
                              </button>
                            </form>
                          )}
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-[#121312]/5 pt-3 font-mono text-[9px]">
                        <span className="text-[#121312]/50">
                          {getPermissionCount(session.permissions)} Categories
                        </span>

                        <span className="uppercase tracking-wider text-[#121312]/40">
                          {sessionStatus === "Active"
                            ? `Expires ${formatDate(session.expires_at)}`
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
