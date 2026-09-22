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

import {
  formatDateTime,
  getProviderStatusClass,
  getReviewClass,
  getReviewLabel,
} from "./helper";

import type { StaffProvider } from "./types";

type Props = {
  provider: StaffProvider | undefined;

  canManage: boolean;

  onClose: () => void;

  onReview: (provider: StaffProvider) => void;
};

export default function ClientDetails({
  provider,
  canManage,
  onClose,
  onReview,
}: Props) {
  if (!provider) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
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
              className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getProviderStatusClass(
                provider.status,
              )}`}
            >
              {provider.status}
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

        {/* BODY */}

        <div className="overflow-y-auto p-6">
          <div className="space-y-6">
            {/* BASIC / COMPANY */}

            <div className="grid gap-5 lg:grid-cols-2">
              <Section title="Basic Information" icon={UserRound}>
                <Field label="Provider Name" value={provider.name} />

                <Field label="Company" value={provider.companyName} />

                <Field label="Email" value={provider.email} />

                <Field label="Phone" value={provider.phone} />
              </Section>

              <Section title="Company Information" icon={Building2}>
                <Field label="Industry" value={provider.industry} />

                <Field label="Address" value={provider.address} />

                <Field label="Website" value={provider.website} />
              </Section>

              <Section title="Contact Person" icon={Phone}>
                <Field label="Name" value={provider.contactPerson} />

                <Field label="Phone" value={provider.contactPersonPhone} />

                <Field label="Email" value={provider.contactPersonEmail} />
              </Section>

              <Section title="Hiring Information" icon={BriefcaseBusiness}>
                <Field label="Hiring Needs" value={provider.hiringNeeds} />

                <Field label="Provider Notes" value={provider.notes} />
              </Section>
            </div>

            {/* STATS */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold">Recruitment Statistics</h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
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

            {/* STAFF REVIEW */}

            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">Staff Review</h3>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getReviewClass(
                    provider.staffReview.status,
                  )}`}
                >
                  {getReviewLabel(provider.staffReview.status)}
                </span>
              </div>

              {provider.staffReview.status === "NOT_REVIEWED" && (
                <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />

                  <p className="text-sm text-amber-700">
                    This client company has not been reviewed by Staff yet.
                  </p>
                </div>
              )}

              {provider.staffReview.status === "REVIEWED" && (
                <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                  <p className="text-sm text-emerald-700">
                    Staff operational review has been completed.
                  </p>
                </div>
              )}

              {provider.staffReview.status === "NEEDS_ATTENTION" && (
                <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />

                  <p className="text-sm text-red-700">
                    Staff marked this client company as needing Admin attention.
                  </p>
                </div>
              )}

              {provider.staffReview.status !== "NOT_REVIEWED" && (
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <ReviewDetail
                    label="Reviewed By"
                    value={provider.staffReview.reviewedByStaffId}
                  />

                  <ReviewDetail
                    label="Reviewed At"
                    value={formatDateTime(provider.staffReview.reviewedAt)}
                  />
                </div>
              )}

              {provider.staffReview.note && (
                <div
                  className={`mt-3 rounded-2xl border p-4 ${
                    provider.staffReview.status === "NEEDS_ATTENTION"
                      ? "border-red-200 bg-red-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Staff Review Note
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    {provider.staffReview.note}
                  </p>
                </div>
              )}

              <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                Staff review is operational only. Provider account status and
                final account management remain with Admin.
              </div>
            </section>
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

          {canManage && (
            <button
              type="button"
              onClick={() => onReview(provider)}
              className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white"
            >
              {provider.staffReview.status === "NOT_REVIEWED"
                ? "Review Client"
                : "Edit Review"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// SECTION
// ======================================================

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;

  icon: typeof Building2;

  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 p-5">
      <div className="mb-4 flex items-center gap-2 font-bold">
        <Icon className="h-4 w-4" />

        {title}
      </div>

      <div className="space-y-4">{children}</div>
    </section>
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

  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>

      <p className="mt-1 break-words text-sm font-medium">{value ?? "-"}</p>
    </div>
  );
}

// ======================================================
// REVIEW DETAIL
// ======================================================

function ReviewDetail({
  label,
  value,
}: {
  label: string;

  value?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>

      <p className="mt-1 text-sm font-semibold">{value || "-"}</p>
    </div>
  );
}
