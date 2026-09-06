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
    <div className="relative font-sans text-[#121312] selection:bg-[#202220] selection:text-[#F8F6F0]">
      {email && !user.email_confirmed_at && (
        <div className="animate-rise-in mb-8">
          <EmailVerificationBanner email={email} />
        </div>
      )}

      <div className="space-y-10">
        <section>
          <div className="grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
            <div
              className="animate-tumble-in"
              style={{ animationDelay: "80ms" }}
            >
              <MedicalPassport name={name} email={email} />
            </div>
            <div
              className="hover-tilt animate-tumble-in"
              style={{ animationDelay: "160ms" }}
            >
              <HealthOverview />
            </div>
          </div>
        </section>

        <section>
          <div className="grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
            <div
              className="animate-rise-in"
              style={{ animationDelay: "240ms" }}
            >
              <RecentActivity />
            </div>
            <div
              className="hover-tilt animate-tumble-in"
              style={{ animationDelay: "320ms" }}
            >
              <ShareCard />
            </div>
          </div>
        </section>
      </div>

     
    </div>
  );
}
