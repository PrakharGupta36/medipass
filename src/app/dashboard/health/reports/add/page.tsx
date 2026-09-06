"use client";

import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  FileText,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { uploadMedicalReport } from "../actions";

import { Calendar } from "@/components/ui/calendar";
import { DoubleBorderCard } from "@/components/ui/double-border-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function AddMedicalReportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [date, setDate] = useState<Date>();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (selectedFile?: File) => {
    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Please select a PDF, JPG, PNG or WebP file.");
      return;
    }

    if (selectedFile.size === 0) {
      alert("The selected file is empty.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("Maximum file size is 10 MB.");
      return;
    }

    setFile(selectedFile);

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(selectedFile);
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative w-full max-w-[1200px] space-y-6 text-[#121312]">
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
          Add Medical Report
        </h1>

        <p className="mt-1 max-w-xl font-mono text-xs text-[#121312]/60">
          Store prescriptions, laboratory results, scans, and other clinical
          documents securely.
        </p>
      </div>

      {/* Main Form Card */}
      <DoubleBorderCard variant="light" className="w-full">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-black/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-2xl bg-[#E6E0D6] shadow-[0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.08)_inset]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] text-[#18392B] shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_2px_4px_rgba(0,0,0,0.05)]">
                <FileText size={18} />
              </div>
            </div>

            <div>
              <h2 className="font-serif text-xl font-normal text-[#121312]">
                Report Details
              </h2>
              <p className="font-mono text-[9px] uppercase tracking-wider text-[#121312]/40">
                Identify and attach your document
              </p>
            </div>
          </div>

          <div className="relative flex h-4 w-4 items-center justify-center rounded-full bg-[#E0D9CE] shadow-[0_1px_2px_rgba(0,0,0,0.15)_inset,0_1px_0_rgba(255,255,255,0.8)]">
            <div className="h-1.5 w-1.5 rounded-full bg-[#18392B] shadow-[0_0_4px_rgba(24,57,43,0.6)]" />
          </div>
        </div>

        {/* Form Body */}
        <form action={uploadMedicalReport} className="mt-6 space-y-5">
          {/* Title Field */}
          <div>
            <label className="block min-w-0">
              <span className="ml-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#121312]/60">
                Report Title
              </span>

              <div className="mt-1 rounded-xl border border-black/10 bg-[#E8E2D8] p-1 shadow-[0_1.5px_3px_rgba(0,0,0,0.12)_inset,0_1px_0_rgba(255,255,255,0.8)] transition-all focus-within:border-[#18392B]/40 focus-within:ring-2 focus-within:ring-[#18392B]/15">
                <input
                  id="title"
                  name="title"
                  required
                  placeholder="e.g. Complete Blood Count"
                  className="h-9 w-full min-w-0 rounded-lg bg-white/80 px-3 font-mono text-xs text-[#121312] shadow-[0_1px_1px_rgba(0,0,0,0.05)_inset] outline-none transition-colors placeholder:text-[#121312]/30 focus:bg-white"
                />
              </div>
            </label>
          </div>

          {/* Type & Date Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Report Type Select */}
            <div>
              <label className="block min-w-0">
                <span className="ml-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#121312]/60">
                  Report Type
                </span>

                <div className="relative mt-1 rounded-xl border border-black/10 bg-[#E8E2D8] p-1 shadow-[0_1.5px_3px_rgba(0,0,0,0.12)_inset,0_1px_0_rgba(255,255,255,0.8)] transition-all focus-within:border-[#18392B]/40 focus-within:ring-2 focus-within:ring-[#18392B]/15">
                  <select
                    id="report_type"
                    name="report_type"
                    defaultValue=""
                    className="h-9 w-full appearance-none rounded-lg bg-white/80 pl-3 pr-8 font-mono text-xs text-[#121312] shadow-[0_1px_1px_rgba(0,0,0,0.05)_inset] outline-none transition-colors focus:bg-white"
                  >
                    <option value="" disabled>
                      Select type
                    </option>
                    <option value="Lab report">Lab report</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Imaging">Imaging</option>
                    <option value="Discharge summary">Discharge summary</option>
                    <option value="Doctor note">Doctor note</option>
                    <option value="Other">Other</option>
                  </select>

                  <ChevronDown
                    size={15}
                    strokeWidth={2}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#121312]/40"
                  />
                </div>
              </label>
            </div>

            {/* Report Date Picker */}
            <div>
              <label className="block min-w-0">
                <span className="ml-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#121312]/60">
                  Report Date
                </span>

                <input
                  type="hidden"
                  name="report_date"
                  value={date ? format(date, "yyyy-MM-dd") : ""}
                />

                <div className="mt-1 rounded-xl border border-black/10 bg-[#E8E2D8] p-1 shadow-[0_1.5px_3px_rgba(0,0,0,0.12)_inset,0_1px_0_rgba(255,255,255,0.8)] transition-all focus-within:border-[#18392B]/40 focus-within:ring-2 focus-within:ring-[#18392B]/15">
                  <Popover>
                    <PopoverTrigger
                      type="button"
                      className="flex h-9 w-full items-center justify-between rounded-lg bg-white/80 px-3 font-mono text-xs text-[#121312] shadow-[0_1px_1px_rgba(0,0,0,0.05)_inset] outline-none transition-colors hover:bg-white"
                    >
                      <span
                        className={
                          date ? "text-[#121312]" : "text-[#121312]/30"
                        }
                      >
                        {date
                          ? format(date, "dd MMMM yyyy")
                          : "Select report date"}
                      </span>

                      <CalendarDays
                        size={15}
                        strokeWidth={1.7}
                        className="shrink-0 text-[#121312]/40"
                      />
                    </PopoverTrigger>

                    <PopoverContent
                      align="start"
                      className="w-auto border-black/10 bg-[#F8F6F0] p-2 text-[#121312] shadow-xl"
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(day) => day > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </label>
            </div>
          </div>

          {/* Document Dropzone */}
          <div>
            <div className="mb-1.5 flex items-center justify-between px-0.5">
              <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#121312]/60">
                Document File
              </span>

              <span className="font-mono text-[9px] text-[#121312]/40">
                PDF / JPG / PNG / WEBP · MAX 10 MB
              </span>
            </div>

            <div
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);

                const droppedFile = e.dataTransfer.files?.[0];
                if (droppedFile) handleFile(droppedFile);
              }}
              className={[
                "relative flex min-h-[200px] w-full overflow-hidden rounded-2xl border border-dashed p-2 transition-all",
                dragActive
                  ? "border-[#18392B] bg-[#18392B]/10"
                  : "border-black/15 bg-[#E6E0D6] shadow-[0_1.5px_3px_rgba(0,0,0,0.08)_inset]",
              ].join(" ")}
            >
              {!file ? (
                /* Empty Upload State */
                <label
                  htmlFor="file"
                  className="group flex min-h-[184px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] px-5 text-center shadow-[0_1px_0_rgba(255,255,255,1)_inset]"
                >
                  <div
                    className={[
                      "flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-200",
                      dragActive
                        ? "border-[#18392B] bg-[#18392B] text-white"
                        : "border-black/5 bg-[#E6E0D6] text-[#18392B] shadow-[0_1px_0_rgba(255,255,255,0.8),0_1.5px_3px_rgba(0,0,0,0.08)_inset] group-hover:scale-105",
                    ].join(" ")}
                  >
                    <Upload
                      size={20}
                      strokeWidth={1.8}
                      className={dragActive ? "animate-bounce" : ""}
                    />
                  </div>

                  <p className="mt-3 font-serif text-base font-normal text-[#121312]">
                    {dragActive
                      ? "Drop your document here"
                      : "Drag & drop your document"}
                  </p>

                  <p className="mt-0.5 font-mono text-[10px] text-[#121312]/50">
                    or click to browse from your device
                  </p>

                  <div className="mt-3 flex items-center gap-1.5">
                    {["PDF", "JPG", "PNG", "WEBP"].map((type) => (
                      <span
                        key={type}
                        className="rounded-md border border-black/5 bg-[#E6E0D6] px-2 py-0.5 font-mono text-[8px] font-semibold text-[#121312]/60 shadow-[0_1px_0_rgba(255,255,255,0.8)]"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </label>
              ) : (
                /* Selected File State */
                <div className="flex min-h-[184px] w-full items-center justify-center rounded-xl border border-black/5 bg-gradient-to-b from-white to-[#F3EFE9] p-4 shadow-[0_1px_0_rgba(255,255,255,1)_inset]">
                  <div className="flex w-full max-w-[500px] items-center gap-3.5 rounded-xl border border-black/5 bg-[#E6E0D6] p-3 shadow-[0_1px_0_rgba(255,255,255,0.8),0_1.5px_3px_rgba(0,0,0,0.08)_inset]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/5 bg-white text-[#18392B] shadow-[0_1px_0_rgba(255,255,255,1)_inset]">
                      <FileText size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[#121312]">
                        {file.name}
                      </p>

                      <div className="mt-1 flex items-center gap-2 font-mono text-[9px]">
                        <span className="text-[#121312]/50">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>

                        <span className="h-1 w-1 rounded-full bg-[#18392B]" />

                        <span className="flex items-center gap-1 font-semibold text-[#18392B]">
                          <CheckCircle2 size={11} />
                          Ready to upload
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/5 bg-white text-[#121312]/40 shadow-[0_1px_0_rgba(255,255,255,1)_inset] transition-all hover:bg-red-50 hover:text-red-600 active:scale-95"
                      aria-label="Remove file"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                id="file"
                name="file"
                type="file"
                required={!file}
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  handleFile(e.target.files?.[0]);
                }}
              />
            </div>
          </div>

          {/* Privacy Note */}
          <div className="rounded-xl border border-black/5 bg-[#E6E0D6] p-3.5 shadow-[0_1px_0_rgba(255,255,255,0.8),0_1.5px_3px_rgba(0,0,0,0.08)_inset]">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#18392B] shadow-[0_0_4px_rgba(24,57,43,0.4)]" />
              <p className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#18392B]">
                Private & Encrypted
              </p>
            </div>

            <p className="mt-1 font-mono text-[10px] leading-relaxed text-[#121312]/60">
              This document belongs exclusively to your medical record. It
              remains strictly private unless you explicitly share it.
            </p>
          </div>

          {/* Tactile Submit Button */}
          <div className="pt-2">
            <div className="p-1 rounded-xl bg-[#E6E0D6] shadow-[0_1px_0_rgba(255,255,255,0.8),0_1.5px_3px_rgba(0,0,0,0.08)_inset]">
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#18392B]/30 bg-gradient-to-b from-[#224f3c] via-[#18392B] to-[#10271d] px-4 font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_3px_8px_rgba(24,57,43,0.25)] transition-all active:scale-[0.98]"
              >
                <Check size={14} />
                <span>Upload Report</span>
              </button>
            </div>
          </div>
        </form>
      </DoubleBorderCard>
    </div>
  );
}
