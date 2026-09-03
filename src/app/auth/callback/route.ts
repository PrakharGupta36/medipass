import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");

  if (code) {
    const supabase = await createClient();

    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const safeNext =
        next && next.startsWith("/")
          ? next
          : "/dashboard";

      return NextResponse.redirect(
        new URL(safeNext, requestUrl.origin),
      );
    }
  }

  return NextResponse.redirect(
    new URL(
      "/auth?error=verification_failed",
      requestUrl.origin,
    ),
  );
}