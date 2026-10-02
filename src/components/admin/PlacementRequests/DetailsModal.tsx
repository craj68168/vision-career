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
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
};
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
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              {request.recruitId}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {request.jobTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{request.companyName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* CONTENT */}
        <div className="overflow-y-auto p-6">
          <div className="space-y-7">
            {/* PROVIDER */}
            <section>
              <h3 className="mb-4 text-lg font-bold">{t("providerInformation")}</h3>
              <div className="grid gap-3 md:grid-cols-3">
                <Field label={t("company")} value={request.companyName} />
                <Field label={t("provider")} value={request.providerName} />
                <Field label={t("providerEmail")} value={request.providerEmail} />
              </div>
            </section>
            {/* JOB */}
            <section>
              <h3 className="mb-4 text-lg font-bold">{t("jobInformation")}</h3>
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
            <section>
              <h3 className="mb-4 text-lg font-bold">{t("requirements")}</h3>
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
            <section>
              <h3 className="mb-4 text-lg font-bold">{t("workConditions")}</h3>
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
            <section>
              <h3 className="mb-4 text-lg font-bold">{t("timeline")}</h3>
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
            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-bold">{t("staffScreening")}</h3>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${screeningClass(
                    screening.status,
                  )}`}
                >
                  {screeningLabel(screening.status)}
                </span>
              </div>
              {screening.status === "NOT_SCREENED" && (
                <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div>
                    <p className="font-semibold text-amber-800">{t("notScreenedMessage")}</p>
                    <p className="mt-1 text-sm text-amber-700">{t("adminAuthority")}</p>
                  </div>
                </div>
              )}
              {screening.status === "SCREENED" && (
                <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-emerald-800">{t("screenedMessage")}</p>
                    <p className="mt-1 text-sm text-emerald-700">{t("readyForReview")}</p>
                  </div>
                </div>
              )}
              {screening.status === "NEEDS_ATTENTION" && (
                <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800">{t("needsAttentionMessage")}</p>
                    <p className="mt-1 text-sm text-red-700">{t("reviewNote")}</p>
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
                  className={`mt-3 rounded-2xl border p-4 ${
                    screening.status === "NEEDS_ATTENTION"
                      ? "border-red-200 bg-red-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("staffScreeningNote")}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                    {screening.note}
                  </p>
                </div>
              )}
              <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">{t("advisory")}</div>
            </section>
            {/* ADMIN REJECTION */}
            {request.rejectionReason && (
              <section className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-600">{t("adminRejectionReason")}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">
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
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-wrap break-words text-sm font-medium text-slate-900">
        {text(value)}
      </p>
    </div>
  );
}
