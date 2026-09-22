import type {
  CandidateStaffReviewStatus,
  PlacementCandidateStatus,
} from "./types";

// ======================================================
// PIPELINE STATUS
// ======================================================

export const getCandidateStatusLabel = (status: PlacementCandidateStatus) => {
  switch (status) {
    case "MATCHED":
      return "Matched";

    case "UNDER_REVIEW":
      return "Under Review";

    case "INTERVIEW":
      return "Interview";

    case "SELECTED":
      return "Selected";

    case "PLACED":
      return "Placed";

    case "REJECTED":
      return "Rejected";
  }
};

export const getCandidateStatusClass = (status: PlacementCandidateStatus) => {
  switch (status) {
    case "MATCHED":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";

    case "UNDER_REVIEW":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "INTERVIEW":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "SELECTED":
      return "border-violet-200 bg-violet-50 text-violet-700";

    case "PLACED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "REJECTED":
      return "border-red-200 bg-red-50 text-red-700";
  }
};

// ======================================================
// STAFF REVIEW
// ======================================================

export const getReviewLabel = (status: CandidateStaffReviewStatus) => {
  switch (status) {
    case "REVIEWED":
      return "Reviewed";

    case "NEEDS_ATTENTION":
      return "Needs Attention";

    default:
      return "Not Reviewed";
  }
};

export const getReviewClass = (status: CandidateStaffReviewStatus) => {
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
