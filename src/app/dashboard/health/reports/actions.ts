"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function uploadMedicalReport(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const title = String(formData.get("title") || "").trim();

  const reportType = String(formData.get("report_type") || "").trim() || null;

  const reportDate = String(formData.get("report_date") || "").trim() || null;

  const file = formData.get("file");

  if (!title) {
    throw new Error("Report title is required");
  }

  if (!(file instanceof File)) {
    throw new Error("Please select a file");
  }

  if (file.size === 0) {
    throw new Error("The selected file is empty");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Maximum file size is 10 MB");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only PDF, JPG, PNG and WebP files are supported");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "file";

  const filePath = `${user.id}/${crypto.randomUUID()}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("medical-reports")
    .upload(filePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

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

  if (reportError) {
    // Remove the uploaded file if database insertion fails.
    await supabase.storage.from("medical-reports").remove([filePath]);

    throw new Error(reportError.message);
  }

  const { error: eventError } = await supabase.from("medical_events").insert({
    user_id: user.id,
    event_type: "medical_report",
    title: `Medical report added: ${title}`,
    description: reportType || "A medical report was uploaded.",
    event_date: reportDate || new Date().toISOString().slice(0, 10),
    source_type: "medical_report",
    source_id: report.id,
  });

  if (eventError) {
    throw new Error(eventError.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/health");
  revalidatePath("/dashboard/timeline");
}
