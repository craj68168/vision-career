import type { ProviderReviewStatus, ProviderStatus } from "./types";

// ======================================================
// ACCOUNT STATUS
// ======================================================

export const getProviderStatusClass = (status: ProviderStatus) => {
  switch (status) {
    case "active":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "suspended":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
  }
};

// ======================================================
// STAFF REVIEW
// ======================================================

export const getReviewLabel = (status: ProviderReviewStatus) => {
  switch (status) {
    case "REVIEWED":
      return "Reviewed";

    case "NEEDS_ATTENTION":
      return "Needs Attention";

    default:
      return "Not Reviewed";
  }
};

export const getReviewClass = (status: ProviderReviewStatus) => {
  switch (status) {
    case "REVIEWED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
  }
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
