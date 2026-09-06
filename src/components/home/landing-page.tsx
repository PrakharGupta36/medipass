// src/app/page.tsx

"use client";

import {
  ArrowRight,
  FileText,
  HeartPulse,
  Lock,
  Pill,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Smooth mouse coordinates for physics and lighting
  const [pos, setPos] = useState({ x: 50, y: 20 });
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = pageRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Track global mouse percentage
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x: xPct, y: yPct });

    // Interactive 3D Card Tilt Calculation
    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const cardX = e.clientX - cardRect.left - cardRect.width / 2;
      const cardY = e.clientY - cardRect.top - cardRect.height / 2;

      // Calculate rotation angles
      const rotateX = (cardY / (cardRect.height / 2)) * -8;
      const rotateY = (cardX / (cardRect.width / 2)) * 8;
      setCardTilt({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setCardTilt({ x: 0, y: 0 });
  };

  return (
    <main
      ref={pageRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#F4F0EA] text-[#121312] selection:bg-[#18392B] selection:text-[#F8F6F0]"
    >
      {/* 1. Fine Film Grain Texture Overaly */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* 2. Warm Architectural Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#121312 1px, transparent 1px), linear-gradient(90deg, #121312 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* 3. Interactive Mouse Revealing Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden transition-opacity duration-500 lg:block"
        style={{
          backgroundImage: `linear-gradient(#18392B 1px, transparent 1px), linear-gradient(90deg, #18392B 1px, transparent 1px)`,
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
          background: `radial-gradient(750px circle at ${pos.x}% ${pos.y}%, rgba(24, 57, 43, 0.08), transparent 50%)`,
        }}
      />

      {/* 5. Editorial Ambient Glow Orbs */}
      <div className="pointer-events-none absolute -right-20 -top-20 z-0 h-[380px] w-[380px] rounded-full bg-[#18392B] opacity-[0.07] blur-[120px] sm:h-[600px] sm:w-[600px] sm:blur-[180px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 z-0 h-[320px] w-[320px] rounded-full bg-[#C9A227] opacity-[0.06] blur-[120px] sm:h-[500px] sm:w-[500px] sm:blur-[180px]" />

      {/* Primary Layout Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-8 pt-6 sm:px-10 lg:px-16 lg:pb-12 lg:pt-10">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="group relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[#121312] text-[#F8F6F0] shadow-md transition-transform duration-300 hover:scale-105 sm:h-11 sm:w-11">
              <HeartPulse
                size={20}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:rotate-12"
              />
            </div>

            <span className="font-serif text-xl font-normal tracking-tight text-[#121312] sm:text-2xl">
              MediPass
            </span>
          </div>

          <button
            onClick={() => router.push("/auth")}
            className="group relative overflow-hidden rounded-full border border-[#121312]/15 bg-white px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#121312] shadow-xs transition-all hover:border-[#121312] hover:shadow-md active:scale-95 sm:px-6 sm:py-3"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-[#F8F6F0]">
              Sign in
            </span>
            <div className="absolute inset-0 z-0 translate-y-full bg-[#121312] transition-transform duration-300 ease-out group-hover:translate-y-0" />
          </button>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-1 flex-col items-center justify-center gap-12 py-10 sm:py-16 lg:flex-row lg:gap-20 lg:py-20 lg:text-left">
          {/* Main Editorial Copy */}
          <div className="w-full max-w-xl lg:max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#18392B]/20 bg-[#18392B]/5 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#18392B] backdrop-blur-md sm:mb-8 sm:text-xs">
              <ShieldCheck size={14} className="shrink-0 text-[#18392B]" />
              <span>Sovereign Record · End-to-End Encrypted</span>
            </div>

            <h1 className="font-serif text-4xl leading-[1.08] tracking-tight text-[#121312] sm:text-6xl lg:text-[clamp(3.5rem,5.5vw,5.25rem)]">
              Your medical history,{" "}
              <span className="relative inline-block italic text-[#18392B]">
                wherever you go.
                <svg
                  className="absolute -bottom-1 left-0 w-full text-[#18392B]/30"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,15 Q50,5 100,15"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-md font-mono text-sm leading-relaxed text-[#121312]/70 sm:mt-8 sm:text-base lg:mx-0">
              One unified, encrypted vault for your medical timeline, active
              prescriptions, allergies, and lab diagnostics. Shareable in
              seconds.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-4 sm:mt-10 sm:flex-row sm:items-center lg:justify-start">
              <button
                onClick={() => router.push("/auth")}
                className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#121312] px-8 font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] shadow-lg transition-all hover:bg-[#18392B] hover:shadow-xl active:scale-[0.98] sm:w-auto"
              >
                <span>Create Health Passport</span>
                <ArrowRight
                  size={16}
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => router.push("/auth")}
                className="h-14 w-full rounded-2xl border border-[#121312]/15 bg-white/80 px-8 font-mono text-xs font-semibold uppercase tracking-wider text-[#121312] shadow-xs backdrop-blur-sm transition-all hover:border-[#121312] hover:bg-white active:scale-[0.98] sm:w-auto"
              >
                Existing Account
              </button>
            </div>
          </div>

          {/* Interactive Passport Visual Artifact */}
          <div
            ref={cardRef}
            className="w-full max-w-[320px] shrink-0 sm:max-w-[380px] lg:max-w-[420px]"
            style={{
              perspective: "1000px",
            }}
          >
            <div
              className="relative transition-transform duration-200 ease-out"
              style={{
                transform: `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Floating QR Badge */}
              <div className="absolute -right-3 -top-6 z-20 flex items-center gap-3 rounded-2xl border border-[#121312]/10 bg-white/90 p-4 shadow-xl backdrop-blur-md transition-transform duration-300 hover:scale-105 sm:-right-6 sm:-top-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F0EA] text-[#18392B]">
                  <QrCode size={18} />
                </div>

                <div className="text-left">
                  <p className="font-serif text-sm font-medium text-[#121312]">
                    Instant Access
                  </p>

                  <p className="font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
                    Provider Token
                  </p>
                </div>
              </div>

              {/* Main Outer Passport Envelope */}
              <div className="relative overflow-hidden rounded-[32px] border border-[#121312]/10 bg-white p-6 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.06)] sm:p-8">
                {/* Dynamic Shine Light Beam */}
                <div
                  className="pointer-events-none absolute -inset-full z-10 opacity-30 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.8) 0%, transparent 60%)`,
                  }}
                />

                {/* Inner Card Blueprint Surface */}
                <div className="relative rounded-[24px] border border-[#121312]/10 bg-[#F8F6F0] p-5 sm:p-6">
                  {/* Card Header */}
                  <div className="flex items-start justify-between border-b border-[#121312]/10 pb-4">
                    <div className="text-left">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[#121312]/40">
                        Medical Passport
                      </p>

                      <p className="font-serif text-xl font-normal text-[#121312]">
                        MediPass
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#18392B] text-[#F8F6F0] shadow-xs">
                      <HeartPulse size={16} />
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div className="mt-8 text-left">
                    <p className="font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
                      Passport Holder
                    </p>

                    <p className="mt-1 font-serif text-2xl font-normal text-[#121312]">
                      Unified Patient Vault
                    </p>
                  </div>

                  {/* Status Grid Badges */}
                  <div className="mt-8 grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl border border-[#121312]/10 bg-white p-3 text-left shadow-2xs">
                      <p className="font-mono text-[8px] uppercase tracking-wider text-[#121312]/40">
                        ALLERGIES
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 font-mono text-xs font-semibold text-[#18392B]">
                        <Lock size={10} />
                        Encrypted
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#121312]/10 bg-white p-3 text-left shadow-2xs">
                      <p className="font-mono text-[8px] uppercase tracking-wider text-[#121312]/40">
                        MEDICATIONS
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 font-mono text-xs font-semibold text-[#18392B]">
                        <Pill size={10} />
                        Verified
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 rounded-xl border border-[#121312]/10 bg-white p-3 text-left shadow-2xs">
                    <p className="font-mono text-[8px] uppercase tracking-wider text-[#121312]/40">
                      TIMELINE RECORD
                    </p>

                    <p className="mt-1 flex items-center gap-1.5 font-mono text-xs font-semibold text-[#121312]">
                      <FileText size={10} className="text-[#18392B]" />
                      Continuously Synced
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Security Badge */}
              <div className="absolute -bottom-5 -left-3 rounded-2xl border border-[#121312]/10 bg-white px-5 py-3.5 text-left shadow-xl backdrop-blur-md sm:-bottom-6 sm:-left-6">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18392B] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#18392B]" />
                  </span>

                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#121312]">
                    Zero Knowledge Architecture
                  </span>
                </div>

                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
                  Full User Authorization Control
                </p>
              </div>
            </div>
          </div>
        </section>

       

        {/* Footer */}
        <footer className="pt-6 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-[#121312]/40">
            One Patient · Universal Medical History · Sovereign Control
          </p>
        </footer>
      </div>
    </main>
  );
}
