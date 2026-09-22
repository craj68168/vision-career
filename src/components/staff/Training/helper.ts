import type { StaffTrainingFileType } from "./types";

// ======================================================
// DATE
// ======================================================

export const formatStaffTrainingDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",

    month: "short",

    day: "numeric",
  });
};

// ======================================================
// FILE SIZE
// ======================================================

export const formatStaffTrainingFileSize = (bytes?: number | null) => {
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

export const getStaffTrainingFileTypeLabel = (type: StaffTrainingFileType) => {
  const labels: Record<StaffTrainingFileType, string> = {
    pdf: "PDF",

    video: "Video",

    image: "Image",

    doc: "Document",

    excel: "Spreadsheet",

    ppt: "Presentation",

    other: "Other",
  };

  return labels[type];
};
