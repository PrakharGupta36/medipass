// src/app/dashboard/health/add/page.tsx

import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { DoubleBorderCard } from "@/components/ui/double-border-card";
import { addHealthItem } from "../actions";

export default function AddHealthPage() {
  return (
    <div className="w-full max-w-[1200px] space-y-6">
      {/* Back Button & Header */}
      <div>
        <div className="p-1 inline-block rounded-xl bg-[#E6E0D6] shadow-[0_1px_0_rgba(255,255,255,0.8),0_1.5px_3px_rgba(0,0,0,0.08)_inset]">
          <Link
            href="/dashboard/health"
            className="group flex items-center gap-1.5 rounded-lg border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] px-3 py-1.5 font-mono text-xs font-semibold text-[#18392B] shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_4px_rgba(0,0,0,0.05)] transition-all active:scale-[0.97]"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            <span>Back to Health Records</span>
          </Link>
        </div>

        <h1 className="mt-4 font-serif text-3xl font-normal text-[#121312] sm:text-4xl">
          Add Health Information
        </h1>

        <p className="mt-1 max-w-xl font-mono text-xs text-[#121312]/60">
          Record entry management. Update or revise individual logs at any time.
        </p>
      </div>

      {/* Forms Grid */}
      <div className="grid w-full grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
        <FormCard
          title="Allergy Record"
          type="allergy"
          fields={
            <>
              <Field
                name="name"
                label="Allergen Name"
                placeholder="e.g. Penicillin"
              />

              <Field
                name="reaction"
                label="Observed Reaction"
                placeholder="e.g. Anaphylaxis, Rash"
              />

              <Field
                name="severity"
                label="Severity Rating"
                placeholder="Mild / Moderate / Severe"
              />
            </>
          }
        />

        <FormCard
          title="Medication Record"
          type="medication"
          fields={
            <>
              <Field
                name="name"
                label="Medication Name"
                placeholder="e.g. Metformin"
              />

              <Field
                name="dosage"
                label="Dosage Amount"
                placeholder="e.g. 500 mg"
              />

              <Field
                name="frequency"
                label="Administration Frequency"
                placeholder="e.g. Twice daily with meals"
              />
            </>
          }
        />

        <FormCard
          title="Condition Record"
          type="condition"
          fields={
            <>
              <Field
                name="name"
                label="Condition Name"
                placeholder="e.g. Asthma"
              />

              <Field name="diagnosed_date" label="Diagnosis Date" type="date" />

              <Field
                name="notes"
                label="Clinical Notes"
                placeholder="Optional observation notes"
                required={false}
              />
            </>
          }
        />

        <FormCard
          title="Vaccination Record"
          type="vaccination"
          fields={
            <>
              <Field
                name="name"
                label="Vaccine Title"
                placeholder="e.g. Hepatitis B"
              />

              <Field name="date" label="Administration Date" type="date" />

              <Field
                name="next_due_date"
                label="Next Scheduled Dose"
                type="date"
                required={false}
              />
            </>
          }
        />
      </div>
    </div>
  );
}

function FormCard({
  title,
  type,
  fields,
}: {
  title: string;
  type: string;
  fields: React.ReactNode;
}) {
  return (
    <DoubleBorderCard variant="light" className="w-full">
      <form action={addHealthItem} className="w-full min-w-0">
        <input type="hidden" name="type" value={type} />

        {/* Section Header */}
        <div className="flex items-center justify-between pb-4">
          <h2 className="font-serif text-xl font-normal text-[#121312]">
            {title}
          </h2>

          <div className="relative flex h-4 w-4 items-center justify-center rounded-full bg-[#E0D9CE] shadow-[0_1px_2px_rgba(0,0,0,0.15)_inset,0_1px_0_rgba(255,255,255,0.8)]">
            <div className="h-1.5 w-1.5 rounded-full bg-[#18392B] shadow-[0_0_4px_rgba(24,57,43,0.6)]" />
          </div>
        </div>

        {/* Input Fields Stack */}
        <div className="mt-1 space-y-3.5">{fields}</div>

        {/* Tactile Submit Button */}
        <div className="mt-5 p-1 rounded-xl bg-[#E6E0D6] shadow-[0_1px_0_rgba(255,255,255,0.8),0_1.5px_3px_rgba(0,0,0,0.08)_inset]">
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#18392B]/30 bg-gradient-to-b from-[#224f3c] via-[#18392B] to-[#10271d] px-4 font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_3px_8px_rgba(24,57,43,0.25)] transition-all active:scale-[0.98]"
          >
            <Check size={14} />
            <span>Save {title}</span>
          </button>
        </div>
      </form>
    </DoubleBorderCard>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required = true,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block min-w-0">
      <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#121312]/60 ml-0.5">
        {label}
      </span>

      {/* Recessed Skeuomorphic Input Well */}
      <div className="mt-1 rounded-xl border border-black/10 bg-[#E8E2D8] p-1 shadow-[0_1.5px_3px_rgba(0,0,0,0.12)_inset,0_1px_0_rgba(255,255,255,0.8)] focus-within:border-[#18392B]/40 focus-within:ring-2 focus-within:ring-[#18392B]/15 transition-all">
        <input
          required={required}
          name={name}
          type={type}
          placeholder={placeholder}
          className="h-9 w-full min-w-0 rounded-lg bg-white/80 px-3 font-mono text-xs text-[#121312] shadow-[0_1px_1px_rgba(0,0,0,0.05)_inset] outline-none placeholder:text-[#121312]/30 focus:bg-white transition-colors"
        />
      </div>
    </label>
  );
}
