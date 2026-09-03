// src/app/dashboard/page.tsx

import EmailVerificationBanner from "@/components/dashboard/email-verification-banner";
import HealthOverview from "@/components/dashboard/health-overview";
import MedicalPassport from "@/components/dashboard/medical-passport";
import RecentActivity from "@/components/dashboard/recent-activity";
import ShareCard from "@/components/dashboard/share-card";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const name =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "there";

  const email = user.email || "";

  return (
    <div className="relative">
      {/* =========================================================
          PAGE ATMOSPHERE
      ========================================================== */}

      <div className="pointer-events-none absolute -top-24 right-0 hidden h-72 w-72 rounded-full bg-[#1F7A4F]/[0.035] blur-[100px] lg:block" />

      {/* =========================================================
          EMAIL STATUS
      ========================================================== */}

      {email && !user.email_confirmed_at && (
        <EmailVerificationBanner email={email} />
      )}


      {/* =========================================================
          IDENTITY / HEALTH
      ========================================================== */}

      <section>
        

        <div className="grid gap-5 xl:grid-cols-[1.5fr_0.85fr]">
          <MedicalPassport name={name} email={email} />

          <HealthOverview />
        </div>
      </section>

      {/* =========================================================
          ACTIVITY / ACCESS
      ========================================================== */}

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-white/20" />

            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
              Record activity
            </span>
          </div>

          <span className="font-mono text-[8px] text-white/15">02 / 02</span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.45fr_0.75fr]">
          <RecentActivity />

          <ShareCard />
        </div>
      </section>

      {/* =========================================================
          FOOTER STATUS
      ========================================================== */}

      <div className="mt-8 flex items-center justify-between border-t border-white/[0.045] px-1 pt-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#62C58C]/60" />

          <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/15">
            MediPass secure record
          </span>
        </div>

        <span className="font-mono text-[8px] text-white/10">PRIVATE</span>
      </div>
    </div>
  );
}
