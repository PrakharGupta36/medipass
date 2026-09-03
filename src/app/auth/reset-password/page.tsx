"use client";

import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("Password too short", {
        description: "Your password must contain at least 8 characters.",
      });

      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");

      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        toast.error("Could not update password", {
          description: error.message,
        });

        return;
      }

      toast.success("Password updated", {
        description: "Your MediPass password has been changed.",
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
      });

      router.push("/dashboard/settings");
      router.refresh();
    } catch {
      toast.error("Something went wrong", {
        description: "Please request another password reset link.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080D0A] px-4 py-8 text-white">
      <div className="w-full max-w-md">
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-white/30 transition hover:text-white/60"
        >
          <ArrowLeft size={13} />
          Back to sign in
        </Link>

        <div className="mt-8 border-y border-white/[0.08] py-8">
          <div className="flex h-10 w-10 items-center justify-center border border-[#62C58C]/15 bg-[#1F7A4F]/[0.06] text-[#62C58C]">
            <Lock size={17} />
          </div>

          <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.18em] text-[#62C58C]/70">
            Account security
          </p>

          <h1 className="mt-2 text-3xl font-medium tracking-[-0.05em]">
            Set a new password
          </h1>

          <p className="mt-2 text-xs leading-5 text-white/30">
            Choose a new password for your MediPass account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <PasswordField
              id="password"
              label="New password"
              value={password}
              onChange={setPassword}
              visible={showPassword}
              onToggle={() => setShowPassword((value) => !value)}
            />

            <PasswordField
              id="confirm-password"
              label="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              visible={showConfirm}
              onToggle={() => setShowConfirm((value) => !value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 bg-[#246B45] text-xs font-semibold transition hover:bg-[#2C7D53] disabled:cursor-wait disabled:opacity-60"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}

              {loading ? "Updating password..." : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-[9px] uppercase tracking-[0.12em] text-white/25"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          minLength={8}
          className="h-11 w-full border border-white/[0.08] bg-[#0C110E] px-3.5 pr-11 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#62C58C]/30 focus:ring-2 focus:ring-[#62C58C]/10"
          placeholder="••••••••"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-white/20 transition hover:text-white/50"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}
