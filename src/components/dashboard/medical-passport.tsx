import Link from "next/link";
import {
  ArrowUpRight,
  Fingerprint,
  QrCode,
  ShieldCheck,
} from "lucide-react";

export default function MedicalPassport({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  return (
    <section
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border border-[#62C58C]/15
        bg-[#111A14]
        shadow-[0_24px_70px_rgba(0,0,0,0.28)]
      "
    >
      {/* =========================================================
          GLASS / DOCUMENT SURFACE
      ========================================================== */}

      <div
        className="
          pointer-events-none
          absolute inset-[1px]
          rounded-[27px]
          border border-white/[0.035]
        "
      />

      {/* Top glass reflection */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-10
          top-0
          h-16
          bg-white/[0.025]
          blur-2xl
        "
      />

      {/* Very subtle green atmosphere */}
      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-80
          w-80
          rounded-full
          bg-[#2B8A5A]/[0.10]
          blur-[100px]
        "
      />

      {/* Decorative passport ring */}
      <div
        className="
          pointer-events-none
          absolute
          -bottom-28
          -right-20
          h-64
          w-64
          rounded-full
          border
          border-white/[0.035]
        "
      />

      <div className="relative p-6 sm:p-7 lg:p-8">
        {/* =======================================================
            PASSPORT HEADER
        ======================================================== */}

        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="
                  flex h-6 w-6
                  items-center justify-center
                  rounded-[7px]
                  border border-[#62C58C]/20
                  bg-[#1F7A4F]/10
                  text-[#62C58C]
                "
              >
                <ShieldCheck size={13} strokeWidth={1.8} />
              </span>

              <p className="font-mono text-[8px] font-medium uppercase tracking-[0.22em] text-[#62C58C]/75">
                Medical passport
              </p>
            </div>

            <h2 className="mt-4 truncate text-[27px] font-semibold tracking-[-0.045em] text-white sm:text-[30px]">
              {name}
            </h2>

            <p className="mt-1 truncate text-[11px] text-white/25">
              {email}
            </p>
          </div>

          {/* QR / access button */}
          <Link
            href="/dashboard/share"
            aria-label="Share medical passport"
            data-cuelume-hover="tick"
            data-cuelume-press
            data-cuelume-release
            className="
              group/qr
              relative
              flex h-14 w-14
              shrink-0
              items-center justify-center
              rounded-[16px]
              border border-white/[0.09]
              bg-white/[0.035]
              text-white/55
              shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]
              transition-all duration-200
              hover:border-[#62C58C]/20
              hover:bg-[#1F7A4F]/10
              hover:text-[#72D39A]
              active:scale-95
            "
          >
            <QrCode
              size={23}
              strokeWidth={1.6}
              className="transition-transform duration-200 group-hover/qr:scale-105"
            />

            <span
              className="
                absolute
                right-2
                top-2
                h-1.5
                w-1.5
                rounded-full
                bg-[#62C58C]/70
              "
            />
          </Link>
        </div>

        {/* =======================================================
            IDENTITY STRIP
        ======================================================== */}

        <div className="mt-7 border-y border-white/[0.065] py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Fingerprint
                size={13}
                strokeWidth={1.5}
                className="text-white/20"
              />

              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/20">
                Patient identity
              </span>
            </div>

            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#62C58C]/55">
              Verified record
            </span>
          </div>
        </div>

        {/* =======================================================
            PASSPORT DATA
        ======================================================== */}

        <div className="grid grid-cols-2 sm:grid-cols-4">
          <PassportField
            label="Status"
            value="Active"
            green
            bordered
          />

          <PassportField
            label="Records"
            value="0"
            bordered
          />

          <PassportField
            label="Sharing"
            value="Private"
            bordered
          />

          <PassportField
            label="Updated"
            value="Just now"
          />
        </div>

        {/* =======================================================
            SHARE ACTION
        ======================================================== */}

        <Link
          href="/dashboard/share"
          data-cuelume-hover="tick"
          data-cuelume-press
          data-cuelume-release
          className="
            group/share
            relative
            mt-7
            flex
            h-12
            w-full
            items-center
            justify-center
            gap-2.5
            overflow-hidden
            rounded-[14px]
            border border-[#62C58C]/20
            bg-[#1F6B46]
            text-[11px]
            font-semibold
            text-white
            shadow-[0_10px_28px_rgba(31,107,70,0.16),inset_0_1px_0_rgba(255,255,255,0.10)]
            transition-all duration-200
            hover:bg-[#26764D]
            hover:shadow-[0_12px_32px_rgba(31,107,70,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]
            active:scale-[0.985]
          "
        >
          {/* Button glass reflection */}
          <span
            className="
              pointer-events-none
              absolute
              inset-x-12
              top-0
              h-6
              rounded-full
              bg-white/[0.06]
              blur-xl
            "
          />

          <QrCode
            size={15}
            strokeWidth={1.8}
            className="relative z-10"
          />

          <span className="relative z-10">
            Share medical passport
          </span>

          <ArrowUpRight
            size={14}
            strokeWidth={1.8}
            className="
              relative z-10
              transition-transform duration-200
              group-hover/share:translate-x-0.5
              group-hover/share:-translate-y-0.5
            "
          />
        </Link>

        {/* =======================================================
            FOOTNOTE
        ======================================================== */}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#62C58C]/60" />

            <span className="text-[9px] text-white/20">
              Access controlled by you
            </span>
          </div>

          <span className="font-mono text-[8px] tracking-[0.12em] text-white/10">
            MEDIPASS
          </span>
        </div>
      </div>
    </section>
  );
}

function PassportField({
  label,
  value,
  green = false,
  bordered = false,
}: {
  label: string;
  value: string;
  green?: boolean;
  bordered?: boolean;
}) {
  return (
    <div
      className={`
        relative
        py-5
        ${bordered ? "border-r border-white/[0.055]" : ""}
      `}
    >
      <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/20">
        {label}
      </p>

      <p
        className={`
          mt-2
          text-[11px]
          font-medium
          ${
            green
              ? "text-[#62C58C]"
              : "text-white/65"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
}