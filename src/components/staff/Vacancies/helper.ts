import type { StaffVacancyScreeningStatus, StaffVacancyStatus } from "./types";

// ======================================================
// VACANCY STATUS
// ======================================================

export const getVacancyStatusLabel = (status: StaffVacancyStatus) => {
  const labels: Record<StaffVacancyStatus, string> = {
    draft: "Draft",

    pending_review: "Pending Review",

    approved: "Approved",

    rejected: "Rejected",

    published: "Published",

    closed: "Closed",
  };

  return labels[status];
};

export const getVacancyStatusClass = (status: StaffVacancyStatus) => {
  switch (status) {
    case "pending_review":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "approved":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "published":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";

    case "closed":
      return "bg-slate-100 text-slate-600 border-slate-200";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

// ======================================================
// SCREENING
// ======================================================

export const getScreeningLabel = (status: StaffVacancyScreeningStatus) => {
  const labels: Record<StaffVacancyScreeningStatus, string> = {
    NOT_SCREENED: "Not Screened",

    SCREENED: "Screened",

    NEEDS_ATTENTION: "Needs Attention",
  };

  return labels[status];
};

export const getScreeningClass = (status: StaffVacancyScreeningStatus) => {
  switch (status) {
    case "SCREENED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "NEEDS_ATTENTION":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

// ======================================================
// MONEY
// ======================================================

export const formatSalary = (min?: number | null, max?: number | null) => {
  if (min == null && max == null) {
    return "-";
  }

  if (min != null && max != null) {
    return `¥${min.toLocaleString()} - ¥${max.toLocaleString()}`;
  }

  if (min != null) {
    return `¥${min.toLocaleString()}+`;
  }

  return `Up to ¥${Number(max).toLocaleString()}`;
};

// ======================================================
// DATE
// ======================================================

export const formatDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString();
};

export const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
};
