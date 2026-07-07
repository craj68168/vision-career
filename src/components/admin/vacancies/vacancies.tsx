"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Briefcase,
  MapPin,
  Search,
  RefreshCw,
  AlertTriangle,
  BadgeJapaneseYen,
  CalendarDays,
  Users,
  Pencil,
  X,
  Trash2,
  AlertCircle,
  Eye,
  Clock,
  Mail,
  User,
  FileText,
  Shield,
  Heart,
  DollarSign,
  GraduationCap,
  Globe,
  Home,
  Phone,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import VacancyForm from "./VacancyForm";
import toast from "react-hot-toast";

type Vacancy = {
  id: number;
  company_name: string;
  company_name_kana?: string;
  title: string;
  title_kana?: string;
  employment_type: string;
  number_of_people: number;
  job_description: string;
  responsibilities?: string;
  required_skills?: string;
  preferred_skills?: string;
  required_education?: string;
  required_experience?: string;
  japanese_level: string;
  work_location: string;
  work_location_detail?: string;
  remote_work?: string;
  salary_min?: number;
  salary_max?: number;
  salary_note?: string;
  work_hours?: string;
  break_time?: string;
  overtime?: string;
  holidays?: string;
  benefits?: string[];
  insurance?: string[];
  trial_period?: string;
  application_deadline?: string;
  start_date?: string;
  selection_process?: string;
  contact_person: string;
  contact_person_kana?: string;
  contact_email: string;
  created_at: string;
};

// VacancyFormData type matching the form component
type VacancyFormData = {
  id?: number;
  companyName: string;
  companyNameKana: string;
  title: string;
  titleKana: string;
  employmentType: string;
  numberOfPeople: number;
  jobDescription: string;
  responsibilities: string;
  requiredSkills: string;
  preferredSkills: string;
  requiredEducation: string;
  requiredExperience: string;
  japaneseLevel: string;
  workLocation: string;
  workLocationDetail: string;
  remoteWork: string;
  salaryMin: number;
  salaryMax: number;
  salaryNote: string;
  workHours: string;
  breakTime: string;
  overtime: string;
  holidays: string;
  benefits: string[];
  insurance: string[];
  trialPeriod: string;
  applicationDeadline: string;
  startDate: string;
  selectionProcess: string;
  contactPerson: string;
  contactPersonKana: string;
  contactEmail: string;
  uploadedBy?: number;
};

