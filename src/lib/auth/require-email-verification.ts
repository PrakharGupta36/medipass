import { createClient } from "@/lib/supabase/server";

export async function requireEmailVerification() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      verified: false,
      authenticated: false,
    };
  }

  return {
    verified: Boolean(user.email_confirmed_at),
    authenticated: true,
  };
}
