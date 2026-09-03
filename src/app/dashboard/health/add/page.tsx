import Link from "next/link";
import { addHealthItem } from "../actions";

const input =
  "mt-2 h-11 w-full min-w-0 rounded-xl border border-white/[0.07] bg-[#0C110E] px-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#62C58C]/30 focus:ring-2 focus:ring-[#62C58C]/10";

export default function AddHealthPage() {
  return (
    <div className="w-full max-w-[1200px]">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Link
          href="/dashboard/health"
          className="inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.14em] text-[#62C58C] transition hover:text-[#8BE0AC]"
        >
          ← Back to health
        </Link>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          Add health information
        </h1>

        <p className="mt-1 max-w-xl text-xs leading-5 text-white/30 sm:text-sm">
          Add one record at a time. You can update your information later.
        </p>
      </div>

      {/* Forms */}
      <div className="grid w-full grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
        <FormCard
          title="Allergy"
          type="allergy"
          fields={
            <>
              <Field
                name="name"
                label="Allergen"
                placeholder="e.g. Penicillin"
              />

              <Field name="reaction" label="Reaction" placeholder="e.g. Rash" />

              <Field
                name="severity"
                label="Severity"
                placeholder="Mild / Moderate / Severe"
              />
            </>
          }
        />

        <FormCard
          title="Medication"
          type="medication"
          fields={
            <>
              <Field
                name="name"
                label="Medicine"
                placeholder="e.g. Metformin"
              />

              <Field name="dosage" label="Dosage" placeholder="e.g. 500 mg" />

              <Field
                name="frequency"
                label="Frequency"
                placeholder="e.g. Twice daily"
              />
            </>
          }
        />

        <FormCard
          title="Condition"
          type="condition"
          fields={
            <>
              <Field name="name" label="Condition" placeholder="e.g. Asthma" />

              <Field name="diagnosed_date" label="Diagnosed date" type="date" />

              <Field
                name="notes"
                label="Notes"
                placeholder="Optional notes"
                required={false}
              />
            </>
          }
        />

        <FormCard
          title="Vaccination"
          type="vaccination"
          fields={
            <>
              <Field
                name="name"
                label="Vaccine"
                placeholder="e.g. Hepatitis B"
              />

              <Field name="date" label="Date" type="date" />

              <Field
                name="next_due_date"
                label="Next due date"
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
      className="w-full min-w-0 rounded-[22px] border border-white/[0.07] bg-[#111712] p-4 sm:rounded-[26px] sm:p-6"
    >
      <input type="hidden" name="type" value={type} />

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold sm:text-lg">{title}</h2>

        <div className="h-2 w-2 shrink-0 rounded-full bg-[#62C58C]/70 shadow-[0_0_12px_rgba(98,197,140,0.25)]" />
      </div>

      <div className="mt-5 space-y-4 sm:mt-6">{fields}</div>

      <button
        type="submit"
        className="mt-5 h-11 w-full rounded-xl bg-[#246B45] px-4 text-xs font-semibold text-white transition hover:bg-[#2C7D53] active:scale-[0.99] sm:mt-6"
      >
        Save {title.toLowerCase()}
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
    <label className="block min-w-0 text-[10px] font-medium uppercase tracking-[0.1em] text-white/30">
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
