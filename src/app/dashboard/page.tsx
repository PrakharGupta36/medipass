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
    <div className="relative mx-auto max-w-4xl font-sans text-[#121312] selection:bg-[#202220] selection:text-[#F8F6F0]">
      {email && !user.email_confirmed_at && (
        <div className="animate-rise-in mb-6">
          <EmailVerificationBanner email={email} />
        </div>
      )}

      <main className="space-y-6">
        {/* Primary Identification */}
        <section
          className="animate-tumble-in"
          style={{ animationDelay: "80ms" }}
        >
          <MedicalPassport name={name} email={email} />
        </section>

        {/* Activity Logs */}

        <section
          className="animate-rise-in"
          style={{ animationDelay: "320ms" }}
        >
          <RecentActivity />
        </section>

        {/* Health Metrics Overview */}
        <section
          className="animate-tumble-in"
          style={{ animationDelay: "240ms" }}
        >
          <HealthOverview />
        </section>

        {/* Quick Share Action */}
        <section
          className="animate-tumble-in"
          style={{ animationDelay: "160ms" }}
        >
          <ShareCard />
        </section>
      </main>
    </div>
  );
}
