// src/app/share/[token]/page.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from "@/lib/supabase/server";
import {
  AlertTriangle,
  ExternalLink,
  FileText,
  HeartPulse,
  Pill,
  ShieldCheck,
  Syringe,
  UserRound,
} from "lucide-react";
import { createHash } from "node:crypto";

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
        message={
          data?.error || "This share link is unavailable or has expired."
        }
      />
    );
  }

  const record = data.data || {};
  const profile = record.profile;

  return (
    <main className="min-h-screen bg-[#F8F6F0] px-4 py-8 text-[#121312] sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#121312]/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#18392B] text-[#F8F6F0]">
              <HeartPulse size={20} />
            </div>

            <div>
              <p className="font-serif text-lg font-normal text-[#121312]">
                MediPass
              </p>

              <p className="font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
                Shared Medical Passport
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[#18392B]">
            <ShieldCheck size={14} />
            <span>Temporary Access</span>
          </div>
        </header>

        {/* Patient Identity Header */}
        <section className="rounded-3xl border border-[#121312]/10 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] sm:p-8">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#121312]/40">
            Patient Medical Record
          </p>

          <h1 className="mt-1 font-serif text-3xl font-normal text-[#121312]">
            {profile?.full_name || "Anonymous Patient"}
          </h1>

          <p className="mt-1 text-xs text-[#121312]/60">
            Explicitly authorized temporary medical view.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#121312]/10 bg-[#F8F6F0] px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-[#121312]/50">
            <span>Access Expires:</span>
            <span className="font-semibold text-[#121312]">
              {new Date(data.expires_at).toLocaleString()}
            </span>
          </div>
        </section>

        {/* Basic Profile */}
        {profile && (
          <Section title="Basic Profile" icon={<UserRound size={18} />}>
            <Grid
              items={[
                ["Blood Group", profile.blood_group || "Not provided"],

                ["Date of Birth", profile.date_of_birth || "Not provided"],

                ["Phone Number", profile.phone || "Not provided"],

                [
                  "Emergency Contact",
                  profile.emergency_contact_name
                    ? `${profile.emergency_contact_name}${
                        profile.emergency_contact_phone
                          ? ` · ${profile.emergency_contact_phone}`
                          : ""
                      }`
                    : "Not provided",
                ],
              ]}
            />
          </Section>
        )}

        {/* Allergies */}
        <RecordSection
          title="Allergies"
          icon={<AlertTriangle size={18} />}
          items={record.allergies}
          empty="No allergies shared."
          fields={["name", "reaction", "severity"]}
        />

        {/* Medications */}
        <RecordSection
          title="Medications"
          icon={<Pill size={18} />}
          items={record.medications}
          empty="No medications shared."
          fields={["name", "dosage", "frequency"]}
        />

        {/* Conditions */}
        <RecordSection
          title="Conditions"
          icon={<HeartPulse size={18} />}
          items={record.conditions}
          empty="No medical conditions shared."
          fields={["name", "status", "diagnosed_date"]}
        />

        {/* Vaccinations */}
        <RecordSection
          title="Vaccinations"
          icon={<Syringe size={18} />}
          items={record.vaccinations}
          empty="No vaccination records shared."
          fields={["name", "date", "next_due_date"]}
        />

        {/* Medical Reports */}
        <MedicalReportsSection token={token} reports={record.reports} />
      </div>
    </main>
  );
}

/* Medical Reports */
function MedicalReportsSection({
  token,
  reports,
}: {
  token: string;
  reports: any[];
}) {
  return (
    <Section title="Medical Reports" icon={<FileText size={18} />}>
      <div className="mt-4 space-y-2">
        {reports?.length ? (
          reports.map((report: any) => (
            <a
              key={report.id}
              href={`/share/${token}/reports/${report.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-[#121312]/10 bg-[#F8F6F0]/40 p-4 transition-colors hover:bg-[#F8F6F0]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#18392B] border border-[#121312]/10">
                <FileText size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#121312]">
                  {report.title}
                </p>

                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
                  {report.report_type || "Medical Report"} {" · "}
                  {formatReportDate(report.report_date)}
                </p>
              </div>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#121312]/10 bg-white text-[#121312]/40 transition-colors group-hover:bg-[#18392B] group-hover:text-[#F8F6F0]">
                <ExternalLink size={14} />
              </div>
            </a>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-[#121312]/20 p-5 font-mono text-xs text-[#121312]/40 text-center">
            No medical reports shared.
          </p>
        )}
      </div>
    </Section>
  );
}

/* Generic Section Container */
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
    <section className="rounded-3xl border border-[#121312]/10 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] sm:p-8">
      <div className="flex items-center gap-3 border-b border-[#121312]/10 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F8F6F0] text-[#18392B]">
          {icon}
        </div>

        <h2 className="font-serif text-lg font-normal text-[#121312]">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

/* Basic Profile Grid */
function Grid({ items }: { items: string[][] }) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-2xl border border-[#121312]/10 bg-[#F8F6F0]/40 p-4"
        >
          <p className="font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
            {label}
          </p>

          <p className="mt-1 text-xs font-semibold text-[#121312]">{value}</p>
        </div>
      ))}
    </div>
  );
}

/* Generic Itemized Medical Record Section */
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
              className="rounded-2xl border border-[#121312]/10 bg-[#F8F6F0]/40 p-4"
            >
              <p className="text-xs font-semibold text-[#121312]">
                {item[fields[0]]}
              </p>

              <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[#121312]/50">
                {fields
                  .slice(1)
                  .map((field) => item[field])
                  .filter(Boolean)
                  .join(" · ") || "Recorded"}
              </p>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-[#121312]/20 p-5 font-mono text-xs text-[#121312]/40 text-center">
            {empty}
          </p>
        )}
      </div>
    </Section>
  );
}

/* Invalid Share State */
function InvalidShare({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F6F0] px-6 text-[#121312]">
      <div className="w-full max-w-md rounded-3xl border border-[#121312]/10 bg-white p-8 text-center shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
          <AlertTriangle size={22} />
        </div>

        <h1 className="mt-5 font-serif text-xl font-normal text-[#121312]">
          Share Link Unavailable
        </h1>

        <p className="mt-2 font-mono text-xs text-[#121312]/60 leading-relaxed">
          {message}
        </p>
      </div>
    </main>
  );
}

/* Date Formatting */
function formatReportDate(value: string | null | undefined) {
  if (!value) {
    return "No Date";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
