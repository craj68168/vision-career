import type { VacancyStatus } from "./types";

export const getVacancyStatusLabel = (
  status: VacancyStatus,
  lang: "ja" | "en",
) => {
  const labels: Record<
    VacancyStatus,
    {
      en: string;
      ja: string;
    }
  > = {
    draft: {
      en: "Draft",
      ja: "下書き",
    },

    pending_review: {
      en: "Pending Review",
      ja: "審査待ち",
    },

    approved: {
      en: "Approved",
      ja: "承認済み",
    },

    rejected: {
      en: "Rejected",
      ja: "却下",
    },

    published: {
      en: "Published",
      ja: "公開中",
    },

    closed: {
      en: "Closed",
      ja: "終了",
    },
  };

  return labels[status][lang];
};

export const getVacancyStatusClass = (status: VacancyStatus) => {
  switch (status) {
    case "pending_review":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "approved":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "published":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";

    case "closed":
      return "border-slate-300 bg-slate-100 text-slate-700";

    case "draft":
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

export const formatVacancyDate = (
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

export const formatVacancySalary = (
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
