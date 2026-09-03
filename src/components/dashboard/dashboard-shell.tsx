import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import MobileNav from "@/components/dashboard/mobile-nav";

export default async function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const name =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "there";

  const email = user.email || "";

  return (
    <main className="min-h-screen bg-[#080D0A] text-white">
      <DashboardSidebar name={name} email={email} />

      <div className="lg:pl-[250px]">
        <div className="mx-auto w-full max-w-[1400px] px-5 pb-32 pt-6 sm:px-7 md:px-8 lg:px-8 lg:pb-10 xl:px-10">
          {children}
        </div>
      </div>

      <MobileNav />
    </main>
  );
}
