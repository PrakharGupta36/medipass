"use client";

import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
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

    /*
     * Important:
     *
     * When a file is dragged onto the drop zone,
     * we need to put that file into the actual
     * <input type="file"> as well.
     *
     * Otherwise the React state knows about the file,
     * but FormData won't contain it when the form submits.
     */
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
    <div className="relative w-full">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -top-32 right-10 h-80 w-80 rounded-full bg-[#1F7A4F]/[0.035] blur-[120px]" />

      {/* Back */}
      <Link
        href="/dashboard/health"
        className="group inline-flex items-center gap-2 text-[10px] font-medium text-white/25 transition hover:text-white/60"
      >
        <ArrowLeft
          size={14}
          className="transition-transform group-hover:-translate-x-0.5"
        />
        Back to health
      </Link>

      {/* Page heading */}
      <div className="mt-6 mb-8 flex items-start justify-between gap-8 lg:mb-9">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#62C58C] shadow-[0_0_8px_rgba(98,197,140,0.35)]" />

            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#62C58C]/60">
              Medical records / 01
            </span>
          </div>

          <h1 className="mt-3 text-[30px] font-semibold tracking-[-0.045em] text-white sm:text-[36px]">
            Add a medical report
          </h1>

          <p className="mt-2 max-w-2xl text-[11px] leading-5 text-white/25 sm:text-xs">
            Store prescriptions, laboratory results, scans and other important
            medical documents in your private medical record.
          </p>
        </div>

        {/* Desktop icon */}
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#111712] text-[#62C58C] shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] lg:flex">
          <FileText size={19} strokeWidth={1.7} />
        </div>
      </div>

      {/* Main form card */}
      <section className="relative w-full overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#111712]/90 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl">
        {/* Top reflection */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* Card header */}
        <div className="border-b border-white/[0.055] px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#62C58C]/10 bg-[#1F7A4F]/10 text-[#62C58C]">
              <FileText size={17} />
            </div>

            <div>
              <p className="text-xs font-semibold text-white/75">
                Report details
              </p>

              <p className="mt-0.5 text-[9px] text-white/20">
                Add information to identify this document later.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          action={uploadMedicalReport}
          className="space-y-7 p-5 sm:p-7 lg:p-8"
        >
          {/* ------------------------------------------ */}
          {/* Report title */}
          {/* ------------------------------------------ */}

          <div>
            <label
              htmlFor="title"
              className="mb-2 block font-mono text-[8px] uppercase tracking-[0.16em] text-white/25"
            >
              Report title
            </label>

            <input
              id="title"
              name="title"
              required
              placeholder="e.g. Complete Blood Count"
              className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#0B100D] px-4 text-xs text-white/75 outline-none transition placeholder:text-white/15 hover:border-white/[0.11] focus:border-[#62C58C]/30 focus:bg-[#0D130F] focus:ring-2 focus:ring-[#62C58C]/[0.07]"
            />
          </div>

          {/* ------------------------------------------ */}
          {/* Report type + date */}
          {/* ------------------------------------------ */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Report type */}
            <div>
              <label
                htmlFor="report_type"
                className="mb-2 block font-mono text-[8px] uppercase tracking-[0.16em] text-white/25"
              >
                Report type
              </label>

              <div className="relative">
                <select
                  id="report_type"
                  name="report_type"
                  defaultValue=""
                  className="h-12 w-full appearance-none rounded-xl border border-white/[0.07] bg-[#0B100D] px-4 pr-11 text-xs text-white/60 outline-none transition hover:border-white/[0.11] focus:border-[#62C58C]/30 focus:bg-[#0D130F] focus:ring-2 focus:ring-[#62C58C]/[0.07]"
                >
                  <option value="">Select type</option>
                  <option value="Lab report">Lab report</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Imaging">Imaging</option>
                  <option value="Discharge summary">Discharge summary</option>
                  <option value="Doctor note">Doctor note</option>
                  <option value="Other">Other</option>
                </select>

                <ChevronDown
                  size={15}
                  strokeWidth={1.7}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/20"
                />
              </div>
            </div>

            {/* Report date */}
            <div>
              <label className="mb-2 block font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
                Report date
              </label>

              {/* Value submitted to server */}
              <input
                type="hidden"
                name="report_date"
                value={date ? format(date, "yyyy-MM-dd") : ""}
              />

              <Popover>
                {/* No asChild — compatible with your current Base UI shadcn */}
                <PopoverTrigger
                  type="button"
                  className="flex h-12 w-full items-center justify-between rounded-xl border border-white/[0.07] bg-[#0B100D] px-4 text-left text-xs outline-none transition hover:border-white/[0.11] focus:border-[#62C58C]/30 focus:bg-[#0D130F] focus:ring-2 focus:ring-[#62C58C]/[0.07]"
                >
                  <span className={date ? "text-white/70" : "text-white/20"}>
                    {date ? format(date, "dd MMMM yyyy") : "Select report date"}
                  </span>

                  <CalendarDays
                    size={15}
                    strokeWidth={1.7}
                    className="shrink-0 text-white/20"
                  />
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  className="w-auto border-white/[0.08] bg-[#111712] p-2 text-white shadow-2xl"
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
          </div>

          {/* ------------------------------------------ */}
          {/* Document */}
          {/* ------------------------------------------ */}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="file"
                className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/25"
              >
                Document
              </label>

              <span className="font-mono text-[8px] text-white/15">
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

                if (droppedFile) {
                  handleFile(droppedFile);
                }
              }}
              className={[
                "relative flex min-h-[230px] w-full overflow-hidden rounded-2xl border border-dashed transition",
                dragActive
                  ? "border-[#62C58C]/50 bg-[#1F7A4F]/10"
                  : "border-white/[0.09] bg-[#0B100D]",
              ].join(" ")}
            >
              {/* Reflection */}
              <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              {!file ? (
                /* Empty state */
                <label
                  htmlFor="file"
                  className="group flex min-h-[230px] w-full cursor-pointer flex-col items-center justify-center px-5 text-center"
                >
                  <div
                    className={[
                      "flex h-14 w-14 items-center justify-center rounded-2xl border transition",
                      dragActive
                        ? "border-[#62C58C]/25 bg-[#1F7A4F]/15 text-[#62C58C]"
                        : "border-white/[0.06] bg-[#111712] text-[#62C58C]/80 group-hover:border-[#62C58C]/15 group-hover:bg-[#1F7A4F]/10",
                    ].join(" ")}
                  >
                    <Upload
                      size={21}
                      strokeWidth={1.7}
                      className={dragActive ? "animate-bounce" : ""}
                    />
                  </div>

                  <p className="mt-4 text-xs font-semibold text-white/60">
                    {dragActive
                      ? "Drop your document here"
                      : "Drag & drop your document"}
                  </p>

                  <p className="mt-1 text-[10px] text-white/20">
                    or click to browse from your device
                  </p>

                  <div className="mt-4 flex items-center gap-1.5">
                    {["PDF", "JPG", "PNG", "WEBP"].map((type) => (
                      <span
                        key={type}
                        className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 font-mono text-[7px] text-white/20"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </label>
              ) : (
                /* Selected file */
                <div className="flex min-h-[230px] w-full items-center justify-center p-5">
                  <div className="flex w-full max-w-[600px] items-center gap-4 rounded-2xl border border-[#62C58C]/15 bg-[#102018] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#62C58C]/10 bg-[#1F7A4F]/10 text-[#62C58C]">
                      <FileText size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-white/70">
                        {file.name}
                      </p>

                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="font-mono text-[8px] text-white/20">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>

                        <span className="h-1 w-1 rounded-full bg-[#62C58C]/60" />

                        <span className="flex items-center gap-1 text-[8px] text-[#62C58C]/70">
                          <CheckCircle2 size={10} />
                          Ready to upload
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.02] text-white/20 transition hover:border-white/[0.1] hover:bg-white/[0.05] hover:text-white/60"
                      aria-label="Remove file"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Actual input ALWAYS stays mounted */}
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

          {/* ------------------------------------------ */}
          {/* Privacy */}
          {/* ------------------------------------------ */}

          <div className="relative overflow-hidden rounded-2xl border border-[#62C58C]/10 bg-[#0F1B14] p-4 sm:p-5">
            <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-[#62C58C]/[0.035] blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#62C58C] shadow-[0_0_7px_rgba(98,197,140,0.4)]" />

                <p className="text-[10px] font-semibold text-[#A7E1BE]">
                  Private by default
                </p>
              </div>

              <p className="mt-2 max-w-3xl text-[9px] leading-5 text-white/25">
                This document belongs to your medical record. It remains private
                unless you explicitly include it in a temporary MediPass sharing
                session.
              </p>
            </div>
          </div>

          {/* ------------------------------------------ */}
          {/* Submit */}
          {/* ------------------------------------------ */}

          <div className="flex flex-col-reverse gap-4 border-t border-white/[0.05] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/15">
                MediPass / Medical record
              </p>

              <p className="mt-1 text-[9px] text-white/15">
                Your document is stored securely.
              </p>
            </div>

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#246B45] px-6 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(36,107,69,0.18)] transition hover:bg-[#2C7D53] hover:shadow-[0_10px_30px_rgba(36,107,69,0.24)] active:scale-[0.99] sm:w-auto"
            >
              <Upload size={14} />
              Upload report
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
