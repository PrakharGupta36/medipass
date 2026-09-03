import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      token: string;
      reportId: string;
    }>;
  },
) {
  const { token, reportId } = await params;

  if (!token || !reportId) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = await createClient();

  // -----------------------------------------------
  // Hash QR token
  // -----------------------------------------------

  const tokenHash = createHash("sha256").update(token).digest("hex");

  // -----------------------------------------------
  // Validate share session directly
  // -----------------------------------------------

  const { data: session, error: sessionError } = await supabase
    .from("share_sessions")
    .select("user_id, expires_at, revoked_at, permissions")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (sessionError) {
    console.error(sessionError);

    return NextResponse.json(
      {
        error: "Unable to validate share link.",
      },
      { status: 500 },
    );
  }

  if (!session) {
    return NextResponse.json(
      {
        error: "Share link is invalid.",
      },
      { status: 404 },
    );
  }

  // -----------------------------------------------
  // Expiration / revocation
  // -----------------------------------------------

  if (session.revoked_at) {
    return NextResponse.json(
      {
        error: "This share link has been revoked.",
      },
      { status: 403 },
    );
  }

  if (new Date(session.expires_at).getTime() <= Date.now()) {
    return NextResponse.json(
      {
        error: "This share link has expired.",
      },
      { status: 403 },
    );
  }

  // -----------------------------------------------
  // Check report permission
  // -----------------------------------------------

  const permissions = session.permissions || {};

  const reportsAllowed =
    permissions.reports === true || permissions.medical_reports === true;

  if (!reportsAllowed) {
    return NextResponse.json(
      {
        error: "Medical reports were not included in this share.",
      },
      { status: 403 },
    );
  }

  // -----------------------------------------------
  // Find report
  // -----------------------------------------------

  const { data: report, error: reportError } = await supabase
    .from("medical_reports")
    .select("id, file_path")
    .eq("id", reportId)
    .eq("user_id", session.user_id)
    .maybeSingle();

  if (reportError) {
    console.error(reportError);

    return NextResponse.json(
      {
        error: "Unable to retrieve medical report.",
      },
      { status: 500 },
    );
  }

  if (!report) {
    return NextResponse.json(
      {
        error: "Medical report not found.",
      },
      { status: 404 },
    );
  }

  // -----------------------------------------------
  // Create temporary signed URL
  // -----------------------------------------------

  const { data: signedUrl, error: signedUrlError } = await supabase.storage
    .from("medical-reports")
    .createSignedUrl(report.file_path, 5 * 60);

  if (signedUrlError || !signedUrl?.signedUrl) {
    console.error(signedUrlError);

    return NextResponse.json(
      {
        error: "Unable to open medical report.",
      },
      { status: 500 },
    );
  }

  // -----------------------------------------------
  // Open document
  // -----------------------------------------------

  return NextResponse.redirect(signedUrl.signedUrl);
}
