"use client";

import {
  ArrowLeft,
  HeartPulse,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  async function resendEmail() {
    if (loading) return;

    if (!email) {
      toast.error("Email unavailable", {
        description: "Return to sign in and enter your email again.",
      });
      return;
    }

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
    <main className="min-h-screen bg-[#080D0A] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-[520px] items-center justify-center">
        <section className="w-full rounded-[28px] border border-white/[0.08] bg-[#111712] p-7 text-center shadow-[0_30px_100px_rgba(0,0,0,0.4)] sm:p-10">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1F7A4F]">
              <HeartPulse size={21} />
            </div>

            <span className="font-semibold tracking-tight">MediPass</span>
          </div>

          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1F7A4F]/15 text-[#62C58C]">
            <Mail size={27} />
          </div>

          <h1 className="mt-6 text-2xl font-semibold">Check your inbox</h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/35">
            We sent a confirmation link to
          </p>

          <p className="mt-1 break-all text-sm font-medium text-white/75">
            {email || "your email address"}
          </p>

          {/* Resend */}
          <button
            type="button"
            onClick={resendEmail}
            disabled={loading}
            className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-5 text-xs font-semibold text-white/65 transition hover:bg-white/[0.06] hover:text-white disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Sending...
              </>
            ) : (
              "Resend confirmation email"
            )}
          </button>

          {/* Security */}
          <div className="mt-8 border-t border-white/[0.06] pt-6">
            <div className="flex items-center justify-center gap-2 text-[10px] text-white/20">
              <ShieldCheck size={13} />
              Secure account verification
            </div>
          </div>

          {/* Back */}
          <Link
            href="/auth"
            className="mt-6 inline-flex items-center gap-2 text-xs text-white/30 transition hover:text-white/70"
          >
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </section>
      </div>
    </main>
  );
}
