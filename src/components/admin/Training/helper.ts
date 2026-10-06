import { createTranslator } from "next-intl";

import enMessages from "../../../../messages/en.json";
import jaMessages from "../../../../messages/ja.json";

import type { TrainingFileType, TrainingStatus } from "./types";

// ======================================================
// TRANSLATOR
// ======================================================

const translator = (lang: string) => {
  const locale = lang.startsWith("ja") ? "ja" : "en";

  return createTranslator({
    locale,
    messages: locale === "ja" ? jaMessages : enMessages,
    namespace: "adminTraining",
  });
};

// ======================================================
// STATUS
// ======================================================

export const getTrainingStatusLabel = (
  status: TrainingStatus,
  lang: string,
) => {
  const t = translator(lang);

  if (status === "active") {
    return {
      label: t("active"),

      color: "bg-emerald-50 text-emerald-700 border-emerald-200",

      darkColor:
        "dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    };
  }

  return {
    label: t("inactive"),

    color: "bg-slate-100 text-slate-600 border-slate-200",

    darkColor: "dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  };
};

// ======================================================
// DATE
// ======================================================

export const formatTrainingDate = (
  dateString: string,
  lang: string,
) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleString(
    lang.startsWith("ja") ? "ja-JP" : "en-US",
    {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
};

// ======================================================
// FILE SIZE
// ======================================================

export const formatTrainingFileSize = (
  bytes: number | null,
  lang = "en",
) => {
  if (
    bytes === null ||
    bytes === undefined ||
    !Number.isFinite(bytes) ||
    bytes < 0
  ) {
    return "-";
  }

  const t = translator(lang);

  if (bytes === 0) {
    return `0 ${t("units.B")}`;
  }

  const units = ["B", "KB", "MB", "GB"] as const;

  const index = Math.max(
    0,
    Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1,
    ),
  );

  const amount = new Intl.NumberFormat(
    lang.startsWith("ja") ? "ja-JP" : "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(bytes / 1024 ** index);

  return `${amount} ${t(`units.${units[index]}`)}`;
};

// ======================================================
// FILE TYPE LABEL
// ======================================================

export const getTrainingFileTypeLabel = (
  fileType: TrainingFileType,
  lang: string,
) => {
  const t = translator(lang);

  return t(`fileTypes.${fileType}`);
};