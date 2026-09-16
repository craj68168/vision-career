"use client";

import { useState, useMemo } from "react";
import axiosInstance from "@/services/axiosInstance";
import {
  Search,
  RefreshCw,
  AlertTriangle,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Loader2,
  FileEdit,
  Printer,
  Send,
  CreditCard,
  Receipt,
  AlertCircle,
  Download,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import useDebounced from "@/hooks/useDebounced";
import {
  usePlacementBillingsWithPagination,
  PlacementBilling,
  BillingStatus,
  PaymentStatus,
  SortableColumns,
  SortOrder,
} from "@/hooks/usePlacementBillings";
import toast from "react-hot-toast";
import { BillingDetailsModal } from "./BillingDetailsModal";
import { BillingEditModal } from "./BillingEditModal";
import Pagination from "@/components/layout/Pagination";

// Status configurations
export const BILLING_STATUS_CONFIG: Record<
  BillingStatus,
  {
    label: { en: string; ja: string };
    color: string;
    darkColor: string;
    icon: React.ReactNode;
  }
> = {
  draft: {
    label: { en: "Draft", ja: "下書き" },
    color: "bg-slate-100 text-slate-700 border-slate-200",
    darkColor: "dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    icon: <FileEdit className="h-3.5 w-3.5" />,
  },
  issued: {
    label: { en: "Issued", ja: "発行済み" },
    color: "bg-blue-100 text-blue-700 border-blue-200",
    darkColor: "dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    icon: <FileText className="h-3.5 w-3.5" />,
  },
  sent: {
    label: { en: "Sent", ja: "送信済み" },
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    darkColor:
      "dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
    icon: <Send className="h-3.5 w-3.5" />,
  },
  paid: {
    label: { en: "Paid", ja: "支払済み" },
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    darkColor:
      "dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  overdue: {
    label: { en: "Overdue", ja: "期限切れ" },
    color: "bg-rose-100 text-rose-700 border-rose-200",
    darkColor: "dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
  },
  cancelled: {
    label: { en: "Cancelled", ja: "キャンセル" },
    color: "bg-gray-100 text-gray-700 border-gray-200",
    darkColor: "dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  refunded: {
    label: { en: "Refunded", ja: "返金済み" },
    color: "bg-purple-100 text-purple-700 border-purple-200",
    darkColor:
      "dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    icon: <Receipt className="h-3.5 w-3.5" />,
  },
};

export const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  {
    label: { en: string; ja: string };
    color: string;
    darkColor: string;
    icon: React.ReactNode;
  }
> = {
  not_invoiced: {
    label: { en: "Not Invoiced", ja: "未請求" },
    color: "bg-slate-100 text-slate-700 border-slate-200",
    darkColor: "dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  invoiced: {
    label: { en: "Invoiced", ja: "請求済み" },
    color: "bg-blue-100 text-blue-700 border-blue-200",
    darkColor: "dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    icon: <FileText className="h-3.5 w-3.5" />,
  },
  partial: {
    label: { en: "Partial", ja: "一部支払い" },
    color: "bg-amber-100 text-amber-700 border-amber-200",
    darkColor: "dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    icon: <CreditCard className="h-3.5 w-3.5" />,
  },
  paid: {
    label: { en: "Paid", ja: "支払済み" },
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    darkColor:
      "dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  overdue: {
    label: { en: "Overdue", ja: "期限切れ" },
    color: "bg-rose-100 text-rose-700 border-rose-200",
    darkColor: "dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
  },
  cancelled: {
    label: { en: "Cancelled", ja: "キャンセル" },
    color: "bg-gray-100 text-gray-700 border-gray-200",
    darkColor: "dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  refunded: {
    label: { en: "Refunded", ja: "返金済み" },
    color: "bg-purple-100 text-purple-700 border-purple-200",
    darkColor:
      "dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    icon: <Receipt className="h-3.5 w-3.5" />,
  },
};

export const SORTABLE_COLUMNS: {
  value: SortableColumns;
  label: { en: string; ja: string };
}[] = [
  { value: "created_at", label: { en: "Created At", ja: "作成日" } },
  { value: "updated_at", label: { en: "Updated At", ja: "更新日" } },
  {
    value: "invoice_number",
    label: { en: "Invoice Number", ja: "請求書番号" },
  },
  {
    value: "billing_status",
    label: { en: "Billing Status", ja: "請求ステータス" },
  },
  { value: "issue_date", label: { en: "Issue Date", ja: "発行日" } },
  { value: "due_date", label: { en: "Due Date", ja: "支払期限" } },
  { value: "paid_date", label: { en: "Paid Date", ja: "支払日" } },
  { value: "total_amount", label: { en: "Total Amount", ja: "合計金額" } },
  { value: "company_name", label: { en: "Company Name", ja: "企業名" } },
  { value: "candidate_name", label: { en: "Candidate Name", ja: "候補者名" } },
  { value: "job_title", label: { en: "Job Title", ja: "求人タイトル" } },
  { value: "placement_date", label: { en: "Placement Date", ja: "配置日" } },
  { value: "joining_date", label: { en: "Joining Date", ja: "入社日" } },
];

export const formatCurrency = (amount: number, currency?: string | null) => {
  if (!amount && amount !== 0) return "-";
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "¥";
  return `${symbol}${amount.toLocaleString()}`;
};

export const formatDate = (lang: string, date?: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function AdminPlacementBillingsPage() {
  const { lang } = useLanguage();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [billingStatusFilter, setBillingStatusFilter] = useState<
    BillingStatus | ""
  >("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    PaymentStatus | ""
  >("");
  const [sortBy, setSortBy] = useState<SortableColumns>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedBilling, setSelectedBilling] =
    useState<PlacementBilling | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBillingForEdit, setSelectedBillingForEdit] =
    useState<PlacementBilling | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sendingInvoice, setSendingInvoice] = useState<number | null>(null);

  const handleUpdateBilling = (billing: PlacementBilling) => {
    setSelectedBillingForEdit(billing);
    setShowEditModal(true);
  };

  const handleEditSuccess = (updatedBilling: PlacementBilling) => {
    setSelectedBillingForEdit(updatedBilling);
    refetch();
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  const {
    data: response,
    isLoading,
    isFetching,
    error,
    refetch,
    billings,
    pagination,
    admin,
    appliedFilters,
    pageControls,
  } = usePlacementBillingsWithPagination(page, limit, {
    keyword: debouncedSearch || undefined,
    billing_status: billingStatusFilter || undefined,
    payment_status: paymentStatusFilter || undefined,
    sort_by: sortBy || undefined,
    sort_order: sortOrder || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
  });

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    billings.forEach((billing) => {
      if (billing.billing_status) {
        counts[billing.billing_status] =
          (counts[billing.billing_status] || 0) + 1;
      }
    });
    return counts;
  }, [billings]);

  const paymentStatusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    billings.forEach((billing) => {
      if (billing.payment_status) {
        counts[billing.payment_status] =
          (counts[billing.payment_status] || 0) + 1;
      }
    });
    return counts;
  }, [billings]);

  const getBillingStatusBadge = (status: BillingStatus | null) => {
    if (!status) return null;
    const config = BILLING_STATUS_CONFIG[status];
    if (!config) return null;
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.color} ${config.darkColor}`}
      >
        {config.icon}
        {config.label[lang]}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: PaymentStatus | null) => {
    if (!status) return null;
    const config = PAYMENT_STATUS_CONFIG[status];
    if (!config) return null;
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.color} ${config.darkColor}`}
      >
        {config.icon}
        {config.label[lang]}
      </span>
    );
  };

  const handleSortChange = (column: SortableColumns) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const handleViewDetails = (billing: PlacementBilling) => {
    setSelectedBilling(billing);
    setShowDetailsModal(true);
  };

  const handleEditBilling = (billing: PlacementBilling) => {
    setShowDetailsModal(false);
    router.push(`/admin/placement-billings/${billing.billing_id}/edit`);
  };

  const handleSendBilling = (billing: PlacementBilling) => {
    toast.success(
      lang === "ja" ? "請求書を送信しました" : "Invoice sent successfully",
    );
    setShowDetailsModal(false);
  };

  const handlePrintBilling = (billing: PlacementBilling) => {
    toast.success(
      lang === "ja" ? "請求書を印刷しています..." : "Printing invoice...",
    );
  };

  const handleDownloadBilling = (billing: PlacementBilling) => {
    toast.success(
      lang === "ja"
        ? "請求書をダウンロードしています..."
        : "Downloading invoice...",
    );
  };

  const handleDownloadInvoice = async (invoiceData: any) => {
    try {
      const loadingToast = toast.loading(
        lang === "ja" ? "請求書を生成中..." : "Generating invoice...",
      );

      const { pdf } = await import("@react-pdf/renderer");
      const { InvoicePDF } = await import("@/components/layout/InvoicePDF");

      const doc = <InvoicePDF data={invoiceData} />;

      const blob = await pdf(doc).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoiceData.invoice_number || "download"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      toast.dismiss(loadingToast);
      toast.success(
        lang === "ja"
          ? "請求書をダウンロードしました"
          : "Invoice downloaded successfully",
      );
    } catch (error) {
      console.error("Error generating invoice PDF:", error);
      toast.error(
        lang === "ja"
          ? "請求書の生成に失敗しました"
          : "Failed to generate invoice",
      );
    }
  };

  const handleSendInvoice = async (billing: PlacementBilling) => {
    try {
      setSendingInvoice(billing.billing_id);
      const token = localStorage.getItem("admin_token");

      if (token) {
        router.replace("/admin");
      }
      const res = await fetch(
        "https://vision-career.co.jp/admin-send-placement-billing.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ billing_id: billing.billing_id }),
        },
      );

      if (!res.ok && res.status !== 200) {
        const data = await res.json();
        toast.error(data.message || "Failed to send invoice");
        return;
      }

      toast.success(
        lang === "ja" ? "請求書を送信しました" : "Invoice sent successfully",
      );
      refetch();
    } catch (error) {
      console.log("Error while sending invoice: ", error);
      toast.error(
        lang === "ja" ? "請求書の送信に失敗しました" : "Failed to send invoice",
      );
    } finally {
      setSendingInvoice(null);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-slate-400 dark:text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {lang === "ja" ? "アクセス権限がありません" : "Access Denied"}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {lang === "ja"
              ? "このページを表示するには管理者としてログインしてください。"
              : "Please login as an administrator to view this page."}
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <RefreshCw className="mx-auto mb-4 h-10 w-10 animate-spin text-slate-400 dark:text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {lang === "ja"
              ? "請求書データを読み込み中..."
              : "Loading billing data..."}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto max-w-7xl px-4 py-6 md:px-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {lang === "ja" ? "請求書管理" : "Billing Management"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {lang === "ja"
                ? "配置請求書の一覧表示・管理をします。"
                : "View and manage all placement invoices."}
            </p>
            {admin && (
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {lang === "ja" ? "管理者" : "Admin"}: {admin.name} (
                {admin.email})
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              {lang === "ja" ? "更新" : "Refresh"}
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-4 space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={
                  lang === "ja"
                    ? "企業名、請求書番号、候補者名で検索..."
                    : "Search by company, invoice number, candidate name..."
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Billing Status Filter */}
              <select
                value={billingStatusFilter}
                onChange={(e) => {
                  setBillingStatusFilter(e.target.value as BillingStatus | "");
                  setPage(1);
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-600"
              >
                <option value="">
                  {lang === "ja" ? "請求ステータス" : "Billing Status"}
                </option>
                {Object.entries(BILLING_STATUS_CONFIG).map(
                  ([status, config]) => (
                    <option key={status} value={status}>
                      {config.label[lang]}
                    </option>
                  ),
                )}
              </select>

              {/* Payment Status Filter */}
              <select
                value={paymentStatusFilter}
                onChange={(e) => {
                  setPaymentStatusFilter(e.target.value as PaymentStatus | "");
                  setPage(1);
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-600"
              >
                <option value="">
                  {lang === "ja" ? "支払ステータス" : "Payment Status"}
                </option>
                {Object.entries(PAYMENT_STATUS_CONFIG).map(
                  ([status, config]) => (
                    <option key={status} value={status}>
                      {config.label[lang]}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          {/* Date Range & Sort */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-sm text-slate-600 dark:text-slate-400">
                {lang === "ja" ? "日付範囲:" : "Date Range:"}
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-600"
              />
              <span className="text-slate-400 dark:text-slate-500">〜</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-600"
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortableColumns);
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-600"
              >
                {SORTABLE_COLUMNS.map((col) => (
                  <option key={col.value} value={col.value}>
                    {col.label[lang]}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>

          {/* Status Chips - Billing Status */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setBillingStatusFilter("");
                setPage(1);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                billingStatusFilter === ""
                  ? "bg-slate-900 text-white dark:bg-indigo-600"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              {lang === "ja" ? "すべて" : "All"} (
              {response?.pagination?.total || 0})
            </button>
            {Object.entries(BILLING_STATUS_CONFIG).map(([status, config]) => {
              const count = statusCounts[status] || 0;
              return (
                <button
                  key={status}
                  onClick={() => {
                    setBillingStatusFilter(status as BillingStatus);
                    setPage(1);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    billingStatusFilter === status
                      ? "bg-slate-900 text-white dark:bg-indigo-600"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  }`}
                >
                  {config.label[lang]} ({count})
                </button>
              );
            })}
          </div>

          {/* Status Chips - Payment Status */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-slate-500 mr-2 dark:text-slate-400">
              {lang === "ja" ? "支払:" : "Payment:"}
            </span>
            {Object.entries(PAYMENT_STATUS_CONFIG).map(([status, config]) => {
              const count = paymentStatusCounts[status] || 0;
              return (
                <button
                  key={status}
                  onClick={() => {
                    setPaymentStatusFilter(
                      paymentStatusFilter === status
                        ? ""
                        : (status as PaymentStatus),
                    );
                    setPage(1);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    paymentStatusFilter === status
                      ? "bg-slate-900 text-white dark:bg-indigo-600"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  }`}
                >
                  {config.label[lang]} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error.message}
        </div>
      )}

      {/* Empty State */}
      {billings.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <Receipt className="mx-auto mb-4 h-10 w-10 text-slate-300 dark:text-slate-600" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {lang === "ja" ? "請求書が見つかりません" : "No invoices found"}
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {lang === "ja"
              ? "検索条件を変更するか、リストを更新してください。"
              : "Try changing your search or refresh the list."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "請求書番号" : "Invoice #"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "企業" : "Company"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "候補者" : "Candidate"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "求人" : "Job"}
                  </th>
                  <th className="px-5 py-4 font-semibold text-right">
                    {lang === "ja" ? "金額" : "Amount"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "請求ステータス" : "Billing Status"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "支払ステータス" : "Payment Status"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "発行日" : "Issue Date"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "支払期限" : "Due Date"}
                  </th>
                  <th className="px-5 py-4 text-right font-semibold">
                    {lang === "ja" ? "操作" : "Actions"}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {billings.map((billing) => (
                  <tr
                    key={billing.billing_id}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {billing.invoice_number || "—"}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                        ID: {billing.billing_id}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {billing.company_name || "-"}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {billing.company_contact_name || "-"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {billing.candidate_name || "-"}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {billing.candidate_email || "-"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-sm text-slate-900 dark:text-white">
                        {billing.job_title || "-"}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {billing.job_category?.replace(/_/g, " ") || "-"}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(billing.total_amount, billing.currency)}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {lang === "ja" ? "小計" : "Subtotal"}:{" "}
                        {formatCurrency(
                          billing.subtotal_amount,
                          billing.currency,
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {getBillingStatusBadge(billing.billing_status)}
                    </td>

                    <td className="px-5 py-4">
                      {getPaymentStatusBadge(billing.payment_status)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(lang, billing.issue_date)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(lang, billing.due_date)}
                      </div>
                      {billing.due_date &&
                        new Date(billing.due_date) < new Date() &&
                        billing.payment_status !== "paid" && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                            <AlertCircle className="h-3 w-3" />
                            {lang === "ja" ? "期限切れ" : "Overdue"}
                          </span>
                        )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => handleViewDetails(billing)}
                          className="inline-flex items-center cursor-pointer gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          title={lang === "ja" ? "詳細表示" : "View Details"}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => handleUpdateBilling(billing)}
                          className="inline-flex items-center cursor-pointer gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                          title={lang === "ja" ? "編集" : "Edit"}
                        >
                          <FileEdit className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => handleSendInvoice(billing)}
                          disabled={
                            sendingInvoice === billing.billing_id ||
                            billing.billing_status === "sent"
                          }
                          className="inline-flex items-center cursor-pointer gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                          title={lang === "ja" ? "送信" : "Send"}
                        >
                          {sendingInvoice === billing.billing_id ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Send className="h-3.5 w-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleDownloadInvoice(billing)}
                          className="inline-flex items-center cursor-pointer gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50"
                          title={lang === "ja" ? "印刷" : "Print"}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalItems > 0 && (
            <Pagination
              lang={lang}
              pagination={pagination}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              pageControls={pageControls}
              isFetching={isFetching}
            />
          )}

          {showDetailsModal && selectedBilling && (
            <BillingDetailsModal
              lang={lang}
              billing={selectedBilling}
              onClose={() => {
                setShowDetailsModal(false);
                setSelectedBilling(null);
              }}
              onEdit={handleUpdateBilling}
              onSend={handleSendBilling}
              onDownload={handleDownloadBilling}
              sendingInvoice={sendingInvoice}
            />
          )}

          {showEditModal && selectedBillingForEdit && (
            <BillingEditModal
              lang={lang}
              billing={selectedBillingForEdit}
              token={token}
              onClose={() => {
                setShowEditModal(false);
                setSelectedBillingForEdit(null);
              }}
              onSuccess={handleEditSuccess}
              onRefresh={() => refetch()}
            />
          )}
        </div>
      )}
    </div>
  );
}
