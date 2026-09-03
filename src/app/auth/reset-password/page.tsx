"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartPulse,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    if (password.length < 6) {
      toast.error("Password too short", {
        description: "Your password must contain at least 6 characters.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Make sure both password fields are identical.",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        toast.error("Password update failed", {
          description: error.message,
        });
        return;
      }

      setSuccess(true);

      toast.success("Password updated", {
        description: "Your MediPass password has been changed successfully.",
      });
    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);

      toast.error("Something went wrong", {
        description: "Please request a new password reset link.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#080D0A] px-4 py-6 text-white">
        <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-[520px] items-center justify-center">
          <section className="w-full rounded-[28px] border border-white/[0.08] bg-[#111712] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1F7A4F]/15 text-[#62C58C]">
              <CheckCircle2 size={28} />
            </div>

            <h1 className="mt-6 text-2xl font-semibold">Password changed</h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/35">
              Your MediPass password has been successfully updated.
            </p>

            <Link
              href="/auth"
              className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#246B45] px-6 text-sm font-semibold transition hover:bg-[#1F603D]"
            >
              Continue to sign in
              <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080D0A] px-4 py-6 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-[520px] items-center justify-center">
        <section className="w-full rounded-[28px] border border-white/[0.08] bg-[#111712] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.4)] sm:p-9">
          <Link
            href="/auth"
            className="mb-8 inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-white/45 transition hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft size={15} />
            Back
          </Link>

          <div className="mb-8">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1F7A4F]/15 text-[#62C58C]">
              <HeartPulse size={20} />
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.04em]">
              Create a new password
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/35">
              Choose a strong password for your MediPass account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordField
              label="New password"
              value={password}
              onChange={setPassword}
              show={showPassword}
              onToggle={() => setShowPassword((value) => !value)}
              autoComplete="new-password"
              loading={loading}
            />

            <PasswordField
              label="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((value) => !value)}
              autoComplete="new-password"
              loading={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#246B45] text-sm font-semibold text-white shadow-[0_6px_18px_rgba(36,107,69,0.18)] transition hover:bg-[#1F603D] disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Updating password...
                </>
              ) : (
                <>
                  Update password
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 flex items-center justify-center gap-2 text-[10px] text-white/20">
            <ShieldCheck size={13} />
            Your password is securely stored
          </div>
        </section>
      </div>
    </main>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
  loading,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete: string;
  loading: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-white/55">{label}</label>

      <div className="relative">
        <Lock
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
        />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          minLength={6}
          required
          autoComplete={autoComplete}
          disabled={loading}
          placeholder="••••••••"
          className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#55B981]/40 focus:bg-white/[0.05] disabled:opacity-50"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={loading}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/[0.05] hover:text-white/60 disabled:pointer-events-none disabled:opacity-40"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
