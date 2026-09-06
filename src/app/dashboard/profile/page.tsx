// src/app/dashboard/profile/page.tsx

import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "./actions";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: initialProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <ProfileClient
      initialProfile={initialProfile}
      user={{
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      }}
      memberSince={memberSince}
      updateProfileAction={updateProfile}
    />
  );
}
