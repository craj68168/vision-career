import type { TrainingFileType, TrainingStatus } from "./types";

// ======================================================
// STATUS
// ======================================================

export const getTrainingStatusLabel = (
  status: TrainingStatus,
  lang: string,
) => {
  if (status === "active") {
    return {
      label: lang === "ja" ? "有効" : "Active",

      color: "bg-emerald-50 text-emerald-700 border-emerald-200",

      darkColor:
        "dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    };
  }

  return {
    label: lang === "ja" ? "無効" : "Inactive",

    color: "bg-slate-100 text-slate-600 border-slate-200",

    darkColor: "dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  };
};

// ======================================================
// DATE
// ======================================================

export const formatTrainingDate = (dateString: string, lang: string) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleString(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",

    month: "short",

    day: "numeric",

    hour: "2-digit",

    minute: "2-digit",
  });
};

// ======================================================
// FILE SIZE
// ======================================================

export const formatTrainingFileSize = (bytes: number | null) => {
  if (bytes === null || bytes === undefined) {
    return "-";
  }

  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),

    units.length - 1,
  );

  return `${(bytes / 1024 ** index).toFixed(2)} ${units[index]}`;
};

// ======================================================
// FILE TYPE LABEL
// ======================================================

export const getTrainingFileTypeLabel = (
  fileType: TrainingFileType,
  lang: string,
) => {
  const labels: Record<
    TrainingFileType,
    {
      en: string;

      ja: string;
    }
  > = {
    pdf: {
      en: "PDF",

      ja: "PDF",
    },

    video: {
      en: "Video",

      ja: "動画",
    },

    image: {
      en: "Image",

      ja: "画像",
    },

    doc: {
      en: "Document",

      ja: "ドキュメント",
    },

    excel: {
      en: "Spreadsheet",

      ja: "スプレッドシート",
    },

    ppt: {
      en: "Presentation",

      ja: "プレゼンテーション",
    },

    link: {
      en: "Link",

      ja: "リンク",
    },

    other: {
      en: "Other",

      ja: "その他",
    },
  };

  return lang === "ja" ? labels[fileType].ja : labels[fileType].en;
};
