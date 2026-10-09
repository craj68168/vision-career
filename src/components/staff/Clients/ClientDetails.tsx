"use client";

import type { ComponentType, ReactNode } from "react";

import {
  AlertTriangle,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Mail,
  Pencil,
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

// ======================================================
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const secondaryButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "C"
  );
}

export default function ClientDetails({
  provider,
  canManage,
  onClose,
  onReview,
}: Props) {
  if (!provider) {
    return null;
  }

  const notReviewed = provider.staffReview.status === "NOT_REVIEWED";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={provider.companyName}
      className="fixed inset-0 z-[130] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-slate-200 sm:rounded-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="relative shrink-0 overflow-hidden bg-[linear-gradient(120deg,#eef2ff_0%,#f5f3ff_45%,#ffffff_100%)] px-4 py-4 shadow-[inset_0_-1px_0_0_#e0e7ff] sm:px-6 sm:py-5">
          {/* decorative grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.07)_1px,transparent_1px)] bg-[length:44px_44px] [mask-image:linear-gradient(90deg,#000,transparent)]"
          />

          <div className="relative flex items-start gap-3 sm:gap-4">
            <span
              aria-hidden="true"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-base font-bold text-white shadow-md shadow-indigo-600/30"
            >
              {getInitials(provider.companyName)}
            </span>

            <div className="min-w-0 flex-1">
              <p className="break-all text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                {provider.registerId}
              </p>

              <h2 className="mt-0.5 break-words text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
                {provider.companyName}
              </h2>

              <p className="mt-1 break-words text-sm text-slate-500">
                {provider.name}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getProviderStatusClass(
                    provider.status,
                  )}`}
                >
                  {provider.status}
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getReviewClass(
                    provider.staffReview.status,
                  )}`}
                >
                  {getReviewLabel(provider.staffReview.status)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-slate-600 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/60">
          <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
            {/* BASIC / COMPANY / CONTACT / HIRING */}

            <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
              <Section title="Basic Information" icon={UserRound} accent="indigo">
                <Field label="Provider Name" value={provider.name} />

                <Field label="Company" value={provider.companyName} />

                <Field label="Email" value={provider.email} />

                <Field label="Phone" value={provider.phone} />
              </Section>

              <Section title="Company Information" icon={Building2} accent="sky">
                <Field label="Industry" value={provider.industry} />

                <Field label="Address" value={provider.address} />

                <Field label="Website" value={provider.website} />
              </Section>

              <Section title="Contact Person" icon={Phone} accent="violet">
                <Field label="Name" value={provider.contactPerson} />

                <Field label="Phone" value={provider.contactPersonPhone} />

                <Field label="Email" value={provider.contactPersonEmail} />
              </Section>

              <Section
                title="Hiring Information"
                icon={BriefcaseBusiness}
                accent="emerald"
              >
                <Field label="Hiring Needs" value={provider.hiringNeeds} />

                <Field label="Provider Notes" value={provider.notes} />
              </Section>
            </div>

            {/* STATS */}

            <section className="rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5">
              <h3 className="text-sm font-semibold text-slate-950">
                Recruitment Statistics
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-[linear-gradient(180deg,#eef2ff,#ffffff_75%)] p-4 text-center ring-1 ring-inset ring-indigo-200">
                  <span
                    aria-hidden="true"
                    className="mx-auto grid h-9 w-9 place-items-center rounded-lg bg-white text-indigo-600 ring-1 ring-inset ring-indigo-200"
                  >
                    <FileText className="h-4 w-4" />
                  </span>

                  <p className="mt-3 text-[26px] font-bold leading-none tabular-nums text-slate-950">
                    {provider.vacancyCount}
                  </p>

                  <p className="mt-1.5 text-xs font-medium text-slate-500">
                    Vacancies
                  </p>
                </div>

                <div className="rounded-xl bg-[linear-gradient(180deg,#f5f3ff,#ffffff_75%)] p-4 text-center ring-1 ring-inset ring-violet-200">
                  <span
                    aria-hidden="true"
                    className="mx-auto grid h-9 w-9 place-items-center rounded-lg bg-white text-violet-600 ring-1 ring-inset ring-violet-200"
                  >
                    <Mail className="h-4 w-4" />
                  </span>

                  <p className="mt-3 text-[26px] font-bold leading-none tabular-nums text-slate-950">
                    {provider.applicationCount}
                  </p>

                  <p className="mt-1.5 text-xs font-medium text-slate-500">
                    Applications
                  </p>
                </div>
              </div>
            </section>

            {/* STAFF REVIEW */}

            <section className="rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-950">
                  Staff Review
                </h3>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getReviewClass(
                    provider.staffReview.status,
                  )}`}
                >
                  {getReviewLabel(provider.staffReview.status)}
                </span>
              </div>

              {provider.staffReview.status === "NOT_REVIEWED" && (
                <div className="flex gap-3 rounded-xl bg-amber-50 p-4 ring-1 ring-inset ring-amber-200">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />

                  <p className="text-sm text-amber-700">
                    This client company has not been reviewed by Staff yet.
                  </p>
                </div>
              )}

              {provider.staffReview.status === "REVIEWED" && (
                <div className="flex gap-3 rounded-xl bg-emerald-50 p-4 ring-1 ring-inset ring-emerald-200">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                  <p className="text-sm text-emerald-700">
                    Staff operational review has been completed.
                  </p>
                </div>
              )}

              {provider.staffReview.status === "NEEDS_ATTENTION" && (
                <div className="flex gap-3 rounded-xl bg-rose-50 p-4 ring-1 ring-inset ring-rose-200">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />

                  <p className="text-sm text-rose-700">
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
                  className={`mt-3 rounded-xl p-4 ring-1 ring-inset ${
                    provider.staffReview.status === "NEEDS_ATTENTION"
                      ? "bg-rose-50 ring-rose-200"
                      : "bg-slate-50 ring-slate-200"
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Staff Review Note
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">
                    {provider.staffReview.note}
                  </p>
                </div>
              )}

              <div className="mt-3 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-700 ring-1 ring-inset ring-blue-200">
                Staff review is operational only. Provider account status and
                final account management remain with Admin.
              </div>
            </section>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex shrink-0 flex-col-reverse gap-2 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[inset_0_1px_0_0_#e2e8f0] sm:flex-row sm:justify-end sm:px-6 sm:py-4">
          <button type="button" onClick={onClose} className={secondaryButton}>
            Close
          </button>

          {canManage && (
            <button
              type="button"
              onClick={() => onReview(provider)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              {notReviewed ? (
                <ClipboardCheck className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}

              {notReviewed ? "Review Client" : "Edit Review"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// SECTION
//
// Full class names are written out so Tailwind can
// detect them.
// ======================================================

const sectionAccents = {
  indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  sky: "bg-sky-50 text-sky-600 ring-sky-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
} as const;

function Section({
  title,
  icon: Icon,
  accent,
  children,
}: {
  title: string;

  icon: ComponentType<{ className?: string }>;

  accent: keyof typeof sectionAccents;

  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset ${sectionAccents[accent]}`}
        >
          <Icon className="h-4 w-4" />
        </span>

        <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      </div>

      <div className="mt-4 space-y-3">{children}</div>
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
    <div className="min-w-0 rounded-xl bg-slate-50 p-3.5 ring-1 ring-inset ring-slate-200/70">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-950">
        {value ?? "-"}
      </p>
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
    <div className="min-w-0 rounded-xl bg-slate-50 p-3.5 ring-1 ring-inset ring-slate-200/70">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-950">
        {value || "-"}
      </p>
    </div>
  );
}