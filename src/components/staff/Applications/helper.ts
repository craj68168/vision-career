import type { StaffApplicationStatus, StaffScreeningStatus } from "./types";

// ======================================================
// APPLICATION STATUS LABEL
// ======================================================

export const getApplicationStatusLabel = (status: StaffApplicationStatus) => {
  const labels: Record<StaffApplicationStatus, string> = {
    PENDING_ADMIN_APPROVAL: "Pending Admin Approval",

    ADMIN_REJECTED: "Admin Rejected",

    SENT_TO_PROVIDER: "Sent to Provider",

    UNDER_REVIEW: "Under Review",

    INTERVIEW: "Interview",

    SELECTED: "Selected",

    HIRED: "Hired",

    REJECTED: "Provider Rejected",
  };

  return labels[status];
};

// ======================================================
// APPLICATION STATUS CLASS
// ======================================================

export const getApplicationStatusClass = (status: StaffApplicationStatus) => {
  switch (status) {
    case "PENDING_ADMIN_APPROVAL":
      return "bg-amber-50 text-amber-700";

    case "ADMIN_REJECTED":
    case "REJECTED":
      return "bg-red-50 text-red-700";

    case "HIRED":
      return "bg-emerald-50 text-emerald-700";

    case "SELECTED":
      return "bg-green-50 text-green-700";

    case "INTERVIEW":
      return "bg-purple-50 text-purple-700";

    case "UNDER_REVIEW":
      return "bg-blue-50 text-blue-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
};

// ======================================================
// SCREENING
// ======================================================

export const getScreeningLabel = (status: StaffScreeningStatus) => {
  const labels: Record<StaffScreeningStatus, string> = {
    NOT_SCREENED: "Not Screened",

    SCREENED: "Screened",

    NEEDS_ATTENTION: "Needs Attention",
  };

  return labels[status];
};

export const getScreeningClass = (status: StaffScreeningStatus) => {
  switch (status) {
    case "SCREENED":
      return "bg-emerald-50 text-emerald-700";

    case "NEEDS_ATTENTION":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
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
