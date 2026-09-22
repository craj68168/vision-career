"use client";

import {
  AlertTriangle,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import type { AdminProvider, ProviderReviewStatus } from "./types";

type Props = {
  provider: AdminProvider;

  onClose: () => void;
};

// ======================================================
// FIELD
// ======================================================

function Field({
  label,
  value,
}: {
  label: string;

  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>

      <p className="mt-1 break-words text-sm font-medium text-slate-900">
        {value ?? "-"}
      </p>
    </div>
  );
}

// ======================================================
// REVIEW LABEL
// ======================================================

function getReviewLabel(status: ProviderReviewStatus) {
  switch (status) {
    case "REVIEWED":
      return "Reviewed";

    case "NEEDS_ATTENTION":
      return "Needs Attention";

    default:
      return "Not Reviewed";
  }
}

// ======================================================
// REVIEW CLASS
// ======================================================

function getReviewClass(status: ProviderReviewStatus) {
  switch (status) {
    case "REVIEWED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

// ======================================================
// DATE
// ======================================================

function formatDateTime(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

// ======================================================
// VIEW
// ======================================================

export default function ViewModal({ provider, onClose }: Props) {
  const review = provider.staffReview;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              {provider.registerId}
            </p>

            <h2 className="mt-1 text-2xl font-bold">{provider.companyName}</h2>

            <p className="mt-1 text-sm text-slate-500">{provider.name}</p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                provider.status === "active"
                  ? "bg-emerald-50 text-emerald-700"
                  : provider.status === "suspended"
                    ? "bg-red-50 text-red-700"
                    : "bg-slate-100 text-slate-600"
              }`}
            >
              {provider.status}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full p-2 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* COMPANY INFORMATION */}

          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="mb-4 flex items-center gap-2 font-bold">
                <UserRound className="h-4 w-4" />
                Basic Information
              </div>

              <div className="space-y-4">
                <Field label="Provider Name" value={provider.name} />

                <Field label="Company" value={provider.companyName} />

                <Field label="Email" value={provider.email} />

                <Field label="Phone" value={provider.phone} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="mb-4 flex items-center gap-2 font-bold">
                <Building2 className="h-4 w-4" />
                Company Information
              </div>

              <div className="space-y-4">
                <Field label="Industry" value={provider.industry} />

                <Field label="Address" value={provider.address} />

                <Field label="Website" value={provider.website} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="mb-4 flex items-center gap-2 font-bold">
                <Phone className="h-4 w-4" />
                Contact Person
              </div>

              <div className="space-y-4">
                <Field label="Name" value={provider.contactPerson} />

                <Field label="Phone" value={provider.contactPersonPhone} />

                <Field label="Email" value={provider.contactPersonEmail} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="mb-4 flex items-center gap-2 font-bold">
                <BriefcaseBusiness className="h-4 w-4" />
                Hiring Information
              </div>

              <div className="space-y-4">
                <Field label="Hiring Needs" value={provider.hiringNeeds} />

                <Field label="Provider Notes" value={provider.notes} />
              </div>
            </section>
          </div>

          {/* STATISTICS */}

          <section className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold">Statistics</h3>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <FileText className="mx-auto h-5 w-5 text-indigo-500" />

                <p className="mt-2 text-2xl font-bold">
                  {provider.vacancyCount}
                </p>

                <p className="text-xs text-slate-500">Vacancies</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <Mail className="mx-auto h-5 w-5 text-indigo-500" />

                <p className="mt-2 text-2xl font-bold">
                  {provider.applicationCount}
                </p>

                <p className="text-xs text-slate-500">Applications</p>
              </div>
            </div>
          </section>

          {/* ================================================= */}
          {/* STAFF REVIEW */}
          {/* ================================================= */}

          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-950">Staff Review</h3>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getReviewClass(
                  review.status,
                )}`}
              >
                {getReviewLabel(review.status)}
              </span>
            </div>

            {/* NOT REVIEWED */}

            {review.status === "NOT_REVIEWED" && (
              <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                <div>
                  <p className="font-semibold text-amber-800">
                    This client company has not been reviewed by Staff yet.
                  </p>

                  <p className="mt-1 text-sm text-amber-700">
                    Admin still retains full account management authority.
                  </p>
                </div>
              </div>
            )}

            {/* REVIEWED */}

            {review.status === "REVIEWED" && (
              <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="font-semibold text-emerald-800">
                    Staff review completed.
                  </p>

                  <p className="mt-1 text-sm text-emerald-700">
                    Company and operational information has been reviewed.
                  </p>
                </div>
              </div>
            )}

            {/* NEEDS ATTENTION */}

            {review.status === "NEEDS_ATTENTION" && (
              <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                <div>
                  <p className="font-semibold text-red-800">
                    Staff marked this client company as needing attention.
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    Review the Staff note before making account-related
                    decisions.
                  </p>
                </div>
              </div>
            )}

            {/* META */}

            {review.status !== "NOT_REVIEWED" && (
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <ReviewField
                  label="Reviewed By"
                  value={review.reviewedByStaffId}
                />

                <ReviewField
                  label="Reviewed At"
                  value={formatDateTime(review.reviewedAt)}
                />
              </div>
            )}

            {/* NOTE */}

            {review.note && (
              <div
                className={`mt-3 rounded-2xl border p-4 ${
                  review.status === "NEEDS_ATTENTION"
                    ? "border-red-200 bg-red-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Staff Review Note
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {review.note}
                </p>
              </div>
            )}

            <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
              Staff review is operational information only. Provider activation,
              suspension, editing and deletion remain controlled by Admin.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// REVIEW FIELD
// ======================================================

function ReviewField({
  label,
  value,
}: {
  label: string;

  value?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}
