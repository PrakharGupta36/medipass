// src/app/dashboard/layout.tsx

import DashboardShell from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
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
    <DashboardShell name={name} email={email}>
      {children}
    </DashboardShell>
  );
}
