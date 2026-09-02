import EmailVerificationBanner from "@/components/dashboard/email-verification-banner";
import MedicalPassport from "@/components/dashboard/medical-passport";
import HealthOverview from "@/components/dashboard/health-overview";
import RecentActivity from "@/components/dashboard/recent-activity";
import ShareCard from "@/components/dashboard/share-card";

import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  const email = user?.email || "";

  return (
    <>
      {email && <EmailVerificationBanner email={email} />}

      {/* Mobile welcome */}
      <div className="mb-7 lg:hidden">
        <p className="text-sm text-white/30">Welcome back,</p>

        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
          {name}
        </h1>
      </div>

      {/* Main */}
      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <MedicalPassport name={name} email={email} />

        <HealthOverview />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
        <RecentActivity />

        <ShareCard />
      </div>
    </>
  );
}
