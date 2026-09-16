import type { ApplicationStatus } from "./types";

export const formatApplicationDate = (
  value?: string | null,
  lang: "ja" | "en" = "en",
) => {
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
};

export const formatSalary = (
  minimum?: number | null,
  maximum?: number | null,
) => {
  if (minimum == null && maximum == null) {
    return "-";
  }

  if (minimum != null && maximum != null) {
    return `${minimum} ~ ${maximum} 万円`;
  }

  return `${minimum ?? maximum} 万円`;
};

export const getApplicationStatusLabel = (
  status: ApplicationStatus,
  lang: "ja" | "en",
) => {
  const labels: Record<
    ApplicationStatus,
    {
      en: string;
      ja: string;
    }
  > = {
    PENDING_ADMIN_APPROVAL: {
      en: "Pending Admin Approval",
      ja: "管理者承認待ち",
    },

    ADMIN_REJECTED: {
      en: "Admin Rejected",
      ja: "管理者却下",
    },

    SENT_TO_PROVIDER: {
      en: "Sent to Provider",
      ja: "企業へ送信済み",
    },

    UNDER_REVIEW: {
      en: "Under Review",
      ja: "企業審査中",
    },

    INTERVIEW: {
      en: "Interview",
      ja: "面接",
    },

    SELECTED: {
      en: "Selected",
      ja: "選考通過",
    },

    HIRED: {
      en: "Hired",
      ja: "採用",
    },

    REJECTED: {
      en: "Rejected",
      ja: "不採用",
    },
  };

  return labels[status][lang];
};

export const getApplicationStatusClass = (status: ApplicationStatus) => {
  switch (status) {
    case "PENDING_ADMIN_APPROVAL":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "SENT_TO_PROVIDER":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "UNDER_REVIEW":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";

    case "INTERVIEW":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "SELECTED":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";

    case "HIRED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "ADMIN_REJECTED":
    case "REJECTED":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};
