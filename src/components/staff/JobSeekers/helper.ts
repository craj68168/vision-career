import type {
  AccountStatus,
  ApprovalStatus,
  PlacementStatus,
  SeekerScreeningStatus,
} from "./types";

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

export const getApprovalClass = (status: ApprovalStatus) => {
  switch (status) {
    case "approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
};

export const getAccountClass = (status: AccountStatus) => {
  switch (status) {
    case "active":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "suspended":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
  }
};

export const getPlacementLabel = (status: PlacementStatus) => {
  switch (status) {
    case "matching":
      return "Matching";

    case "interview":
      return "Interview";

    case "selected":
      return "Selected";

    case "placed":
      return "Placed";

    default:
      return "Unplaced";
  }
};

export const getScreeningLabel = (status: SeekerScreeningStatus) => {
  switch (status) {
    case "SCREENED":
      return "Screened";

    case "NEEDS_ATTENTION":
      return "Needs Attention";

    default:
      return "Not Screened";
  }
};

export const getScreeningClass = (status: SeekerScreeningStatus) => {
  switch (status) {
    case "SCREENED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
  }
};
