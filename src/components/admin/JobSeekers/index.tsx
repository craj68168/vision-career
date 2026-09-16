"use client";

import { useState } from "react";
import {
  Search,
  RefreshCw,
  AlertTriangle,
  Users,
  UserCheck,
  UserX,
  Inbox,
  Pencil,
  Trash2,
  Plus,
  Eye,
  User as UserIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { useSeekers, JobSeekerItem } from "@/hooks/useSeekers";
import useDebounced from "@/hooks/useDebounced";
import toast from "react-hot-toast";
import EditModal from "./EditModal";
import DeleteSeekerModal from "./DeleteModal";
import CreateSeekerModal from "./CreateModal";
import ViewSeekerModal from "./ViewModal";

// Define the form data types
interface CreateFormData {
  name: string;
  email: string;
  password: string;
  status: string;
}

interface EditFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  visaType: string;
  visaExpiryDate: string;
  japaneseLevel: string;
  desiredJob: string;
  desiredLocation: string;
  availableFrom: string;
  notes: string;
  status: string;
  placementStatus: string;
  password: string;
  resumeFile: File | null;
}

export default function AdminJobSeekersList() {
  const { lang } = useLanguage();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const debouncedTerm = useDebounced(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [togglingSeekerId, setTogglingSeekerId] = useState<number | null>(null);

  // Create modal states - using single object
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateFormData>({
    name: "",
    email: "",
    password: "",
    status: "active",
  });
  const [creating, setCreating] = useState(false);

  // Edit modal states - using single object
  const [editingSeeker, setEditingSeeker] = useState<JobSeekerItem | null>(
    null,
  );
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    visaType: "",
    visaExpiryDate: "",
    japaneseLevel: "",
    desiredJob: "",
    desiredLocation: "",
    availableFrom: "",
    notes: "",
    status: "inactive",
    placementStatus: "available",
    password: "",
    resumeFile: null,
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingSeeker, setDeletingSeeker] = useState<JobSeekerItem | null>(
    null,
  );
  const [viewingSeeker, setViewingSeeker] = useState<JobSeekerItem | null>(
    null,
  );

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const {
    data: seekersResponse,
    isLoading,
    isFetching,
    error: seekersError,
    refetch,
  } = useSeekers(page, limit, debouncedTerm);

  const seekers = seekersResponse?.data ?? [];
  const summary = seekersResponse?.summary ?? null;
  const pagination = seekersResponse?.pagination;

  // Helper function to handle create form changes
  const handleCreateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Helper function to reset create form
  const resetCreateForm = () => {
    setCreateFormData({
      name: "",
      email: "",
      password: "",
      status: "active",
    });
  };

  // Helper function to handle edit form changes
  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    // Handle file input separately
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      setEditFormData((prev) => ({
        ...prev,
        [name]: fileInput.files?.[0] || null,
      }));
      return;
    }

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Helper function to reset edit form
  const resetEditForm = () => {
    setEditFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      gender: "",
      nationality: "",
      visaType: "",
      visaExpiryDate: "",
      japaneseLevel: "",
      desiredJob: "",
      desiredLocation: "",
      availableFrom: "",
      notes: "",
      status: "inactive",
      placementStatus: "available",
      password: "",
      resumeFile: null,
    });
  };

  const getSeekerStatus = (seeker: JobSeekerItem) => {
    if (seeker.status) {
      return seeker.status.toLowerCase() === "active" ? "active" : "inactive";
    }

    if (typeof seeker.is_active === "boolean") {
      return seeker.is_active ? "active" : "inactive";
    }

    if (typeof seeker.is_active === "number") {
      return seeker.is_active === 1 ? "active" : "inactive";
    }

    return "inactive";
  };

  const toggleJobSeekerStatus = async (jobSeekerId: number) => {
    try {
      setTogglingSeekerId(jobSeekerId);
      setError("");

      const token = localStorage.getItem("admin_token");

      if (!token) {
        router.replace("/admin-login");
        return;
      }

      const res = await fetch(
        "https://vision-career.co.jp/toggle_jobseeker_status.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            job_seeker_id: jobSeekerId,
          }),
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.message ||
            (lang === "ja"
              ? "ステータスの更新に失敗しました"
              : "Failed to update status"),
        );
      }

      await refetch();
    } catch (err: unknown) {
      console.error("Failed to toggle job seeker status:", err);
      setError(
        err instanceof Error
          ? err.message
          : lang === "ja"
            ? "ステータスの更新に失敗しました"
            : "Failed to update status",
      );
    } finally {
      setTogglingSeekerId(null);
    }
  };

  // Create modal handlers
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    resetCreateForm();
    setError("");
  };

  const closeCreateModal = () => {
    if (creating) return;
    setIsCreateModalOpen(false);
    resetCreateForm();
    setError("");
  };

  const createJobSeeker = async () => {
    try {
      setCreating(true);
      setError("");

      const token = localStorage.getItem("admin_token");

      if (!token) {
        router.replace("/admin-login");
        return;
      }

      const res = await fetch(
        "https://vision-career.co.jp/admin-create-jobseeker.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: createFormData.name,
            email: createFormData.email,
            password: createFormData.password,
            status: createFormData.status,
          }),
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.status || data.status !== "success") {
        throw new Error(
          data?.message ||
            (lang === "ja"
              ? "求職者の作成に失敗しました"
              : "Failed to create job seeker"),
        );
      }

      await refetch();
      closeCreateModal();
    } catch (err: unknown) {
      console.error("Failed to create job seeker:", err);
      setError(
        err instanceof Error
          ? err.message
          : lang === "ja"
            ? "求職者の作成に失敗しました"
            : "Failed to create job seeker",
      );
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (seeker: JobSeekerItem) => {
    console.log(seeker);
    setEditingSeeker(seeker);
    setEditFormData({
      name: seeker.full_name || seeker.name || "",
      email: seeker.email || "",
      phone: seeker.phone || "",
      address: seeker.address || "",
      dateOfBirth: seeker.dateOfBirth || "",
      gender: seeker.gender || "",
      nationality: seeker.nationality || "",
      visaType: seeker.visaType || "",
      visaExpiryDate: seeker.visaExpiryDate || "",
      japaneseLevel: seeker.japaneseLevel || "",
      desiredJob: seeker.desiredJob || "",
      desiredLocation: seeker.desiredLocation || "",
      availableFrom: seeker.availableFrom || "",
      notes: seeker.notes || "",
      status: getSeekerStatus(seeker),
      placementStatus: seeker.placementStatus || "available",
      password: "",
      resumeFile: null,
    });
    setError("");
  };

  const closeEditModal = () => {
    if (savingEdit) return;
    setEditingSeeker(null);
    resetEditForm();
    setError("");
  };

  const updateJobSeeker = async () => {
    if (!editingSeeker) return;

    try {
      setSavingEdit(true);
      setError("");

      const token = localStorage.getItem("admin_token");

      if (!token) {
        router.replace("/admin-login");
        return;
      }

      // Prepare form data for file upload
      const formData = new FormData();
      formData.append("job_seeker_id", editingSeeker.id.toString());
      formData.append("name", editFormData.name);
      formData.append("email", editFormData.email);

      if (editFormData.phone) formData.append("phone", editFormData.phone);
      if (editFormData.address)
        formData.append("address", editFormData.address);
      if (editFormData.dateOfBirth)
        formData.append("date_of_birth", editFormData.dateOfBirth);
      if (editFormData.gender) formData.append("gender", editFormData.gender);
      if (editFormData.nationality)
        formData.append("nationality", editFormData.nationality);
      if (editFormData.visaType)
        formData.append("visa_type", editFormData.visaType);
      if (editFormData.visaExpiryDate)
        formData.append("visa_expiry_date", editFormData.visaExpiryDate);
      if (editFormData.japaneseLevel)
        formData.append("japanese_level", editFormData.japaneseLevel);
      if (editFormData.desiredJob)
        formData.append("desired_job", editFormData.desiredJob);
      if (editFormData.desiredLocation)
        formData.append("desired_location", editFormData.desiredLocation);
      if (editFormData.availableFrom)
        formData.append("available_from", editFormData.availableFrom);
      if (editFormData.notes) formData.append("notes", editFormData.notes);
      formData.append("status", editFormData.status);
      formData.append("placement_status", editFormData.placementStatus);

      if (editFormData.password.trim()) {
        formData.append("password", editFormData.password.trim());
      }

      if (editFormData.resumeFile) {
        formData.append("resume_file", editFormData.resumeFile);
      }

      const res = await fetch(
        "https://vision-career.co.jp/update_jobseeker.php",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.message ||
            (lang === "ja"
              ? "求職者の更新に失敗しました"
              : "Failed to update job seeker"),
        );
      }

      toast.success(
        lang === "ja" ? "求職者を更新しました" : "Job seeker updated",
      );
      await refetch();
      closeEditModal();
    } catch (err: unknown) {
      console.error("Failed to update job seeker:", err);
      setError(
        err instanceof Error
          ? err.message
          : lang === "ja"
            ? "求職者の更新に失敗しました"
            : "Failed to update job seeker",
      );
    } finally {
      setSavingEdit(false);
    }
  };

  const openDeleteModal = (seeker: JobSeekerItem) => {
    setDeletingSeeker(seeker);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeletingSeeker(null);
  };

  const deleteJobSeeker = async () => {
    if (!deletingSeeker) return;

    try {
      setDeleting(true);
      setError("");

      const token = localStorage.getItem("admin_token");

      if (!token) {
        router.replace("/admin-login");
        return;
      }

      const res = await fetch(
        "https://vision-career.co.jp/delete_jobseeker.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            job_seeker_id: deletingSeeker.id,
          }),
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.message ||
            (lang === "ja"
              ? "求職者の削除に失敗しました"
              : "Failed to delete job seeker"),
        );
      }

      closeDeleteModal();

      if (seekers.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await refetch();
      }
    } catch (err: unknown) {
      console.error("Failed to delete job seeker:", err);
      setError(
        err instanceof Error
          ? err.message
          : lang === "ja"
            ? "求職者の削除に失敗しました"
            : "Failed to delete job seeker",
      );
    } finally {
      setDeleting(false);
    }
  };

  // View modal handlers
  const openViewModal = (seeker: JobSeekerItem) => {
    setViewingSeeker(seeker);
  };

  const closeViewModal = () => {
    setViewingSeeker(null);
  };

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
            {lang === "ja"
              ? "求職者情報を読み込み中..."
              : "Loading job seekers..."}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {lang === "ja" ? "求職者" : "Job Seekers"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {lang === "ja"
                ? "登録されているすべての求職者とその応募活動を表示します。"
                : "View all registered job seekers and their application activity."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              {lang === "ja" ? "新規作成" : "New Job Seeker"}
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

        <div className="relative mt-4">
          <label htmlFor="job-seeker-search" className="sr-only">
            {lang === "ja" ? "求職者を検索" : "Search job seekers"}
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            id="job-seeker-search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={
              lang === "ja"
                ? "名前またはメールで検索..."
                : "Search by name or email..."
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label={lang === "ja" ? "総求職者数" : "Total Job Seekers"}
          value={String(summary?.total_job_seekers ?? seekers.length)}
        />
        <StatCard
          icon={<UserCheck className="h-5 w-5" />}
          label={lang === "ja" ? "アクティブ" : "Active"}
          value={String(summary?.active_job_seekers ?? 0)}
        />
        <StatCard
          icon={<UserX className="h-5 w-5" />}
          label={lang === "ja" ? "非アクティブ" : "Inactive"}
          value={String(summary?.inactive_job_seekers ?? 0)}
        />
        <StatCard
          icon={<Inbox className="h-5 w-5" />}
          label={lang === "ja" ? "応募済み" : "Applications Submitted"}
          value={String(summary?.total_applications_submitted ?? 0)}
        />
      </div>

      {(error || seekersError) && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error ||
            (seekersError instanceof Error
              ? seekersError.message
              : lang === "ja"
                ? "求職者の読み込みに失敗しました"
                : "Failed to load job seekers")}
        </div>
      )}

      {seekers.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-slate-300 dark:text-slate-600" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {lang === "ja" ? "求職者が見つかりません" : "No job seekers found"}
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
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4 font-semibold">ID</th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "名前" : "Name"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "メール" : "Email"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "ステータス" : "Status"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "応募数" : "Applications"}
                  </th>
                  <th className="px-5 py-4 text-right font-semibold">
                    {lang === "ja" ? "操作" : "Actions"}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {seekers.map((seeker) => {
                  const displayName = seeker.full_name || seeker.name || "-";
                  const status = getSeekerStatus(seeker);
                  const isActive = status === "active";
                  const isToggling = togglingSeekerId === seeker.id;

                  return (
                    <tr
                      key={seeker.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-300">
                        #{seeker.id}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {displayName}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="break-all text-slate-700 dark:text-slate-300">
                          {seeker.email || "-"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            disabled={isToggling}
                            onClick={() => toggleJobSeekerStatus(seeker.id)}
                            className={`relative inline-flex h-7 w-11 cursor-pointer items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
                              isActive
                                ? "bg-emerald-500"
                                : "bg-slate-300 dark:bg-slate-600"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                                isActive ? "translate-x-5" : "translate-x-1"
                              }`}
                            />
                          </button>

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {isToggling
                              ? lang === "ja"
                                ? "更新中..."
                                : "Updating..."
                              : isActive
                                ? lang === "ja"
                                  ? "有効"
                                  : "Active"
                                : lang === "ja"
                                  ? "無効"
                                  : "Inactive"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {seeker.statistics?.total_applications ??
                            seeker.statistics?.total_applications_submitted ??
                            0}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openViewModal(seeker)}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            {lang === "ja" ? "詳細" : "View"}
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(seeker)}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            {lang === "ja" ? "編集" : "Edit"}
                          </button>

                          <button
                            type="button"
                            onClick={() => openDeleteModal(seeker)}
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
          {pagination && pagination.total_records > 0 && (
            <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-800">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {lang === "ja" ? (
                  <>
                    全 {pagination.total_records} 件中{" "}
                    {(pagination.page - 1) * pagination.limit + 1} -{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total_records,
                    )}{" "}
                    件を表示
                  </>
                ) : (
                  <>
                    Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
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
                    disabled={!pagination.has_prev || isFetching}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {lang === "ja" ? "最初" : "First"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={!pagination.has_prev || isFetching}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {lang === "ja" ? "前へ" : "Prev"}
                  </button>

                  <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    {pagination.page} / {pagination.total_pages || 1}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((prev) =>
                        Math.min(pagination.total_pages || 1, prev + 1),
                      )
                    }
                    disabled={!pagination.has_next || isFetching}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {lang === "ja" ? "次へ" : "Next"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPage(pagination.total_pages || 1)}
                    disabled={!pagination.has_next || isFetching}
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

      {/* View Seeker Modal */}
      {viewingSeeker && (
        <ViewSeekerModal
          lang={lang}
          closeViewModal={closeViewModal}
          viewingSeeker={viewingSeeker}
        />
      )}

      {/* Create Job Seeker Modal */}
      {isCreateModalOpen && (
        <CreateSeekerModal
          lang={lang}
          closeCreateModal={closeCreateModal}
          creating={creating}
          error={error}
          createFormData={createFormData}
          handleCreateChange={handleCreateChange}
          createJobSeeker={createJobSeeker}
        />
      )}

      {/* Edit Job Seeker Modal */}
      {editingSeeker && (
        <EditModal
          lang={lang}
          closeEditModal={closeEditModal}
          savingEdit={savingEdit}
          error={error}
          editFormData={editFormData}
          handleEditChange={handleEditChange}
          editingSeeker={editingSeeker}
          updateJobSeeker={updateJobSeeker}
        />
      )}

      {/* Delete Job Seeker Modal */}
      {deletingSeeker && (
        <DeleteSeekerModal
          lang={lang}
          deletingSeeker={deletingSeeker}
          closeDeleteModal={closeDeleteModal}
          deleting={deleting}
          deleteJobSeeker={deleteJobSeeker}
        />
      )}
    </div>
  );
}

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
