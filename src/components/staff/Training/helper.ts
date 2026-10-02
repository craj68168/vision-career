import type { StaffTrainingFileType } from "./types";

export const formatStaffTrainingDate = (
  value?: string | null,
  lang: string = "en",
) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatStaffTrainingFileSize = (bytes?: number | null) => {
  if (bytes === null || bytes === undefined) return "-";

  if (!Number.isFinite(bytes) || bytes < 0) return "-";

  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];

  const index = Math.max(
    0,
    Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1,
    ),
  );

  return `${(bytes / 1024 ** index).toFixed(2)} ${units[index]}`;
};

export const getStaffTrainingFileTypeLabel = (
  type: StaffTrainingFileType,
  lang: string = "en",
) => {
  const labels: Record<
    StaffTrainingFileType,
    { ja: string; en: string }
  > = {
    pdf: { ja: "PDF", en: "PDF" },
    video: { ja: "動画", en: "Video" },
    image: { ja: "画像", en: "Image" },
    doc: { ja: "文書", en: "Document" },
    excel: { ja: "スプレッドシート", en: "Spreadsheet" },
    ppt: { ja: "プレゼンテーション", en: "Presentation" },
    other: { ja: "その他", en: "Other" },
  };

  return labels[type][lang === "ja" ? "ja" : "en"];
};