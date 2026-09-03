// Move this file to:
// src/app/dashboard/share/actions.ts

"use server";

import { createHash, randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const DURATIONS = {
  "15 minutes": 15 * 60 * 1000,
  "1 hour": 60 * 60 * 1000,
  "24 hours": 24 * 60 * 60 * 1000,
} as const;

export async function createShareSession(formData: FormData) {
  const duration = String(formData.get("duration") || "15 minutes") as keyof typeof DURATIONS;

  if (!(duration in DURATIONS)) throw new Error("Invalid duration");

  const { supabase, user } = await (async () => {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();
    return { supabase: client, user };
  })();

  if (!user) throw new Error("Unauthorized");

  const permissions = {
    basic_profile: formData.get("basic_profile") === "on",
    allergies: formData.get("allergies") === "on",
    medications: formData.get("medications") === "on",
    conditions: formData.get("conditions") === "on",
    vaccinations: formData.get("vaccinations") === "on",
    reports: formData.get("reports") === "on",
  };

  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + DURATIONS[duration]).toISOString();

  const { data, error } = await supabase
    .from("share_sessions")
    .insert({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt,
      permissions,
    })
    .select("id, expires_at")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/share");

  return {
    token,
    expiresAt: data.expires_at,
  };
}

export async function revokeShareSession(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("share_sessions")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/share");
}
