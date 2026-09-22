"use client";

import { AlertTriangle, CheckCircle2, X } from "lucide-react";

import {
  formatDate,
  formatDateTime,
  formatSalary,
  getRequestStatusClass,
  getRequestStatusLabel,
  getScreeningClass,
  getScreeningLabel,
} from "./helper";

import type { StaffPlacementRequest } from "./types";

type Props = {
  request: StaffPlacementRequest | undefined;

  canReview: boolean;

  onClose: () => void;

  onScreen: (request: StaffPlacementRequest) => void;
};

export default function PlacementRequestDetails({
  request,
  canReview,
  onClose,
  onScreen,
}: Props) {
  if (!request) {
    return null;
  }

  const canScreen = canReview && request.status === "pending_review";

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              {request.recruitId}
            </p>

            <h2 className="mt-1 text-2xl font-bold">{request.jobTitle}</h2>

            <p className="mt-1 text-sm text-slate-500">{request.companyName}</p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getRequestStatusClass(
                request.status,
              )}`}
            >
              {getRequestStatusLabel(request.status)}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* CONTENT */}

        <div className="overflow-y-auto p-6">
          <div className="space-y-7">
            {/* PROVIDER */}

            <section>
              <h3 className="mb-4 text-lg font-bold">Provider Information</h3>

              <div className="grid gap-3 md:grid-cols-3">
                <Field label="Company" value={request.companyName} />

                <Field label="Provider" value={request.providerName} />

                <Field label="Provider Email" value={request.providerEmail} />
              </div>
            </section>

            {/* JOB */}

            <section>
              <h3 className="mb-4 text-lg font-bold">Job Information</h3>

              <div className="grid gap-3 md:grid-cols-3">
                <Field label="Job Title" value={request.jobTitle} />

                <Field label="Category" value={request.jobCategory} />

                <Field label="Employment Type" value={request.employmentType} />

                <Field label="Positions" value={request.numberOfPositions} />

                <Field label="Work Location" value={request.workLocation} />

                <Field label="Start Date" value={request.startDate} />
              </div>
            </section>

            {/* REQUIREMENTS */}

            <section>
              <h3 className="mb-4 text-lg font-bold">Requirements</h3>

              <div className="grid gap-3 md:grid-cols-2">
                <Field
                  label="Japanese Level"
                  value={request.japaneseLevelRequired}
                />

                <Field
                  label="Visa Requirement"
                  value={request.visaTypeRequired}
                />
              </div>

              <div className="mt-3 grid gap-3">
                <Field label="Job Description" value={request.jobDescription} />

                <Field label="Requirements" value={request.requirements} />
              </div>
            </section>

            {/* CONDITIONS */}

            <section>
              <h3 className="mb-4 text-lg font-bold">Work Conditions</h3>

              <div className="grid gap-3 md:grid-cols-3">
                <Field
                  label="Salary"
                  value={formatSalary(request.salaryAmount, request.salaryType)}
                />

                <Field label="Working Hours" value={request.workingHours} />

                <Field label="Days Off" value={request.daysOff} />
              </div>
            </section>

            {/* SUBMISSION */}

            <section>
              <h3 className="mb-4 text-lg font-bold">Request Timeline</h3>

              <div className="grid gap-3 md:grid-cols-3">
                <Field
                  label="Submitted At"
                  value={formatDateTime(request.submittedAt)}
                />

                <Field
                  label="Admin Reviewed At"
                  value={formatDateTime(request.reviewedAt)}
                />

                <Field
                  label="Created At"
                  value={formatDate(request.createdAt)}
                />
              </div>
            </section>

            {/* STAFF SCREENING */}

            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">Staff Screening</h3>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getScreeningClass(
                    request.staffScreening.status,
                  )}`}
                >
                  {getScreeningLabel(request.staffScreening.status)}
                </span>
              </div>

              {request.staffScreening.status === "NOT_SCREENED" && (
                <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />

                  <p className="text-sm text-amber-700">
                    This placement request has not been screened by Staff yet.
                  </p>
                </div>
              )}

              {request.staffScreening.status === "SCREENED" && (
                <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                  <p className="text-sm text-emerald-700">
                    Staff screening has been completed. The request is ready for
                    Admin review.
                  </p>
                </div>
              )}

              {request.staffScreening.status === "NEEDS_ATTENTION" && (
                <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />

                  <p className="text-sm text-red-700">
                    Staff marked this placement request as needing Admin
                    attention.
                  </p>
                </div>
              )}

              {request.staffScreening.status !== "NOT_SCREENED" && (
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <Field
                    label="Screened By"
                    value={request.staffScreening.screenedByStaffId}
                  />

                  <Field
                    label="Screened At"
                    value={formatDateTime(request.staffScreening.screenedAt)}
                  />
                </div>
              )}

              {request.staffScreening.note && (
                <div
                  className={`mt-3 rounded-2xl border p-4 ${
                    request.staffScreening.status === "NEEDS_ATTENTION"
                      ? "border-red-200 bg-red-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Staff Screening Note
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    {request.staffScreening.note}
                  </p>
                </div>
              )}

              <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                Staff screening is advisory. Final approval or rejection remains
                with Admin.
              </div>
            </section>

            {/* ADMIN REJECTION */}

            {request.rejectionReason && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-xs font-semibold uppercase text-red-600">
                  Admin Rejection Reason
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">
                  {request.rejectionReason}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5"
          >
            Close
          </button>

          {canScreen && (
            <button
              type="button"
              onClick={() => onScreen(request)}
              className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white"
            >
              {request.staffScreening.status === "NOT_SCREENED"
                ? "Screen Request"
                : "Edit Screening"}
            </button>
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
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 whitespace-pre-wrap break-words text-sm font-medium">
        {value ?? "-"}
      </p>
    </div>
  );
}
