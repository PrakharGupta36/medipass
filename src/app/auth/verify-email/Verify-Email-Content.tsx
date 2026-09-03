"use client";

import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  ArrowRight,
  HeartPulse,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  async function resendEmail() {
    if (!email) {
      toast.error("Email unavailable", {
        description: "Return to sign in and enter your email again.",
      });
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        toast.error("Couldn't resend confirmation", {
          description: error.message,
        });
        return;
      }

      toast.success("Confirmation email sent", {
        description: "Check your inbox for the new confirmation link.",
      });
    } catch (error) {
      console.error("RESEND CONFIRMATION ERROR:", error);

      toast.error("Something went wrong", {
        description: "Please try again shortly.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020504] text-white">
      <div className="relative min-h-screen overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-[120px]" />
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-8 flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08]">
                <HeartPulse size={20} className="text-emerald-400" />
              </div>

              <span className="text-lg font-semibold tracking-tight">
                MediPass
              </span>
            </div>

            {/* Card */}
            <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08]">
                  <Mail size={28} className="text-emerald-400" />
                </div>

                <h1 className="text-2xl font-semibold tracking-tight">
                  Check your inbox
                </h1>

                <p className="mt-3 text-sm leading-6 text-white/50">
                  We&apos;ve sent a confirmation link to your email address.
                </p>

                {email && (
                  <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3">
                    <p className="truncate text-sm font-medium text-white/80">
                      {email}
                    </p>
                  </div>
                )}
              </div>

              {/* Security note */}
              <div className="mb-6 flex gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <div>
                  <p className="text-sm font-medium text-white/80">
                    Verify your email
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/40">
                    Click the link in the email to activate your MediPass
                    account.
                  </p>
                </div>
              </div>

              {/* Resend */}
              <button
                type="button"
                onClick={resendEmail}
                disabled={loading || !email}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Resend confirmation email
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>

              {/* Back */}
              <Link
                href="/auth"
                className="mt-5 flex items-center justify-center gap-2 text-sm text-white/40 transition hover:text-white/70"
              >
                <ArrowLeft size={15} />
                Back to sign in
              </Link>
            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-[11px] uppercase tracking-[0.18em] text-white/20">
              Your health data belongs to you
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
