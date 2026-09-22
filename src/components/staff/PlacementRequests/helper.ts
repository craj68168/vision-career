import type {
  PlacementRequestScreeningStatus,
  PlacementRequestStatus,
} from "./types";

// ======================================================
// REQUEST STATUS
// ======================================================

export const getRequestStatusLabel = (status: PlacementRequestStatus) => {
  switch (status) {
    case "pending_review":
      return "Pending Review";

    case "approved":
      return "Approved";

    case "rejected":
      return "Rejected";

    default:
      return "Draft";
  }
};

export const getRequestStatusClass = (status: PlacementRequestStatus) => {
  switch (status) {
    case "pending_review":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
  }
};

// ======================================================
// SCREENING
// ======================================================

export const getScreeningLabel = (status: PlacementRequestScreeningStatus) => {
  switch (status) {
    case "SCREENED":
      return "Screened";

    case "NEEDS_ATTENTION":
      return "Needs Attention";

    default:
      return "Not Screened";
  }
};

export const getScreeningClass = (status: PlacementRequestScreeningStatus) => {
  switch (status) {
    case "SCREENED":
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
    return value;
  }

  return date.toLocaleDateString();
};

export const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

// ======================================================
// SALARY
// ======================================================

export const formatSalary = (amount: number, type: string) => {
  if (!amount && !type) {
    return "-";
  }

  if (!amount) {
    return type || "-";
  }

  return `${amount.toLocaleString()}${type ? ` ${type}` : ""}`;
};
