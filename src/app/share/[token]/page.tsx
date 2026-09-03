/* eslint-disable @typescript-eslint/no-explicit-any */
// New route: src/app/share/[token]/page.tsx

import { createClient } from "@/lib/supabase/server";
import { createHash } from "node:crypto";
import {
  AlertTriangle,
  CalendarDays,
  FileText,
  HeartPulse,
  Pill,
  ShieldCheck,
  Syringe,
  UserRound,
} from "lucide-react";

export default async function SharedRecordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const hash = createHash("sha256").update(token).digest("hex");

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_shared_medical_record", {
    p_token_hash: hash,
  });

  if (error || !data?.ok) {
    return (
      <InvalidShare
        message={data?.error || "This share link is unavailable."}
      />
    );
  }

  const record = data.data || {};
  const profile = record.profile;

  return (
    <main className="min-h-screen bg-[#080D0A] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F7A4F]">
              <HeartPulse size={19} />
            </div>
            <div>
              <p className="font-semibold">MediPass</p>
              <p className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                Shared medical record
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#62C58C]">
            <ShieldCheck size={14} /> Temporary access
          </div>
        </header>

        <section className="mt-8 rounded-[26px] border border-white/[0.07] bg-[#111712] p-6 sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#62C58C]">
            Patient record
          </p>
          <h1 className="mt-2 text-2xl font-semibold">
            {profile?.full_name || "Medical patient"}
          </h1>
          <p className="mt-1 text-xs text-white/30">
            This information was explicitly shared by the patient.
          </p>
          <p className="mt-5 text-[10px] text-white/20">
            Access expires {new Date(data.expires_at).toLocaleString()}
          </p>
        </section>

        {profile && (
          <Section title="Basic profile" icon={<UserRound size={17} />}>
            <Grid
              items={[
                ["Blood group", profile.blood_group || "Not provided"],
                ["Date of birth", profile.date_of_birth || "Not provided"],
                ["Phone", profile.phone || "Not provided"],
                [
                  "Emergency contact",
                  profile.emergency_contact_name
                    ? `${profile.emergency_contact_name} · ${profile.emergency_contact_phone || ""}`
                    : "Not provided",
                ],
              ]}
            />
          </Section>
        )}

        <RecordSection
          title="Allergies"
          icon={<AlertTriangle size={17} />}
          items={record.allergies}
          empty="No allergies shared."
          fields={["name", "reaction", "severity"]}
        />
        <RecordSection
          title="Medications"
          icon={<Pill size={17} />}
          items={record.medications}
          empty="No medications shared."
          fields={["name", "dosage", "frequency"]}
        />
        <RecordSection
          title="Conditions"
          icon={<HeartPulse size={17} />}
          items={record.conditions}
          empty="No conditions shared."
          fields={["name", "status", "diagnosed_date"]}
        />
        <RecordSection
          title="Vaccinations"
          icon={<Syringe size={17} />}
          items={record.vaccinations}
          empty="No vaccinations shared."
          fields={["name", "date", "next_due_date"]}
        />
        <RecordSection
          title="Medical reports"
          icon={<FileText size={17} />}
          items={record.reports}
          empty="No reports shared."
          fields={["title", "report_type", "report_date"]}
        />
      </div>
    </main>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5 rounded-[26px] border border-white/[0.07] bg-[#111712] p-6">
      <div className="flex items-center gap-3">
        <div className="text-[#62C58C]">{icon}</div>
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Grid({ items }: { items: string[][] }) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4"
        >
          <p className="text-[9px] uppercase tracking-[0.12em] text-white/20">
            {label}
          </p>
          <p className="mt-2 text-xs text-white/60">{value}</p>
        </div>
      ))}
    </div>
  );
}

function RecordSection({
  title,
  icon,
  items,
  empty,
  fields,
}: {
  title: string;
  icon: React.ReactNode;
  items: any[];
  empty: string;
  fields: string[];
}) {
  return (
    <Section title={title} icon={icon}>
      <div className="mt-4 space-y-2">
        {items?.length ? (
          items.map((item: any) => (
            <div
              key={item.id}
              className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4"
            >
              <p className="text-xs font-medium text-white/65">
                {item[fields[0]]}
              </p>
              <p className="mt-1 text-[10px] text-white/25">
                {fields
                  .slice(1)
                  .map((f) => item[f])
                  .filter(Boolean)
                  .join(" · ") || "Recorded"}
              </p>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-white/[0.06] p-5 text-xs text-white/25">
            {empty}
          </p>
        )}
      </div>
    </Section>
  );
}

function InvalidShare({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080D0A] px-6 text-white">
      <div className="w-full max-w-md rounded-[26px] border border-white/[0.07] bg-[#111712] p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
          <AlertTriangle size={22} />
        </div>
        <h1 className="mt-5 text-xl font-semibold">Share link unavailable</h1>
        <p className="mt-2 text-xs leading-5 text-white/30">{message}</p>
      </div>
    </main>
  );
}
