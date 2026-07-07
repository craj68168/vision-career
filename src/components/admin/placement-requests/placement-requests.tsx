// app/admin/placement-requests/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  RefreshCw,
  AlertTriangle,
  Building2,
  Briefcase,
  Inbox,
  Users,
  Mail,
  Pencil,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Clock as ClockIcon,
  Filter,
  ChevronDown,
  Loader2,
  UserPlus,
  Check,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import useDebounced from "@/hooks/useDebounced";
import {
  useAdminPlacementRequests,
  PlacementRequest,
  PlacementRequestStatus,
} from "@/hooks/useAdminPlacementRequests";
import toast from "react-hot-toast";
import DetailsModal from "./DetailsModal";
import CandidatesModal from "./CandidatesModal";

// Status configuration
export const STATUS_CONFIG: Record<
  PlacementRequestStatus,
  {
    label: { en: string; ja: string };
    color: string;
    darkColor: string;
    icon: React.ReactNode;
  }
> = {
  pending: {
    label: { en: "Pending", ja: "保留中" },
    color: "bg-slate-100 text-slate-700 border-slate-200",
    darkColor: "dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  reviewing: {
    label: { en: "Reviewing", ja: "審査中" },
    color: "bg-blue-100 text-blue-700 border-blue-200",
    darkColor: "dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    icon: <Eye className="h-3.5 w-3.5" />,
  },
  approved: {
    label: { en: "Approved", ja: "承認済み" },
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    darkColor:
      "dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  rejected: {
    label: { en: "Rejected", ja: "却下" },
    color: "bg-rose-100 text-rose-700 border-rose-200",
    darkColor: "dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  recruiting: {
    label: { en: "Recruiting", ja: "募集中" },
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    darkColor:
      "dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
    icon: <Users className="h-3.5 w-3.5" />,
  },
  interviewing: {
    label: { en: "Interviewing", ja: "面接中" },
    color: "bg-amber-100 text-amber-700 border-amber-200",
    darkColor: "dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    icon: <Users className="h-3.5 w-3.5" />,
  },
  filled: {
    label: { en: "Filled", ja: "埋まりました" },
    color: "bg-purple-100 text-purple-700 border-purple-200",
    darkColor:
      "dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  cancelled: {
    label: { en: "Cancelled", ja: "キャンセル" },
    color: "bg-gray-100 text-gray-700 border-gray-200",
    darkColor: "dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  closed: {
    label: { en: "Closed", ja: "終了" },
    color: "bg-slate-100 text-slate-600 border-slate-200",
    darkColor: "dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

export const formatSalary = (
  amount: string | number | null,
  type: string | null,
) => {
  if (!amount) return "-";
  const { lang } = useLanguage();
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const typeLabel = type
    ? type === "monthly"
      ? lang === "ja"
        ? "/月"
        : "/month"
      : type === "yearly"
        ? lang === "ja"
          ? "/年"
          : "/year"
        : type === "hourly"
          ? lang === "ja"
            ? "/時間"
            : "/hour"
          : ""
    : "";
  return `${num.toLocaleString()}${typeLabel}`;
};

export const formatDate = (lang: string, date?: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const CANDIDATE_STATUS_OPTIONS = [
  { value: "recommended", label: { en: "Recommended", ja: "推薦済み" } },
  {
    value: "sent_to_company",
    label: { en: "Sent to Company", ja: "企業送信済み" },
  },
  {
    value: "interview_scheduled",
    label: { en: "Interview Scheduled", ja: "面接予定" },
  },
  { value: "interviewed", label: { en: "Interviewed", ja: "面接済み" } },
  { value: "selected", label: { en: "Selected", ja: "選考通過" } },
  { value: "rejected", label: { en: "Rejected", ja: "不合格" } },
  { value: "joined", label: { en: "Joined", ja: "入社済み" } },
  { value: "cancelled", label: { en: "Cancelled", ja: "キャンセル" } },
];

export default function AdminPlacementRequestsPage() {
  const { lang } = useLanguage();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [statusFilter, setStatusFilter] = useState<PlacementRequestStatus | "">(
    "",
  );
  const [companyFilter, setCompanyFilter] = useState<string>("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  const {
    data: response,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useAdminPlacementRequests(token, {
    status: statusFilter || undefined,
    company_id: companyFilter || undefined,
    keyword: debouncedSearch || undefined,
    page,
    limit,
  });

  const placementRequests = response?.placement_requests ?? [];
  const pagination = response?.pagination;

  // Status counts for filter chips
  const statusCounts = useMemo(() => {
    const counts: Record<PlacementRequestStatus, number> = {
      pending: 0,
      reviewing: 0,
      approved: 0,
      rejected: 0,
      recruiting: 0,
      interviewing: 0,
      filled: 0,
      cancelled: 0,
      closed: 0,
    };

    placementRequests.forEach((req) => {
      if (counts[req.request_status] !== undefined) {
        counts[req.request_status]++;
      }
    });

    return counts;
  }, [placementRequests]);

  const [selectedRequest, setSelectedRequest] =
    useState<PlacementRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<PlacementRequestStatus>("pending");
  const [adminNote, setAdminNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedPlacementRequest, setSelectedPlacementRequest] =
    useState<PlacementRequest | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<number>>(
    new Set(),
  );
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [submittingCandidates, setSubmittingCandidates] = useState(false);
  const [candidateSearch, setCandidateSearch] = useState("");
  const debouncedCandidateSearch = useDebounced(candidateSearch, 500);
  const [candidateFilters, setCandidateFilters] = useState({
    visa_type: "",
    japanese_level: "",
    desired_job: "",
    desired_location: "",
    nationality: "",
  });
  const [candidatePagination, setCandidatePagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  });
  const [candidateError, setCandidateError] = useState("");
  const [removingCandidateId, setRemovingCandidateId] = useState<number | null>(
    null,
  );
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [candidateToRemove, setCandidateToRemove] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // View Candidates Modal States
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);
  const [placementCandidates, setPlacementCandidates] = useState<any[]>([]);
  const [loadingPlacementCandidates, setLoadingPlacementCandidates] =
    useState(false);
  const [placementCandidatesError, setPlacementCandidatesError] = useState("");
  const [placementCandidatesPagination, setPlacementCandidatesPagination] =
    useState({
      page: 1,
      limit: 20,
      total: 0,
      total_pages: 0,
    });
  const [placementCandidatesSearch, setPlacementCandidatesSearch] =
    useState("");
  const debouncedPlacementCandidatesSearch = useDebounced(
    placementCandidatesSearch,
    500,
  );
  const [candidateStatusFilter, setCandidateStatusFilter] = useState("");

  // Status Update Modal States
  const [showCandidateStatusModal, setShowCandidateStatusModal] =
    useState(false);
  const [selectedPlacementCandidate, setSelectedPlacementCandidate] = useState<
    any | null
  >(null);
  const [newCandidateStatus, setNewCandidateStatus] = useState("");
  const [candidateStatusNote, setCandidateStatusNote] = useState("");
  const [companyFeedback, setCompanyFeedback] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [updatingCandidateStatus, setUpdatingCandidateStatus] = useState(false);

  const getCandidateStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      recommended:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      sent_to_company:
        "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
      interview_scheduled:
        "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
      interviewed:
        "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      selected:
        "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
      rejected:
        "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800",
      joined:
        "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      cancelled:
        "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    };
    return (
      statusMap[status] ||
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
    );
  };

  const getCandidateStatusLabel = (status: string) => {
    const option = CANDIDATE_STATUS_OPTIONS.find((opt) => opt.value === status);
    return option ? option.label[lang] : status;
  };

  const removeCandidate = async (
    placementRequestId: number,
    jobSeekerId: number,
  ) => {
    try {
      setRemovingCandidateId(jobSeekerId);

      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        "https://vision-career.co.jp/admin-remove-candidate-from-placement-request.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            placement_request_id: placementRequestId,
            job_seeker_id: jobSeekerId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data?.message || "Failed to remove candidate");
      }

      toast.success(
        lang === "ja"
          ? "候補者を削除しました"
          : "Candidate removed successfully",
      );

      if (selectedPlacementRequest) {
        await fetchCandidates(
          selectedPlacementRequest.id,
          candidatePagination.page,
        );
      }

      setShowRemoveConfirm(false);
      setCandidateToRemove(null);
    } catch (err: any) {
      console.error("Error removing candidate:", err);
      toast.error(
        err?.message ||
          (lang === "ja"
            ? "候補者の削除に失敗しました"
            : "Failed to remove candidate"),
      );
    } finally {
      setRemovingCandidateId(null);
    }
  };

  const fetchPlacementCandidates = async (
    placementRequestId: number,
    page: number = 1,
  ) => {
    try {
      setLoadingPlacementCandidates(true);
      setPlacementCandidatesError("");

      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const params = new URLSearchParams({
        placement_request_id: String(placementRequestId),
        page: String(page),
        limit: String(placementCandidatesPagination.limit),
      });

      if (debouncedPlacementCandidatesSearch) {
        params.append("keyword", debouncedPlacementCandidatesSearch);
      }
      if (candidateStatusFilter) {
        params.append("candidate_status", candidateStatusFilter);
      }

      const response = await fetch(
        `https://vision-career.co.jp/admin-get-placement-request-candidates.php?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(
          data?.message || "Failed to fetch placement candidates",
        );
      }

      setPlacementCandidates(data.placement_request_candidates || []);
      setPlacementCandidatesPagination({
        page: data.pagination?.page || 1,
        limit: data.pagination?.limit || 20,
        total: data.pagination?.total || 0,
        total_pages: data.pagination?.total_pages || 0,
      });
    } catch (err: any) {
      console.error("Error fetching placement candidates:", err);
      setPlacementCandidatesError(err?.message || "Failed to load candidates");
    } finally {
      setLoadingPlacementCandidates(false);
    }
  };

  const handleViewCandidates = (request: PlacementRequest) => {
    setSelectedPlacementRequest(request);
    setPlacementCandidatesSearch("");
    setCandidateStatusFilter("");
    setPlacementCandidatesPagination({
      page: 1,
      limit: 20,
      total: 0,
      total_pages: 0,
    });
    setShowCandidatesModal(true);
    fetchPlacementCandidates(request.id, 1);
  };

  const handleStatusUpdateClick = (candidate: any) => {
    setSelectedPlacementCandidate(candidate);
    setNewCandidateStatus(candidate.candidate_status || "");
    setCandidateStatusNote(candidate.admin_note || "");
    setCompanyFeedback(candidate.company_feedback || "");
    setInterviewDate(candidate.interview_date || "");
    setShowCandidateStatusModal(true);
  };

  const updateCandidateStatus = async () => {
    if (!selectedPlacementCandidate) return;

    try {
      setUpdatingCandidateStatus(true);

      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        "https://vision-career.co.jp/admin-update-placement-candidate-status.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            placement_request_candidate_id:
              selectedPlacementCandidate.placement_request_candidate_id,
            candidate_status: newCandidateStatus,
            admin_note: candidateStatusNote || undefined,
            company_feedback: companyFeedback || undefined,
            interview_date: interviewDate || undefined,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data?.message || "Failed to update candidate status");
      }

      toast.success(
        lang === "ja"
          ? "候補者のステータスを更新しました"
          : "Candidate status updated successfully",
      );

      setShowCandidateStatusModal(false);
      setSelectedPlacementCandidate(null);

      if (selectedPlacementRequest) {
        await fetchPlacementCandidates(
          selectedPlacementRequest.id,
          placementCandidatesPagination.page,
        );
      }
    } catch (err: any) {
      console.error("Error updating candidate status:", err);
      toast.error(
        err?.message ||
          (lang === "ja"
            ? "ステータスの更新に失敗しました"
            : "Failed to update status"),
      );
    } finally {
      setUpdatingCandidateStatus(false);
    }
  };

  const handleRemoveClick = (candidateId: number, candidateName: string) => {
    setCandidateToRemove({ id: candidateId, name: candidateName });
    setShowRemoveConfirm(true);
  };

  const handlePlaceCandidates = async (request: PlacementRequest) => {
    setSelectedPlacementRequest(request);
    setSelectedCandidates(new Set());
    setCandidateSearch("");
    setCandidateFilters({
      visa_type: "",
      japanese_level: "",
      desired_job: "",
      desired_location: "",
      nationality: "",
    });
    setCandidatePagination({ page: 1, limit: 20, total: 0, total_pages: 0 });
    setShowCandidateModal(true);
    await fetchCandidates(request.id, 1);
  };

  const fetchCandidates = async (
    placementRequestId: number,
    page: number = 1,
  ) => {
    try {
      setLoadingCandidates(true);
      setCandidateError("");

      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const params = new URLSearchParams({
        placement_request_id: String(placementRequestId),
        page: String(page),
        limit: String(candidatePagination.limit),
      });

      if (debouncedCandidateSearch)
        params.append("keyword", debouncedCandidateSearch);
      if (candidateFilters.visa_type)
        params.append("visa_type", candidateFilters.visa_type);
      if (candidateFilters.japanese_level)
        params.append("japanese_level", candidateFilters.japanese_level);
      if (candidateFilters.desired_job)
        params.append("desired_job", candidateFilters.desired_job);
      if (candidateFilters.desired_location)
        params.append("desired_location", candidateFilters.desired_location);
      if (candidateFilters.nationality)
        params.append("nationality", candidateFilters.nationality);

      const response = await fetch(
        `https://vision-career.co.jp/admin-get-jobseekers-for-placement.php?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data?.message || "Failed to fetch candidates");
      }

      setCandidates(data.candidates || []);
      setCandidatePagination({
        page: data.pagination?.page || 1,
        limit: data.pagination?.limit || 20,
        total: data.pagination?.total || 0,
        total_pages: data.pagination?.total_pages || 0,
      });
    } catch (err: any) {
      console.error("Error fetching candidates:", err);
      setCandidateError(err?.message || "Failed to load candidates");
    } finally {
      setLoadingCandidates(false);
    }
  };

  useEffect(() => {
    if (selectedPlacementRequest && debouncedCandidateSearch !== undefined) {
      fetchCandidates(selectedPlacementRequest.id, 1);
    }
  }, [debouncedCandidateSearch, selectedPlacementRequest]);

  useEffect(() => {
    if (selectedPlacementRequest && showCandidatesModal) {
      fetchPlacementCandidates(selectedPlacementRequest.id, 1);
    }
  }, [
    debouncedPlacementCandidatesSearch,
    candidateStatusFilter,
    showCandidatesModal,
  ]);

  const submitCandidates = async () => {
    if (!selectedPlacementRequest || selectedCandidates.size === 0) return;

    try {
      setSubmittingCandidates(true);

      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        "https://vision-career.co.jp/admin-add-candidates-to-placement-request.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            placement_request_id: selectedPlacementRequest.id,
            job_seeker_ids: Array.from(selectedCandidates),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data?.message || "Failed to add candidates");
      }

      toast.success(
        lang === "ja"
          ? `${selectedCandidates.size}名の候補者を追加しました`
          : `Added ${selectedCandidates.size} candidate(s) successfully`,
      );

      setShowCandidateModal(false);
      setSelectedCandidates(new Set());
      await refetch();
    } catch (err: any) {
      console.error("Error adding candidates:", err);
      toast.error(
        err?.message ||
          (lang === "ja"
            ? "候補者の追加に失敗しました"
            : "Failed to add candidates"),
      );
    } finally {
      setSubmittingCandidates(false);
    }
  };

  const toggleCandidate = (candidateId: number) => {
    setSelectedCandidates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId);
      } else {
        newSet.add(candidateId);
      }
      return newSet;
    });
  };

  const toggleAllCandidates = () => {
    if (selectedCandidates.size === candidates.length) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(candidates.map((c) => c.id)));
    }
  };

  const getStatusLabel = (status: PlacementRequestStatus) => {
    return STATUS_CONFIG[status]?.label[lang] || status;
  };

  const getStatusBadge = (status: PlacementRequestStatus) => {
    const config = STATUS_CONFIG[status];
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config?.color || ""} ${config?.darkColor || ""}`}
      >
        {config?.icon}
        {config?.label[lang] || status}
      </span>
    );
  };

  const handleViewDetails = (request: PlacementRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleStatusUpdate = (request: PlacementRequest) => {
    setSelectedRequest(request);
    setNewStatus(request.request_status);
    setAdminNote(request.admin_note || "");
    setRejectionReason(request.rejection_reason || "");
    setShowStatusModal(true);
  };

  const updateStatus = async () => {
    if (!selectedRequest) return;

    try {
      setUpdating(true);

      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.replace("/admin-login");
        return;
      }

      const res = await fetch(
        "https://vision-career.co.jp/admin-update-placement-request-status.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            request_id: selectedRequest.id,
            request_status: newStatus,
            admin_note: adminNote || undefined,
            rejection_reason:
              newStatus === "rejected" ? rejectionReason : undefined,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data?.message || "Failed to update status");
      }

      await refetch();
      setShowStatusModal(false);
      toast.success(
        lang === "ja"
          ? "ステータスを更新しました"
          : "Status updated successfully",
      );
    } catch (err: any) {
      toast.error(
        err?.message ||
          (lang === "ja"
            ? "ステータスの更新に失敗しました"
            : "Failed to update status"),
      );
    } finally {
      setUpdating(false);
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <RefreshCw className="mx-auto mb-4 h-10 w-10 animate-spin text-slate-400 dark:text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {lang === "ja"
              ? "採用依頼を読み込み中..."
              : "Loading placement requests..."}
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
              {lang === "ja" ? "採用依頼管理" : "Placement Requests"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {lang === "ja"
                ? "企業からの採用依頼を一覧表示・管理します。"
                : "View and manage all placement requests from companies."}
            </p>
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
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
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
                  ? "企業名、求人タイトル、担当者名で検索..."
                  : "Search by company, job title, contact person..."
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as PlacementRequestStatus | "");
                setPage(1);
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-slate-400 md:w-48 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-600"
            >
              <option value="">
                {lang === "ja" ? "すべてのステータス" : "All Status"}
              </option>
              {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                <option key={status} value={status}>
                  {config.label[lang]}
                </option>
              ))}
            </select>
            <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* Status Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setStatusFilter("");
              setPage(1);
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              statusFilter === ""
                ? "bg-slate-900 text-white dark:bg-indigo-600"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            {lang === "ja" ? "すべて" : "All"} ({pagination?.total || 0})
          </button>
          {Object.entries(STATUS_CONFIG).map(([status, config]) => {
            const count = statusCounts[status as PlacementRequestStatus] || 0;
            return (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status as PlacementRequestStatus);
                  setPage(1);
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  statusFilter === status
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

      {/* Error State */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error.message}
        </div>
      )}

      {/* Empty State */}
      {placementRequests.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <Inbox className="mx-auto mb-4 h-10 w-10 text-slate-300 dark:text-slate-600" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {lang === "ja"
              ? "採用依頼が見つかりません"
              : "No placement requests found"}
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
            <table className="w-full min-w-[1200px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4 font-semibold">ID</th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "企業" : "Company"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "求人タイトル" : "Job Title"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "カテゴリー" : "Category"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "ステータス" : "Status"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "人数" : "Positions"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "作成日" : "Created"}
                  </th>
                  <th className="px-5 py-4 text-right font-semibold">
                    {lang === "ja" ? "操作" : "Actions"}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {placementRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-300">
                      #{request.id}
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {request.company_name || "-"}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {request.contact_person || "-"}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {request.job_title}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {request.employment_type || "-"}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                      {request.job_category
                        ? request.job_category.replace(/_/g, " ")
                        : "-"}
                    </td>

                    <td className="px-5 py-4">
                      {getStatusBadge(request.request_status)}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        {request.number_of_positions}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(lang, request.created_at)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="inline-flex items-center cursor-pointer gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {lang === "ja" ? "詳細" : "View"}
                        </button>

                        <button
                          onClick={() => handleStatusUpdate(request)}
                          className="inline-flex items-center cursor-pointer gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          {lang === "ja" ? "ステータス" : "Status"}
                        </button>

                        <button
                          onClick={() => handlePlaceCandidates(request)}
                          className="inline-flex items-center cursor-pointer gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          {lang === "ja" ? "候補者を配置" : "Place Candidates"}
                        </button>

                        <button
                          onClick={() => handleViewCandidates(request)}
                          className="inline-flex items-center cursor-pointer gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50"
                        >
                          <Users className="h-3.5 w-3.5" />
                          {lang === "ja"
                            ? "配置済み候補者"
                            : "Placed Candidates"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {pagination && pagination.total > 0 && (
            <div className="flex flex-col gap-4 rounded-br-3xl border-t border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-800">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {lang === "ja" ? (
                  <>
                    全 {pagination.total} 件中{" "}
                    {(pagination.page - 1) * pagination.limit + 1} -{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}{" "}
                    件を表示
                  </>
                ) : (
                  <>
                    Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}{" "}
                    of {pagination.total}
                  </>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-slate-600"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(1)}
                    disabled={pagination.page === 1 || isFetching}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {lang === "ja" ? "最初" : "First"}
                  </button>

                  <button
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={pagination.page === 1 || isFetching}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {lang === "ja" ? "前へ" : "Prev"}
                  </button>

                  <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    {pagination.page} / {pagination.total_pages || 1}
                  </span>

                  <button
                    onClick={() =>
                      setPage((prev) =>
                        Math.min(pagination.total_pages || 1, prev + 1),
                      )
                    }
                    disabled={
                      pagination.page === pagination.total_pages || isFetching
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {lang === "ja" ? "次へ" : "Next"}
                  </button>

                  <button
                    onClick={() => setPage(pagination.total_pages || 1)}
                    disabled={
                      pagination.page === pagination.total_pages || isFetching
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {lang === "ja" ? "最後" : "Last"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <DetailsModal
          lang={lang}
          setShowDetailsModal={setShowDetailsModal}
          selectedRequest={selectedRequest}
          getStatusBadge={getStatusBadge}
        />
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedRequest && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowStatusModal(false);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {lang === "ja" ? "ステータスを更新" : "Update Status"}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedRequest.job_title}
                </p>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={updating}
                className="rounded-full p-2 px-3 cursor-pointer text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "ステータス" : "Status"}
                </label>
                <select
                  value={newStatus}
                  onChange={(e) =>
                    setNewStatus(e.target.value as PlacementRequestStatus)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                >
                  {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                    <option key={status} value={status}>
                      {config.label[lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "管理者ノート" : "Admin Note"}
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  placeholder={
                    lang === "ja" ? "ノートを入力..." : "Enter note..."
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800"
                />
              </div>

              {newStatus === "rejected" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {lang === "ja" ? "却下理由" : "Rejection Reason"}
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={2}
                    placeholder={
                      lang === "ja"
                        ? "却下理由を入力..."
                        : "Enter rejection reason..."
                    }
                    className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:bg-white dark:border-rose-800 dark:bg-rose-900/20 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-rose-600 dark:focus:bg-rose-900/30"
                    required
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={updating}
                className="rounded-xl border cursor-pointer border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {lang === "ja" ? "キャンセル" : "Cancel"}
              </button>

              <button
                onClick={updateStatus}
                disabled={
                  updating ||
                  (newStatus === "rejected" && !rejectionReason.trim())
                }
                className="rounded-xl bg-slate-900 cursor-pointer px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-700"
              >
                {updating
                  ? lang === "ja"
                    ? "更新中..."
                    : "Updating..."
                  : lang === "ja"
                    ? "更新"
                    : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Place Candidates Modal */}
      {showCandidateModal && selectedPlacementRequest && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCandidateModal(false);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
        >
          <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-800">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4 dark:border-slate-700">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {lang === "ja" ? "候補者を配置" : "Place Candidates"}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {lang === "ja"
                    ? `${selectedPlacementRequest.company_name || ""} - ${selectedPlacementRequest.job_title}`
                    : `${selectedPlacementRequest.company_name || ""} - ${selectedPlacementRequest.job_title}`}
                </p>
              </div>
              <button
                onClick={() => setShowCandidateModal(false)}
                disabled={submittingCandidates}
                className="rounded-full p-2 px-3 cursor-pointer text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            {/* Search & Filters */}
            <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    value={candidateSearch}
                    onChange={(e) => {
                      setCandidateSearch(e.target.value);
                    }}
                    placeholder={
                      lang === "ja"
                        ? "名前、メール、希望職種で検索..."
                        : "Search by name, email, desired job..."
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  />
                </div>

                <button
                  onClick={() =>
                    fetchCandidates(selectedPlacementRequest.id, 1)
                  }
                  disabled={loadingCandidates}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                >
                  {loadingCandidates ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {lang === "ja" ? "更新" : "Refresh"}
                </button>
              </div>

              {/* Advanced Filters */}
              <div className="mt-3 flex flex-wrap gap-2">
                <select
                  value={candidateFilters.visa_type}
                  onChange={(e) => {
                    setCandidateFilters({
                      ...candidateFilters,
                      visa_type: e.target.value,
                    });
                    fetchCandidates(selectedPlacementRequest.id, 1);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-600"
                >
                  <option value="">
                    {lang === "ja" ? "ビザ種類" : "Visa Type"}
                  </option>
                  <option value="Engineer/Specialist in Humanities">
                    エンジニア/人文知識
                  </option>
                  <option value="Student">学生</option>
                  <option value="Spouse">配偶者</option>
                  <option value="Permanent Resident">永住者</option>
                  <option value="Other">その他</option>
                </select>

                <select
                  value={candidateFilters.japanese_level}
                  onChange={(e) => {
                    setCandidateFilters({
                      ...candidateFilters,
                      japanese_level: e.target.value,
                    });
                    fetchCandidates(selectedPlacementRequest.id, 1);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-600"
                >
                  <option value="">
                    {lang === "ja" ? "日本語レベル" : "Japanese Level"}
                  </option>
                  <option value="Native">ネイティブ</option>
                  <option value="Business">ビジネス</option>
                  <option value="Conversational">日常会話</option>
                  <option value="Beginner">初心者</option>
                </select>

                <input
                  type="text"
                  value={candidateFilters.desired_job}
                  onChange={(e) => {
                    setCandidateFilters({
                      ...candidateFilters,
                      desired_job: e.target.value,
                    });
                    fetchCandidates(selectedPlacementRequest.id, 1);
                  }}
                  placeholder={lang === "ja" ? "希望職種" : "Desired Job"}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-600"
                />

                <input
                  type="text"
                  value={candidateFilters.desired_location}
                  onChange={(e) => {
                    setCandidateFilters({
                      ...candidateFilters,
                      desired_location: e.target.value,
                    });
                    fetchCandidates(selectedPlacementRequest.id, 1);
                  }}
                  placeholder={
                    lang === "ja" ? "希望勤務地" : "Desired Location"
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-600"
                />
              </div>

              {/* Selected count */}
              {selectedCandidates.size > 0 && (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-2 dark:bg-emerald-900/30">
                  <span className="text-sm text-emerald-700 dark:text-emerald-400">
                    {lang === "ja"
                      ? `${selectedCandidates.size}名の候補者を選択中`
                      : `${selectedCandidates.size} candidate(s) selected`}
                  </span>
                </div>
              )}
            </div>

            {/* Candidates Table */}
            <div className="max-h-[50vh] overflow-y-auto px-6 py-4">
              {candidateError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  {candidateError}
                </div>
              )}

              {loadingCandidates ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400 dark:text-slate-500" />
                </div>
              ) : candidates.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {lang === "ja"
                      ? "条件に一致する求職者が見つかりません"
                      : "No job seekers found matching the criteria"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                      <tr>
                        <th className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={
                              selectedCandidates.size === candidates.length &&
                              candidates.length > 0
                            }
                            onChange={toggleAllCandidates}
                            className="h-4 w-4 rounded border-slate-300 cursor-pointer dark:border-slate-600 dark:bg-slate-700"
                          />
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          {lang === "ja" ? "名前" : "Name"}
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
                        <th className="px-4 py-3 text-center font-semibold">
                          {lang === "ja" ? "操作" : "Actions"}
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {candidates.map((candidate) => (
                        <tr
                          key={candidate.id}
                          className={`transition hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                            selectedCandidates.has(candidate.id)
                              ? "bg-emerald-50 dark:bg-emerald-900/20"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedCandidates.has(candidate.id)}
                              onChange={() => toggleCandidate(candidate.id)}
                              disabled={candidate.already_added === 1}
                              className="h-4 w-4 rounded border-slate-300 cursor-pointer disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                {candidate.name || "-"}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {candidate.nationality || "-"}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm">
                              <div className="text-slate-900 dark:text-white">
                                {candidate.email || "-"}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {candidate.phone || "-"}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                            {candidate.visa_type || "-"}
                            {candidate.visa_expiry_date && (
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {lang === "ja" ? "有効期限:" : "Exp:"}{" "}
                                {new Date(
                                  candidate.visa_expiry_date,
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                            {candidate.japanese_level || "-"}
                          </td>
                          <td className="px-4 py-3">
                            {candidate.already_added === 1 ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                                <Check className="h-3 w-3" />
                                {lang === "ja" ? "追加済み" : "Added"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <UserPlus className="h-3 w-3" />
                                {lang === "ja" ? "追加可能" : "Available"}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {candidate.already_added === 1 && (
                              <button
                                onClick={() =>
                                  handleRemoveClick(
                                    candidate.id,
                                    candidate.name || "Unknown",
                                  )
                                }
                                disabled={removingCandidateId === candidate.id}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed dark:border-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                              >
                                {removingCandidateId === candidate.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                                {lang === "ja" ? "削除" : "Remove"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Candidate Pagination */}
              {candidatePagination.total > 0 && (
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {lang === "ja"
                      ? `全 ${candidatePagination.total} 件中 ${(candidatePagination.page - 1) * candidatePagination.limit + 1} - ${Math.min(candidatePagination.page * candidatePagination.limit, candidatePagination.total)} 件`
                      : `Showing ${(candidatePagination.page - 1) * candidatePagination.limit + 1} - ${Math.min(candidatePagination.page * candidatePagination.limit, candidatePagination.total)} of ${candidatePagination.total}`}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        fetchCandidates(
                          selectedPlacementRequest.id,
                          candidatePagination.page - 1,
                        )
                      }
                      disabled={
                        candidatePagination.page === 1 || loadingCandidates
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {lang === "ja" ? "前へ" : "Prev"}
                    </button>
                    <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-sm dark:bg-slate-700 dark:text-slate-300">
                      {candidatePagination.page} /{" "}
                      {candidatePagination.total_pages}
                    </span>
                    <button
                      onClick={() =>
                        fetchCandidates(
                          selectedPlacementRequest.id,
                          candidatePagination.page + 1,
                        )
                      }
                      disabled={
                        candidatePagination.page ===
                          candidatePagination.total_pages || loadingCandidates
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {lang === "ja" ? "次へ" : "Next"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 rounded-b-3xl dark:border-slate-700 dark:bg-slate-800/50">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setShowCandidateModal(false)}
                  disabled={submittingCandidates}
                  className="rounded-xl border cursor-pointer border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {lang === "ja" ? "キャンセル" : "Cancel"}
                </button>

                <button
                  onClick={submitCandidates}
                  disabled={
                    selectedCandidates.size === 0 || submittingCandidates
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 cursor-pointer px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submittingCandidates ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {lang === "ja" ? "追加中..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      {lang === "ja"
                        ? `${selectedCandidates.size}名を追加`
                        : `Add ${selectedCandidates.size} candidate(s)`}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Candidate Confirmation Modal */}
      {showRemoveConfirm && candidateToRemove && selectedPlacementRequest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {lang === "ja" ? "候補者を削除" : "Remove Candidate"}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {lang === "ja"
                    ? `"${candidateToRemove.name}" を削除しますか？`
                    : `Remove "${candidateToRemove.name}"?`}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowRemoveConfirm(false);
                  setCandidateToRemove(null);
                }}
                disabled={removingCandidateId === candidateToRemove.id}
                className="rounded-full p-2 px-3 cursor-pointer text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-500" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                    {lang === "ja" ? "注意" : "Warning"}
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-500">
                    {lang === "ja"
                      ? "この候補者は配置リクエストから削除されます。この操作は元に戻せません。"
                      : "This candidate will be removed from the placement request. This action cannot be undone."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  setShowRemoveConfirm(false);
                  setCandidateToRemove(null);
                }}
                disabled={removingCandidateId === candidateToRemove.id}
                className="rounded-xl border cursor-pointer border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {lang === "ja" ? "キャンセル" : "Cancel"}
              </button>

              <button
                onClick={() => {
                  if (selectedPlacementRequest && candidateToRemove) {
                    removeCandidate(
                      selectedPlacementRequest.id,
                      candidateToRemove.id,
                    );
                  }
                }}
                disabled={removingCandidateId === candidateToRemove.id}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 cursor-pointer px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {removingCandidateId === candidateToRemove.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {lang === "ja" ? "削除中..." : "Removing..."}
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    {lang === "ja" ? "削除する" : "Remove"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* View Placed Candidates Modal */}
      {showCandidatesModal && selectedPlacementRequest && (
        <CandidatesModal
          lang={lang}
          setShowCandidatesModal={setShowCandidatesModal}
          selectedPlacementRequest={selectedPlacementRequest}
          setPlacementCandidates={setPlacementCandidates}
          placementCandidatesSearch={placementCandidatesSearch}
          setPlacementCandidatesSearch={setPlacementCandidatesSearch}
          candidateStatusFilter={candidateStatusFilter}
          setCandidateStatusFilter={setCandidateStatusFilter}
          placementCandidatesPagination={placementCandidatesPagination}
          setPlacementCandidatesPagination={setPlacementCandidatesPagination}
          placementCandidates={placementCandidates}
          loadingPlacementCandidates={loadingPlacementCandidates}
          fetchPlacementCandidates={fetchPlacementCandidates}
          placementCandidatesError={placementCandidatesError}
          handleStatusUpdateClick={handleStatusUpdateClick}
          getCandidateStatusBadge={getCandidateStatusBadge}
          getCandidateStatusLabel={getCandidateStatusLabel}
        />
      )}

      {/* Update Candidate Status Modal */}
      {showCandidateStatusModal && selectedPlacementCandidate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {lang === "ja"
                    ? "候補者ステータス更新"
                    : "Update Candidate Status"}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedPlacementCandidate.candidate_name}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCandidateStatusModal(false);
                  setSelectedPlacementCandidate(null);
                }}
                disabled={updatingCandidateStatus}
                className="rounded-full p-2 px-3 cursor-pointer text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "ステータス" : "Status"}
                </label>
                <select
                  value={newCandidateStatus}
                  onChange={(e) => setNewCandidateStatus(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                >
                  <option value="">
                    {lang === "ja" ? "ステータスを選択" : "Select status"}
                  </option>
                  {CANDIDATE_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label[lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "管理者ノート" : "Admin Note"}
                </label>
                <textarea
                  value={candidateStatusNote}
                  onChange={(e) => setCandidateStatusNote(e.target.value)}
                  rows={2}
                  placeholder={
                    lang === "ja" ? "ノートを入力..." : "Enter note..."
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "企業フィードバック" : "Company Feedback"}
                </label>
                <textarea
                  value={companyFeedback}
                  onChange={(e) => setCompanyFeedback(e.target.value)}
                  rows={2}
                  placeholder={
                    lang === "ja"
                      ? "フィードバックを入力..."
                      : "Enter feedback..."
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "面接日" : "Interview Date"}
                </label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  setShowCandidateStatusModal(false);
                  setSelectedPlacementCandidate(null);
                }}
                disabled={updatingCandidateStatus}
                className="rounded-xl border cursor-pointer border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {lang === "ja" ? "キャンセル" : "Cancel"}
              </button>

              <button
                onClick={updateCandidateStatus}
                disabled={updatingCandidateStatus || !newCandidateStatus}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 cursor-pointer px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-700"
              >
                {updatingCandidateStatus ? (
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
    </div>
  );
}

export function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400 dark:text-slate-500">{icon}</div>
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="text-sm text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
