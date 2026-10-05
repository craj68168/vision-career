"use client";
import { useLocale, useTranslations } from "next-intl";

import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import type {
  PlacementRequest,
  PlacementRequestScreeningStatus,
} from "./types";
type Props = {
  request: PlacementRequest;
  onClose: () => void;
};
// ======================================================
// VALUE
// ======================================================
const text = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
};
// ======================================================
// SCREENING CLASS
// ======================================================
const screeningClass = (status: PlacementRequestScreeningStatus) => {
  switch (status) {
    case "SCREENED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";
    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300";
  }
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";
// ======================================================
// DETAILS MODAL
// ======================================================
export default function DetailsModal({ request, onClose }: Props) {
  const t = useTranslations("placementRequestDetails");
  const locale = useLocale();
  const screening = request.staffScreening;

  const dateTime = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString(locale, { timeZone: "Asia/Tokyo" });
  };

  const screeningLabel = (status: PlacementRequestScreeningStatus) => {
    switch (status) {
      case "SCREENED": return t("screened");
      case "NEEDS_ATTENTION": return t("needsAttention");
      default: return t("notScreened");
    }
  };

  // Translate known API values for display without changing stored values.
  const localizedValue = (group: "requestStatuses" | "employmentTypes" | "salaryTypes", value?: string | null) => {
    if (!value) return "-";
    const key = `${group}.${value.trim().toUpperCase().replace(/[ -]+/g, "_")}`;
    return t.has(key) ? t(key) : value;
  };
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {request.recruitId}
            </p>
            <h2 className="mt-0.5 break-words text-lg font-semibold text-zinc-950 dark:text-white sm:text-xl">
              {request.jobTitle}
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{request.companyName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10 ${focusRing}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* CONTENT */}
        <div className="overflow-y-auto p-4 sm:p-5">
          <div className="space-y-4">
            {/* PROVIDER */}
            <section className="rounded-lg border border-zinc-200 p-4 dark:border-white/10">
              <h3 className="mb-3 text-sm font-semibold text-zinc-950 dark:text-white">{t("providerInformation")}</h3>
              <div className="grid gap-3 md:grid-cols-3">
                <Field label={t("company")} value={request.companyName} />
                <Field label={t("provider")} value={request.providerName} />
                <Field label={t("providerEmail")} value={request.providerEmail} />
              </div>
            </section>
            {/* JOB */}
            <section className="rounded-lg border border-zinc-200 p-4 dark:border-white/10">
              <h3 className="mb-3 text-sm font-semibold text-zinc-950 dark:text-white">{t("jobInformation")}</h3>
              <div className="grid gap-3 md:grid-cols-3">
                <Field label={t("jobTitle")} value={request.jobTitle} />
                <Field label={t("category")} value={request.jobCategory} />
                <Field label={t("employmentType")} value={localizedValue("employmentTypes", request.employmentType)} />
                <Field label={t("positions")} value={request.numberOfPositions} />
                <Field label={t("workLocation")} value={request.workLocation} />
                <Field label={t("startDate")} value={request.startDate} />
              </div>
            </section>
            {/* REQUIREMENTS */}
            <section className="rounded-lg border border-zinc-200 p-4 dark:border-white/10">
              <h3 className="mb-3 text-sm font-semibold text-zinc-950 dark:text-white">{t("requirements")}</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <Field
                  label={t("japaneseLevel")}
                  value={request.japaneseLevelRequired}
                />
                <Field
                  label={t("visaRequirement")}
                  value={request.visaTypeRequired}
                />
              </div>
              <div className="mt-3 space-y-3">
                <Field label={t("jobDescription")} value={request.jobDescription} />
                <Field label={t("requirements")} value={request.requirements} />
              </div>
            </section>
            {/* CONDITIONS */}
            <section className="rounded-lg border border-zinc-200 p-4 dark:border-white/10">
              <h3 className="mb-3 text-sm font-semibold text-zinc-950 dark:text-white">{t("workConditions")}</h3>
              <div className="grid gap-3 md:grid-cols-3">
                <Field
                  label={t("salary")}
                  value={
                    request.salaryAmount != null
                      ? `${request.salaryAmount.toLocaleString(locale)} ${
                          request.salaryType ? localizedValue("salaryTypes", request.salaryType) : ""
                        }`
                      : localizedValue("salaryTypes", request.salaryType)
                  }
                />
                <Field label={t("workingHours")} value={request.workingHours} />
                <Field label={t("daysOff")} value={request.daysOff} />
              </div>
            </section>
            {/* TIMELINE */}
            <section className="rounded-lg border border-zinc-200 p-4 dark:border-white/10">
              <h3 className="mb-3 text-sm font-semibold text-zinc-950 dark:text-white">{t("timeline")}</h3>
              <div className="grid gap-3 md:grid-cols-3">
                <Field
                  label={t("submittedAt")}
                  value={dateTime(request.submittedAt)}
                />
                <Field
                  label={t("adminReviewedAt")}
                  value={dateTime(request.reviewedAt)}
                />
                <Field
                  label={t("status")}
                  value={localizedValue("requestStatuses", request.status)}
                />
              </div>
            </section>
            {/* ================================================= */}
            {/* STAFF SCREENING */}
            {/* ================================================= */}
            <section className="rounded-lg border border-zinc-200 p-4 dark:border-white/10">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">{t("staffScreening")}</h3>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${screeningClass(
                    screening.status,
                  )}`}
                >
                  {screeningLabel(screening.status)}
                </span>
              </div>
              {screening.status === "NOT_SCREENED" && (
                <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-400/20 dark:bg-amber-400/10">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div>
                    <p className="font-semibold text-amber-800 dark:text-amber-200">{t("notScreenedMessage")}</p>
                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">{t("adminAuthority")}</p>
                  </div>
                </div>
              )}
              {screening.status === "SCREENED" && (
                <div className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-400/20 dark:bg-emerald-400/10">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-emerald-800 dark:text-emerald-200">{t("screenedMessage")}</p>
                    <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">{t("readyForReview")}</p>
                  </div>
                </div>
              )}
              {screening.status === "NEEDS_ATTENTION" && (
                <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-400/20 dark:bg-red-400/10">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800 dark:text-red-200">{t("needsAttentionMessage")}</p>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">{t("reviewNote")}</p>
                  </div>
                </div>
              )}
              {screening.status !== "NOT_SCREENED" && (
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <Field
                    label={t("screenedBy")}
                    value={screening.screenedByStaffId}
                  />
                  <Field
                    label={t("screenedAt")}
                    value={dateTime(screening.screenedAt)}
                  />
                </div>
              )}
              {screening.note && (
                <div
                  className={`mt-3 rounded-lg border p-3 ${
                    screening.status === "NEEDS_ATTENTION"
                      ? "border-red-200 bg-red-50 dark:border-red-400/20 dark:bg-red-400/10"
                      : "border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("staffScreeningNote")}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                    {screening.note}
                  </p>
                </div>
              )}
              <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300">{t("advisory")}</div>
            </section>
            {/* ADMIN REJECTION */}
            {request.rejectionReason && (
              <section className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-400/20 dark:bg-red-400/10">
                <p className="text-xs font-medium text-red-600 dark:text-red-300">{t("adminRejectionReason")}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-red-700 dark:text-red-300">
                  {request.rejectionReason}
                </p>
              </section>
            )}
          </div>
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
    <div className="min-w-0 rounded-lg bg-zinc-50 p-3 dark:bg-white/5">
      <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-0.5 whitespace-pre-wrap break-words text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {text(value)}
      </p>
    </div>
  );
}
