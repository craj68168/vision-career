"use client";

import { CalendarDays, MapPin, X } from "lucide-react";
import { useTranslations } from "next-intl";

import type { PlacementRequest, PlacementRequestStatus } from "./types";

type Props = {
  open: boolean;
  request: PlacementRequest | null;
  onClose: () => void;
  lang: string;
};

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

export default function PlacementRequestDetailsModal({
  open,
  request,
  onClose,
  lang,
}: Props) {
  const t = useTranslations("provider.placementRequests.details");
  const statusT = useTranslations("provider.placementRequests.list.statuses");

  if (!open || !request) {
    return null;
  }

  const formatDateTime = (value: string) =>
    new Date(value).toLocaleString(lang === "ja" ? "ja-JP" : "en-US");

  const statusKey = request.status.toLowerCase().replaceAll("_", "");

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className="absolute inset-0"
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
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
          <div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                request.status,
              )}`}
            >
              {statusT(statusKey)}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label={t("fields.jobCategory")}
              value={request.job_category}
            />
            <Field
              label={t("fields.employmentType")}
              value={request.employment_type}
            />
            <Field
              label={t("fields.numberOfPositions")}
              value={request.number_of_positions}
            />
            <Field
              label={t("fields.workLocation")}
              value={request.work_location}
            />
            <Field
              label={t("fields.japaneseLevel")}
              value={request.japanese_level_required}
            />
            <Field
              label={t("fields.visaRequirement")}
              value={request.visa_type_required}
            />
            <Field label={t("fields.salaryType")} value={request.salary_type} />
            <Field
              label={t("fields.salaryAmount")}
              value={request.salary_amount}
            />
            <Field
              label={t("fields.workingHours")}
              value={request.working_hours}
            />
            <Field label={t("fields.daysOff")} value={request.days_off} />
            <Field label={t("fields.startDate")} value={request.start_date} />
          </div>

          <Section title={t("sections.jobDescription")}>
            {request.job_description || "-"}
          </Section>

          <Section title={t("sections.requirements")}>
            {request.requirements || "-"}
          </Section>

          {request.status === "rejected" && request.rejection_reason && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-semibold text-red-700">
                {t("rejectionReason")}
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">
                {request.rejection_reason}
              </p>
            </div>
          )}

          {request.submitted_at && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CalendarDays className="h-4 w-4" />
              <span>
                {t("submitted")}: {formatDateTime(request.submitted_at)}
              </span>
            </div>
          )}

          {request.reviewed_at && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CalendarDays className="h-4 w-4" />
              <span>
                {t("reviewed")}: {formatDateTime(request.reviewed_at)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
