"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function uploadMedicalReport(formData: FormData): Promise<void> {
  // --------------------------------------------------
  // Supabase
  // --------------------------------------------------

  const supabase = await createClient();

  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // --------------------------------------------------
  // Read form data
  // --------------------------------------------------

  const title = String(formData.get("title") || "").trim();

  const reportType = String(formData.get("report_type") || "").trim() || null;

  const reportDate = String(formData.get("report_date") || "").trim() || null;

  const file = formData.get("file");

  // --------------------------------------------------
  // Validate title
  // --------------------------------------------------

  if (!title) {
    throw new Error("Report title is required.");
  }

  // --------------------------------------------------
  // Validate file
  // --------------------------------------------------

  if (!(file instanceof File)) {
    throw new Error("Please select a file.");
  }

  if (file.size === 0) {
    throw new Error("The selected file is empty.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Maximum file size is 10 MB.");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only PDF, JPG, PNG and WebP files are supported.");
  }

  // --------------------------------------------------
  // Generate private storage path
  // --------------------------------------------------

  const extension = file.name.split(".").pop()?.toLowerCase() || "file";

  const filePath = `${user.id}/${crypto.randomUUID()}.${extension}`;

  // --------------------------------------------------
  // Convert file
  // --------------------------------------------------

  const arrayBuffer = await file.arrayBuffer();

  // --------------------------------------------------
  // Upload to Supabase Storage
  // --------------------------------------------------

  const { error: uploadError } = await supabase.storage
    .from("medical-reports")
    .upload(filePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Could not upload document: ${uploadError.message}`);
  }

  // --------------------------------------------------
  // Insert medical report metadata
  // --------------------------------------------------

  const { data: report, error: reportError } = await supabase
    .from("medical_reports")
    .insert({
      user_id: user.id,
      title,
      report_type: reportType,
      report_date: reportDate,
      file_path: filePath,
    })
    .select("id")
    .single();

  // --------------------------------------------------
  // Cleanup uploaded file if DB insert fails
  // --------------------------------------------------

  if (reportError || !report) {
    await supabase.storage.from("medical-reports").remove([filePath]);

    throw new Error(reportError?.message || "Could not save medical report.");
  }

  // --------------------------------------------------
  // Add event to medical timeline
  // --------------------------------------------------

  const { error: eventError } = await supabase.from("medical_events").insert({
    user_id: user.id,

    event_type: "medical_report",

    title: `Medical report added: ${title}`,

    description: reportType || "A medical report was uploaded.",

    event_date: reportDate || new Date().toISOString().slice(0, 10),

    source_type: "medical_report",

    source_id: report.id,
  });

  /*
   * We don't delete the medical report if timeline
   * insertion fails.
   *
   * The document itself has already been successfully
   * stored and should not disappear because of a
   * secondary timeline error.
   */
  if (eventError) {
    console.error("Medical report timeline event failed:", eventError.message);
  }

  // --------------------------------------------------
  // Refresh pages
  // --------------------------------------------------

  revalidatePath("/dashboard");

  revalidatePath("/dashboard/health");

  revalidatePath("/dashboard/timeline");

  // --------------------------------------------------
  // Return user to Health
  // --------------------------------------------------

  redirect("/dashboard/health");
}
