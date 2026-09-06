import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("notifications_enabled")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <SettingsClient
      userId={user.id}
      email={user.email || ""}
      emailVerified={!!user.email_confirmed_at}
      notificationsEnabled={profile?.notifications_enabled ?? true}
    />
  );
}
