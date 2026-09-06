// src/app/auth/verify-email/page.tsx

"use client";

import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  // Interactive mouse position & spotlight states
  const pageRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = pageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x: xPct, y: yPct });
  };

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
    <main
      ref={pageRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#F4F0EA] p-4 text-[#121312] selection:bg-[#18392B] selection:text-[#F8F6F0] lg:p-6"
    >
      {/* 1. Fine Film Grain Texture Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* 2. Architectural Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#121312 1px, transparent 1px), linear-gradient(90deg, #121312 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* 3. Dynamic Cursor Mask Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden transition-opacity duration-500 lg:block"
        style={{
          backgroundImage:
            "linear-gradient(#18392B 1px, transparent 1px), linear-gradient(90deg, #18392B 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: isHovering ? 0.2 : 0,
          WebkitMaskImage: `radial-gradient(320px circle at ${pos.x}% ${pos.y}%, black, transparent 80%)`,
          maskImage: `radial-gradient(320px circle at ${pos.x}% ${pos.y}%, black, transparent 80%)`,
        }}
      />

      {/* 4. Warm Dynamic Spotlight Aura */}
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden transition-all duration-300 ease-out lg:block"
        style={{
          background: `radial-gradient(750px circle at ${pos.x}% ${pos.y}%, rgba(24, 57, 43, 0.07), transparent 50%)`,
        }}
      />

      {/* Main Enclosing Frame - Strictly Bounded */}
      <div className="relative z-10 flex h-full max-h-[720px] w-full max-w-[500px] items-center justify-center">
        <div className="flex h-full w-full flex-col justify-between overflow-hidden rounded-[32px] border border-[#121312]/10 bg-white/80 p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] backdrop-blur-md sm:p-8">
          {/* Header Navigation & Brand */}
          <div className="flex items-center justify-between">
            <Link
              href="/auth"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#121312]/10 bg-[#F8F6F0] text-[#121312]/60 transition-all hover:border-[#121312] hover:bg-[#121312] hover:text-[#F8F6F0]"
              aria-label="Back to sign in"
            >
              <ArrowLeft size={16} />
            </Link>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18392B] text-[#F8F6F0]">
                <HeartPulse size={16} />
              </div>
              <span className="font-serif text-lg font-normal text-[#121312]">
                MediPass
              </span>
            </div>

            <div className="w-9" />
          </div>

          {/* Main Verification Card Content */}
          <div className="my-auto py-2 text-center">
            {/* Ambient Mail Icon */}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#18392B]/10 text-[#18392B] shadow-sm">
              <Mail size={24} />
            </div>

            <h1 className="font-serif text-3xl font-normal tracking-tight text-[#121312] sm:text-4xl">
              Check Your Inbox
            </h1>

            <p className="mt-2 font-mono text-xs leading-relaxed text-[#121312]/60">
              We&apos;ve dispatched a secure verification passkey to activate
              your health vault.
            </p>

            {/* Email Address Pill */}
            {email && (
              <div className="mt-4 rounded-xl border border-[#121312]/10 bg-[#F8F6F0] px-4 py-2.5">
                <p className="truncate font-mono text-xs font-semibold text-[#18392B]">
                  {email}
                </p>
              </div>
            )}

            {/* Security Note Box */}
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#121312]/10 bg-[#F8F6F0]/60 p-3.5 text-left">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#18392B]/10 text-[#18392B]">
                <CheckCircle2 size={14} />
              </div>
              <div>
                <p className="font-mono text-xs font-semibold text-[#121312]">
                  Verification Required
                </p>
                <p className="mt-0.5 font-mono text-[10px] leading-relaxed text-[#121312]/50">
                  Select the confirmation link inside the email to authorize
                  your sovereign account.
                </p>
              </div>
            </div>

            {/* Resend CTA */}
            <button
              type="button"
              onClick={resendEmail}
              disabled={loading || !email}
              className="group mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#121312] font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] shadow-sm transition-all hover:bg-[#18392B] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <span>Resend Confirmation Email</span>
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>

            {/* Back to sign in link */}
            <div className="mt-4">
              <Link
                href="/auth"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#18392B] transition hover:underline"
              >
                <ArrowLeft size={13} />
                <span>Return to sign in</span>
              </Link>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="border-t border-[#121312]/5 pt-4 text-center">
            <div className="flex items-center justify-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#121312]/40">
              <ShieldCheck size={12} className="text-[#18392B]" />
              <span>Sovereign Identity Protection</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
