"use client";

import { useState } from "react";
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
  Plus,
  Eye,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { useProviders } from "@/hooks/useProviders";
import { ProviderItem } from "@/hooks/useProviders";
import useDebounced from "@/hooks/useDebounced";
import toast from "react-hot-toast";
import EditJobProviderModal from "./EditModal";
import ViewProviderDetailsModal from "./ViewModal";
import DeleteProviderModal from "./DeleteModal";
import CreateProviderModal from "./CreateModal";

export default function AdminProvidersList() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedTerm = useDebounced(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [togglingProviderId, setTogglingProviderId] = useState<number | null>(
    null,
  );
  const [editingProvider, setEditingProvider] = useState<ProviderItem | null>(
    null,
  );
  const [deletingProvider, setDeletingProvider] = useState<ProviderItem | null>(
    null,
  );
  const [viewingProvider, setViewingProvider] = useState<ProviderItem | null>(
    null,
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createStatus, setCreateStatus] = useState("active");
  const [createCompanyName, setCreateCompanyName] = useState("");
  const [creating, setCreating] = useState(false);

  const [editData, setEditData] = useState({
    provider_id: "",
    name: "",
    company_name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    industry: "",
    contact_person: "",
    contact_person_phone: "",
    contact_person_email: "",
    status: "active",
    hiring_needs: "",
    notes: "",
    password: "",
  });

  const handleEditData = (key: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const {
    data: providersResponse,
    isLoading,
    isFetching,
    error: providersError,
    refetch,
  } = useProviders(page, limit, debouncedTerm);

  const providers = providersResponse?.data ?? [];
  const summary = providersResponse?.summary ?? null;
  const pagination = providersResponse?.pagination;

  const toggleProviderStatus = async (providerId: number) => {
    try {
      setTogglingProviderId(providerId);
      setError("");

      const token = localStorage.getItem("admin_token");

      if (!token) {
        router.replace("/admin-login");
        return;
      }

      const res = await fetch(
        "https://vision-career.co.jp/toggle_provider_status.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            provider_id: providerId,
          }),
        },
      );

      let data: {
        ok: boolean;
        message?: string;
        data?: {
          id: number;
          status: string;
        };
      } | null = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.message ||
            (lang === "ja"
              ? "ステータスの更新に失敗しました"
              : "Failed to update status"),
        );
      }

      await refetch();
    } catch (err: any) {
      console.error("Failed to toggle provider status:", err);
      setError(
        err?.message ||
          (lang === "ja"
            ? "ステータスの更新に失敗しました"
            : "Failed to update status"),
      );
    } finally {
      setTogglingProviderId(null);
    }
  };

  // Create modal handlers
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setCreateName("");
    setCreateEmail("");
    setCreatePassword("");
    setCreateStatus("active");
    setCreateCompanyName("");
    setError("");
  };

  const closeCreateModal = () => {
    if (creating) return;
    setIsCreateModalOpen(false);
    setCreateName("");
    setCreateEmail("");
    setCreatePassword("");
    setCreateStatus("active");
    setCreateCompanyName("");
    setError("");
  };

  const createProvider = async () => {
    try {
      setCreating(true);
      setError("");

      const token = localStorage.getItem("admin_token");

      if (!token) {
        router.replace("/admin-login");
        return;
      }

      const res = await fetch(
        "https://vision-career.co.jp/admin-create-company.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: createName,
            email: createEmail,
            password: createPassword,
            company_name: createCompanyName,
            status: createStatus,
          }),
        },
      );

      let data: {
        status: string;
        message?: string;
        user_id?: number;
      } | null = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok || !data?.status || data.status !== "success") {
        throw new Error(
          data?.message ||
            (lang === "ja"
              ? "クライアント企業の作成に失敗しました"
              : "Failed to create client company"),
        );
      }

      await refetch();
      closeCreateModal();
    } catch (err: any) {
      console.error("Failed to create provider:", err);
      setError(
        err?.message ||
          (lang === "ja"
            ? "クライアント企業の作成に失敗しました"
            : "Failed to create client company"),
      );
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (provider: ProviderItem) => {
    console.log(provider);
    setEditingProvider(provider);
    setEditData((prev) => ({
      ...prev,
      name: provider.name || "",
      email: provider.email || "",
      phone: provider.phone || "",
      address: provider.address || "",
      website: provider.website || "",
      industry: provider.industry || "",
      contact_person: provider.contactPerson || "",
      contact_person_phone: provider.contactPersonPhone || "",
      contact_person_email: provider.contactPersonEmail || "",
      hiring_needs: provider.hiringNeeds || "",
      notes: provider.notes || "",
      status: provider.status || "inactive",
      password: "",
    }));
  };

  const closeEditModal = () => {
    if (savingEdit) return;

    setEditingProvider(null);
    setEditData({
      provider_id: "",
      name: "",
      company_name: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      industry: "",
      contact_person: "",
      contact_person_phone: "",
      contact_person_email: "",
      hiring_needs: "",
      notes: "",
      status: "inactive",
      password: "",
    });
    setError("");
  };

  const updateProvider = async () => {
    if (!editingProvider) return;

    try {
      setSavingEdit(true);
      setError("");

      const token = localStorage.getItem("admin_token");

      if (!token) {
        router.replace("/admin-login");
        return;
      }

      const res = await fetch(
        "https://vision-career.co.jp/update_provider.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...editData,
            provider_id: editingProvider.id,
          }),
        },
      );

      let data: {
        ok: boolean;
        message?: string;
        data?: {
          id: number;
          name: string;
          company_name: string;
          email: string;
          status: string;
        };
      } | null = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.message ||
            (lang === "ja"
              ? "プロバイダーの更新に失敗しました"
              : "Failed to update provider"),
        );
      }

      toast.success(lang === "ja" ? "更新しました" : "Client Updated");
      await refetch();
      closeEditModal();
    } catch (err: any) {
      console.error("Failed to update provider:", err);
      setError(
        err?.message ||
          (lang === "ja"
            ? "プロバイダーの更新に失敗しました"
            : "Failed to update provider"),
      );
    } finally {
      setSavingEdit(false);
    }
  };

  const openDeleteModal = (provider: ProviderItem) => {
    setDeletingProvider(provider);
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setDeletingProvider(null);
  };

  const deleteProvider = async () => {
    if (!deletingProvider) return;

    try {
      setDeleting(true);
      setError("");

      const token = localStorage.getItem("admin_token");

      if (!token) {
        router.replace("/admin-login");
        return;
      }

      const res = await fetch(
        "https://vision-career.co.jp/delete_provider.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            provider_id: deletingProvider.id,
          }),
        },
      );

      let data: {
        ok: boolean;
        message?: string;
      } | null = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.message ||
            (lang === "ja"
              ? "プロバイダーの削除に失敗しました"
              : "Failed to delete provider"),
        );
      }

      if (providers.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await refetch();
      }

      closeDeleteModal();
    } catch (err: any) {
      console.error("Failed to delete provider:", err);
      setError(
        err?.message ||
          (lang === "ja"
            ? "プロバイダーの削除に失敗しました"
            : "Failed to delete provider"),
      );
    } finally {
      setDeleting(false);
    }
  };

  // View modal handlers
  const openViewModal = (provider: ProviderItem) => {
    setViewingProvider(provider);
  };

  const closeViewModal = () => {
    setViewingProvider(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <RefreshCw className="mx-auto mb-4 h-10 w-10 animate-spin text-slate-400 dark:text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {lang === "ja"
              ? "プロバイダー情報を読み込み中..."
              : "Loading providers..."}
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
              {lang === "ja" ? "クライアント企業" : "Client Companies"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {lang === "ja"
                ? "登録されているすべてのクライアント企業とそのアクティビティを表示します。"
                : "View all registered client companies and their activity."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              {lang === "ja" ? "新規作成" : "New Company"}
            </button>

            <button
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
          <label htmlFor="provider-search" className="sr-only">
            {lang === "ja" ? "プロバイダーを検索" : "Search providers"}
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            id="provider-search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={
              lang === "ja"
                ? "プロバイダー名、メール、会社名で検索..."
                : "Search by provider name, email, or company..."
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label={lang === "ja" ? "総企業数" : "Total Companies"}
          value={String(summary?.total_providers ?? providers.length)}
          lang={lang}
        />
        <StatCard
          icon={<Briefcase className="h-5 w-5" />}
          label={lang === "ja" ? "求人あり" : "With Vacancies"}
          value={String(summary?.providers_with_vacancies ?? 0)}
          lang={lang}
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label={lang === "ja" ? "求人なし" : "Without Vacancies"}
          value={String(summary?.providers_without_vacancies ?? 0)}
          lang={lang}
        />
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          label={lang === "ja" ? "総求人数" : "Total Vacancies"}
          value={String(summary?.total_vacancies_all_providers ?? 0)}
          lang={lang}
        />
        <StatCard
          icon={<Inbox className="h-5 w-5" />}
          label={lang === "ja" ? "総応募数" : "Total Applications"}
          value={String(summary?.total_applications_all_providers ?? 0)}
          lang={lang}
        />
      </div>

      {(error || providersError) && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error ||
            (providersError instanceof Error
              ? providersError.message
              : lang === "ja"
                ? "プロバイダーの読み込みに失敗しました"
                : "Failed to load providers")}
        </div>
      )}

      {providers.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-slate-300 dark:text-slate-600" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {lang === "ja"
              ? "プロバイダーが見つかりません"
              : "No providers found"}
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
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "ID" : "ID"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "プロバイダー名" : "Provider Name"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "会社名" : "Company"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "メール" : "Email"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "ステータス" : "Status"}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {lang === "ja" ? "求人数" : "Vacancies"}
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
                {providers.map((provider) => {
                  const isActive = provider.status === "active";
                  const isToggling = togglingProviderId === provider.id;

                  return (
                    <tr
                      key={provider.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-300">
                        #{provider.id}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {provider.name || "-"}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                        {provider.company_name ||
                          (lang === "ja" ? "会社名なし" : "No company name")}
                      </td>

                      <td className="px-5 py-4">
                        <div className="break-all text-slate-700 dark:text-slate-300">
                          {provider.email || "-"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            disabled={isToggling}
                            onClick={() => toggleProviderStatus(provider.id)}
                            className={`relative inline-flex h-7 w-11 cursor-pointer items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
                              isActive
                                ? "bg-emerald-500"
                                : "bg-slate-300 dark:bg-slate-600"
                            }`}
                            aria-label={
                              isActive
                                ? lang === "ja"
                                  ? "無効にする"
                                  : "Set inactive"
                                : lang === "ja"
                                  ? "有効にする"
                                  : "Set active"
                            }
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
                          {provider.statistics?.total_vacancies ?? 0}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {provider.statistics?.total_applications ??
                            provider.statistics?.total_applications_received ??
                            0}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openViewModal(provider)}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            {lang === "ja" ? "詳細" : "View"}
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(provider)}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            {lang === "ja" ? "編集" : "Edit"}
                          </button>

                          <button
                            type="button"
                            onClick={() => openDeleteModal(provider)}
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

      {/* View Provider Modal */}
      {viewingProvider && (
        <ViewProviderDetailsModal
          lang={lang}
          closeViewModal={closeViewModal}
          viewingProvider={viewingProvider}
        />
      )}

      {/* Create Provider Modal */}
      {isCreateModalOpen && (
        <CreateProviderModal
          lang={lang}
          closeCreateModal={closeCreateModal}
          creating={creating}
          error={error}
          createName={createName}
          createEmail={createEmail}
          createPassword={createPassword}
          createStatus={createStatus}
          createCompanyName={createCompanyName}
          createProvider={createProvider}
          setCreateName={setCreateName}
          setCreateEmail={setCreateEmail}
          setCreatePassword={setCreatePassword}
          setCreateStatus={setCreateStatus}
          setCreateCompanyName={setCreateCompanyName}
        />
      )}

      {/* Edit Provider Modal */}
      {editingProvider && (
        <EditJobProviderModal
          lang={lang}
          closeEditModal={closeEditModal}
          savingEdit={savingEdit}
          error={error}
          updateProvider={updateProvider}
          handleEditData={handleEditData}
          editData={editData}
        />
      )}

      {/* Delete Provider Modal */}
      {deletingProvider && (
        <DeleteProviderModal
          lang={lang}
          deletingProvider={deletingProvider}
          closeDeleteModal={closeDeleteModal}
          deleting={deleting}
          deleteProvider={deleteProvider}
        />
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  lang,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  lang: string;
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
