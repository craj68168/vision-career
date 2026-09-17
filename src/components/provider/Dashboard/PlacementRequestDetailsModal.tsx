"use client";

import { CalendarDays, MapPin, X } from "lucide-react";

import type { PlacementRequest, PlacementRequestStatus } from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  open: boolean;

  request: PlacementRequest | null;

  onClose: () => void;

  lang: string;
};

// ======================================================
// HELPERS
// ======================================================

const getStatusClasses = (status: PlacementRequestStatus) => {
  switch (status) {
    case "pending_review":
      return "bg-amber-50 text-amber-700";

    case "approved":
      return "bg-emerald-50 text-emerald-700";

    case "rejected":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

const getStatusLabel = (status: PlacementRequestStatus) => {
  switch (status) {
    case "pending_review":
      return "Pending Review";

    case "approved":
      return "Approved";

    case "rejected":
      return "Rejected";

    default:
      return "Draft";
  }
};

// ======================================================
// COMPONENT
// ======================================================

export default function PlacementRequestDetailsModal({
  open,
  request,
  onClose,
  lang,
}: Props) {
  if (!open || !request) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      {/* BACKDROP */}

      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0"
      />

      {/* MODAL */}

      <div className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <header className="sticky top-0 z-20 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {request.recruitId}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {request.job_title}
            </h2>

            {request.work_location && (
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />

                {request.work_location}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-6 p-6">
          {/* STATUS */}

          <div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                request.status,
              )}`}
            >
              {getStatusLabel(request.status)}
            </span>
          </div>

          {/* DETAILS */}

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label={lang === "ja" ? "職種カテゴリー" : "Job Category"}
              value={request.job_category}
            />

            <Field
              label={lang === "ja" ? "雇用形態" : "Employment Type"}
              value={request.employment_type}
            />

            <Field
              label={lang === "ja" ? "募集人数" : "Number of Positions"}
              value={request.number_of_positions}
            />

            <Field
              label={lang === "ja" ? "勤務地" : "Work Location"}
              value={request.work_location}
            />

            <Field
              label={lang === "ja" ? "日本語レベル" : "Japanese Level"}
              value={request.japanese_level_required}
            />

            <Field
              label={lang === "ja" ? "ビザ条件" : "Visa Requirement"}
              value={request.visa_type_required}
            />

            <Field
              label={lang === "ja" ? "給与形態" : "Salary Type"}
              value={request.salary_type}
            />

            <Field
              label={lang === "ja" ? "給与額" : "Salary Amount"}
              value={request.salary_amount}
            />

            <Field
              label={lang === "ja" ? "勤務時間" : "Working Hours"}
              value={request.working_hours}
            />

            <Field
              label={lang === "ja" ? "休日" : "Days Off"}
              value={request.days_off}
            />

            <Field
              label={lang === "ja" ? "勤務開始日" : "Start Date"}
              value={request.start_date}
            />
          </div>

          {/* DESCRIPTION */}

          <Section title={lang === "ja" ? "仕事内容" : "Job Description"}>
            {request.job_description || "-"}
          </Section>

          {/* REQUIREMENTS */}

          <Section title={lang === "ja" ? "応募条件" : "Requirements"}>
            {request.requirements || "-"}
          </Section>

          {/* REJECTION */}

          {request.status === "rejected" && request.rejection_reason && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-semibold text-red-700">
                {lang === "ja" ? "却下理由" : "Rejection Reason"}
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">
                {request.rejection_reason}
              </p>
            </div>
          )}

          {/* SUBMITTED DATE */}

          {request.submitted_at && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CalendarDays className="h-4 w-4" />

              <span>
                {lang === "ja" ? "送信日時" : "Submitted"}:{" "}
                {new Date(request.submitted_at).toLocaleString()}
              </span>
            </div>
          )}

          {/* REVIEWED DATE */}

          {request.reviewed_at && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CalendarDays className="h-4 w-4" />

              <span>
                {lang === "ja" ? "審査日時" : "Reviewed"}:{" "}
                {new Date(request.reviewed_at).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// FIELD
// ======================================================

function Field({
  label,
  value,
}: {
  label: string;

  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 whitespace-pre-wrap text-sm font-medium text-slate-900">
        {value === null || value === undefined || value === ""
          ? "-"
          : String(value)}
      </p>
    </div>
  );
}

// ======================================================
// SECTION
// ======================================================

function Section({
  title,
  children,
}: {
  title: string;

  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900">{title}</h3>

      <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
        {children}
      </div>
    </section>
  );
}
