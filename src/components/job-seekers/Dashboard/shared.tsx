import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import type { SeekerInterviewMethod, SeekerInterviewStatus } from "./types";

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";
export const btnBase = `inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-3.5 py-2 text-[13px] font-semibold transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55 ${focusRing}`;
export const btnPrimary = `${btnBase} bg-emerald-700 text-white hover:bg-emerald-800`;
export const btnSecondary = `${btnBase} border border-slate-200 bg-white text-emerald-950 hover:border-slate-300 hover:bg-slate-100`;
export const card =
  "flex min-w-0 flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition motion-safe:hover:-translate-y-px hover:border-slate-300 hover:shadow-md";
export const labelCaps =
  "text-[10px] font-medium uppercase tracking-wider text-slate-500";
export const wrap = "[overflow-wrap:anywhere]";
export const badgePrimary =
  "rounded-full bg-emerald-700 px-2 py-0.5 text-[11px] font-medium text-white";
export const badgeNeutral =
  "rounded-full border border-slate-200 bg-[oklch(0.975_0.008_150)] px-2 py-0.5 text-[11px] font-medium text-slate-600";

const pill = "h-fit shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium";

export function InlineInfo({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className={`inline-flex min-w-0 items-center gap-1.5 ${wrap}`}>
      <span aria-hidden className="shrink-0 text-slate-400">
        {icon}
      </span>
      {children}
    </span>
  );
}

export function InfoGrid({
  children,
  cols = 2,
}: {
  children: ReactNode;
  cols?: 2 | 3;
}) {
  return (
    <dl
      className={`mt-3.5 grid gap-x-3 gap-y-2.5 border-y border-slate-100 py-3 ${
        cols === 3 ? "grid-cols-3" : "grid-cols-2"
      }`}
    >
      {children}
    </dl>
  );
}

export function JobInfo({
  label,
  value,
  icon,
  highlight = false,
  className = "",
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="flex items-center gap-1 text-slate-500 [&>svg]:h-3 [&>svg]:w-3">
        <span className={labelCaps}>{label}</span>
        {icon}
      </dt>
      <dd
        className={`mt-0.5 text-[13px] font-medium ${wrap} ${
          highlight ? "text-emerald-800" : ""
        }`}
      >
        {value || "-"}
      </dd>
    </div>
  );
}

export function ApplicationStatusBadge({ status }: { status: string }) {
  const t = useTranslations("jobSeeker.dashboard");
  const normalized = status.toUpperCase();
  let classes = "bg-slate-100 text-slate-700";

  if (
    normalized === "PENDING_ADMIN_APPROVAL" ||
    normalized === "UNDER_REVIEW"
  ) {
    classes = "bg-amber-50 text-amber-800";
  }

  if (normalized === "SENT_TO_PROVIDER" || normalized === "INTERVIEW") {
    classes = "bg-emerald-50 text-emerald-800";
  }

  if (normalized === "SELECTED" || normalized === "HIRED") {
    classes = "bg-emerald-100 text-emerald-900";
  }

  if (normalized === "ADMIN_REJECTED" || normalized === "REJECTED") {
    classes = "bg-red-50 text-red-800";
  }

  return (
    <span className={`${pill} ${classes}`}>
      {formatApplicationStatus(status, t)}
    </span>
  );
}

export function InterviewStatusBadge({
  status,
}: {
  status: SeekerInterviewStatus;
}) {
  const t = useTranslations("jobSeeker.dashboard");
  let classes = "bg-slate-100 text-slate-700";

  if (status === "CONFIRMED") {
    classes = "bg-emerald-50 text-emerald-800";
  }

  if (status === "COMPLETED") {
    classes = "bg-sky-50 text-sky-800";
  }

  if (status === "CANCELLED") {
    classes = "bg-red-50 text-red-800";
  }

  const label =
    status === "CONFIRMED"
      ? t("statusConfirmed")
      : status === "COMPLETED"
        ? t("statusCompleted")
        : t("statusCancelled");

  return <span className={`${pill} ${classes}`}>{label}</span>;
}

export function formatInterviewMethod(
  method: SeekerInterviewMethod,
  t: ReturnType<typeof useTranslations>,
) {
  if (method === "ZOOM") {
    return "Zoom";
  }

  if (method === "GOOGLE_MEET") {
    return "Google Meet";
  }

  if (method === "PHONE") {
    return t("methodPhone");
  }

  if (method === "FACE_TO_FACE") {
    return t("methodFaceToFace");
  }

  return t("methodOther");
}

export function formatApplicationStatus(
  status: string,
  t: ReturnType<typeof useTranslations>,
) {
  const labels: Record<string, string> = {
    PENDING_ADMIN_APPROVAL: t("applicationStatusPendingAdminApproval"),
    ADMIN_REJECTED: t("applicationStatusAdminRejected"),
    SENT_TO_PROVIDER: t("applicationStatusSentToProvider"),
    UNDER_REVIEW: t("applicationStatusUnderReview"),
    INTERVIEW: t("applicationStatusInterview"),
    SELECTED: t("applicationStatusSelected"),
    HIRED: t("applicationStatusHired"),
    REJECTED: t("applicationStatusRejected"),
  };

  return labels[status.toUpperCase()] || status;
}

export function formatSalary(
  minimum?: number | null,
  maximum?: number | null,
  unit = "",
) {
  if (minimum == null && maximum == null) {
    return "-";
  }

  if (minimum != null && maximum != null) {
    return `${minimum} ~ ${maximum} ${unit}`;
  }

  if (minimum != null) {
    return `${minimum} ${unit}~`;
  }

  return `~ ${maximum} ${unit}`;
}

export function formatDate(value?: string | null, lang?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getDateKeyInTimezone(date: Date, timezone?: string | null) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone || undefined,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);

    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;

    if (year && month && day) {
      return `${year}-${month}-${day}`;
    }
  } catch {
    // Fall back to local date when the API sends a non-IANA timezone label.
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getInterviewDateKey(value?: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  const dateOnlyMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);

  if (dateOnlyMatch) {
    return dateOnlyMatch[1];
  }

  const date = new Date(trimmed);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return getDateKeyInTimezone(date);
}

export function isInterviewDatePast(
  interviewDate?: string | null,
  timezone?: string | null,
) {
  const interviewDateKey = getInterviewDateKey(interviewDate);

  if (!interviewDateKey) {
    return false;
  }

  return interviewDateKey < getDateKeyInTimezone(new Date(), timezone);
}
