"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    supabase,
    user,
  };
}

export async function addHealthItem(formData: FormData) {
  const type = String(formData.get("type") || "");

  const { supabase, user } = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const name = String(formData.get("name") || "").trim();

  if (!name) {
    throw new Error("Name is required");
  }

  const reaction = String(formData.get("reaction") || "").trim() || null;

  const severity = String(formData.get("severity") || "").trim() || null;

  const dosage = String(formData.get("dosage") || "").trim() || null;

  const frequency = String(formData.get("frequency") || "").trim() || null;

  const diagnosedDate =
    String(formData.get("diagnosed_date") || "").trim() || null;

  const status = String(formData.get("status") || "active").trim();

  const notes = String(formData.get("notes") || "").trim() || null;

  const date = String(formData.get("date") || "").trim() || null;

  const nextDueDate =
    String(formData.get("next_due_date") || "").trim() || null;

  let table: "allergies" | "conditions" | "medications" | "vaccinations";

  let row: Record<string, unknown>;

  let eventType: string;
  let eventTitle: string;
  let eventDescription: string;
  let eventDate: string;

  if (type === "allergy") {
    table = "allergies";

    row = {
      user_id: user.id,
      name,
      reaction,
      severity,
    };

    eventType = "allergy";
    eventTitle = `Allergy added: ${name}`;

    eventDescription =
      severity || reaction
        ? [reaction, severity].filter(Boolean).join(" · ")
        : "A new allergy was added to your medical profile.";

    eventDate = new Date().toISOString().slice(0, 10);
  } else if (type === "condition") {
    table = "conditions";

    row = {
      user_id: user.id,
      name,
      diagnosed_date: diagnosedDate,
      status,
      notes,
    };

    eventType = "condition";
    eventTitle = `Condition added: ${name}`;

    eventDescription = diagnosedDate
      ? `Medical condition recorded. Diagnosed ${diagnosedDate}.`
      : "A new medical condition was added to your profile.";

    eventDate = diagnosedDate || new Date().toISOString().slice(0, 10);
  } else if (type === "medication") {
    table = "medications";

    row = {
      user_id: user.id,
      name,
      dosage,
      frequency,
      status,
    };

    eventType = "medication";
    eventTitle = `Medication added: ${name}`;

    eventDescription =
      [dosage, frequency].filter(Boolean).join(" · ") ||
      "A medication was added to your medical profile.";

    eventDate = new Date().toISOString().slice(0, 10);
  } else if (type === "vaccination") {
    table = "vaccinations";

    row = {
      user_id: user.id,
      name,
      date,
      next_due_date: nextDueDate,
      notes,
    };

    eventType = "vaccination";
    eventTitle = `Vaccination recorded: ${name}`;

    eventDescription = nextDueDate
      ? `Vaccination recorded. Next due ${nextDueDate}.`
      : "A vaccination was added to your medical history.";

    eventDate = date || new Date().toISOString().slice(0, 10);
  } else {
    throw new Error("Invalid health item");
  }

  // Insert actual health record.
  const { data: inserted, error } = await supabase
    .from(table)
    .insert(row)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Add corresponding timeline event.
  const { error: eventError } = await supabase.from("medical_events").insert({
    user_id: user.id,
    event_type: eventType,
    title: eventTitle,
    description: eventDescription,
    event_date: eventDate,
    source_type: table.slice(0, -1),
    source_id: inserted.id,
  });

  if (eventError) {
    // Don't silently ignore this.
    // The health record exists, but the timeline failed.
    throw new Error(eventError.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/health");
  revalidatePath("/dashboard/timeline");
}

export async function deleteHealthItem(
  type: "allergy" | "condition" | "medication" | "vaccination",
  id: string,
) {
  const { supabase, user } = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const tables = {
    allergy: "allergies",
    condition: "conditions",
    medication: "medications",
    vaccination: "vaccinations",
  } as const;

  const table = tables[type];

  // Find the corresponding timeline event first.
  const { data: event } = await supabase
    .from("medical_events")
    .select("id")
    .eq("user_id", user.id)
    .eq("source_type", type)
    .eq("source_id", id)
    .maybeSingle();

  const { error } = await supabase
    .from(table)
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  // Remove its timeline event too.
  if (event?.id) {
    const { error: eventError } = await supabase
      .from("medical_events")
      .delete()
      .eq("id", event.id)
      .eq("user_id", user.id);

    if (eventError) {
      throw new Error(eventError.message);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/health");
  revalidatePath("/dashboard/timeline");
}
