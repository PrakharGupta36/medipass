// src/app/auth/page.tsx

"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartPulse,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

type Mode = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Interactive mouse position & 3D tilt states
  const pageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = pageRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Track global mouse percentage
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x: xPct, y: yPct });

    // Interactive 3D Card Tilt
    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const cardX = e.clientX - cardRect.left - cardRect.width / 2;
      const cardY = e.clientY - cardRect.top - cardRect.height / 2;

      const rotateX = (cardY / (cardRect.height / 2)) * -8;
      const rotateY = (cardX / (cardRect.width / 2)) * 8;
      setCardTilt({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setCardTilt({ x: 0, y: 0 });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          },
        });

        if (error) {
          toast.error("Account Creation Failed", {
            description: error.message,
          });
          return;
        }

        if (data.session) {
          toast.success("Welcome to MediPass", {
            description: "Your medical passport is ready.",
          });
          router.replace("/dashboard");
          router.refresh();
          return;
        }

        toast.success("Check your inbox", {
          description:
            "We've sent you a confirmation link to finish creating your account.",
        });
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
        return;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error("Authentication Error", { description: error.message });
          return;
        }

        toast.success("Signed in successfully");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Unexpected Error", {
        description: "Something went wrong. Please try again.",
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
      onMouseLeave={handleMouseLeave}
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
      <div className="relative z-10 flex h-full max-h-[820px] w-full max-w-[1320px] items-center justify-center">
        <div className="grid h-full w-full overflow-hidden rounded-[32px] border border-[#121312]/10 bg-white/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] backdrop-blur-md lg:grid-cols-2">
          {/* =====================================================
              LEFT — EDITORIAL / VISUAL PANEL
          ====================================================== */}
          <section className="relative hidden h-full overflow-hidden border-r border-[#121312]/10 bg-[#F8F6F0] lg:block">
            {/* Ambient Dynamic Glows */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-[480px] w-[480px] rounded-full bg-[#18392B] opacity-[0.08] blur-[140px]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-[520px] w-[520px] rounded-full bg-[#C9A227] opacity-[0.06] blur-[150px]" />

            {/* Layout Container */}
            <div className="relative flex h-full flex-col justify-between p-8 xl:p-10">
              {/* Brand Header */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#18392B] text-[#F8F6F0] shadow-sm">
                  <HeartPulse size={20} />
                </div>
                <span className="font-serif text-2xl font-normal text-[#121312]">
                  MediPass
                </span>
              </div>

              {/* Interactive 3D Stage */}
              <div
                className="relative flex flex-1 items-center justify-center py-4"
                style={{ perspective: "1000px" }}
              >
                <div
                  ref={cardRef}
                  className="relative w-full max-w-[380px] transition-transform duration-200 ease-out"
                  style={{
                    transform: `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Passport Card */}
                  <div className="relative rounded-[24px] border border-[#121312]/10 bg-white p-5 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.06)]">
                    <div className="rounded-[18px] border border-[#121312]/10 bg-[#F8F6F0] p-4">
                      <div className="flex items-center justify-between border-b border-[#121312]/10 pb-3">
                        <div>
                          <p className="font-mono text-[8px] uppercase tracking-widest text-[#121312]/40">
                            Medical Passport
                          </p>
                          <p className="font-serif text-base font-normal text-[#121312]">
                            Unified Patient Vault
                          </p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18392B] text-[#F8F6F0]">
                          <ShieldCheck size={16} />
                        </div>
                      </div>

                      {/* Mini Data Grid */}
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <EditorialMiniCard label="Blood Group" value="O+" />
                        <EditorialMiniCard
                          label="Allergies"
                          value="Penicillin"
                        />
                        <EditorialMiniCard
                          label="Conditions"
                          value="1 Active"
                        />
                        <EditorialMiniCard label="Records" value="14 Files" />
                      </div>

                      {/* Status Banner */}
                      <div className="mt-3 rounded-lg border border-[#121312]/10 bg-white p-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#18392B]/10 text-[#18392B]">
                            <CheckCircle2 size={13} />
                          </div>
                          <div>
                            <p className="font-mono text-[11px] font-semibold text-[#121312]">
                              Medical Record Synced
                            </p>
                            <p className="font-mono text-[8px] uppercase tracking-wider text-[#121312]/40">
                              Ready for provider auth
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Security Badge */}
                  <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#121312]/10 bg-white px-4 py-1.5 shadow-md backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18392B] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#18392B]" />
                    </span>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#121312]">
                      Sovereign Encryption
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Copy */}
              <div className="max-w-[440px]">
                <p className="mb-1 font-mono text-[9px] font-semibold uppercase tracking-widest text-[#18392B]">
                  Your Universal History
                </p>

                <h2 className="font-serif text-2xl font-normal leading-tight tracking-tight text-[#121312] xl:text-3xl">
                  One patient.{" "}
                  <span className="italic text-[#18392B]">
                    One lifetime record.
                  </span>{" "}
                  Anywhere.
                </h2>

                <p className="mt-2 font-mono text-[11px] leading-relaxed text-[#121312]/60">
                  Consolidate your lifetime clinical record into an encrypted
                  passport under your exclusive authorization.
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              RIGHT — FORM PANEL
          ====================================================== */}
          <section className="relative flex h-full flex-col justify-between bg-white p-6 sm:p-8 lg:p-10">
            {/* Header Navigation */}
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#121312]/10 bg-[#F8F6F0] text-[#121312]/60 transition-all hover:border-[#121312] hover:bg-[#121312] hover:text-[#F8F6F0]"
                aria-label="Back to home"
              >
                <ArrowLeft size={16} />
              </Link>

              {/* Mobile Only Logo */}
              <div className="flex items-center gap-2 lg:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18392B] text-[#F8F6F0]">
                  <HeartPulse size={16} />
                </div>
                <span className="font-serif text-lg">MediPass</span>
              </div>

              <div className="w-9 lg:hidden" />
            </div>

            {/* Form Stage */}
            <div className="mx-auto w-full max-w-[380px] py-2">
              {/* Heading */}
              <div className="mb-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#18392B]/10 text-[#18392B]">
                  <HeartPulse size={20} />
                </div>

                <h1 className="font-serif text-3xl font-normal text-[#121312]">
                  {mode === "login" ? "Welcome Back" : "Create Account"}
                </h1>

                <p className="mt-1 font-mono text-[11px] leading-relaxed text-[#121312]/60">
                  {mode === "login"
                    ? "Sign in to access your secure medical passport."
                    : "Initialize your sovereign health vault today."}
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <Tabs
                value={mode}
                onValueChange={(value) => setMode(value as Mode)}
                className="mb-5"
              >
                <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl bg-[#F8F6F0] p-1 border border-[#121312]/5">
                  <TabsTrigger
                    value="login"
                    className="rounded-lg font-mono text-[10px] font-semibold uppercase tracking-wider text-[#121312]/50 transition-all data-[state=active]:bg-white data-[state=active]:text-[#121312] data-[state=active]:shadow-xs"
                  >
                    Sign In
                  </TabsTrigger>

                  <TabsTrigger
                    value="signup"
                    className="rounded-lg font-mono text-[10px] font-semibold uppercase tracking-wider text-[#121312]/50 transition-all data-[state=active]:bg-white data-[state=active]:text-[#121312] data-[state=active]:shadow-xs"
                  >
                    Create Account
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Form Input Fields */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Full Name */}
                {mode === "signup" && (
                  <EditorialInput label="Full Name" icon={<User size={15} />}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      autoComplete="name"
                      className="mt-1 h-10 w-full rounded-lg border border-[#121312]/15 bg-[#F8F6F0] pl-10 pr-3 font-mono text-xs text-[#121312] outline-none transition placeholder:text-[#121312]/30 focus:border-[#18392B] focus:bg-white focus:ring-1 focus:ring-[#18392B]"
                    />
                  </EditorialInput>
                )}

                {/* Email Address */}
                <EditorialInput label="Email Address" icon={<Mail size={15} />}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    required
                    autoComplete="email"
                    className="mt-1 h-10 w-full rounded-lg border border-[#121312]/15 bg-[#F8F6F0] pl-10 pr-3 font-mono text-xs text-[#121312] outline-none transition placeholder:text-[#121312]/30 focus:border-[#18392B] focus:bg-white focus:ring-1 focus:ring-[#18392B]"
                  />
                </EditorialInput>

                {/* Password Field */}
                <EditorialInput label="Password" icon={<Lock size={15} />}>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      minLength={6}
                      autoComplete={
                        mode === "login" ? "current-password" : "new-password"
                      }
                      className="mt-1 h-10 w-full rounded-lg border border-[#121312]/15 bg-[#F8F6F0] pl-10 pr-10 font-mono text-xs text-[#121312] outline-none transition placeholder:text-[#121312]/30 focus:border-[#18392B] focus:bg-white focus:ring-1 focus:ring-[#18392B]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[#121312]/40 transition hover:bg-[#121312]/5 hover:text-[#121312]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </EditorialInput>

                {/* Forgot Password Link */}
                {mode === "login" && (
                  <div className="flex justify-end">
                    <Link
                      href="/auth/forgot-password"
                      className="font-mono text-[11px] font-semibold text-[#18392B] transition hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#121312] font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] shadow-sm transition-all hover:bg-[#18392B] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>
                        {mode === "login" ? "Authenticating..." : "Creating..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        {mode === "login" ? "Sign In" : "Initialize Passport"}
                      </span>
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Security Badge */}
              <div className="mt-5 flex items-center justify-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[#121312]/50">
                <ShieldCheck size={13} className="text-[#18392B]" />
                <span>Zero Knowledge Auth · Protected Vault</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="font-mono text-[9px] font-medium uppercase tracking-widest text-[#121312]/30">
                Encrypted • Sovereign • User Authorized
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

{
  /* Input Wrapper */
}
function EditorialInput({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-0.5">
      <label className="font-mono text-[8px] uppercase tracking-wider text-[#121312]/60">
        {label}
      </label>

      <div className="group relative">
        <div className="pointer-events-none absolute left-3 top-[calc(50%+2px)] z-10 -translate-y-1/2 text-[#121312]/30 transition-colors duration-200 group-focus-within:text-[#18392B]">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}

{
  /* Passport Micro Card */
}
function EditorialMiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#121312]/10 bg-white p-2 text-left">
      <p className="font-mono text-[7px] uppercase tracking-wider text-[#121312]/40">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-[11px] font-semibold text-[#121312]">
        {value}
      </p>
    </div>
  );
}
