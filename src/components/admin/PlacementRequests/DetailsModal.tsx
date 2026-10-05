"use client";
import type { ComponentType, ReactNode } from "react";

import { useLocale, useTranslations } from "next-intl";

import {
  AlertTriangle,
  Briefcase,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  ListChecks,
  ShieldCheck,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import type {
  PlacementRequest,
  PlacementRequestScreeningStatus,
} from "./types";

type Props = {
  request: PlacementRequest;
  onClose: () => void;
};

type Tone = "sky" | "violet" | "amber" | "emerald" | "indigo" | "red";

// ======================================================
// SECTION COLORS (one light color per section)
// ======================================================

const toneClasses: Record<
  Tone,
  { border: string; header: string; chip: string; title: string; field: string }
> = {
  sky: {
    border: "border-sky-200",
    header: "bg-sky-50",
    chip: "bg-sky-100 text-sky-700",
    title: "text-sky-900",
    field: "bg-sky-50/60",
  },
  violet: {
    border: "border-violet-200",
    header: "bg-violet-50",
    chip: "bg-violet-100 text-violet-700",
    title: "text-violet-900",
    field: "bg-violet-50/60",
  },
  amber: {
    border: "border-amber-200",
    header: "bg-amber-50",
    chip: "bg-amber-100 text-amber-700",
    title: "text-amber-900",
    field: "bg-amber-50/60",
  },
  emerald: {
    border: "border-emerald-200",
    header: "bg-emerald-50",
    chip: "bg-emerald-100 text-emerald-700",
    title: "text-emerald-900",
    field: "bg-emerald-50/60",
  },
  indigo: {
    border: "border-indigo-200",
    header: "bg-indigo-50",
    chip: "bg-indigo-100 text-indigo-700",
    title: "text-indigo-900",
    field: "bg-indigo-50/60",
  },
  red: {
    border: "border-red-200",
    header: "bg-red-50",
    chip: "bg-red-100 text-red-700",
    title: "text-red-900",
    field: "bg-red-50/60",
  },
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
      return "border-emerald-200 bg-white text-emerald-700";
    case "NEEDS_ATTENTION":
      return "border-red-200 bg-white text-red-700";
    default:
      return "border-amber-200 bg-white text-amber-700";
  }
};

const screeningTone = (status: PlacementRequestScreeningStatus): Tone => {
  switch (status) {
    case "SCREENED":
      return "emerald";
    case "NEEDS_ATTENTION":
      return "red";
    default:
      return "amber";
  }
};

