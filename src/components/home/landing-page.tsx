"use client";

import {
  ArrowRight,
  FileText,
  HeartPulse,
  Lock,
  Pill,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const RAISED =
  "shadow-[0_1px_0.5px_#ffffff1a_inset,0_1px_1px_#ffffff35_inset,0_10px_10px_-9px_#00000070,0_20px_20px_-14px_#00000060,0_0px_6px_0px_#00000060]";

const RAISED_CRISP =
  "shadow-[0_0.5px_0px_#ffffff1a_inset,0_1px_0.5px_#ffffff25_inset,0_10px_10px_-9px_#00000070,0_20px_20px_-14px_#00000060,0_0px_6px_0px_#00000060]";

const INSET = "shadow-[0_0.5px_0_#ffffff50,0_2px_6px_#00000090_inset]";

const GRID_BG =
  "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)";

const GRID_SIZE = "56px 56px";

export default function LandingPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState({
    x: 50,
    y: 20,
  });

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = pageRef.current?.getBoundingClientRect();

    if (!rect) return;

    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <main
      ref={pageRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#0f0f0f] text-[#ececec]"
    >
      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Base grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: GRID_BG,
          backgroundSize: GRID_SIZE,
        }}
      />

      {/* Cursor grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden transition-opacity duration-300 lg:block"
        style={{
          backgroundImage: GRID_BG,
          backgroundSize: GRID_SIZE,
          opacity: isHovering ? 0.25 : 0,
          WebkitMaskImage: `radial-gradient(260px circle at ${pos.x}% ${pos.y}%, black, transparent 70%)`,
          maskImage: `radial-gradient(260px circle at ${pos.x}% ${pos.y}%, black, transparent 70%)`,
        }}
      />

      {/* Cursor glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden transition-[background] duration-300 lg:block"
        style={{
          background: `radial-gradient(820px circle at ${pos.x}% ${pos.y}%, rgba(76,169,124,0.06), transparent 45%)`,
        }}
      />

      {/* Atmosphere */}
      <div className="pointer-events-none absolute -right-24 -top-24 z-0 h-[280px] w-[280px] rounded-full bg-[#1f6b46] blur-[100px] opacity-[0.12] sm:-right-40 sm:-top-40 sm:h-[420px] sm:w-[420px] lg:-right-52 lg:-top-52 lg:h-[640px] lg:w-[640px] lg:blur-[170px]" />

      <div className="pointer-events-none absolute -bottom-28 -left-28 z-0 h-[260px] w-[260px] rounded-full bg-[#1f6b46] blur-[100px] opacity-[0.08] sm:-bottom-40 sm:-left-40 sm:h-[380px] sm:w-[380px] lg:-bottom-56 lg:-left-56 lg:h-[560px] lg:w-[560px] lg:blur-[170px]" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pb-8 pt-5 sm:px-8 sm:pt-8 lg:px-20 lg:pb-10 lg:pt-10">
        {/* Navbar */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-b from-[#2c6b4c] to-[#20553b] text-[#eafff3] sm:h-11 sm:w-11 sm:rounded-2xl lg:h-12 lg:w-12 ${RAISED}`}
            >
              <HeartPulse size={18} strokeWidth={2.3} className="sm:hidden" />

              <HeartPulse
                size={22}
                strokeWidth={2.3}
                className="hidden sm:block"
              />
            </div>

            <span className="text-lg font-semibold tracking-[-0.03em] text-white sm:text-xl lg:text-2xl">
              MediPass
            </span>
          </div>

          <button
            onClick={() => router.push("/auth")}
            className={`rounded-full bg-gradient-to-b from-[#202020] to-[#191919] px-4 py-2 text-sm font-medium text-white/60 transition-all duration-150 hover:text-white active:scale-[0.97] sm:px-6 sm:py-3 sm:text-base ${RAISED}`}
          >
            Sign in
          </button>
        </nav>

        {/* Hero */}
        <section className="flex flex-1 flex-col items-center justify-center gap-10 py-10 text-center sm:gap-14 sm:py-14 lg:flex-row lg:gap-24 lg:py-16 lg:text-left">
          <div className="w-full max-w-md sm:max-w-xl lg:max-w-2xl">
            <div
              className={`animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#191919] to-[#151515] px-3.5 py-2 text-[11px] font-medium text-white/60 sm:mb-7 sm:px-4 sm:py-2.5 sm:text-xs lg:mb-9 ${RAISED}`}
            >
              <ShieldCheck size={13} className="shrink-0 text-[#4CA97C]" />

              <span>Your health. Your record. Your control.</span>
            </div>

            <h1
              className="animate-fade-up text-[2.25rem] leading-[1.12] tracking-[-0.02em] text-white sm:text-6xl sm:leading-[1.06] lg:text-[clamp(3rem,5.2vw,4.75rem)] [font-family:var(--font-fraunces)]"
              style={{ animationDelay: "80ms" }}
            >
              <span className="block sm:whitespace-nowrap font-medium">
                Your medical history,
              </span>

              <span className="block sm:whitespace-nowrap font-medium italic text-[#5CBA8A]">
                wherever you go.
              </span>
            </h1>

            <p
              className="animate-fade-up mx-auto mt-5 max-w-md text-[15px] leading-7 text-white/50 sm:mt-8 sm:text-lg sm:leading-8 sm:text-white/70 lg:mx-0"
              style={{ animationDelay: "160ms" }}
            >
              One secure place for your medical history, medications, allergies,
              reports and more. Share it with any doctor in seconds.
            </p>

            <div
              className="animate-fade-up mt-7 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-start sm:gap-4"
              style={{ animationDelay: "240ms" }}
            >
              <button
                onClick={() => router.push("/auth")}
                className={`group flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#2c6b4c] to-[#20553b] px-6 text-sm font-semibold text-[#eafff3] transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.97] sm:h-14 sm:w-auto sm:px-7 sm:text-base ${RAISED}`}
              >
                Create your health passport
                <ArrowRight
                  size={17}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5"
                />
              </button>

              <button
                onClick={() => router.push("/auth")}
                className="h-12 w-full rounded-2xl px-6 text-sm font-medium text-white/45 transition hover:bg-white/[0.04] hover:text-white sm:h-14 sm:w-auto sm:text-base"
              >
                I already have an account
              </button>
            </div>
          </div>

          {/* Passport visual */}
          <div
            className="animate-fade-up w-full max-w-[280px] shrink-0 sm:max-w-[340px] lg:max-w-[420px]"
            style={{ animationDelay: "180ms" }}
          >
            <div className="relative">
              <div
                className={`absolute -right-3 -top-5 z-10 flex items-center gap-2.5 rounded-2xl bg-gradient-to-b from-[#202020] to-[#191919] p-3 sm:-right-5 sm:-top-8 sm:gap-3.5 sm:p-4 lg:-right-9 ${RAISED}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl bg-[#131313] text-white/70 sm:h-11 sm:w-11 ${INSET}`}
                >
                  <QrCode size={15} className="sm:hidden" />
                  <QrCode size={19} className="hidden sm:block" />
                </div>

                <div className="text-left">
                  <p className="text-xs font-semibold text-white sm:text-sm">
                    Share instantly
                  </p>

                  <p className="text-[10px] text-white/35 sm:text-xs">
                    With any doctor
                  </p>
                </div>
              </div>

              <div
                className={`rotate-[-1.5deg] rounded-[24px] bg-gradient-to-b from-[#212121] to-[#191919] p-4 transition-transform duration-500 hover:rotate-0 sm:rounded-[32px] sm:p-6 ${RAISED_CRISP}`}
              >
                <div
                  className={`relative overflow-hidden rounded-[18px] bg-gradient-to-b from-[#121412] to-[#0d0f0d] p-4 sm:rounded-[24px] sm:p-6 ${INSET}`}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white/[0.05] to-transparent sm:h-20" />

                  <div className="relative flex items-start justify-between">
                    <div className="text-left">
                      <p className="text-[9px] uppercase tracking-[0.18em] text-white/30 sm:text-[11px]">
                        Medical Passport
                      </p>

                      <p className="mt-1 text-base font-semibold tracking-tight text-white sm:mt-1.5 sm:text-xl">
                        MediPass
                      </p>
                    </div>

                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-b from-[#2c6b4c] to-[#20553b] sm:h-10 sm:w-10 sm:rounded-xl ${RAISED}`}
                    >
                      <HeartPulse
                        size={13}
                        className="text-[#eafff3] sm:hidden"
                      />

                      <HeartPulse
                        size={16}
                        className="hidden text-[#eafff3] sm:block"
                      />
                    </div>
                  </div>

                  <div className="relative mt-8 text-left sm:mt-14">
                    <p className="text-xs text-white/30 sm:text-sm">Patient</p>

                    <p className="mt-1 text-lg font-medium text-white sm:mt-1.5 sm:text-2xl">
                      Your Medical Record
                    </p>
                  </div>

                  <div className="relative mt-5 grid grid-cols-2 gap-2 sm:mt-8 sm:gap-2.5">
                    <div
                      className={`rounded-xl bg-[#0a0c0a] p-2.5 text-left sm:rounded-2xl sm:p-4 ${INSET}`}
                    >
                      <p className="text-[9px] text-white/30 sm:text-[11px]">
                        ALLERGIES
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-white/80 sm:mt-1.5 sm:gap-2 sm:text-base">
                        <Lock size={11} className="shrink-0 text-[#4CA97C]" />
                        Protected
                      </p>
                    </div>

                    <div
                      className={`rounded-xl bg-[#0a0c0a] p-2.5 text-left sm:rounded-2xl sm:p-4 ${INSET}`}
                    >
                      <p className="text-[9px] text-white/30 sm:text-[11px]">
                        MEDICATIONS
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-white/80 sm:mt-1.5 sm:gap-2 sm:text-base">
                        <Pill size={11} className="shrink-0 text-[#4CA97C]" />
                        Protected
                      </p>
                    </div>
                  </div>

                  <div
                    className={`relative mt-2 rounded-xl bg-[#0a0c0a] p-2.5 text-left sm:mt-2.5 sm:rounded-2xl sm:p-4 ${INSET}`}
                  >
                    <p className="text-[9px] text-white/30 sm:text-[11px]">
                      MEDICAL HISTORY
                    </p>

                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-white/80 sm:mt-1.5 sm:gap-2 sm:text-base">
                      <FileText size={11} className="shrink-0 text-[#4CA97C]" />
                      Always with you
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`absolute -bottom-4 -left-4 rounded-xl bg-gradient-to-b from-[#202020] to-[#191919] px-3.5 py-3 text-left sm:-bottom-6 sm:-left-6 sm:rounded-2xl sm:px-5 sm:py-4 ${RAISED}`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#4CA97C] sm:h-2 sm:w-2" />

                  <span className="text-xs font-semibold text-white sm:text-sm">
                    Secure & private
                  </span>
                </div>

                <p className="mt-1 text-[10px] text-white/30 sm:mt-1.5 sm:text-xs">
                  You control who sees your records
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-4 sm:pt-6">
          <p className="text-center text-xs text-white/25 sm:text-sm">
            One patient. One medical history. Anywhere.
          </p>
        </div>
      </div>
    </main>
  );
}
