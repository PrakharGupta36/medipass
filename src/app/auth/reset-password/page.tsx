"use client";

import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
} from "framer-motion";
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
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

// Fluid Spring Configurations
const springPhysics = {
  type: "spring" as const,
  stiffness: 380,
  damping: 28,
  mass: 0.8,
};

const microSpring = {
  type: "spring" as const,
  stiffness: 500,
  damping: 25,
};

export default function ResetPasswordPage() {
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 3D Tilt Card Motion Logic
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 20 });
  const y = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(y, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-6, 6]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

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

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080D0A] px-4 py-6 text-white selection:bg-[#1F7A4F] selection:text-white sm:px-6">
      {/* Dynamic Glow Canvas */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1F7A4F]/[0.15] blur-[140px]"
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[500px]">
        {/* Back Link */}
        {!success && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={springPhysics}
          >
            <Link
              href="/auth"
              className="group mb-6 inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 text-xs font-mono uppercase tracking-wider text-white/50 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />
              <span>Back</span>
            </Link>
          </motion.div>
        )}

        {/* 3D Tilt Wrapper */}
        <motion.section
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, y: 25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={springPhysics}
          className="relative overflow-hidden rounded-[32px] border border-white/[0.1] bg-[#111712]/90 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-9"
        >
          <AnimatePresence mode="wait">
            {success ? (
              /* SUCCESS CONFIRMATION STAGE */
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={springPhysics}
                className="py-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={microSpring}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1F7A4F]/20 text-[#62C58C]"
                >
                  <CheckCircle2 size={30} />
                </motion.div>

                <h1 className="mt-6 font-serif text-2xl font-normal tracking-tight text-white sm:text-3xl">
                  Password changed
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-white/40 sm:text-sm">
                  Your MediPass credential has been securely updated. You can
                  now log in to your account.
                </p>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8"
                >
                  <Link
                    href="/auth"
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#246B45] font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-[0_6px_20px_rgba(36,107,69,0.25)] transition hover:bg-[#1F603D]"
                  >
                    <span>Continue to Sign In</span>
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              /* FORM ENTRY STAGE */
              <motion.div
                key="form-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={springPhysics}
              >
                <div className="mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={microSpring}
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1F7A4F]/15 text-[#62C58C]"
                  >
                    <HeartPulse size={21} />
                  </motion.div>

                  <h1 className="font-serif text-2xl font-normal tracking-tight text-white sm:text-3xl">
                    Create a new password
                  </h1>

                  <p className="mt-2 text-xs leading-5 text-white/40 sm:text-sm">
                    Choose a strong, unique password for your MediPass vault.
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

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="group relative mt-2 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#246B45] font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-[0_6px_20px_rgba(36,107,69,0.25)] transition hover:bg-[#1F603D] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin text-white"
                        />
                        <span>Updating Password…</span>
                      </>
                    ) : (
                      <>
                        <span>Update Password</span>
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Tag */}
          <div className="mt-8 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/20">
            <ShieldCheck size={13} className="text-[#62C58C]" />
            <span>End-to-End Encrypted Storage</span>
          </div>
        </motion.section>
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
      <label className="font-mono text-[10px] font-semibold uppercase tracking-wider text-white/50">
        {label}
      </label>

      <div className="relative">
        <Lock
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 transition-colors group-focus-within:text-[#62C58C]"
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
          className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-11 pr-12 font-sans text-sm text-white outline-none transition duration-200 placeholder:text-white/20 focus:border-[#62C58C]/50 focus:bg-white/[0.06] disabled:opacity-50"
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={onToggle}
          disabled={loading}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/[0.05] hover:text-white/70 disabled:pointer-events-none disabled:opacity-40"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </motion.button>
      </div>
    </div>
  );
}
