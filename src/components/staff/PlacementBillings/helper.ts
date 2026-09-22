import type { PlacementBillingStatus } from "./types";

// ======================================================
// MONEY
// ======================================================

export const formatMoney = (value: number, currency = "JPY") => {
  if (currency === "JPY") {
    return `¥${Number(value || 0).toLocaleString()}`;
  }

  return `${currency} ${Number(value || 0).toLocaleString()}`;
};

// ======================================================
// DATE
// ======================================================

export const formatBillingDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString();
};

export const formatBillingDateTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
};

// ======================================================
// STATUS
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
  }
};
