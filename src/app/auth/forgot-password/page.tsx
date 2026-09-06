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
  HeartPulse,
  Loader2,
  Mail,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/toast"; // Sound-enabled Cuelume audio toasts
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

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

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // 3D Tilt Card Effects
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

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      toast.warning("Email required to proceed");
      return;
    }

    setLoading(true);

    try {
      const origin = window.location.origin;

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
      });

      if (error) {
        toast.error("Unable to send reset email");
        return;
      }

      setSent(true);
      toast.success("Reset link sent to inbox");
    } catch (error) {
      console.error("FORGOT PASSWORD ERROR:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080D0A] px-4 py-6 text-white selection:bg-[#1F7A4F] selection:text-white sm:px-6">
      {/* Dynamic Background Glow Canvas */}
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
            <span>Back to sign in</span>
          </Link>
        </motion.div>

        {/* 3D Tilt Card */}
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
          {/* Logo Header */}
          <div className="mb-8 flex items-center gap-3.5">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.05 }}
              transition={microSpring}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1F7A4F] text-white shadow-[0_8px_25px_rgba(31,122,79,0.3)]"
            >
              <HeartPulse size={21} />
            </motion.div>

            <div>
              <p className="font-serif text-lg font-normal tracking-tight text-white">
                MediPass
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                Secure Account Recovery
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!sent ? (
              /* FORM STAGE */
              <motion.div
                key="form-stage"
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
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1F7A4F]/15 text-[#62C58C]"
                  >
                    <Mail size={22} />
                  </motion.div>

                  <h1 className="font-serif text-2xl font-normal tracking-tight text-white sm:text-3xl">
                    Forgot your password?
                  </h1>

                  <p className="mt-2 text-xs leading-5 text-white/40 sm:text-sm">
                    Enter your registered email address to receive an encrypted
                    reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] font-semibold uppercase tracking-wider text-white/50">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 transition-colors group-focus-within:text-[#62C58C]"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        autoComplete="email"
                        required
                        disabled={loading}
                        className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-11 pr-4 font-sans text-sm text-white outline-none transition duration-200 placeholder:text-white/20 focus:border-[#62C58C]/50 focus:bg-white/[0.06] disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#246B45] font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-[0_6px_20px_rgba(36,107,69,0.25)] transition hover:bg-[#1F603D] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin text-white"
                        />
                        <span>Sending reset link…</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              /* SUCCESS CONFIRMATION STAGE */
              <motion.div
                key="success-stage"
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
                  className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F7A4F]/20 text-[#62C58C]"
                >
                  <CheckCircle2 size={26} />
                </motion.div>

                <h1 className="font-serif text-2xl font-normal tracking-tight text-white">
                  Check your inbox
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-white/40 sm:text-sm">
                  If an active account exists for{" "}
                  <span className="font-semibold text-white/80">{email}</span>,
                  a secure recovery authorization email has been dispatched.
                </p>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => {
                    setSent(false);
                    toast.info("Form reset for new request");
                  }}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#62C58C] transition hover:border-[#62C58C]/40 hover:bg-white/[0.08]"
                >
                  <RotateCcw size={13} />
                  <span>Send Another Email</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card Footer Security Tag */}
          <div className="mt-8 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/20">
            <ShieldCheck size={13} className="text-[#62C58C]" />
            <span>End-to-End Encrypted Recovery</span>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
