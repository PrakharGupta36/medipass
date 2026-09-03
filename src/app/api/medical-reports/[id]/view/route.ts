import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  const supabase = await createClient();

  // ----------------------------------------
  // Authenticate
  // ----------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ----------------------------------------
  // Get report
  // ----------------------------------------

  const { id } = await context.params;

  const { data: report, error: reportError } = await supabase
    .from("medical_reports")
    .select("id, file_path")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (reportError) {
    return NextResponse.json({ error: reportError.message }, { status: 500 });
  }

  if (!report) {
    return NextResponse.json(
      { error: "Medical report not found." },
      { status: 404 },
    );
  }

  // ----------------------------------------
  // Create temporary signed URL
  // ----------------------------------------

  const { data: signedUrl, error: signedUrlError } = await supabase.storage
    .from("medical-reports")
    .createSignedUrl(
      report.file_path,
      60 * 5, // 5 minutes
    );

  if (signedUrlError || !signedUrl?.signedUrl) {
    return NextResponse.json(
      {
        error: signedUrlError?.message || "Could not create document URL.",
      },
      { status: 500 },
    );
  }

  // ----------------------------------------
  // Redirect to document
  // ----------------------------------------

  return NextResponse.redirect(signedUrl.signedUrl);
}
