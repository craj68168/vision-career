import dayjs from "dayjs";

export const formatDateForInput = (value?: string | null): string => {
  if (!value) return "";

  const date = dayjs.utc(value);

  if (!date.isValid()) {
    return "";
  }

  return date.format("YYYY-MM-DD");
};
