import Link from "next/link";
import { ArrowLeft, FileText, Upload } from "lucide-react";
import { uploadMedicalReport } from "../actions";

export default function AddMedicalReportPage() {
  return (
    <div className="w-full max-w-[1000px]">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Link
          href="/dashboard/health"
          className="inline-flex items-center gap-2 text-[10px] font-medium text-white/30 transition hover:text-white/60"
        >
          <ArrowLeft size={14} />
          Back to health
        </Link>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#62C58C]">
            Medical reports
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Add a medical report
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-5 text-white/30 sm:text-sm">
            Keep prescriptions, lab reports and other medical documents in your
            MediPass.
          </p>
        </div>
      </div>

      {/* Form card */}
      <section className="w-full overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#111712] sm:rounded-[26px]">
        {/* Card header */}
        <div className="border-b border-white/[0.06] px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F7A4F]/10 text-[#62C58C]">
              <FileText size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold">Report details</p>

              <p className="mt-0.5 text-[10px] leading-4 text-white/25">
                Add enough information to identify the document later.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          action={uploadMedicalReport}
          className="space-y-5 p-4 sm:space-y-6 sm:p-6"
        >
          {/* Title */}
          <div className="min-w-0">
            <label
              htmlFor="title"
              className="mb-2 block text-[10px] font-medium uppercase tracking-[0.1em] text-white/30"
            >
              Report title
            </label>

            <input
              id="title"
              name="title"
              required
              placeholder="e.g. Complete Blood Count"
              className="h-11 w-full min-w-0 rounded-xl border border-white/[0.07] bg-[#0C110E] px-3.5 text-sm text-white/70 outline-none transition placeholder:text-white/15 focus:border-[#62C58C]/30 focus:ring-2 focus:ring-[#62C58C]/10"
            />
          </div>

          {/* Type + Date */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="min-w-0">
              <label
                htmlFor="report_type"
                className="mb-2 block text-[10px] font-medium uppercase tracking-[0.1em] text-white/30"
              >
                Report type
              </label>

              <select
                id="report_type"
                name="report_type"
                className="h-11 w-full min-w-0 rounded-xl border border-white/[0.07] bg-[#0C110E] px-3.5 text-sm text-white/60 outline-none transition focus:border-[#62C58C]/30 focus:ring-2 focus:ring-[#62C58C]/10"
              >
                <option value="">Select type</option>
                <option value="Lab report">Lab report</option>
                <option value="Prescription">Prescription</option>
                <option value="Imaging">Imaging</option>
                <option value="Discharge summary">Discharge summary</option>
                <option value="Doctor note">Doctor note</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="min-w-0">
              <label
                htmlFor="report_date"
                className="mb-2 block text-[10px] font-medium uppercase tracking-[0.1em] text-white/30"
              >
                Report date
              </label>

              <input
                id="report_date"
                name="report_date"
                type="date"
                className="h-11 w-full min-w-0 rounded-xl border border-white/[0.07] bg-[#0C110E] px-3.5 text-sm text-white/60 outline-none transition focus:border-[#62C58C]/30 focus:ring-2 focus:ring-[#62C58C]/10"
              />
            </div>
          </div>

          {/* File */}
          <div className="min-w-0">
            <label
              htmlFor="file"
              className="mb-2 block text-[10px] font-medium uppercase tracking-[0.1em] text-white/30"
            >
              Document
            </label>

            <label
              htmlFor="file"
              className="group flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-[#0C110E] px-4 text-center transition hover:border-[#62C58C]/25 hover:bg-[#0F150F] sm:min-h-[220px] sm:px-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1F7A4F]/10 text-[#62C58C] transition group-hover:bg-[#1F7A4F]/20">
                <Upload size={21} />
              </div>

              <p className="mt-4 text-xs font-medium text-white/60 sm:text-sm">
                Choose a medical document
              </p>

              <p className="mt-1 max-w-xs text-[10px] leading-4 text-white/20">
                PDF, JPG, PNG or WebP · Maximum 10 MB
              </p>

              <input
                id="file"
                name="file"
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                className="sr-only"
              />
            </label>
          </div>

          {/* Privacy notice */}
          <div className="rounded-2xl border border-[#62C58C]/10 bg-[#102018] p-4 sm:p-5">
            <p className="text-xs font-medium text-[#A7E1BE]">
              Your document stays private
            </p>

            <p className="mt-1 text-[10px] leading-5 text-white/25">
              Files are stored under your account and are only accessible
              through your authenticated MediPass session or an explicitly
              permitted share.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#246B45] px-4 text-xs font-semibold transition hover:bg-[#2C7D53] active:scale-[0.99]"
          >
            <Upload size={15} />
            Upload report
          </button>
        </form>
      </section>
    </div>
  );
}
