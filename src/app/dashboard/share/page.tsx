// Move to: src/app/dashboard/share/page.tsx

import { createClient } from "@/lib/supabase/server";
import ShareClient from "./share-client";

export default async function SharePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: sessions } = await supabase
    .from("share_sessions")
    .select("id,expires_at,revoked_at,created_at,permissions")
    .order("created_at", { ascending: false })
    .limit(10);

  return <ShareClient sessions={sessions || []} />;
}
