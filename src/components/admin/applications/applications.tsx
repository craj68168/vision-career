"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Building2,
  Briefcase,
  MapPin,
  Search,
  Users,
  RefreshCw,
  AlertTriangle,
  Mail,
  Phone,
  Clock3,
  Eye,
  Inbox,
  CheckCircle2,
  User,
  CalendarDays,
  Pencil,
  Trash2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ApplicationDetails, {
  statusBadge,
  formatDate,
} from "./ApplicationDetails";
import ApplicationEditModal from "./EditModal";
import ApplicationDeleteModal from "./DeleteModal";

type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "rejected"
  | "hired";

type AdminUser = {
  id: number;
  role: string;
};

type Provider = {
  id: number;
  name?: string;
  email?: string;
};

export type VacancyLite = {
  id: number;
  company_name: string;
  company_name_kana?: string;
  title: string;
  title_kana?: string;
  employment_type?: string;
  number_of_people?: number;
  work_location?: string;
  salary_min?: number;
  salary_max?: number;
  application_deadline?: string | null;
  total_applications?: number;
};

type AdminApplication = {
  application_id: number;
  vacancy_id: number;
  jobseeker_id: number;
  full_name: string;
  email: string;
  phone: string;
  current_location?: string;
  cover_letter?: string;
  cv_file_path?: string;
  status: ApplicationStatus;
  applied_at: string;
  vacancy: VacancyLite;
  provider: Provider;
};

type Summary = {
  total_applications: number;
  by_status: {
    pending: number;
    reviewed: number;
    shortlisted: number;
    rejected: number;
    hired: number;
  };
  total_vacancies: number;
  total_providers: number;
  date_range?: {
    first_application?: string | null;
    last_application?: string | null;
  };
};

type TopProvider = {
  provider_id: number;
  provider_name?: string;
  provider_email?: string;
  total_applications: number;
  total_vacancies: number;
};

type DailyStat = {
  date: string;
  count: number;
  pending: string;
  reviewed: string;
  shortlisted: string;
  rejected: string;
  hired: string;
};

type Pagination = {
  current_page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
};

type AdminApplicationsResponse = {
  ok: boolean;
  admin: AdminUser;
  summary: Summary;
  top_providers: TopProvider[];
  daily_stats: DailyStat[];
  pagination: Pagination;
  filters_applied: {
    status: string | null;
    provider_id: number | null;
    vacancy_id: number | null;
    search: string | null;
    date_from: string | null;
    date_to: string | null;
    sort_by: string | null;
    sort_order: string | null;
  };
  data: AdminApplication[];
  message?: string;
};

