import type { PlacementBillingStatus } from "./types";

// ======================================================
// LOCALE
// ======================================================

const resolveLocale = (locale?: string) => {
  if (locale?.toLowerCase().startsWith("ja")) {
    return "ja-JP";
  }

  return "en-US";
};

// ======================================================
// MONEY
// ======================================================

export const formatMoney = (
  value: number,
  currency = "JPY",
  locale?: string,
) => {
  const amount = Number(value || 0);

  const resolvedLocale = resolveLocale(locale);

  if (currency === "JPY") {
    return `¥${Math.round(amount).toLocaleString(resolvedLocale)}`;
  }

  return `${currency} ${amount.toLocaleString(resolvedLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// ======================================================
// DATE
// ======================================================

export const formatBillingDate = (value?: string | null, locale?: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(resolveLocale(locale), {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatBillingDateTime = (
  value?: string | null,
  locale?: string,
) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString(resolveLocale(locale), {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ======================================================
// STATUS
//
// Label helper remains for compatibility.
// Translated UI should use next-intl.
// ======================================================

export const getBillingStatusLabel = (status: PlacementBillingStatus) => {
  switch (status) {
    case "draft":
      return "Draft";

    case "issued":
      return "Issued";

    case "paid":
      return "Paid";

    case "partially_refunded":
      return "Partially Refunded";

    case "refunded":
      return "Refunded";

    case "cancelled":
      return "Cancelled";

    default:
      return status;
  }
};

export const getBillingStatusClass = (status: PlacementBillingStatus) => {
  switch (status) {
    case "draft":
      return "bg-slate-100 text-slate-700";

    case "issued":
      return "bg-blue-50 text-blue-700";

    case "paid":
      return "bg-emerald-50 text-emerald-700";

    case "partially_refunded":
      return "bg-amber-50 text-amber-700";

    case "refunded":
      return "bg-red-50 text-red-700";

    case "cancelled":
      return "bg-slate-100 text-slate-500";

    default:
      return "bg-slate-100 text-slate-600";
  }
};
