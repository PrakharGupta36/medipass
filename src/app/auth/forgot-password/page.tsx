"use client";

import {
  ArrowLeft,
  ArrowRight,
  HeartPulse,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      toast.error("Email required", {
        description: "Enter the email address associated with your account.",
      });
      return;
    }

    setLoading(true);

    try {
      const origin = window.location.origin;

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
      });

      if (error) {
        toast.error("Unable to send reset email", {
          description: error.message,
        });
        return;
      }

      setSent(true);

      toast.success("Reset email sent", {
        description: "Check your inbox for the password reset link.",
      });
    } catch (error) {
      console.error("FORGOT PASSWORD ERROR:", error);

      toast.error("Something went wrong", {
        description: "Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080D0A] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-[520px] items-center justify-center">
        <div className="w-full">
          {/* Back */}
          <Link
            href="/auth"
            className="mb-8 inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-white/45 transition hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to sign in
          </Link>

          {/* Card */}
          <section className="rounded-[28px] border border-white/[0.08] bg-[#111712] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.4)] sm:p-9">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1F7A4F] text-white shadow-[0_8px_25px_rgba(31,122,79,0.25)]">
                <HeartPulse size={21} />
              </div>

              <div>
                <p className="font-semibold tracking-tight">MediPass</p>

                <p className="text-[10px] uppercase tracking-[0.14em] text-white/25">
                  Secure account recovery
                </p>
              </div>
            </div>

            {!sent ? (
              <>
                <div className="mb-8">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1F7A4F]/15 text-[#62C58C]">
                    <Mail size={20} />
                  </div>

                  <h1 className="text-3xl font-semibold tracking-[-0.04em]">
                    Forgot your password?
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-white/35">
                    Enter your email and we&apos;ll send you a secure link to create
                    a new password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/55">
                      Email
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        autoComplete="email"
                        required
                        disabled={loading}
                        className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#55B981]/40 focus:bg-white/[0.05] disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#246B45] text-sm font-semibold text-white shadow-[0_6px_18px_rgba(36,107,69,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1F603D] disabled:pointer-events-none disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      <>
                        Send reset link
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-6 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F7A4F]/15 text-[#62C58C]">
                  <Mail size={23} />
                </div>

                <h1 className="text-2xl font-semibold">Check your inbox</h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/35">
                  If an account exists for{" "}
                  <span className="text-white/65">{email}</span>, we&apos;ve sent a
                  password reset link.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    toast.info("Ready to resend", {
                      description: "You can request another reset email.",
                    });
                  }}
                  className="mt-7 text-xs font-semibold text-[#62C58C] transition hover:text-white"
                >
                  Send another email
                </button>
              </div>
            )}

            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-white/20">
              <ShieldCheck size={13} />
              Secure password recovery
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
