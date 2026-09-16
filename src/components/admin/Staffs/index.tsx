"use client";

import { useState } from "react";
import {
  Search,
  RefreshCw,
  AlertTriangle,
  Users,
  UserCheck,
  UserX,
  UserCog,
  Pencil,
  Trash2,
  Plus,
  Eye,
  Mail,
  Calendar,
  Shield,
  Clock,
  User as UserIcon,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Key,
  BadgeCheck,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import {
  useStaffs,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
  useToggleStaffStatus,
  Staff,
  StaffStatus,
  StaffListParams,
} from "@/hooks/useStaffs";
import useDebounced from "@/hooks/useDebounced";
import toast from "react-hot-toast";

export default function AdminStaffList() {
  const { lang } = useLanguage();
  const router = useRouter();

  // Filter states
  const [search, setSearch] = useState("");
  const debouncedTerm = useDebounced(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<StaffStatus | "">("");
  const [sortBy, setSortBy] = useState<
    "id" | "username" | "status" | "created_at" | "updated_at"
  >("created_at");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [createUsername, setCreateUsername] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createStatus, setCreateStatus] = useState<StaffStatus>("active");

  const [editUsername, setEditUsername] = useState("");
  const [editStatus, setEditStatus] = useState<StaffStatus>("active");
  const [editPassword, setEditPassword] = useState("");

  // Error state
  const [error, setError] = useState("");
  const [togglingStaffId, setTogglingStaffId] = useState<number | null>(null);

  // Query and mutations
  const params: StaffListParams = {
    page,
    limit,
    search: debouncedTerm,
    status: statusFilter,
    sort_by: sortBy,
    sort_order: sortOrder,
  };

  const {
    data: staffResponse,
    isLoading,
    isFetching,
    error: staffError,
    refetch,
  } = useStaffs(params);

  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const deleteMutation = useDeleteStaff();
  const toggleStatusMutation = useToggleStaffStatus();

  const staffs = staffResponse?.data ?? [];
  const pagination = staffResponse?.pagination ?? null;

  // Helper: Status label
  const getStatusLabel = (
    status: StaffStatus,
  ): {
    label: string;
    color: string;
    darkColor: string;
    icon: React.ReactNode;
  } => {
    const map: Record<
      StaffStatus,
      {
        label: { ja: string; en: string };
        color: string;
        darkColor: string;
        icon: React.ReactNode;
      }
    > = {
      active: {
        label: { ja: "有効", en: "Active" },
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        darkColor:
          "dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
        icon: <BadgeCheck className="h-4 w-4 text-emerald-500" />,
      },
      inactive: {
        label: { ja: "無効", en: "Inactive" },
        color: "bg-slate-100 text-slate-600 border-slate-200",
        darkColor:
          "dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
        icon: <UserX className="h-4 w-4 text-slate-400" />,
      },
      suspended: {
        label: { ja: "停止中", en: "Suspended" },
        color: "bg-amber-50 text-amber-700 border-amber-200",
        darkColor:
          "dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
        icon: <ShieldAlert className="h-4 w-4 text-amber-500" />,
      },
    };

    const result = map[status];
    return {
      label: lang === "ja" ? result.label.ja : result.label.en,
      color: result.color,
      darkColor: result.darkColor,
      icon: result.icon,
    };
  };

  // Helper: Get next status for toggle
  const getNextStatus = (currentStatus: StaffStatus): StaffStatus => {
    if (currentStatus === "active") return "inactive";
    if (currentStatus === "inactive") return "active";
    return currentStatus;
  };

  // Helper: Get toggle tooltip
  const getToggleTooltip = (currentStatus: StaffStatus): string => {
    const nextStatus = getNextStatus(currentStatus);
    const statusMap: Record<StaffStatus, { ja: string; en: string }> = {
      active: { ja: "有効", en: "Active" },
      inactive: { ja: "無効", en: "Inactive" },
      suspended: { ja: "停止中", en: "Suspended" },
    };

    if (currentStatus === "suspended") {
      return lang === "ja"
        ? "停止中は編集から変更してください"
        : "Suspended status must be changed via edit";
    }

    return lang === "ja"
      ? `${statusMap[nextStatus].ja}に変更`
      : `Change to ${statusMap[nextStatus].en}`;
  };

  // Helper: Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString(lang === "ja" ? "ja-JP" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Handlers
  const handleCreate = () => {
    setError("");
    setCreateUsername("");
    setCreatePassword("");
    setCreateStatus("active");
    setIsCreateModalOpen(true);
  };

  const handleEdit = (staff: Staff) => {
    setError("");
    setSelectedStaff(staff);
    setEditUsername(staff.username);
    setEditStatus(staff.status);
    setEditPassword("");
    setIsEditModalOpen(true);
  };

  const handleView = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsViewModalOpen(true);
  };

  const handleDelete = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = async (staffId: number) => {
    try {
      setTogglingStaffId(staffId);
      setError("");

      await toggleStatusMutation.mutateAsync({ id: staffId });

      toast.success(
        lang === "ja"
          ? "ステータスを更新しました"
          : "Status updated successfully",
      );
    } catch (err) {
      console.error("Failed to toggle staff status:", err);
      setError(
        err instanceof Error
          ? err.message
          : lang === "ja"
            ? "ステータスの更新に失敗しました"
            : "Failed to update status",
      );
      toast.error(
        err instanceof Error
          ? err.message
          : lang === "ja"
            ? "ステータスの更新に失敗しました"
            : "Failed to update status",
      );
    } finally {
      setTogglingStaffId(null);
    }
  };

  const submitCreate = async () => {
    if (!createUsername.trim() || !createPassword.trim()) {
      setError(
        lang === "ja"
          ? "ユーザー名とパスワードは必須です"
          : "Username and password are required",
      );
      return;
    }

    if (createPassword.length < 6) {
      setError(
        lang === "ja"
          ? "パスワードは6文字以上必要です"
          : "Password must be at least 6 characters",
      );
      return;
    }

    try {
      await createMutation.mutateAsync({
        username: createUsername.trim(),
        password: createPassword,
        status: createStatus,
      });

      toast.success(
        lang === "ja" ? "スタッフを作成しました" : "Staff created successfully",
      );
      setIsCreateModalOpen(false);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create staff");
    }
  };

  const submitEdit = async () => {
    if (!selectedStaff) return;
    if (!editUsername.trim()) {
      setError(lang === "ja" ? "ユーザー名は必須です" : "Username is required");
      return;
    }

    if (editPassword && editPassword.length < 6) {
      setError(
        lang === "ja"
          ? "パスワードは6文字以上必要です"
          : "Password must be at least 6 characters",
      );
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: selectedStaff.id,
        username: editUsername.trim(),
        ...(editPassword ? { password: editPassword } : {}),
        status: editStatus,
      });

      toast.success(
        lang === "ja" ? "スタッフを更新しました" : "Staff updated successfully",
      );
      setIsEditModalOpen(false);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update staff");
    }
  };

  const submitDelete = async () => {
    if (!selectedStaff) return;

    try {
      await deleteMutation.mutateAsync({
        id: selectedStaff.id,
      });

      toast.success(
        lang === "ja" ? "スタッフを削除しました" : "Staff deleted successfully",
      );
      setIsDeleteModalOpen(false);
      setSelectedStaff(null);

      if (staffs.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete staff");
    }
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(false);
    setError("");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
        <div
          className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
          role="status"
          aria-busy="true"
        >
          <RefreshCw className="mx-auto mb-4 h-10 w-10 animate-spin text-slate-400 dark:text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {lang === "ja" ? "スタッフ情報を読み込み中..." : "Loading staff..."}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8">
      {/* Header Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {lang === "ja" ? "スタッフ管理" : "Staff Management"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {lang === "ja"
                ? "システムスタッフの管理を行います。"
                : "Manage system staff members."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              {lang === "ja" ? "新規スタッフ" : "New Staff"}
            </button>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              {lang === "ja" ? "更新" : "Refresh"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="relative">
            <label htmlFor="staff-search" className="sr-only">
              {lang === "ja" ? "スタッフを検索" : "Search staff"}
            </label>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              id="staff-search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={
                lang === "ja" ? "ユーザー名で検索..." : "Search by username..."
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as StaffStatus | "");
              setPage(1);
            }}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
          >
            <option value="">
              {lang === "ja" ? "全てのステータス" : "All Statuses"}
            </option>
            <option value="active">{lang === "ja" ? "有効" : "Active"}</option>
            <option value="inactive">
              {lang === "ja" ? "無効" : "Inactive"}
            </option>
            <option value="suspended">
              {lang === "ja" ? "停止中" : "Suspended"}
            </option>
          </select>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as typeof sortBy);
                setPage(1);
              }}
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
            >
              <option value="id">ID</option>
              <option value="username">
                {lang === "ja" ? "ユーザー名" : "Username"}
              </option>
              <option value="status">
                {lang === "ja" ? "ステータス" : "Status"}
              </option>
              <option value="created_at">
                {lang === "ja" ? "作成日" : "Created"}
              </option>
              <option value="updated_at">
                {lang === "ja" ? "更新日" : "Updated"}
              </option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
                setPage(1);
              }}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {sortOrder === "ASC" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label={lang === "ja" ? "総スタッフ数" : "Total Staff"}
          value={String(pagination?.total_records ?? staffs.length)}
        />
        <StatCard
          icon={<UserCheck className="h-5 w-5" />}
          label={lang === "ja" ? "有効" : "Active"}
          value={String(
            staffs.filter((s) => s.status === "active").length ?? 0,
          )}
        />
        <StatCard
          icon={<UserX className="h-5 w-5" />}
          label={lang === "ja" ? "無効" : "Inactive"}
          value={String(
            staffs.filter((s) => s.status === "inactive").length ?? 0,
          )}
        />
        <StatCard
          icon={<ShieldAlert className="h-5 w-5" />}
          label={lang === "ja" ? "停止中" : "Suspended"}
          value={String(
            staffs.filter((s) => s.status === "suspended").length ?? 0,
          )}
        />
      </div>

      {/* Error Display */}
      {(error || staffError) && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error ||
            (staffError instanceof Error
              ? staffError.message
              : lang === "ja"
                ? "スタッフの読み込みに失敗しました"
                : "Failed to load staff")}
        </div>
      )}

      {/* Staff Table */}
      {staffs.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-slate-300 dark:text-slate-600" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {lang === "ja" ? "スタッフが見つかりません" : "No staff found"}
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
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4 font-semibold">ID</th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "ユーザー名" : "Username"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "ステータス" : "Status"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "作成日" : "Created"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "更新日" : "Updated"}
                  </th>
                  <th className="px-5 py-4 text-right font-semibold">
                    {lang === "ja" ? "操作" : "Actions"}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {staffs.map((staff) => {
                  const statusInfo = getStatusLabel(staff.status);
                  const isToggling = togglingStaffId === staff.id;
                  const canToggle = staff.status !== "suspended";
                  const nextStatus = getNextStatus(staff.status);

                  return (
                    <tr
                      key={staff.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-300">
                        #{staff.id}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {staff.username}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {/* Status Toggle Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(staff.id)}
                            disabled={isToggling || !canToggle}
                            className={`relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${
                              staff.status === "active"
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : staff.status === "inactive"
                                  ? "bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500"
                                  : "bg-amber-400 cursor-not-allowed opacity-50 dark:bg-amber-600"
                            } ${isToggling ? "cursor-wait" : ""}`}
                            title={getToggleTooltip(staff.status)}
                            aria-label={
                              lang === "ja"
                                ? `ステータスを切り替え (現在: ${statusInfo.label})`
                                : `Toggle status (current: ${statusInfo.label})`
                            }
                          >
                            {isToggling ? (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="h-4 w-4 animate-spin text-white" />
                              </div>
                            ) : (
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                                  staff.status === "active"
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            )}
                          </button>

                          {/* Status Badge */}
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.color} ${statusInfo.darkColor}`}
                          >
                            {statusInfo.icon}
                            {statusInfo.label}
                          </span>
                        </div>

                        {/* Status change indicator */}
                        {canToggle && staff.status !== "suspended" && (
                          <span className="mt-1 block text-[10px] text-slate-400 dark:text-slate-500">
                            {lang === "ja"
                              ? `クリックで${nextStatus === "active" ? "有効" : "無効"}に`
                              : `Click to ${nextStatus === "active" ? "activate" : "deactivate"}`}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                          {formatDate(staff.created_at)}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                          {formatDate(staff.updated_at)}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleView(staff)}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            {lang === "ja" ? "詳細" : "View"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEdit(staff)}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            {lang === "ja" ? "編集" : "Edit"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(staff)}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {lang === "ja" ? "削除" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.total_records > 0 && (
            <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-800">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {lang === "ja" ? (
                  <>
                    全 {pagination.total_records} 件中{" "}
                    {(pagination.current_page - 1) * pagination.limit + 1} -{" "}
                    {Math.min(
                      pagination.current_page * pagination.limit,
                      pagination.total_records,
                    )}{" "}
                    件を表示
                  </>
                ) : (
                  <>
                    Showing{" "}
                    {(pagination.current_page - 1) * pagination.limit + 1} -{" "}
                    {Math.min(
                      pagination.current_page * pagination.limit,
                      pagination.total_records,
                    )}{" "}
                    of {pagination.total_records}
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

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage(1)}
                    disabled={!pagination.has_previous_page || isFetching}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {lang === "ja" ? "最初" : "First"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={!pagination.has_previous_page || isFetching}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {lang === "ja" ? "前へ" : "Prev"}
                  </button>

                  <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    {pagination.current_page} / {pagination.total_pages}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((prev) =>
                        Math.min(pagination.total_pages, prev + 1),
                      )
                    }
                    disabled={!pagination.has_next_page || isFetching}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {lang === "ja" ? "次へ" : "Next"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPage(pagination.total_pages)}
                    disabled={!pagination.has_next_page || isFetching}
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

      {/* Create Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={closeModals}
          title={lang === "ja" ? "新規スタッフ作成" : "Create Staff"}
          description={
            lang === "ja"
              ? "新しいスタッフアカウントを作成します。"
              : "Create a new staff account."
          }
          error={error}
          isLoading={createMutation.isPending}
          onConfirm={submitCreate}
          confirmLabel={lang === "ja" ? "作成" : "Create"}
          cancelLabel={lang === "ja" ? "キャンセル" : "Cancel"}
          lang={lang}
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ja" ? "ユーザー名 *" : "Username *"}
              </label>
              <input
                type="text"
                value={createUsername}
                onChange={(e) => setCreateUsername(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                placeholder={
                  lang === "ja" ? "ユーザー名を入力" : "Enter username"
                }
                autoFocus
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ja" ? "パスワード *" : "Password *"}
              </label>
              <input
                type="password"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                placeholder={
                  lang === "ja"
                    ? "パスワードを入力（6文字以上）"
                    : "Enter password (min 6 characters)"
                }
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {lang === "ja"
                  ? "パスワードは6文字以上で入力してください。"
                  : "Password must be at least 6 characters long."}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ja" ? "ステータス" : "Status"}
              </label>
              <select
                value={createStatus}
                onChange={(e) => setCreateStatus(e.target.value as StaffStatus)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
              >
                <option value="active">
                  {lang === "ja" ? "有効" : "Active"}
                </option>
                <option value="inactive">
                  {lang === "ja" ? "無効" : "Inactive"}
                </option>
                <option value="suspended">
                  {lang === "ja" ? "停止中" : "Suspended"}
                </option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedStaff && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={closeModals}
          title={lang === "ja" ? "スタッフ編集" : "Edit Staff"}
          description={
            lang === "ja"
              ? `"${selectedStaff.username}" の情報を編集します。`
              : `Editing "${selectedStaff.username}"`
          }
          error={error}
          isLoading={updateMutation.isPending}
          onConfirm={submitEdit}
          confirmLabel={lang === "ja" ? "保存" : "Save"}
          cancelLabel={lang === "ja" ? "キャンセル" : "Cancel"}
          lang={lang}
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ja" ? "ユーザー名 *" : "Username *"}
              </label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                placeholder={
                  lang === "ja" ? "ユーザー名を入力" : "Enter username"
                }
                autoFocus
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ja" ? "新しいパスワード" : "New Password"}
              </label>
              <input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                placeholder={
                  lang === "ja"
                    ? "変更する場合のみ入力（6文字以上）"
                    : "Enter only if you want to change it (min 6 chars)"
                }
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {lang === "ja"
                  ? "空欄のままにすると、現在のパスワードは変更されません。"
                  : "Leave blank to keep the current password unchanged."}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ja" ? "ステータス" : "Status"}
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as StaffStatus)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
              >
                <option value="active">
                  {lang === "ja" ? "有効" : "Active"}
                </option>
                <option value="inactive">
                  {lang === "ja" ? "無効" : "Inactive"}
                </option>
                <option value="suspended">
                  {lang === "ja" ? "停止中" : "Suspended"}
                </option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedStaff && (
        <ViewModal
          isOpen={isViewModalOpen}
          onClose={closeModals}
          staff={selectedStaff}
          lang={lang}
          formatDate={formatDate}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedStaff && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeModals}
          staff={selectedStaff}
          lang={lang}
          isLoading={deleteMutation.isPending}
          onConfirm={submitDelete}
        />
      )}
    </div>
  );
}

// ============================================================================
// Subcomponents
// ============================================================================

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        {icon}
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  error?: string;
  isLoading: boolean;
  onConfirm: () => void;
  confirmLabel: string;
  cancelLabel: string;
  lang: string;
}

function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  error,
  isLoading,
  onConfirm,
  confirmLabel,
  cancelLabel,
  lang,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
    >
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6">{children}</div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="cursor-pointer rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                {confirmLabel}
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff;
  lang: string;
  formatDate: (date: string) => string;
}

function ViewModal({
  isOpen,
  onClose,
  staff,
  lang,
  formatDate,
}: ViewModalProps) {
  if (!isOpen) return null;

  const getStatusInfo = (status: StaffStatus) => {
    const map: Record<
      StaffStatus,
      { label: string; icon: React.ReactNode; color: string; darkColor: string }
    > = {
      active: {
        label: lang === "ja" ? "有効" : "Active",
        icon: <BadgeCheck className="h-5 w-5 text-emerald-500" />,
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        darkColor:
          "dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
      },
      inactive: {
        label: lang === "ja" ? "無効" : "Inactive",
        icon: <UserX className="h-5 w-5 text-slate-400" />,
        color: "bg-slate-50 text-slate-700 border-slate-200",
        darkColor:
          "dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      },
      suspended: {
        label: lang === "ja" ? "停止中" : "Suspended",
        icon: <ShieldAlert className="h-5 w-5 text-amber-500" />,
        color: "bg-amber-50 text-amber-700 border-amber-200",
        darkColor:
          "dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
      },
    };
    return map[status];
  };

  const statusInfo = getStatusInfo(staff.status);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === "ja" ? "スタッフ詳細" : "Staff Details"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {lang === "ja" ? "スタッフの詳細情報" : "Staff member details"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                <UserIcon className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {staff.username}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  ID: #{staff.id}
                </p>
              </div>
            </div>
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${statusInfo.color} ${statusInfo.darkColor}`}
            >
              {statusInfo.icon}
              {statusInfo.label}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "基本情報" : "Basic Information"}
              </h5>

              <InfoRow
                icon={<UserIcon className="h-4 w-4" />}
                label={lang === "ja" ? "ユーザー名" : "Username"}
                value={staff.username}
              />

              <InfoRow
                icon={<Shield className="h-4 w-4" />}
                label={lang === "ja" ? "ステータス" : "Status"}
                value={statusInfo.label}
              />
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "タイムスタンプ" : "Timestamps"}
              </h5>

              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label={lang === "ja" ? "作成日" : "Created At"}
                value={formatDate(staff.created_at)}
              />

              <InfoRow
                icon={<Clock className="h-4 w-4" />}
                label={lang === "ja" ? "更新日" : "Updated At"}
                value={formatDate(staff.updated_at)}
              />
            </div>
          </div>

          {/* Permissions Placeholder */}
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {lang === "ja" ? "権限" : "Permissions"}
            </h5>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                {lang === "ja" ? "管理アクセス" : "Admin Access"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                <ShieldOff className="h-3.5 w-3.5" />
                {lang === "ja" ? "通常アクセス" : "Standard Access"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff;
  lang: string;
  isLoading: boolean;
  onConfirm: () => void;
}

function DeleteModal({
  isOpen,
  onClose,
  staff,
  lang,
  isLoading,
  onConfirm,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <Trash2 className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          {lang === "ja" ? "スタッフを削除" : "Delete Staff"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {lang === "ja"
            ? `スタッフ "${staff.username}" を削除してもよろしいですか？この操作は元に戻せません。`
            : `Are you sure you want to delete "${staff.username}"? This action cannot be undone.`}
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/50">
          <p className="font-semibold text-slate-900 dark:text-white">
            {staff.username}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            ID: #{staff.id}
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {lang === "ja" ? "キャンセル" : "Cancel"}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="cursor-pointer rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-500 dark:hover:bg-red-600"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                {lang === "ja" ? "削除中..." : "Deleting..."}
              </span>
            ) : lang === "ja" ? (
              "削除"
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400 dark:text-slate-500">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
