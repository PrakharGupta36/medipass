// src/app/dashboard/health/add/page.tsx

import Link from "next/link";
import { addHealthItem } from "../actions";

const input =
  "mt-2 h-11 w-full min-w-0 rounded-xl border border-[#121312]/15 bg-[#F8F6F0] px-3.5 font-mono text-xs text-[#121312] outline-none transition placeholder:text-[#121312]/30 focus:border-[#18392B] focus:bg-white focus:ring-1 focus:ring-[#18392B]";

export default function AddHealthPage() {
  return (
    <div className="w-full max-w-[1200px]">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Link
          href="/dashboard/health"
          className="inline-flex items-center font-mono text-[9px] font-semibold uppercase tracking-wider text-[#18392B] transition hover:underline"
        >
          ← Back to Health Records
        </Link>

        <h1 className="mt-3 font-serif text-3xl font-normal text-[#121312] sm:text-4xl">
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
    <form
      action={addHealthItem}
      className="w-full min-w-0 rounded-3xl border border-[#121312]/10 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] sm:p-8"
    >
      <input type="hidden" name="type" value={type} />

      <div className="flex items-center justify-between gap-4 border-b border-[#121312]/10 pb-4">
        <h2 className="font-serif text-xl font-normal text-[#121312]">
          {title}
        </h2>

        <span className="h-2 w-2 shrink-0 rounded-full bg-[#18392B]" />
      </div>

      <div className="mt-6 space-y-4">{fields}</div>

      <button
        type="submit"
        className="mt-6 h-11 w-full rounded-xl bg-[#121312] px-4 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#F8F6F0] transition hover:bg-[#18392B]"
      >
        Save {title}
      </button>
    </form>
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
    <label className="block min-w-0 font-mono text-[9px] uppercase tracking-wider text-[#121312]/60">
      {label}

      <input
        required={required}
        name={name}
        type={type}
        placeholder={placeholder}
        className={input}
      />
    </label>
  );
}
