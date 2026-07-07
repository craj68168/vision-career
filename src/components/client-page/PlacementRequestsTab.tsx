"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Briefcase,
  Building2,
  CalendarDays,
  Clock3,
  FileText,
  MapPin,
  Search,
  Users,
  Wallet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
  RefreshCw,
  Loader2,
  Mail,
  Phone,
  Award,
  BookOpen,
  Globe,
  Calendar,
  Clock,
  DollarSign,
  UserCheck,
  UserMinus,
  CheckCheck,
  Hourglass,
  Check,
  Pencil,
  Receipt,
  Download,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  useCompanyPlacementRequests,
  CompanyPlacementRequest,
  PlacementRequestStatus,
  CompanyPlacementRequestFilters,
} from "@/hooks/useCompanyPlacementRequests";
import toast from "react-hot-toast";
import {
  useCompanyPlacementCandidates,
  COMPANY_ACTIONABLE_STATUSES,
} from "@/hooks/useCompanyPlacementCandidates";
import useDebounced from "@/hooks/useDebounced";
import Link from "next/link";

// Status configuration
const STATUS_CONFIG: Record<
  PlacementRequestStatus,
  { label: Record<"en" | "ja", string>; icon: React.ReactNode; color: string }
> = {
  pending: {
    label: { en: "Pending", ja: "保留中" },
    icon: <Hourglass className="h-4 w-4" />,
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  reviewing: {
    label: { en: "Reviewing", ja: "審査中" },
    icon: <Eye className="h-4 w-4" />,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  approved: {
    label: { en: "Approved", ja: "承認済み" },
    icon: <CheckCheck className="h-4 w-4" />,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: { en: "Rejected", ja: "却下" },
    icon: <XCircle className="h-4 w-4" />,
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
  recruiting: {
    label: { en: "Recruiting", ja: "募集中" },
    icon: <Users className="h-4 w-4" />,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  interviewing: {
    label: { en: "Interviewing", ja: "面接中" },
    icon: <UserCheck className="h-4 w-4" />,
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  filled: {
    label: { en: "Filled", ja: "採用完了" },
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "bg-green-50 text-green-700 border-green-200",
  },
  cancelled: {
    label: { en: "Cancelled", ja: "キャンセル" },
    icon: <UserMinus className="h-4 w-4" />,
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
  closed: {
    label: { en: "Closed", ja: "終了" },
    icon: <XCircle className="h-4 w-4" />,
    color: "bg-slate-50 text-slate-700 border-slate-200",
  },
};

// Status options for filtering
const STATUS_OPTIONS: {
  value: PlacementRequestStatus | "";
  label: Record<"en" | "ja", string>;
}[] = [
  { value: "", label: { en: "All Statuses", ja: "すべてのステータス" } },
  { value: "pending", label: { en: "Pending", ja: "保留中" } },
  { value: "reviewing", label: { en: "Reviewing", ja: "審査中" } },
  { value: "approved", label: { en: "Approved", ja: "承認済み" } },
  { value: "rejected", label: { en: "Rejected", ja: "却下" } },
  { value: "recruiting", label: { en: "Recruiting", ja: "募集中" } },
  { value: "interviewing", label: { en: "Interviewing", ja: "面接中" } },
  { value: "filled", label: { en: "Filled", ja: "採用完了" } },
  { value: "cancelled", label: { en: "Cancelled", ja: "キャンセル" } },
  { value: "closed", label: { en: "Closed", ja: "終了" } },
];

// Stats configuration
const STATS_CONFIG = [
  {
    key: "total",
    label: { en: "Total Requests", ja: "総依頼数" },
    icon: FileText,
  },
  { key: "pending", label: { en: "Pending", ja: "保留中" }, icon: Hourglass },
  { key: "reviewing", label: { en: "Reviewing", ja: "審査中" }, icon: Eye },
  { key: "recruiting", label: { en: "Recruiting", ja: "募集中" }, icon: Users },
  {
    key: "interviewing",
    label: { en: "Interviewing", ja: "面接中" },
    icon: UserCheck,
  },
  {
    key: "filled",
    label: { en: "Filled", ja: "採用完了" },
    icon: CheckCircle2,
  },
];

interface PlacementRequestsTabProps {
  token: string;
}

export default function PlacementRequestsTab({
  token,
}: PlacementRequestsTabProps) {
  const { lang } = useLanguage();
  const isJa = lang === "ja";

  const [filters, setFilters] = useState<CompanyPlacementRequestFilters>({
    status: "",
    keyword: "",
    page: 1,
    limit: 10,
  });

  const [selectedRequest, setSelectedRequest] =
    useState<CompanyPlacementRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPlacedCandidatesModal, setShowPlacedCandidatesModal] =
    useState(false);
  const [selectedPlacementRequest, setSelectedPlacementRequest] =
    useState<any>(null);
  const [placedCandidates, setPlacedCandidates] = useState<any[]>([]);
  const [loadingPlacedCandidates, setLoadingPlacedCandidates] = useState(false);
  const [placedCandidatesError, setPlacedCandidatesError] = useState("");
  const [placedCandidatesSearch, setPlacedCandidatesSearch] = useState("");
  const [placedCandidatesStatus, setPlacedCandidatesStatus] = useState("");
  const [placedCandidatesPagination, setPlacedCandidatesPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  });

  const [showCandidateActionModal, setShowCandidateActionModal] =
    useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [actionStatus, setActionStatus] = useState("");
  const [companyFeedback, setCompanyFeedback] = useState("");
  const [updatingCandidate, setUpdatingCandidate] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoiceData, setSelectedInvoiceData] = useState<any>(null);

  // Add this function to handle invoice click
  const handleInvoiceClick = (candidate: any) => {
    if (!candidate.invoice_available || !candidate.billing_id) {
      toast.error(
        lang === "ja"
          ? "請求書情報が利用できません"
          : "Invoice information not available",
      );
      return;
    }

    setSelectedInvoiceData({
      invoice_number: candidate.invoice_number,
      billing_status: candidate.billing_status,
      subtotal_amount: candidate.subtotal_amount,
      tax_rate: candidate.tax_rate,
      tax_amount: candidate.tax_amount,
      total_amount: candidate.total_amount,
      currency: candidate.currency,
      issue_date: candidate.issue_date,
      due_date: candidate.due_date,
      paid_date: candidate.paid_date,
      billing_company_note: candidate.billing_company_note,
      job_seeker_name: candidate.job_seeker_name,
      job_title: candidate.job_title,
      company_name: company?.company_name || company?.name || "N/A",
      billing_placement_id: candidate.billing_placement_id,
      billing_created_at: candidate.billing_created_at,
    });

    setShowInvoiceModal(true);
  };

  // Debounced search
  const debouncedPlacedSearch = useDebounced(placedCandidatesSearch, 500);

  // Import the hook

  const { fetchCandidates, updateCandidateStatus } =
    useCompanyPlacementCandidates();

  // Add functions
  const handleViewPlacedCandidates = async (request: any) => {
    setSelectedPlacementRequest(request);
    setPlacedCandidatesSearch("");
    setPlacedCandidatesStatus("");
    setPlacedCandidatesPagination({
      page: 1,
      limit: 20,
      total: 0,
      total_pages: 0,
    });
    setShowPlacedCandidatesModal(true);
    await loadPlacedCandidates(request.id, "", "", 1);
  };

  const loadPlacedCandidates = async (
    requestId: number,
    status: string = "",
    keyword: string = "",
    page: number = 1,
  ) => {
    try {
      setLoadingPlacedCandidates(true);
      setPlacedCandidatesError("");

      const data = await fetchCandidates(requestId, status, keyword, page, 20);

      setPlacedCandidates(data.data || []);
      setPlacedCandidatesPagination({
        page: data.pagination?.page || 1,
        limit: data.pagination?.limit || 20,
        total: data.pagination?.total || 0,
        total_pages: data.pagination?.total_pages || 0,
      });
    } catch (err: any) {
      console.error("Error fetching placed candidates:", err);
      setPlacedCandidatesError(err?.message || "Failed to load candidates");
      toast.error(err?.message || "Failed to load candidates");
    } finally {
      setLoadingPlacedCandidates(false);
    }
  };

  // Effect for debounced search
  useEffect(() => {
    if (selectedPlacementRequest && showPlacedCandidatesModal) {
      loadPlacedCandidates(
        selectedPlacementRequest.id,
        placedCandidatesStatus,
        debouncedPlacedSearch,
        1,
      );
    }
  }, [debouncedPlacedSearch, placedCandidatesStatus]);

  const handleCandidateAction = (candidate: any) => {
    setSelectedCandidate(candidate);
    setActionStatus("");
    setCompanyFeedback("");
    setShowCandidateActionModal(true);
  };

  const submitCandidateAction = async () => {
    if (!selectedCandidate || !actionStatus) {
      toast.error(
        lang === "ja"
          ? "アクションを選択してください"
          : "Please select an action",
      );
      return;
    }

    try {
      setUpdatingCandidate(true);

      await updateCandidateStatus(
        selectedCandidate.placement_request_candidate_id,
        actionStatus,
        companyFeedback || undefined,
      );

      toast.success(
        lang === "ja"
          ? "候補者のステータスを更新しました"
          : "Candidate status updated successfully",
      );

      setShowCandidateActionModal(false);
      setSelectedCandidate(null);
      setActionStatus("");
      setCompanyFeedback("");

      // Refresh the list
      if (selectedPlacementRequest) {
        await loadPlacedCandidates(
          selectedPlacementRequest.id,
          placedCandidatesStatus,
          debouncedPlacedSearch,
          placedCandidatesPagination.page,
        );
      }
    } catch (err: any) {
      console.error("Error updating candidate:", err);
      toast.error(err?.message || "Failed to update candidate status");
    } finally {
      setUpdatingCandidate(false);
    }
  };

  const getCandidateStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      sent_to_company: "bg-indigo-100 text-indigo-700 border-indigo-200",
      interview_requested: "bg-amber-100 text-amber-700 border-amber-200",
      interview_scheduled: "bg-blue-100 text-blue-700 border-blue-200",
      interviewed: "bg-purple-100 text-purple-700 border-purple-200",
      selected: "bg-emerald-100 text-emerald-700 border-emerald-200",
      rejected: "bg-rose-100 text-rose-700 border-rose-200",
      joined: "bg-green-100 text-green-700 border-green-200",
    };
    return statusMap[status] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getCandidateStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; ja: string }> = {
      sent_to_company: { en: "Sent to Company", ja: "企業送信済み" },
      interview_requested: { en: "Interview Requested", ja: "面接依頼中" },
      interview_scheduled: { en: "Interview Scheduled", ja: "面接予定" },
      interviewed: { en: "Interviewed", ja: "面接済み" },
      selected: { en: "Selected", ja: "選考通過" },
      rejected: { en: "Rejected", ja: "不合格" },
      joined: { en: "Joined", ja: "入社済み" },
    };
    return labels[status]?.[lang] || status;
  };

  const { data, isLoading, error, refetch, isFetching } =
    useCompanyPlacementRequests(token, filters);

  // Calculate stats
  const stats = useMemo(() => {
    const requests = data?.placement_requests || [];
    const total = requests.length;

    const statsMap: Record<string, number> = {
      total,
      pending: requests.filter((r) => r.request_status === "pending").length,
      reviewing: requests.filter((r) => r.request_status === "reviewing")
        .length,
      recruiting: requests.filter((r) => r.request_status === "recruiting")
        .length,
      interviewing: requests.filter((r) => r.request_status === "interviewing")
        .length,
      filled: requests.filter((r) => r.request_status === "filled").length,
    };

    return statsMap;
  }, [data]);

  const handleFilterChange = (
    key: keyof CompanyPlacementRequestFilters,
    value: any,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? value : 1,
    }));
  };

  const handleViewDetails = (request: CompanyPlacementRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRequest(null);
  };

  const handleRefresh = () => {
    refetch();
    toast.success(isJa ? "更新しました" : "Refreshed");
  };

  const handleDownloadInvoice = async (invoiceData: any) => {
    try {
      console.log(invoiceData);
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

  // Format date
  const formatDate = (date?: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString(isJa ? "ja-JP" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date?: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleString(isJa ? "ja-JP" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status config
  const getStatusConfig = (status: PlacementRequestStatus) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
        <p className="mt-4 text-sm text-slate-600">
          {isJa ? "依頼情報を読み込み中..." : "Loading placement requests..."}
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5" />
          <div>
            <h3 className="font-semibold">
              {isJa
                ? "依頼情報を読み込めません"
                : "Unable to load placement requests"}
            </h3>
            <p className="mt-1 text-sm">
              {error instanceof Error
                ? error.message
                : isJa
                  ? "データの読み込み中にエラーが発生しました"
                  : "An error occurred while loading data"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const requests = data?.placement_requests || [];
  const pagination = data?.pagination;
  const company = data?.company;

  return (
    <div className="space-y-6">
      {/* Company Info Banner */}
      {company && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-slate-100 p-3">
                <Building2 className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {isJa ? "企業情報" : "Company Information"}
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  {company.company_name || company.name}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {company.email}
                  </span>
                  {company.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {company.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isFetching}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
                {isJa ? "更新" : "Refresh"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {STATS_CONFIG.map((stat) => {
          const Icon = stat.icon;
          const value = stats[stat.key as keyof typeof stats] || 0;
          return (
            <div
              key={stat.key}
              className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">
                  {stat.label[lang as "en" | "ja"]}
                </p>
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">
              {isJa ? "フィルター" : "Filters"}
            </span>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="relative flex-1 sm:min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filters.keyword || ""}
                onChange={(e) => handleFilterChange("keyword", e.target.value)}
                placeholder={
                  isJa
                    ? "職種、企業名で検索..."
                    : "Search by job title, company..."
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
              />
            </div>

            <select
              value={filters.status || ""}
              onChange={(e) =>
                handleFilterChange(
                  "status",
                  e.target.value as PlacementRequestStatus | "",
                )
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label[lang as "en" | "ja"]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {isJa
            ? `${requests.length}件の依頼が見つかりました`
            : `${requests.length} placement request(s) found`}
        </p>
        {pagination && (
          <p className="text-sm text-slate-500">
            {isJa
              ? `ページ ${pagination.page} / ${pagination.total_pages}`
              : `Page ${pagination.page} of ${pagination.total_pages}`}
          </p>
        )}
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex w-fit items-center justify-center">
            <FileText className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">
            {isJa ? "依頼が見つかりません" : "No placement requests found"}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {isJa
              ? "フィルターを変更するか、新しい採用依頼を作成してください。"
              : "Try changing your filters or create a new placement request."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 3xl:grid-cols-3">
          {requests.map((request) => {
            const statusConfig = getStatusConfig(request.request_status);
            return (
              <div
                key={request.id}
                className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {isJa ? `依頼 #${request.id}` : `Request #${request.id}`}
                    </p>
                    <h3 className="mt-1 truncate text-lg font-semibold text-slate-900">
                      {request.job_title}
                    </h3>
                  </div>
                  <span
                    className={`flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusConfig.color}`}
                  >
                    {statusConfig.icon}
                    {statusConfig.label[lang as "en" | "ja"]}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  {request.job_category && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{request.job_category}</span>
                    </div>
                  )}
                  {request.employment_type && (
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                      <span>{request.employment_type}</span>
                    </div>
                  )}
                  {request.work_location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{request.work_location}</span>
                    </div>
                  )}
                  {request.salary_amount && (
                    <div className="flex items-center gap-2">
                      <Wallet className="h-3.5 w-3.5 text-slate-400" />
                      <span>
                        {typeof request.salary_amount === "number"
                          ? `${request.salary_amount.toLocaleString()}${request.salary_type ? ` ${request.salary_type}` : ""}`
                          : `${request.salary_amount}${request.salary_type ? ` ${request.salary_type}` : ""}`}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      {isJa
                        ? `${request.number_of_positions}名`
                        : `${request.number_of_positions} position${request.number_of_positions > 1 ? "s" : ""}`}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="text-xs text-slate-500">
                    {formatDate(request.created_at)}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                    >
                      <Eye className="h-4 w-4" />
                      {isJa ? "詳細" : "Details"}
                    </button>
                    <button
                      onClick={() => handleViewPlacedCandidates(request)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-100"
                    >
                      <Users className="h-4 w-4" />
                      {lang === "ja" ? "配置済み候補者" : "Placed Candidates"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() =>
              handleFilterChange("page", Math.max(1, (filters.page || 1) - 1))
            }
            disabled={(filters.page || 1) <= 1}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isJa ? "前へ" : "Previous"}
          </button>
          <span className="text-sm text-slate-600">
            {isJa
              ? `${pagination.page} / ${pagination.total_pages}`
              : `Page ${pagination.page} of ${pagination.total_pages}`}
          </span>
          <button
            onClick={() =>
              handleFilterChange(
                "page",
                Math.min(pagination.total_pages, (filters.page || 1) + 1),
              )
            }
            disabled={(filters.page || 1) >= pagination.total_pages}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isJa ? "次へ" : "Next"}
          </button>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={closeDetailsModal}
            aria-hidden="true"
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {isJa ? "依頼詳細" : "Placement Request Details"}
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">
                  {selectedRequest.job_title}
                </h3>
              </div>
              <button
                onClick={closeDetailsModal}
                className="rounded-full p-2 cursor-pointer text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-6 py-6">
              <div className="space-y-8">
                {/* Status Banner */}
                <div className="rounded-3xl bg-slate-900 p-6 text-white">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm text-slate-300">
                        {isJa ? "依頼ステータス" : "Request Status"}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${getStatusConfig(selectedRequest.request_status).color}`}
                        >
                          {getStatusConfig(selectedRequest.request_status).icon}
                          {
                            getStatusConfig(selectedRequest.request_status)
                              .label[lang as "en" | "ja"]
                          }
                        </span>
                        {selectedRequest.assigned_staff_id && (
                          <span className="text-sm text-slate-300">
                            {isJa
                              ? `担当者 ID: ${selectedRequest.assigned_staff_id}`
                              : `Assigned Staff: #${selectedRequest.assigned_staff_id}`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-slate-300">
                        {isJa ? "作成日" : "Created"}
                      </div>
                      <div className="mt-1 font-medium text-white">
                        {formatDateTime(selectedRequest.created_at)}
                      </div>
                      {selectedRequest.updated_at && (
                        <>
                          <div className="mt-2 text-slate-300">
                            {isJa ? "更新日" : "Updated"}
                          </div>
                          <div className="mt-1 font-medium text-white">
                            {formatDateTime(selectedRequest.updated_at)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                {(selectedRequest.admin_note ||
                  selectedRequest.rejection_reason) && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="text-sm font-semibold text-slate-700">
                      {isJa ? "管理者ノート" : "Admin Notes"}
                    </h4>
                    {selectedRequest.admin_note && (
                      <p className="mt-2 text-sm text-slate-600">
                        {selectedRequest.admin_note}
                      </p>
                    )}
                    {selectedRequest.rejection_reason && (
                      <div className="mt-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
                        <strong>
                          {isJa ? "却下理由: " : "Rejection Reason: "}
                        </strong>
                        {selectedRequest.rejection_reason}
                      </div>
                    )}
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <DetailItem
                    label={isJa ? "職種" : "Job Title"}
                    value={selectedRequest.job_title}
                    icon={<Briefcase className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={isJa ? "カテゴリー" : "Category"}
                    value={selectedRequest.job_category}
                    icon={<BookOpen className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={isJa ? "雇用形態" : "Employment Type"}
                    value={selectedRequest.employment_type}
                    icon={<Clock className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={isJa ? "募集人数" : "Number of Positions"}
                    value={selectedRequest.number_of_positions}
                    icon={<Users className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={isJa ? "勤務地" : "Work Location"}
                    value={selectedRequest.work_location}
                    icon={<MapPin className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={isJa ? "必要な日本語レベル" : "Japanese Level"}
                    value={selectedRequest.japanese_level_required}
                    icon={<Globe className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={isJa ? "必要なビザ" : "Visa Type Required"}
                    value={selectedRequest.visa_type_required}
                    icon={<Award className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={isJa ? "給与タイプ" : "Salary Type"}
                    value={selectedRequest.salary_type}
                    icon={<DollarSign className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={isJa ? "給与額" : "Salary Amount"}
                    value={
                      typeof selectedRequest.salary_amount === "number"
                        ? `${selectedRequest.salary_amount.toLocaleString()}${selectedRequest.salary_type ? ` ${selectedRequest.salary_type}` : ""}`
                        : selectedRequest.salary_amount
                    }
                    icon={<Wallet className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={isJa ? "勤務時間" : "Working Hours"}
                    value={selectedRequest.working_hours}
                    icon={<Clock3 className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={isJa ? "休日" : "Days Off"}
                    value={selectedRequest.days_off}
                    icon={<Calendar className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={isJa ? "開始日" : "Start Date"}
                    value={selectedRequest.start_date}
                    icon={<CalendarDays className="h-4 w-4" />}
                  />
                </div>

                {/* Description & Requirements */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="text-sm font-semibold text-slate-700">
                      {isJa ? "仕事内容" : "Job Description"}
                    </h4>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                      {selectedRequest.job_description || "-"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="text-sm font-semibold text-slate-700">
                      {isJa ? "応募要件" : "Requirements"}
                    </h4>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                      {selectedRequest.requirements || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Placed Candidates Modal */}
      {showPlacedCandidatesModal && selectedPlacementRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {lang === "ja" ? "配置済み候補者" : "Placed Candidates"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedPlacementRequest.title ||
                    selectedPlacementRequest.job_title}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPlacedCandidatesModal(false);
                  setPlacedCandidates([]);
                }}
                className="rounded-full p-2 px-3 cursor-pointer text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Search & Filters */}
            <div className="border-b border-slate-200 px-6 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={placedCandidatesSearch}
                    onChange={(e) => setPlacedCandidatesSearch(e.target.value)}
                    placeholder={
                      lang === "ja" ? "候補者を検索..." : "Search candidates..."
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <select
                  value={placedCandidatesStatus}
                  onChange={(e) => {
                    setPlacedCandidatesStatus(e.target.value);
                    if (selectedPlacementRequest) {
                      loadPlacedCandidates(
                        selectedPlacementRequest.id,
                        e.target.value,
                        debouncedPlacedSearch,
                        1,
                      );
                    }
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                >
                  <option value="">{lang === "ja" ? "すべて" : "All"}</option>
                  <option value="sent_to_company">
                    {lang === "ja" ? "企業送信済み" : "Sent to Company"}
                  </option>
                  <option value="interview_requested">
                    {lang === "ja" ? "面接依頼中" : "Interview Requested"}
                  </option>
                  <option value="interview_scheduled">
                    {lang === "ja" ? "面接予定" : "Interview Scheduled"}
                  </option>
                  <option value="interviewed">
                    {lang === "ja" ? "面接済み" : "Interviewed"}
                  </option>
                  <option value="selected">
                    {lang === "ja" ? "選考通過" : "Selected"}
                  </option>
                  <option value="rejected">
                    {lang === "ja" ? "不合格" : "Rejected"}
                  </option>
                  <option value="joined">
                    {lang === "ja" ? "入社済み" : "Joined"}
                  </option>
                </select>

                <button
                  onClick={() => {
                    if (selectedPlacementRequest) {
                      loadPlacedCandidates(
                        selectedPlacementRequest.id,
                        placedCandidatesStatus,
                        debouncedPlacedSearch,
                        1,
                      );
                    }
                  }}
                  disabled={loadingPlacedCandidates}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {loadingPlacedCandidates ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {lang === "ja" ? "更新" : "Refresh"}
                </button>
              </div>
            </div>

            {/* Candidates Table */}
            <div className="max-h-[55vh] overflow-y-auto px-6 py-4">
              {placedCandidatesError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {placedCandidatesError}
                </div>
              )}

              {loadingPlacedCandidates ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
              ) : placedCandidates.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-2 text-sm text-slate-500">
                    {lang === "ja"
                      ? "このステータスの候補者はいません"
                      : "No candidates with this status"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">#</th>
                        <th className="px-4 py-3 font-semibold">
                          {lang === "ja" ? "候補者" : "Candidate"}
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          {lang === "ja" ? "連絡先" : "Contact"}
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          {lang === "ja" ? "ビザ" : "Visa"}
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          {lang === "ja" ? "日本語" : "Japanese"}
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          {lang === "ja" ? "ステータス" : "Status"}
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          {lang === "ja" ? "面接日" : "Interview Date"}
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          {lang === "ja" ? "操作" : "Actions"}
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {placedCandidates.map((candidate, index) => {
                        const isActionable = [
                          "sent_to_company",
                          "interview_requested",
                          "interview_scheduled",
                          "interviewed",
                        ].includes(candidate.candidate_status);

                        return (
                          <tr
                            key={candidate.placement_request_candidate_id}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-4 py-3 font-medium text-slate-500">
                              {(placedCandidatesPagination.page - 1) *
                                placedCandidatesPagination.limit +
                                index +
                                1}
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <div className="font-medium text-slate-900">
                                  {candidate.job_seeker_name || "-"}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {candidate.nationality || "-"}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm">
                                <div>{candidate.job_seeker_email || "-"}</div>
                                <div className="text-xs text-slate-500">
                                  {candidate.job_seeker_phone || "-"}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {candidate.visa_type || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {candidate.japanese_level || "-"}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getCandidateStatusBadge(candidate.candidate_status)}`}
                              >
                                {getCandidateStatusLabel(
                                  candidate.candidate_status,
                                )}
                              </span>
                              {candidate.company_feedback && (
                                <div className="mt-1 text-xs text-slate-500 truncate max-w-[150px]">
                                  {candidate.company_feedback}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs">
                              {candidate.interview_date || "-"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-center gap-2 flex-wrap">
                                {isActionable && (
                                  <button
                                    onClick={() =>
                                      handleCandidateAction(candidate)
                                    }
                                    className="inline-flex items-center gap-1.5 cursor-pointer rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                                  >
                                    <Pencil className="h-3 w-3" />
                                    {lang === "ja"
                                      ? "ステータス更新"
                                      : "Update Status"}
                                  </button>
                                )}
                                {candidate.resume_file && (
                                  <Link
                                    href={`https://vision-career.co.jp/view_resume.php?token=${localStorage.getItem("token")}&resume=${candidate.resume_file}`}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-blue-400 bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-900 transition hover:bg-blue-200"
                                  >
                                    <Download className="h-3 w-3" />
                                    {lang === "ja"
                                      ? "履歴書をダウンロード"
                                      : "Download Resume"}
                                  </Link>
                                )}
                                {candidate.billing_id !== null && (
                                  <button
                                    onClick={() =>
                                      handleInvoiceClick(candidate)
                                    }
                                    className="inline-flex items-center cursor-pointer gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-blue-100"
                                  >
                                    <Receipt className="h-3 w-3" />
                                    {lang === "ja" ? "請求書" : "Invoice"}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {placedCandidatesPagination.total > 0 && (
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    {lang === "ja"
                      ? `全 ${placedCandidatesPagination.total} 件中 ${(placedCandidatesPagination.page - 1) * placedCandidatesPagination.limit + 1} - ${Math.min(placedCandidatesPagination.page * placedCandidatesPagination.limit, placedCandidatesPagination.total)} 件`
                      : `Showing ${(placedCandidatesPagination.page - 1) * placedCandidatesPagination.limit + 1} - ${Math.min(placedCandidatesPagination.page * placedCandidatesPagination.limit, placedCandidatesPagination.total)} of ${placedCandidatesPagination.total}`}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (selectedPlacementRequest) {
                          loadPlacedCandidates(
                            selectedPlacementRequest.id,
                            placedCandidatesStatus,
                            debouncedPlacedSearch,
                            placedCandidatesPagination.page - 1,
                          );
                        }
                      }}
                      disabled={
                        placedCandidatesPagination.page === 1 ||
                        loadingPlacedCandidates
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      {lang === "ja" ? "前へ" : "Prev"}
                    </button>
                    <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-sm">
                      {placedCandidatesPagination.page} /{" "}
                      {placedCandidatesPagination.total_pages}
                    </span>
                    <button
                      onClick={() => {
                        if (selectedPlacementRequest) {
                          loadPlacedCandidates(
                            selectedPlacementRequest.id,
                            placedCandidatesStatus,
                            debouncedPlacedSearch,
                            placedCandidatesPagination.page + 1,
                          );
                        }
                      }}
                      disabled={
                        placedCandidatesPagination.page ===
                          placedCandidatesPagination.total_pages ||
                        loadingPlacedCandidates
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      {lang === "ja" ? "次へ" : "Next"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Candidate Action Modal */}
      {showCandidateActionModal && selectedCandidate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {lang === "ja" ? "候補者アクション" : "Candidate Action"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedCandidate.job_seeker_name}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCandidateActionModal(false);
                  setSelectedCandidate(null);
                }}
                disabled={updatingCandidate}
                className="rounded-full p-2 px-3 cursor-pointer text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {lang === "ja" ? "アクション" : "Action"}
                </label>
                <select
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                >
                  <option value="">
                    {lang === "ja" ? "アクションを選択" : "Select action"}
                  </option>
                  {COMPANY_ACTIONABLE_STATUSES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label[lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {lang === "ja" ? "フィードバック" : "Feedback"}
                  <span className="text-xs text-slate-400 ml-1">
                    ({lang === "ja" ? "任意" : "Optional"})
                  </span>
                </label>
                <textarea
                  value={companyFeedback}
                  onChange={(e) => setCompanyFeedback(e.target.value)}
                  rows={3}
                  placeholder={
                    lang === "ja"
                      ? "フィードバックを入力..."
                      : "Enter feedback..."
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                />
              </div>

              {actionStatus === "rejected" && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                  <p className="text-sm text-rose-700">
                    {lang === "ja"
                      ? "この候補者を不合格にします。この操作は元に戻せません。"
                      : "This will reject the candidate. This action cannot be undone."}
                  </p>
                </div>
              )}

              {actionStatus === "selected" && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm text-emerald-700">
                    {lang === "ja"
                      ? "この候補者を選考通過にします。"
                      : "This will mark the candidate as selected."}
                  </p>
                </div>
              )}

              {actionStatus === "interview_requested" && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm text-amber-700">
                    {lang === "ja"
                      ? "この候補者に面接を依頼します。"
                      : "This will request an interview with the candidate."}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  setShowCandidateActionModal(false);
                  setSelectedCandidate(null);
                }}
                disabled={updatingCandidate}
                className="rounded-xl border cursor-pointer border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                {lang === "ja" ? "キャンセル" : "Cancel"}
              </button>

              <button
                onClick={submitCandidateAction}
                disabled={updatingCandidate || !actionStatus}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 cursor-pointer px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updatingCandidate ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {lang === "ja" ? "更新中..." : "Updating..."}
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    {lang === "ja" ? "更新" : "Update"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && selectedInvoiceData && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={() => setShowInvoiceModal(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {lang === "ja" ? "請求書" : "Invoice"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedInvoiceData.invoice_number}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadInvoice(selectedInvoiceData)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="rounded-full p-2 px-3 cursor-pointer text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Invoice Content */}
            <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-6 py-6">
              {/* Invoice Status Banner */}
              <div className="mb-6 rounded-2xl bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">
                      {lang === "ja" ? "ステータス" : "Status"}
                    </p>
                    <span
                      className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                        selectedInvoiceData.billing_status === "paid"
                          ? "bg-green-100 text-green-700"
                          : selectedInvoiceData.billing_status === "sent"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {selectedInvoiceData.billing_status === "paid"
                        ? lang === "ja"
                          ? "支払済み"
                          : "Paid"
                        : selectedInvoiceData.billing_status === "sent"
                          ? lang === "ja"
                            ? "送信済み"
                            : "Sent"
                          : lang === "ja"
                            ? "未送信"
                            : "Draft"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">
                      {lang === "ja" ? "発行日" : "Issue Date"}
                    </p>
                    <p className="font-medium text-slate-900">
                      {formatDate(selectedInvoiceData.issue_date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Invoice Details Grid */}
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm font-medium text-slate-500">
                    {lang === "ja" ? "請求先" : "Bill To"}
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedInvoiceData.company_name}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm font-medium text-slate-500">
                    {lang === "ja" ? "候補者" : "Candidate"}
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedInvoiceData.job_seeker_name}
                  </p>
                  <p className="text-sm text-slate-600">
                    {selectedInvoiceData.job_title}
                  </p>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="mb-6 rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">
                        {lang === "ja" ? "項目" : "Item"}
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-600">
                        {lang === "ja" ? "金額" : "Amount"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-3 text-slate-700">
                        {lang === "ja" ? "紹介料" : "Placement Fee"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">
                        {selectedInvoiceData.currency}{" "}
                        {selectedInvoiceData.subtotal_amount?.toLocaleString()}
                      </td>
                    </tr>
                    {selectedInvoiceData.tax_rate > 0 && (
                      <tr>
                        <td className="px-4 py-3 text-slate-700">
                          {lang === "ja"
                            ? `消費税 (${selectedInvoiceData.tax_rate}%)`
                            : `Tax (${selectedInvoiceData.tax_rate}%)`}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-900">
                          {selectedInvoiceData.currency}{" "}
                          {selectedInvoiceData.tax_amount?.toLocaleString()}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {lang === "ja" ? "合計" : "Total"}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">
                        {selectedInvoiceData.currency}{" "}
                        {selectedInvoiceData.total_amount?.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Additional Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm font-medium text-slate-500">
                    {lang === "ja" ? "支払期限" : "Due Date"}
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {formatDate(selectedInvoiceData.due_date)}
                  </p>
                </div>
                {selectedInvoiceData.paid_date && (
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-sm font-medium text-slate-500">
                      {lang === "ja" ? "支払日" : "Paid Date"}
                    </p>
                    <p className="mt-1 font-semibold text-green-700">
                      {formatDate(selectedInvoiceData.paid_date)}
                    </p>
                  </div>
                )}
              </div>

              {selectedInvoiceData.billing_company_note && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">
                    {lang === "ja" ? "備考" : "Notes"}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {selectedInvoiceData.billing_company_note}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 border-t border-slate-200 pt-4">
                <p className="text-xs text-slate-400">
                  {lang === "ja"
                    ? `請求書 ID: ${selectedInvoiceData.billing_placement_id} • 作成日: ${formatDateTime(selectedInvoiceData.billing_created_at)}`
                    : `Invoice ID: ${selectedInvoiceData.billing_placement_id} • Created: ${formatDateTime(selectedInvoiceData.billing_created_at)}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for detail items
function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number | null;
  icon: React.ReactNode;
}) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-sm leading-6 text-slate-800">{value}</div>
    </div>
  );
}
