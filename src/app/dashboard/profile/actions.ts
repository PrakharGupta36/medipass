"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const fullName =
    String(formData.get("full_name") || "").trim() || null;

  const phone =
    String(formData.get("phone") || "").trim() || null;

  const dateOfBirth =
    String(formData.get("date_of_birth") || "").trim() || null;

  const bloodGroup =
    String(formData.get("blood_group") || "").trim() || null;

  const emergencyName =
    String(formData.get("emergency_contact_name") || "").trim() || null;

  const emergencyPhone =
    String(formData.get("emergency_contact_phone") || "").trim() || null;

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: fullName,
      phone,
      date_of_birth: dateOfBirth,
      blood_group: bloodGroup,
      emergency_contact_name: emergencyName,
      emergency_contact_phone: emergencyPhone,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    throw new Error(error.message);
  }

  // Keep Supabase Auth metadata synchronized with the profile.
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/health");
  revalidatePath("/dashboard/timeline");
}