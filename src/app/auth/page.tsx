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
import { FormEvent, useState } from "react";
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (error) {
          toast.error("Account Creation Failed", {
            description: error.message,
          });

          return;
        }

        if (data.session) {
          toast.success("Welcome to MediPass!");

          router.push("/dashboard");
          router.refresh();

          return;
        }

        // Email confirmation required

        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);

        return;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error("Authentication Error", {
            description: error.message,
          });

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
    <main className="min-h-screen bg-[#F3F4F1] p-3 text-[#141914] dark:bg-[#080B09] dark:text-white sm:p-6 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-24px)] max-w-[1440px] items-center justify-center sm:min-h-[calc(100vh-48px)]">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-black/[0.08] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)] dark:border-white/[0.08] dark:bg-[#111611] dark:shadow-[0_30px_80px_rgba(0,0,0,0.45)] lg:grid-cols-2">
          {/* =====================================================
              LEFT — BRAND / VISUAL PANEL
          ====================================================== */}

          <section className="relative hidden min-h-[760px] overflow-hidden bg-[#10261A] lg:block">
            {/* Ambient gradients */}
            <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-[#2B8A5A]/30 blur-[100px]" />

            <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#0B5737]/40 blur-[120px]" />

            <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />

            <div className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />

            {/* Decorative medical grid */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />

            {/* Content */}
            <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1F7A4F] text-white shadow-[0_8px_25px_rgba(31,122,79,0.35)]">
                  <HeartPulse size={21} />
                </div>

                <span className="text-lg font-semibold tracking-tight text-white">
                  MediPass
                </span>
              </div>

              {/* Main visual */}
              <div className="relative flex flex-1 items-center justify-center py-10">
                {/* Floating medical card */}
                <div className="relative w-full max-w-[430px] rotate-[-3deg] rounded-[26px] border border-white/[0.12] bg-white/[0.07] p-5 shadow-[0_35px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                  <div className="rounded-[20px] border border-white/[0.08] bg-[#13271C] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                          Medical Passport
                        </p>

                        <p className="mt-1 text-lg font-semibold text-white">
                          Your health. One place.
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F7A4F]/20 text-[#64C991]">
                        <ShieldCheck size={20} />
                      </div>
                    </div>

                    {/* Health information */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <MiniCard label="Blood Group" value="O+" />

                      <MiniCard label="Allergies" value="None" />

                      <MiniCard label="Conditions" value="2 Active" />

                      <MiniCard label="Records" value="12 Files" />
                    </div>

                    {/* Timeline */}
                    <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F7A4F]/20 text-[#64C991]">
                          <CheckCircle2 size={15} />
                        </div>

                        <div>
                          <p className="text-xs font-medium text-white/75">
                            Medical history synced
                          </p>

                          <p className="mt-0.5 text-[10px] text-white/30">
                            Your records are ready to share
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/[0.1] bg-[#14291D]/90 px-4 py-2.5 shadow-xl backdrop-blur-xl">
                  <div className="h-2 w-2 rounded-full bg-[#55C789] shadow-[0_0_10px_#55C789]" />

                  <span className="text-xs font-medium text-white/65">
                    Always in your control
                  </span>
                </div>
              </div>

              {/* Bottom copy */}
              <div className="max-w-[470px]">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#62C58C]">
                  Your medical identity
                </p>

                <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-white xl:text-4xl">
                  One patient.
                  <br />
                  One medical history.
                  <br />
                  Anywhere.
                </h2>

                <p className="mt-4 max-w-md text-sm leading-6 text-white/40">
                  Keep your medical history organized and share the information
                  your doctor needs, whenever you need it.
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              RIGHT — AUTH PANEL
          ====================================================== */}

          <section className="relative flex min-h-[calc(100vh-24px)] flex-col bg-white dark:bg-[#111611] sm:min-h-[760px]">
            {/* Mobile logo */}
            <div className="flex items-center justify-between p-6 lg:hidden">
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.08] bg-white text-[#17201A] transition hover:bg-black/[0.03] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white"
                aria-label="Back to home"
              >
                <ArrowLeft size={18} />
              </Link>

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1F7A4F] text-white">
                  <HeartPulse size={18} />
                </div>

                <span className="font-semibold tracking-tight">MediPass</span>
              </div>

              <div className="w-10" />
            </div>

            {/* Desktop back */}
            <Link
              href="/"
              className="absolute left-8 top-8 hidden h-10 w-10 items-center justify-center rounded-xl border border-black/[0.07] text-black/50 transition hover:bg-black/[0.03] hover:text-black dark:border-white/[0.08] dark:text-white/50 dark:hover:bg-white/[0.05] dark:hover:text-white lg:flex"
              aria-label="Back to home"
            >
              <ArrowLeft size={17} />
            </Link>

            {/* Form container */}
            <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
              {/* Heading */}
              <div className="mb-8">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F5ED] text-[#1F7A4F] dark:bg-[#1F7A4F]/15 dark:text-[#62C58C]">
                  <HeartPulse size={21} />
                </div>

                <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#121712] dark:text-white sm:text-[2.15rem]">
                  {mode === "login" ? "Welcome back" : "Create your account"}
                </h1>

                <p className="mt-2 text-sm leading-6 text-black/45 dark:text-white/40">
                  {mode === "login"
                    ? "Sign in to access your medical passport."
                    : "Start keeping your medical history in one place."}
                </p>
              </div>

              {/* Tabs */}
              <Tabs
                value={mode}
                onValueChange={(value) => {
                  setMode(value as Mode);
                }}
                className="mb-7"
              >
                <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl bg-[#F1F3F0] p-1 dark:bg-white/[0.05]">
                  <TabsTrigger
                    value="login"
                    className="rounded-lg text-xs font-semibold text-black/40 transition-all data-[state=active]:bg-white data-[state=active]:text-[#151A16] data-[state=active]:shadow-[0_1px_4px_rgba(0,0,0,0.08)] dark:text-white/35 dark:data-[state=active]:bg-[#1C271F] dark:data-[state=active]:text-white dark:data-[state=active]:shadow-none"
                  >
                    Sign in
                  </TabsTrigger>

                  <TabsTrigger
                    value="signup"
                    className="rounded-lg text-xs font-semibold text-black/40 transition-all data-[state=active]:bg-white data-[state=active]:text-[#151A16] data-[state=active]:shadow-[0_1px_4px_rgba(0,0,0,0.08)] dark:text-white/35 dark:data-[state=active]:bg-[#1C271F] dark:data-[state=active]:text-white dark:data-[state=active]:shadow-none"
                  >
                    Create account
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                {mode === "signup" && (
                  <AuthInput label="Full Name" icon={<User size={17} />}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      autoComplete="name"
                      className="auth-input-modern"
                    />
                  </AuthInput>
                )}

                {/* Email */}
                <AuthInput label="Email" icon={<Mail size={17} />}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    className="auth-input-modern"
                  />
                </AuthInput>

                {/* Password */}
                <AuthInput label="Password" icon={<Lock size={17} />}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    className="auth-input-modern pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-black/30 transition hover:bg-black/[0.04] hover:text-black/60 dark:text-white/30 dark:hover:bg-white/[0.06] dark:hover:text-white/70"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </AuthInput>

                {/* Forgot password */}
                {mode === "login" && (
                  <div className="-mt-1 flex justify-end">
                    <button
                      type="button"
                      className="text-xs font-semibold text-[#2563EB] transition hover:text-[#1D4ED8] dark:text-[#6EA8FE] dark:hover:text-[#8BB9FF]"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#246B45] text-sm font-semibold text-white shadow-[0_6px_18px_rgba(36,107,69,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1F603D] hover:shadow-[0_8px_22px_rgba(36,107,69,0.24)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      {mode === "login"
                        ? "Signing in..."
                        : "Creating account..."}
                    </>
                  ) : (
                    <>
                      {mode === "login" ? "Sign in" : "Create account"}

                      <ArrowRight
                        size={16}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Security */}
              <div className="mt-7 flex items-center justify-center gap-2 text-[11px] text-black/35 dark:text-white/25">
                <ShieldCheck size={13} />
                <span>Your medical information stays under your control.</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 text-center sm:px-10 lg:px-12">
              <p className="text-[10px] font-medium tracking-[0.12em] text-black/25 dark:text-white/20">
                SECURE • PRIVATE • USER CONTROLLED
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

// Auth Input

function AuthInput({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-white/55">{label}</label>

      <div className="group relative">
        <div
          className="
            pointer-events-none
            absolute left-4 top-1/2 z-10
            -translate-y-1/2
            text-white/25
            transition-colors duration-200
            group-focus-within:text-[#55B981]
          "
        >
          {icon}
        </div>

        {children}
      </div>
    </div>
  );
}

// Mini Heath Card

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-3.5">
      <p className="text-[9px] font-medium uppercase tracking-wider text-white/25">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-white/80">{value}</p>
    </div>
  );
}