// Request status colors are matched by keyword so unknown values still render.
const requestStatusClass = (status?: string | null) => {
  const key = (status ?? "").toUpperCase();

  if (key.includes("REJECT")) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (key.includes("APPROV") || key.includes("ACCEPT")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (key.includes("PEND") || key.includes("REVIEW")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-zinc-200 bg-zinc-50 text-zinc-700";
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

// ======================================================
// DETAILS MODAL
// ======================================================

export default function DetailsModal({ request, onClose }: Props) {
  const t = useTranslations("placementRequestDetails");
  const locale = useLocale();
  const screening = request.staffScreening;
  const tone = screeningTone(screening.status);

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
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/50 p-3 backdrop-blur-sm sm:p-4">
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="placement-details-title"
        className="relative z-10 flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl"
      >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-4 sm:px-5">
          <div className="flex min-w-0 items-start gap-3">
            <span
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white"
            >
              <ClipboardList className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-emerald-700">
                {request.recruitId}
              </p>

              <h2
                id="placement-details-title"
                className="mt-0.5 break-words text-lg font-semibold leading-snug text-zinc-950 sm:text-xl"
              >
                {request.jobTitle}
              </h2>

              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-zinc-500">
                <Building2 className="h-4 w-4 shrink-0" />

                <span className="truncate">{request.companyName}</span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`hidden whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium sm:inline-flex ${requestStatusClass(
                request.status,
              )}`}
            >
              {localizedValue("requestStatuses", request.status)}
            </span>

            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className={`grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 ${focusRing}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto bg-zinc-50/60 p-3 sm:p-5">
          <div className="grid items-start gap-4 lg:grid-cols-2">
            {/* LEFT COLUMN */}
            <div className="min-w-0 space-y-4">
              {/* PROVIDER */}
              <Section
                title={t("providerInformation")}
                icon={Building2}
                tone="sky"
              >
                <Field tone="sky" label={t("company")} value={request.companyName} />
                <Field tone="sky" label={t("provider")} value={request.providerName} />
                <Field tone="sky" wide label={t("providerEmail")} value={request.providerEmail} />
              </Section>

              {/* JOB */}
              <Section
                title={t("jobInformation")}
                icon={Briefcase}
                tone="violet"
              >
                <Field tone="violet" wide label={t("jobTitle")} value={request.jobTitle} />
                <Field tone="violet" label={t("category")} value={request.jobCategory} />
                <Field tone="violet" label={t("employmentType")} value={localizedValue("employmentTypes", request.employmentType)} />
                <Field tone="violet" label={t("positions")} value={request.numberOfPositions} />
                <Field tone="violet" label={t("startDate")} value={request.startDate} />
                <Field tone="violet" wide label={t("workLocation")} value={request.workLocation} />
              </Section>

              {/* REQUIREMENTS */}
              <Section
                title={t("requirements")}
                icon={ListChecks}
                tone="amber"
              >
                <Field tone="amber" label={t("japaneseLevel")} value={request.japaneseLevelRequired} />
                <Field tone="amber" label={t("visaRequirement")} value={request.visaTypeRequired} />
                <Field tone="amber" wide label={t("jobDescription")} value={request.jobDescription} />
                <Field tone="amber" wide label={t("requirements")} value={request.requirements} />
              </Section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="min-w-0 space-y-4">
              {/* CONDITIONS */}
              <Section
                title={t("workConditions")}
                icon={Wallet}
                tone="emerald"
              >
                <Field
                  tone="emerald"
                  wide
                  label={t("salary")}
                  value={
                    request.salaryAmount != null
                      ? `${request.salaryAmount.toLocaleString(locale)} ${
                          request.salaryType ? localizedValue("salaryTypes", request.salaryType) : ""
                        }`
                      : localizedValue("salaryTypes", request.salaryType)
                  }
                />
                <Field tone="emerald" label={t("workingHours")} value={request.workingHours} />
                <Field tone="emerald" label={t("daysOff")} value={request.daysOff} />
              </Section>

              {/* TIMELINE */}
              <Section
                title={t("timeline")}
                icon={CalendarClock}
                tone="indigo"
              >
                <Field tone="indigo" label={t("submittedAt")} value={dateTime(request.submittedAt)} />
                <Field tone="indigo" label={t("adminReviewedAt")} value={dateTime(request.reviewedAt)} />
                <Field
                  tone="indigo"
                  wide
                  label={t("status")}
                  value={localizedValue("requestStatuses", request.status)}
                />
              </Section>

              {/* STAFF SCREENING */}
              <Section
                title={t("staffScreening")}
                icon={ShieldCheck}
                tone={tone}
                block
                action={
                  <span
                    className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${screeningClass(
                      screening.status,
                    )}`}
                  >
                    {screeningLabel(screening.status)}
                  </span>
                }
              >
                {screening.status === "NOT_SCREENED" && (
                  <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <p className="font-semibold text-amber-800">{t("notScreenedMessage")}</p>
                      <p className="mt-1 text-sm text-amber-700">{t("adminAuthority")}</p>
                    </div>
                  </div>
                )}

                {screening.status === "SCREENED" && (
                  <div className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-emerald-800">{t("screenedMessage")}</p>
                      <p className="mt-1 text-sm text-emerald-700">{t("readyForReview")}</p>
                    </div>
                  </div>
                )}

                {screening.status === "NEEDS_ATTENTION" && (
                  <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-800">{t("needsAttentionMessage")}</p>
                      <p className="mt-1 text-sm text-red-700">{t("reviewNote")}</p>
                    </div>
                  </div>
                )}

                {screening.status !== "NOT_SCREENED" && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <Field tone={tone} label={t("screenedBy")} value={screening.screenedByStaffId} />
                    <Field tone={tone} label={t("screenedAt")} value={dateTime(screening.screenedAt)} />
                  </div>
                )}

                {screening.note && (
                  <div
                    className={`mt-3 rounded-lg border p-3 ${
                      screening.status === "NEEDS_ATTENTION"
                        ? "border-red-200 bg-red-50"
                        : "border-zinc-200 bg-zinc-50"
                    }`}
                  >
                    <p className="text-xs font-medium text-zinc-500">{t("staffScreeningNote")}</p>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm text-zinc-700">
                      {screening.note}
                    </p>
                  </div>
                )}

                <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
                  {t("advisory")}
                </div>
              </Section>
            </div>
          </div>

          {/* ADMIN REJECTION */}
          {request.rejectionReason && (
            <section className="mt-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <span
                aria-hidden="true"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-red-100 text-red-700"
              >
                <XCircle className="h-4 w-4" />
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-red-900">{t("adminRejectionReason")}</p>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-red-700">
                  {request.rejectionReason}
                </p>
              </div>
            </section>
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
  tone,
  action,
  block = false,
  children,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  tone: Tone;
  action?: ReactNode;
  // block: children manage their own layout instead of the 2-column field grid
  block?: boolean;
  children: ReactNode;
}) {
  const classes = toneClasses[tone];

  return (
    <section
      className={`overflow-hidden rounded-lg border bg-white shadow-sm ${classes.border}`}
    >
      <div
        className={`flex items-center justify-between gap-3 border-b px-4 py-2.5 ${classes.border} ${classes.header}`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-md ${classes.chip}`}
          >
            <Icon className="h-4 w-4" />
          </span>

          <h3 className={`truncate text-sm font-semibold ${classes.title}`}>
            {title}
          </h3>
        </div>

        {action}
      </div>

      <div className={block ? "p-4" : "grid gap-2 p-4 sm:grid-cols-2"}>
        {children}
      </div>
    </section>
  );
}

// ======================================================
// FIELD
// ======================================================

function Field({
  label,
  value,
  tone,
  wide = false,
}: {
  label: string;
  value: string | number | null | undefined;
  tone: Tone;
  wide?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-md px-3 py-2 ${toneClasses[tone].field} ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <p className="text-[11px] font-medium text-zinc-500">{label}</p>

      <p className="mt-0.5 whitespace-pre-wrap break-words text-sm font-medium text-zinc-900">
        {text(value)}
      </p>
    </div>
  );
}