export default function AllVacanciesList() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [adminId, setAdminId] = useState<number | null>(null);

  // State for editing vacancy
  const [editingVacancy, setEditingVacancy] = useState<{
    vacancyId: number;
    formData: VacancyFormData;
  } | null>(null);

  // State for delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    vacancyId: number;
    title: string;
    isDeleting: boolean;
  } | null>(null);

  // State for view details modal
  const [viewingVacancy, setViewingVacancy] = useState<Vacancy | null>(null);

  const fetchVacancies = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("admin_token");

      if (!token) {
        router.push("/admin-login");
        return;
      }

      const res = await fetch("https://vision-career.co.jp/get_vacancies.php", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(
          data?.message ||
            (lang === "ja"
              ? "求人情報の取得に失敗しました"
              : "Failed to fetch vacancies"),
        );
      }

      setVacancies(Array.isArray(data?.data) ? data.data : []);

      // Store admin ID if available
      if (data?.admin?.id) {
        setAdminId(data.admin.id);
      }
    } catch (err: any) {
      console.error("Failed to fetch vacancies:", err);
      setError(
        err?.message ||
          (lang === "ja"
            ? "求人情報の読み込みに失敗しました"
            : "Failed to load vacancies"),
      );
    } finally {
      setLoading(false);
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const filteredVacancies = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return vacancies;

    return vacancies.filter((vacancy) => {
      const haystack = [
        vacancy.title,
        vacancy.company_name,
        vacancy.employment_type,
        vacancy.work_location,
        vacancy.japanese_level,
        vacancy.required_skills,
        vacancy.preferred_skills,
        vacancy.contact_person,
        vacancy.contact_email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [vacancies, search]);

  // Transform vacancy data to form data format
  const transformToFormData = (vacancy: Vacancy): VacancyFormData => {
    return {
      id: vacancy.id,
      companyName: vacancy.company_name || "",
      companyNameKana: vacancy.company_name_kana || "",
      title: vacancy.title || "",
      titleKana: vacancy.title_kana || "",
      employmentType: vacancy.employment_type || "",
      numberOfPeople: vacancy.number_of_people || 1,
      jobDescription: vacancy.job_description || "",
      responsibilities: vacancy.responsibilities || "",
      requiredSkills: vacancy.required_skills || "",
      preferredSkills: vacancy.preferred_skills || "",
      requiredEducation: vacancy.required_education || "",
      requiredExperience: vacancy.required_experience || "",
      japaneseLevel: vacancy.japanese_level || "",
      workLocation: vacancy.work_location || "",
      workLocationDetail: vacancy.work_location_detail || "",
      remoteWork: vacancy.remote_work || "",
      salaryMin: vacancy.salary_min || 300,
      salaryMax: vacancy.salary_max || 500,
      salaryNote: vacancy.salary_note || "",
      workHours: vacancy.work_hours || "9:00 - 18:00",
      breakTime: vacancy.break_time || "12:00 - 13:00",
      overtime: vacancy.overtime || "About 20 hours per month on average",
      holidays:
        vacancy.holidays ||
        "Weekends and public holidays, summer vacation, and the year-end/New Year holidays",
      benefits: vacancy.benefits || [],
      insurance: vacancy.insurance || [],
      trialPeriod: vacancy.trial_period || "Three months",
      applicationDeadline: vacancy.application_deadline || "",
      startDate: vacancy.start_date || "",
      selectionProcess:
        vacancy.selection_process ||
        "Document screening → First interview → Final interview → Job offer",
      contactPerson: vacancy.contact_person || "",
      contactPersonKana: vacancy.contact_person_kana || "",
      contactEmail: vacancy.contact_email || "",
      uploadedBy: adminId || undefined,
    };
  };

  const handleEditVacancy = (vacancy: Vacancy) => {
    if (!vacancy.id) {
      toast.error(
        lang === "ja"
          ? "この求人は編集できません"
          : "This vacancy cannot be edited",
      );
      return;
    }

    // Close view modal if open
    setViewingVacancy(null);

    const formData = transformToFormData(vacancy);
    setEditingVacancy({
      vacancyId: vacancy.id,
      formData,
    });
  };

  const handleEditSuccess = (result?: any) => {
    // Close the edit modal
    setEditingVacancy(null);

    // Refresh the vacancies list to show updated data
    fetchVacancies();

    toast.success(
      lang === "ja" ? "求人が更新されました" : "Vacancy updated successfully",
    );
  };

  const handleCancelEdit = () => {
    setEditingVacancy(null);
  };

  // View handlers
  const handleViewVacancy = (vacancy: Vacancy) => {
    setViewingVacancy(vacancy);
  };

  const handleCloseView = () => {
    setViewingVacancy(null);
  };

  // Delete handlers
  const handleDeleteClick = (vacancy: Vacancy) => {
    // Close view modal if open
    setViewingVacancy(null);

    setDeleteConfirmation({
      vacancyId: vacancy.id,
      title: vacancy.title,
      isDeleting: false,
    });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation) return;

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin-login");
      return;
    }

    setDeleteConfirmation((prev) =>
      prev ? { ...prev, isDeleting: true } : null,
    );

    try {
      const res = await fetch(
        "https://vision-career.co.jp/admin-delete-vacancy.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vacancy_id: deleteConfirmation.vacancyId,
          }),
        },
      );

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(
          data?.message ||
            (lang === "ja"
              ? "求人の削除に失敗しました"
              : "Failed to delete vacancy"),
        );
      }

      // Close the delete confirmation modal
      setDeleteConfirmation(null);

      // Refresh the vacancies list
      await fetchVacancies();

      toast.success(
        data?.message ||
          (lang === "ja"
            ? "求人が削除されました"
            : "Vacancy deleted successfully"),
      );
    } catch (err: any) {
      console.error("Failed to delete vacancy:", err);
      toast.error(
        err?.message ||
          (lang === "ja"
            ? "求人の削除中にエラーが発生しました"
            : "An error occurred while deleting the vacancy"),
      );
      setDeleteConfirmation((prev) =>
        prev ? { ...prev, isDeleting: false } : null,
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <RefreshCw className="mx-auto mb-4 h-10 w-10 animate-spin text-slate-400 dark:text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {lang === "ja" ? "求人情報を読み込み中..." : "Loading Vacancies..."}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {lang === "ja" ? "利用可能な求人" : "Available Vacancies"}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {lang === "ja"
                  ? "すべてのアクティブな求人情報を表示します。"
                  : "Browse all active job postings."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchVacancies}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <RefreshCw className="h-4 w-4" />
                {lang === "ja" ? "更新" : "Refresh"}
              </button>
            </div>
          </div>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                lang === "ja"
                  ? "職種、企業名、勤務地、スキルで検索..."
                  : "Search by title, company, location, skills..."
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            icon={<Briefcase className="h-5 w-5" />}
            label={lang === "ja" ? "総求人数" : "Total Vacancies"}
            value={String(vacancies.length)}
            lang={lang}
          />
          <StatCard
            icon={<Search className="h-5 w-5" />}
            label={lang === "ja" ? "フィルター結果" : "Filtered Results"}
            value={String(filteredVacancies.length)}
            lang={lang}
          />
          <StatCard
            icon={<Users className="h-5 w-5" />}
            label={lang === "ja" ? "募集人数" : "Openings"}
            value={String(
              filteredVacancies.reduce(
                (sum, vacancy) => sum + (vacancy.number_of_people || 0),
                0,
              ),
            )}
            lang={lang}
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {filteredVacancies.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-slate-300 dark:text-slate-600" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              {lang === "ja" ? "求人が見つかりません" : "No vacancies found"}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {lang === "ja"
                ? "検索条件を変更するか、リストを更新してください。"
                : "Try changing your search or refresh the list."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredVacancies.map((vacancy) => (
              <div
                key={vacancy.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left side - Main info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-semibold text-white dark:bg-indigo-600">
                        {vacancy.employment_type}
                      </span>
                      <span className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {vacancy.japanese_level}
                      </span>
                      {vacancy.remote_work && (
                        <span className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {vacancy.remote_work}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {vacancy.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        {vacancy.company_name}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {vacancy.work_location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5" />
                        {formatSalary(vacancy, lang)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {vacancy.number_of_people || 0}{" "}
                        {lang === "ja" ? "名" : "openings"}
                      </span>
                    </div>
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 mr-2">
                      <Clock className="inline h-3 w-3 mr-1" />
                      {formatDate(vacancy.created_at, lang)}
                    </div>

                    <button
                      onClick={() => handleViewVacancy(vacancy)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      title={lang === "ja" ? "詳細を見る" : "View Details"}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {lang === "ja" ? "詳細" : "View"}
                      </span>
                    </button>

                    <button
                      onClick={() => handleEditVacancy(vacancy)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      title={lang === "ja" ? "求人を編集" : "Edit Vacancy"}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {lang === "ja" ? "編集" : "Edit"}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteClick(vacancy)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                      title={lang === "ja" ? "求人を削除" : "Delete Vacancy"}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {lang === "ja" ? "削除" : "Delete"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {viewingVacancy && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div
            className="absolute inset-0"
            onClick={handleCloseView}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {lang === "ja" ? "求人詳細" : "Vacancy Details"}
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  {viewingVacancy.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditVacancy(viewingVacancy)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Pencil className="h-4 w-4" />
                  {lang === "ja" ? "編集" : "Edit"}
                </button>
                <button
                  onClick={handleCloseView}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="space-y-6">
                {/* Header Section */}
                <div className="rounded-2xl bg-slate-900 p-6 text-white dark:bg-indigo-900">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                          {viewingVacancy.employment_type}
                        </span>
                        <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                          {viewingVacancy.japanese_level}
                        </span>
                        {viewingVacancy.remote_work && (
                          <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                            {viewingVacancy.remote_work}
                          </span>
                        )}
                      </div>
                      <h2 className="text-3xl font-bold">
                        {viewingVacancy.title}
                      </h2>
                      <p className="mt-2 text-slate-300 dark:text-indigo-200">
                        <Building2 className="inline h-4 w-4 mr-1" />
                        {viewingVacancy.company_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-300 dark:text-indigo-200">
                        {lang === "ja" ? "掲載日" : "Posted"}
                      </p>
                      <p className="font-semibold">
                        {formatDate(viewingVacancy.created_at, lang)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoCard
                    icon={<MapPin className="h-4 w-4" />}
                    label={lang === "ja" ? "勤務地" : "Location"}
                    value={viewingVacancy.work_location}
                  />
                  <InfoCard
                    icon={<DollarSign className="h-4 w-4" />}
                    label={lang === "ja" ? "給与" : "Salary"}
                    value={formatSalary(viewingVacancy, lang)}
                  />
                  <InfoCard
                    icon={<Users className="h-4 w-4" />}
                    label={lang === "ja" ? "募集人数" : "Openings"}
                    value={String(viewingVacancy.number_of_people || 0)}
                  />
                  <InfoCard
                    icon={<CalendarDays className="h-4 w-4" />}
                    label={lang === "ja" ? "応募期限" : "Deadline"}
                    value={formatDate(
                      viewingVacancy.application_deadline,
                      lang,
                    )}
                  />
                </div>

                {/* Main Content */}
                <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                  <div className="space-y-6">
                    <DetailSection
                      title={lang === "ja" ? "仕事内容" : "Job Description"}
                      content={viewingVacancy.job_description}
                    />
                    <DetailSection
                      title={lang === "ja" ? "責任" : "Responsibilities"}
                      content={viewingVacancy.responsibilities}
                    />
                    <DetailSection
                      title={lang === "ja" ? "必須スキル" : "Required Skills"}
                      content={viewingVacancy.required_skills}
                    />
                    <DetailSection
                      title={lang === "ja" ? "歓迎スキル" : "Preferred Skills"}
                      content={viewingVacancy.preferred_skills}
                    />
                  </div>

                  <div className="space-y-6">
                    <SideCard
                      title={lang === "ja" ? "掲載詳細" : "Posting Details"}
                    >
                      <DetailRow
                        label={lang === "ja" ? "雇用形態" : "Employment Type"}
                        value={viewingVacancy.employment_type}
                      />
                      <DetailRow
                        label={
                          lang === "ja" ? "日本語レベル" : "Japanese Level"
                        }
                        value={viewingVacancy.japanese_level}
                      />
                      <DetailRow
                        label={
                          lang === "ja" ? "勤務地詳細" : "Location Details"
                        }
                        value={viewingVacancy.work_location_detail}
                      />
                      <DetailRow
                        label={lang === "ja" ? "リモートワーク" : "Remote Work"}
                        value={viewingVacancy.remote_work}
                      />
                      <DetailRow
                        label={lang === "ja" ? "経験" : "Experience"}
                        value={viewingVacancy.required_experience}
                      />
                      <DetailRow
                        label={lang === "ja" ? "学歴" : "Education"}
                        value={viewingVacancy.required_education}
                      />
                      <DetailRow
                        label={lang === "ja" ? "試用期間" : "Trial Period"}
                        value={viewingVacancy.trial_period}
                      />
                      <DetailRow
                        label={lang === "ja" ? "勤務時間" : "Work Hours"}
                        value={viewingVacancy.work_hours}
                      />
                      <DetailRow
                        label={lang === "ja" ? "休憩時間" : "Break Time"}
                        value={viewingVacancy.break_time}
                      />
                      <DetailRow
                        label={lang === "ja" ? "残業" : "Overtime"}
                        value={viewingVacancy.overtime}
                      />
                      <DetailRow
                        label={lang === "ja" ? "休日" : "Holidays"}
                        value={viewingVacancy.holidays}
                      />
                      <DetailRow
                        label={lang === "ja" ? "開始日" : "Start Date"}
                        value={formatDate(viewingVacancy.start_date, lang)}
                      />
                      <DetailRow
                        label={
                          lang === "ja" ? "選考プロセス" : "Selection Process"
                        }
                        value={viewingVacancy.selection_process}
                      />
                    </SideCard>

                    <SideCard title={lang === "ja" ? "福利厚生" : "Benefits"}>
                      <TagList
                        items={viewingVacancy.benefits || []}
                        lang={lang}
                      />
                    </SideCard>

                    <SideCard title={lang === "ja" ? "保険" : "Insurance"}>
                      <TagList
                        items={viewingVacancy.insurance || []}
                        lang={lang}
                      />
                    </SideCard>

                    <SideCard
                      title={lang === "ja" ? "連絡先" : "Contact Information"}
                    >
                      <DetailRow
                        label={lang === "ja" ? "担当者" : "Contact Person"}
                        value={viewingVacancy.contact_person}
                      />
                      <DetailRow
                        label={
                          lang === "ja"
                            ? "担当者(カナ)"
                            : "Contact Person (Kana)"
                        }
                        value={viewingVacancy.contact_person_kana}
                      />
                      <DetailRow
                        label={lang === "ja" ? "メール" : "Email"}
                        value={viewingVacancy.contact_email}
                      />
                    </SideCard>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vacancy Modal */}
      {editingVacancy && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div
            className="absolute inset-0"
            onClick={handleCancelEdit}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-7xl max-h-[95vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {lang === "ja" ? "求人編集" : "Edit Vacancy"}
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  {editingVacancy.formData.title ||
                    (lang === "ja" ? "求人情報の編集" : "Edit Vacancy")}
                </h3>
              </div>
              <button
                onClick={handleCancelEdit}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-6">
              <VacancyForm
                userId={adminId || 0}
                mode="edit"
                vacancyId={editingVacancy.vacancyId}
                initialData={editingVacancy.formData}
                onSuccess={handleEditSuccess}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={handleCancelDelete}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {lang === "ja" ? "求人を削除" : "Delete Vacancy"}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {lang === "ja"
                      ? "この操作は元に戻せません。"
                      : "This action cannot be undone."}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "削除する求人:" : "Vacancy to delete:"}
                </p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                  {deleteConfirmation.title}
                </p>
              </div>

              <p className="mt-4 text-sm text-red-600 dark:text-red-400">
                {lang === "ja"
                  ? "⚠️ この求人に関連するすべての応募データも削除されます。"
                  : "⚠️ All applications associated with this vacancy will also be deleted."}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={handleCancelDelete}
                  disabled={deleteConfirmation.isDeleting}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {lang === "ja" ? "キャンセル" : "Cancel"}
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteConfirmation.isDeleting}
                  className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-800"
                >
                  {deleteConfirmation.isDeleting ? (
                    <>
                      <RefreshCw className="mr-2 inline h-4 w-4 animate-spin" />
                      {lang === "ja" ? "削除中..." : "Deleting..."}
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 inline h-4 w-4" />
                      {lang === "ja" ? "削除する" : "Delete"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function formatSalary(vacancy: Vacancy, lang?: string) {
  if (vacancy.salary_min || vacancy.salary_max) {
    const min = vacancy.salary_min ?? 0;
    const max = vacancy.salary_max ?? 0;
    return lang === "ja" ? `${min} - ${max} 万円` : `${min} - ${max} man yen`;
  }
  return vacancy.salary_note || (lang === "ja" ? "-" : "-");
}

function formatDate(dateString?: string, lang?: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
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

function InfoCard({
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
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1 font-semibold text-slate-900 dark:text-white">
        {value || "-"}
      </p>
    </div>
  );
}

function DetailSection({
  title,
  content,
}: {
  title: string;
  content?: string;
}) {
  return (
    <section>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">
          {content || "-"}
        </p>
      </div>
    </section>
  );
}

function SideCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
        {title}
      </h3>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 dark:border-slate-700">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm text-slate-800 dark:text-slate-300">
        {value || "-"}
      </p>
    </div>
  );
}

function TagList({ items, lang }: { items: string[]; lang: string }) {
  if (!items.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">-</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