export default function AdminApplicationsPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [topProviders, setTopProviders] = useState<TopProvider[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedApplication, setSelectedApplication] =
    useState<AdminApplication | null>(null);

  const [editingApplication, setEditingApplication] =
    useState<AdminApplication | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    current_location: "",
    status: "pending" as ApplicationStatus,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const [deletingApplication, setDeletingApplication] =
    useState<AdminApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.replace("/admin-login");
      return;
    }

    fetchApplications();
  }, [router]);

  const fetchApplications = async () => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.replace("/admin-login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://vision-career.co.jp/get_admin_applications.php",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      let data: AdminApplicationsResponse | null = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("admin_token");
        router.replace("/admin-login");
        return;
      }

      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.message ||
            (lang === "ja"
              ? "応募情報の取得に失敗しました"
              : "Failed to fetch applications"),
        );
      }

      setAdmin(data.admin || null);
      setSummary(data.summary || null);
      setTopProviders(
        Array.isArray(data.top_providers) ? data.top_providers : [],
      );
      setDailyStats(Array.isArray(data.daily_stats) ? data.daily_stats : []);
      setPagination(data.pagination || null);
      setApplications(Array.isArray(data.data) ? data.data : []);
    } catch (err: any) {
      console.error("Failed to fetch applications:", err);
      setError(
        err?.message ||
          (lang === "ja"
            ? "アプリケーションの読み込みに失敗しました"
            : "Failed to load applications"),
      );
    } finally {
      setLoading(false);
      setIsCheckingAuth(false);
    }
  };

  const openEditModal = (application: AdminApplication) => {
    setEditingApplication(application);
    setEditForm({
      full_name: application.full_name,
      email: application.email,
      phone: application.phone,
      current_location: application.current_location || "",
      status: application.status,
    });
    setEditError("");
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    if (!editingApplication) return;

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin-login");
      return;
    }

    setIsSaving(true);
    setEditError("");

    try {
      const res = await fetch(
        "https://vision-career.co.jp/admin-update-application.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            application_id: editingApplication.application_id,
            full_name: editForm.full_name,
            email: editForm.email,
            phone: editForm.phone,
            current_location: editForm.current_location,
            status: editForm.status,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(
          data?.message ||
            (lang === "ja"
              ? "更新に失敗しました"
              : "Failed to update application"),
        );
      }

      setApplications((prev) =>
        prev.map((app) =>
          app.application_id === editingApplication.application_id
            ? {
                ...app,
                full_name: editForm.full_name,
                email: editForm.email,
                phone: editForm.phone,
                current_location: editForm.current_location,
                status: editForm.status,
              }
            : app,
        ),
      );

      fetchApplications();
      setEditingApplication(null);
    } catch (err: any) {
      console.error("Failed to update application:", err);
      setEditError(
        err?.message ||
          (lang === "ja"
            ? "更新中にエラーが発生しました"
            : "Error occurred while updating"),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = (application: AdminApplication) => {
    setDeletingApplication(application);
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (!deletingApplication) return;

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin-login");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch(
        "https://vision-career.co.jp/admin-delete-application.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            application_id: deletingApplication.application_id,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(
          data?.message ||
            (lang === "ja"
              ? "削除に失敗しました"
              : "Failed to delete application"),
        );
      }

      setApplications((prev) =>
        prev.filter(
          (app) => app.application_id !== deletingApplication.application_id,
        ),
      );

      fetchApplications();
      setDeletingApplication(null);
    } catch (err: any) {
      console.error("Failed to delete application:", err);
      setDeleteError(
        err?.message ||
          (lang === "ja"
            ? "削除中にエラーが発生しました"
            : "Error occurred while deleting"),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredApplications = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return applications;

    return applications.filter((application) => {
      const haystack = [
        application.full_name,
        application.email,
        application.phone,
        application.current_location,
        application.status,
        application.vacancy?.title,
        application.vacancy?.company_name,
        application.vacancy?.employment_type,
        application.vacancy?.work_location,
        application.provider?.name,
        application.provider?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [applications, search]);

  const statusLabels = {
    pending: lang === "ja" ? "保留中" : "pending",
    reviewed: lang === "ja" ? "審査中" : "reviewed",
    shortlisted: lang === "ja" ? "選考中" : "shortlisted",
    rejected: lang === "ja" ? "不合格" : "rejected",
    hired: lang === "ja" ? "採用" : "hired",
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <RefreshCw className="mx-auto mb-4 h-10 w-10 animate-spin text-slate-400 dark:text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {lang === "ja"
              ? "応募情報を読み込み中..."
              : "Loading applications..."}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <StatCard
              icon={<Inbox className="h-5 w-5" />}
              label={lang === "ja" ? "応募数" : "Applications"}
              value={String(summary?.total_applications ?? applications.length)}
              lang={lang}
            />
            <StatCard
              icon={<Briefcase className="h-5 w-5" />}
              label={lang === "ja" ? "求人数" : "Vacancies"}
              value={String(summary?.total_vacancies ?? 0)}
              lang={lang}
            />
            <StatCard
              icon={<Users className="h-5 w-5" />}
              label={lang === "ja" ? "プロバイダー数" : "Providers"}
              value={String(summary?.total_providers ?? 0)}
              lang={lang}
            />
            <StatCard
              icon={<Clock3 className="h-5 w-5" />}
              label={lang === "ja" ? "保留中" : "Pending"}
              value={String(summary?.by_status?.pending ?? 0)}
              lang={lang}
            />
            <StatCard
              icon={<Eye className="h-5 w-5" />}
              label={lang === "ja" ? "審査中" : "Reviewed"}
              value={String(summary?.by_status?.reviewed ?? 0)}
              lang={lang}
            />
            <StatCard
              icon={<CheckCircle2 className="h-5 w-5" />}
              label={lang === "ja" ? "選考中" : "Shortlisted"}
              value={String(summary?.by_status?.shortlisted ?? 0)}
              lang={lang}
            />
          </div>

          <div className="mb-8 grid gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {lang === "ja" ? "応募を検索" : "Search Applications"}
              </h2>
              <div className="relative mt-4">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    lang === "ja"
                      ? "応募者、プロバイダー、求人、企業、メール、電話、場所で検索..."
                      : "Search by applicant, provider, vacancy, company, email, phone, or location..."
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800"
                />
              </div>
              {pagination && (
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  {lang === "ja"
                    ? `${pagination.current_page} / ${pagination.total_pages} ページ • 合計 ${pagination.total_count} 件`
                    : `Page ${pagination.current_page} of ${pagination.total_pages} • ${pagination.total_count} total records`}
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {lang === "ja" ? "期間" : "Date Range"}
              </h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {lang === "ja" ? "最初の応募" : "First Application"}
                  </p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {formatDate(
                      summary?.date_range?.first_application || "-",
                      lang,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {lang === "ja" ? "最後の応募" : "Last Application"}
                  </p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {formatDate(
                      summary?.date_range?.last_application || "-",
                      lang,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {lang === "ja" ? "管理者ロール" : "Admin Role"}
                  </p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {admin?.role || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm mb-8 dark:border-slate-700 dark:bg-slate-800">
              <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-slate-300 dark:text-slate-600" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {lang === "ja"
                  ? "応募が見つかりません"
                  : "No applications found"}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {lang === "ja"
                  ? "現在の検索条件に一致する応募はありません。"
                  : "There are no applications matching your current search."}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2 mb-8">
              {filteredApplications.map((application) => (
                <article
                  key={application.application_id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          {lang === "ja"
                            ? `応募 #${application.application_id}`
                            : `Application #${application.application_id}`}
                        </p>
                        <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                          {application.full_name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                          {lang === "ja" ? "応募先" : "Applied for"}{" "}
                          <span className="font-medium text-slate-900 dark:text-white">
                            {application.vacancy?.title}
                          </span>
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                          application.status,
                        )}`}
                      >
                        {statusLabels[application.status]}
                      </span>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <InfoChip
                        icon={<Mail className="h-4 w-4" />}
                        label={
                          lang === "ja" ? "応募者メール" : "Applicant Email"
                        }
                        value={application.email}
                      />
                      <InfoChip
                        icon={<Phone className="h-4 w-4" />}
                        label={lang === "ja" ? "電話番号" : "Phone"}
                        value={application.phone}
                      />
                      <InfoChip
                        icon={<MapPin className="h-4 w-4" />}
                        label={lang === "ja" ? "所在地" : "Location"}
                        value={application.current_location || "-"}
                      />
                      <InfoChip
                        icon={<CalendarDays className="h-4 w-4" />}
                        label={lang === "ja" ? "応募日" : "Applied"}
                        value={formatDate(application.applied_at, lang)}
                      />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <InfoChip
                        icon={<Building2 className="h-4 w-4" />}
                        label={lang === "ja" ? "企業名" : "Company"}
                        value={application.vacancy?.company_name || "-"}
                      />
                      <InfoChip
                        icon={<Briefcase className="h-4 w-4" />}
                        label={lang === "ja" ? "雇用形態" : "Employment"}
                        value={application.vacancy?.employment_type || "-"}
                      />
                      <InfoChip
                        icon={<User className="h-4 w-4" />}
                        label={lang === "ja" ? "プロバイダー" : "Provider"}
                        value={application.provider?.name || "-"}
                      />
                      <InfoChip
                        icon={<Mail className="h-4 w-4" />}
                        label={
                          lang === "ja"
                            ? "プロバイダーメール"
                            : "Provider Email"
                        }
                        value={application.provider?.email || "-"}
                      />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {lang === "ja" ? "カバーレター" : "Cover Letter"}
                      </p>
                      <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">
                        {application.cover_letter ||
                          (lang === "ja"
                            ? "カバーレターはありません。"
                            : "No cover letter submitted.")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {application.vacancy?.work_location ||
                          (lang === "ja"
                            ? "場所未指定"
                            : "Location not specified")}
                      </div>

                      <div className="flex items-center gap-2">
                        {application.cv_file_path && (
                          <a
                            href={`https://vision-career.co.jp/view_resume.php?token=${localStorage.getItem("admin_token")}&resume=${application.cv_file_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            {lang === "ja" ? "履歴書を見る" : "View CV"}
                          </a>
                        )}
                        <button
                          onClick={() => openEditModal(application)}
                          className="rounded-xl border cursor-pointer not-odd:border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                          title={lang === "ja" ? "編集" : "Edit"}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(application)}
                          className="rounded-xl border border-rose-200 cursor-pointer bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50"
                          title={lang === "ja" ? "削除" : "Delete"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="rounded-xl bg-slate-900 cursor-pointer px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                        >
                          {lang === "ja" ? "詳細を見る" : "View Details"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {topProviders.length > 0 && (
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {lang === "ja" ? "トッププロバイダー" : "Top Providers"}
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {topProviders.map((provider) => (
                  <div
                    key={provider.provider_id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {provider.provider_name || "-"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {provider.provider_email || "-"}
                    </p>
                    <div className="mt-3 flex gap-4 text-xs text-slate-600 dark:text-slate-400">
                      <span>
                        {provider.total_applications}{" "}
                        {lang === "ja" ? "件の応募" : "applications"}
                      </span>
                      <span>
                        {provider.total_vacancies}{" "}
                        {lang === "ja" ? "件の求人" : "vacancies"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dailyStats.length > 0 && (
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {lang === "ja" ? "日別アクティビティ" : "Daily Activity"}
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    <tr>
                      <th className="px-3 py-2 font-medium">
                        {lang === "ja" ? "日付" : "Date"}
                      </th>
                      <th className="px-3 py-2 font-medium">
                        {lang === "ja" ? "合計" : "Total"}
                      </th>
                      <th className="px-3 py-2 font-medium">
                        {lang === "ja" ? "保留中" : "Pending"}
                      </th>
                      <th className="px-3 py-2 font-medium">
                        {lang === "ja" ? "審査中" : "Reviewed"}
                      </th>
                      <th className="px-3 py-2 font-medium">
                        {lang === "ja" ? "選考中" : "Shortlisted"}
                      </th>
                      <th className="px-3 py-2 font-medium">
                        {lang === "ja" ? "不合格" : "Rejected"}
                      </th>
                      <th className="px-3 py-2 font-medium">
                        {lang === "ja" ? "採用" : "Hired"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyStats.map((day) => (
                      <tr
                        key={day.date}
                        className="border-b border-slate-100 dark:border-slate-700"
                      >
                        <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                          {formatDate(day.date, lang)}
                        </td>
                        <td className="px-3 py-3 text-slate-900 dark:text-white">
                          {day.count}
                        </td>
                        <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                          {day.pending}
                        </td>
                        <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                          {day.reviewed}
                        </td>
                        <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                          {day.shortlisted}
                        </td>
                        <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                          {day.rejected}
                        </td>
                        <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                          {day.hired}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApplication && (
        <ApplicationDetails
          lang={lang}
          selectedApplication={selectedApplication}
          setSelectedApplication={setSelectedApplication}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />
      )}

      {/* Edit Modal */}
      {editingApplication && (
        <ApplicationEditModal
          lang={lang}
          isSaving={isSaving}
          setEditingApplication={setEditingApplication}
          editingApplication={editingApplication}
          editError={editError}
          editForm={editForm}
          handleSaveEdit={handleSaveEdit}
          handleEditChange={handleEditChange}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingApplication && (
        <ApplicationDeleteModal
          lang={lang}
          deleteError={deleteError}
          isDeleting={isDeleting}
          setDeletingApplication={setDeletingApplication}
          deletingApplication={deletingApplication}
          handleDelete={handleDelete}
        />
      )}
    </>
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

function InfoChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-2 break-words text-sm text-slate-800 dark:text-slate-300">
        {value}
      </div>
    </div>
  );
}
