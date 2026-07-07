"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  ShieldCheck,
  FileText,
  Clock3,
  CheckCircle2,
  Eye,
  Search,
  Users,
  Inbox,
  AlertCircle,
  UserCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { DeleteDialog } from "@/components/layout/deleteDialog";
import axiosInstance from "@/services/axiosInstance";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import PlacementRequestModal from "./PlacementRequestModal";
import PlacementRequestsTab from "./PlacementRequestsTab";
import DetailsModal from "./DetailsModal";
import ApplicationModal from "./ApplicationModal";
import AddVacancyModal from "./AddVacancyModal";
import EditVacancyModal from "./EditVacancyModal";
import Vacancies from "./Vacancies";
import Applications from "./Applications";
import {
  StatCard,
  TabButton,
  LoadingPanel,
  ErrorPanel,
  EmptyPanel,
} from "./helpers";

type UserType = {
  id: number;
  name?: string;
  email?: string;
  company_name?: string | null;
  phone?: string | null;
  address?: string | null;
};

type Vacancy = {
  id: number;
  uploadedBy: number;
  company_name: string;
  title: string;
  employment_type: string;
  work_location: string;
  salary_min: number;
  salary_max: number;
  created_at: string;
};

type VacancyDetail = {
  id: number;
  uploadedBy: number;
  company_name?: string;
  company_name_kana?: string;
  title?: string;
  title_kana?: string;
  employment_type?: string;
  number_of_people?: number;
  job_description?: string;
  responsibilities?: string;
  required_skills?: string;
  preferred_skills?: string;
  required_education?: string;
  required_experience?: string;
  japanese_level?: string;
  work_location?: string;
  work_location_detail?: string;
  remote_work?: string;
  salary_min?: number;
  salary_max?: number;
  salary_note?: string;
  work_hours?: string;
  break_time?: string;
  overtime?: string;
  holidays?: string;
  benefits?: string[] | string;
  insurance?: string[] | string;
  trial_period?: string;
  application_deadline?: string;
  start_date?: string;
  selection_process?: string;
  contact_person?: string;
  contact_person_kana?: string;
  contact_email?: string;
  created_at?: string;
};

type VacancyFormInitialData = {
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
};

type ApplicationItem = {
  application_id: number;
  jobseeker_id: number;
  full_name: string;
  email: string;
  phone: string;
  current_location?: string;
  cover_letter?: string;
  cv_file_path?: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
  applied_at: string;
};

type ClientApplicationGroup = {
  vacancy: VacancyDetail;
  applications: ApplicationItem[];
};

type ApplicationsSummary = {
  total_applications: number;
  total_vacancies: number;
  by_status: {
    pending: number;
    reviewed: number;
    shortlisted: number;
    rejected: number;
    hired?: number;
  };
};

type ProviderInfo = {
  id: number;
  name?: string;
  email?: string;
};

type TabKey = "vacancies" | "applications" | "placement-requests";

export default function ClientPage() {
  const { lang } = useLanguage();
  const router = useRouter();

  const [user, setUser] = useState<UserType | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [applicationGroups, setApplicationGroups] = useState<
    ClientApplicationGroup[]
  >([]);
  const [applicationsSummary, setApplicationsSummary] =
    useState<ApplicationsSummary | null>(null);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);

  const [loadingVacancies, setLoadingVacancies] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);

  const [vacancyError, setVacancyError] = useState("");
  const [applicationsError, setApplicationsError] = useState("");

  const [activeTab, setActiveTab] = useState<TabKey>("vacancies");
  const [search, setSearch] = useState("");

  const [selectedVacancy, setSelectedVacancy] = useState<VacancyDetail | null>(
    null,
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<VacancyDetail | null>(
    null,
  );
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [showPlacementRequestModal, setShowPlacementRequestModal] =
    useState(false);

  const [selectedApplication, setSelectedApplication] = useState<{
    vacancy: VacancyDetail;
    application: ApplicationItem;
  } | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.replace("/auth");
          return;
        }

        const res = await fetch("https://vision-career.co.jp/profile.php", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || data.status !== "success") {
          localStorage.removeItem("token");
          router.replace("/auth");
          return;
        }

        setUser(data.user);
        setIsAllowed(true);

        if (data.user.company_name) {
          setIsProfileComplete(true);
        }
      } catch (error) {
        console.error("Error while checking auth:", error);
        localStorage.removeItem("token");
        router.replace("/auth");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchVacancies = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth");
      return;
    }

    try {
      setLoadingVacancies(true);
      setVacancyError("");

      const res = await fetch("https://vision-career.co.jp/uploadedBy.php", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        setVacancyError(
          data.message ||
            (lang === "ja"
              ? "求人情報の読み込みに失敗しました"
              : "Failed to load vacancies"),
        );
        return;
      }

      setVacancies(data.data || []);
    } catch (error) {
      console.error("Error fetching vacancies:", error);
      setVacancyError(
        lang === "ja"
          ? "求人情報の読み込み中にエラーが発生しました"
          : "Something went wrong while loading vacancies.",
      );
    } finally {
      setLoadingVacancies(false);
    }
  };

  const flatApplications = useMemo(() => {
    return applicationGroups.flatMap((group) =>
      group.applications.map((application) => ({
        vacancy: group.vacancy,
        application,
      })),
    );
  }, [applicationGroups]);

  const fetchApplications = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth");
      return;
    }

    try {
      setLoadingApplications(true);
      setApplicationsError("");

      const res = await fetch(
        "https://vision-career.co.jp/get_client_applications.php",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok || data.ok !== true) {
        setApplicationsError(
          data.message ||
            (lang === "ja"
              ? "応募情報の読み込みに失敗しました"
              : "Failed to load applications"),
        );
        return;
      }

      setProviderInfo(data.provider || null);
      setApplicationsSummary(data.summary || null);
      setApplicationGroups(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplicationsError(
        lang === "ja"
          ? "応募情報の読み込み中にエラーが発生しました"
          : "Something went wrong while loading applications.",
      );
    } finally {
      setLoadingApplications(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchVacancies();
    fetchApplications();
  }, [user]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDetailsModal();
        closeEditModal();
        closeApplicationModal();
      }
    };

    if (showDetailsModal || showEditModal || showApplicationModal) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [showDetailsModal, showEditModal, showApplicationModal]);

  const fetchSingleVacancy = async (id: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth");
      return null;
    }

    const res = await fetch(
      `https://vision-career.co.jp/get_single_vacancy.php?id=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    if (!res.ok || data.status !== "success") {
      throw new Error(
        data.message ||
          (lang === "ja"
            ? "求人詳細の取得に失敗しました"
            : "Failed to fetch vacancy details"),
      );
    }

    return data.data as VacancyDetail;
  };

  const handleViewDetails = async (id: number) => {
    try {
      setShowDetailsModal(true);
      setLoadingDetails(true);
      setDetailsError("");
      setSelectedVacancy(null);

      const vacancy = await fetchSingleVacancy(id);
      if (vacancy) setSelectedVacancy(vacancy);
    } catch (error) {
      console.error("Error fetching vacancy details:", error);
      setDetailsError(
        lang === "ja"
          ? "求人詳細の読み込み中にエラーが発生しました"
          : "Something went wrong while loading vacancy details.",
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleEditVacancy = async (id: number) => {
    try {
      setLoadingEdit(true);
      setEditError("");
      setEditingVacancy(null);
      setShowEditModal(true);
      setShowDetailsModal(false);

      const vacancy = await fetchSingleVacancy(id);
      if (vacancy) setEditingVacancy(vacancy);
    } catch (error) {
      console.error("Error fetching vacancy for edit:", error);
      setEditError(
        lang === "ja"
          ? "編集用の求人情報の読み込み中にエラーが発生しました"
          : "Something went wrong while loading vacancy for editing.",
      );
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDeleteDialog = async (id: number) => {
    setShowDeleteModal((prev) => !prev);
    setDeletingId(id);
  };

  const handleDeleteVacancy = async () => {
    try {
      const toastId = toast.loading(
        lang === "ja" ? "求人を削除中..." : "Deleting vacancy...",
      );
      const res = await axiosInstance.post("/delete_vacancy.php", {
        id: deletingId,
      });
      const data = await res.data;
      toast.success(data.message, { id: toastId });
      fetchVacancies();
      fetchApplications();
    } catch (err: any) {
      console.error("Failed to delete vacancy:", err);
      toast.error(
        err.response?.data?.message ||
          (lang === "ja"
            ? "求人の削除に失敗しました"
            : "Failed to delete vacancy"),
      );
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
    }
  };

  const handleChangeStatus = async (
    applicationId: number,
    newStatus: string,
  ) => {
    try {
      const token = localStorage.getItem("token");

      const toastId = toast.loading(
        lang === "ja" ? "ステータスを更新中..." : "Updating status...",
      );

      const res = await fetch("https://vision-career.co.jp/change_status.php", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          application_id: applicationId,
          status: newStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(
          data.message ||
            (lang === "ja"
              ? "ステータスの更新に失敗しました"
              : "Failed to update status"),
        );
      }

      toast.success(
        lang === "ja" ? "ステータスを更新しました" : "Status updated",
        { id: toastId },
      );

      fetchApplications();
    } catch (error: any) {
      console.error("Status update error:", error);
      toast.error(
        error.message ||
          (lang === "ja"
            ? "ステータスの更新に失敗しました"
            : "Failed to update status"),
      );
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setLoadingDetails(false);
    setDetailsError("");
    setSelectedVacancy(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setLoadingEdit(false);
    setEditError("");
    setEditingVacancy(null);
  };

  const closeApplicationModal = () => {
    setShowApplicationModal(false);
    setSelectedApplication(null);
  };

  const handleViewApplication = (item: {
    vacancy: VacancyDetail;
    application: ApplicationItem;
  }) => {
    setSelectedApplication(item);
    setShowApplicationModal(true);
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return lang === "ja" ? "未指定" : "Not specified";
    if (min && max)
      return lang === "ja"
        ? `${min.toLocaleString()} - ${max.toLocaleString()} 万円`
        : `¥${min.toLocaleString()} - ¥${max.toLocaleString()}`;
    if (min)
      return lang === "ja"
        ? `${min.toLocaleString()} 万円以上`
        : `From ¥${min.toLocaleString()}`;
    return lang === "ja"
      ? `${max?.toLocaleString()} 万円まで`
      : `Up to ¥${max?.toLocaleString()}`;
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString(
      lang === "ja" ? "ja-JP" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  };

  const toList = (value?: string[] | string) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    return [value].filter(Boolean);
  };

  const toFormInitialData = (
    vacancy: VacancyDetail,
  ): VacancyFormInitialData => ({
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
    salaryMin: vacancy.salary_min || 0,
    salaryMax: vacancy.salary_max || 0,
    salaryNote: vacancy.salary_note || "",
    workHours: vacancy.work_hours || "",
    breakTime: vacancy.break_time || "",
    overtime: vacancy.overtime || "",
    holidays: vacancy.holidays || "",
    benefits: Array.isArray(vacancy.benefits)
      ? vacancy.benefits
      : vacancy.benefits
        ? [vacancy.benefits]
        : [],
    insurance: Array.isArray(vacancy.insurance)
      ? vacancy.insurance
      : vacancy.insurance
        ? [vacancy.insurance]
        : [],
    trialPeriod: vacancy.trial_period || "",
    applicationDeadline: vacancy.application_deadline || "",
    startDate: vacancy.start_date || "",
    selectionProcess: vacancy.selection_process || "",
    contactPerson: vacancy.contact_person || "",
    contactPersonKana: vacancy.contact_person_kana || "",
    contactEmail: vacancy.contact_email || "",
  });

  const filteredVacancies = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return vacancies;

    return vacancies.filter((vacancy) => {
      const haystack = [
        vacancy.title,
        vacancy.company_name,
        vacancy.employment_type,
        vacancy.work_location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [vacancies, search]);

  const filteredApplications = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return flatApplications;

    return flatApplications.filter(({ vacancy, application }) => {
      const haystack = [
        application.full_name,
        application.email,
        application.phone,
        application.status,
        application.current_location,
        vacancy.title,
        vacancy.company_name,
        vacancy.work_location,
        vacancy.employment_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [flatApplications, search]);

  const applicationCounts = {
    total: applicationsSummary?.total_applications ?? 0,
    vacancies: applicationsSummary?.total_vacancies ?? 0,
    pending: applicationsSummary?.by_status?.pending ?? 0,
    reviewed: applicationsSummary?.by_status?.reviewed ?? 0,
    shortlisted: applicationsSummary?.by_status?.shortlisted ?? 0,
    rejected: applicationsSummary?.by_status?.rejected ?? 0,
    hired: applicationsSummary?.by_status?.hired ?? 0,
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-slate-400" />
          <h2 className="text-xl font-semibold text-slate-900">
            {lang === "ja" ? "認証を確認中..." : "Checking authentication..."}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {lang === "ja"
              ? "セッションを確認しています。"
              : "Please wait while we verify your session."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!isAllowed) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {!isProfileComplete && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
                  <div>
                    <h3 className="font-semibold text-amber-800">
                      {lang === "ja"
                        ? "会社プロフィールが未完成です"
                        : "Company profile incomplete"}
                    </h3>
                    <p className="mt-1 text-sm text-amber-700">
                      {lang === "ja"
                        ? "求人を効果的に管理するために、会社情報を完成させてください。会社名と電話番号は必須項目です。"
                        : "Please complete your company profile to manage vacancies effectively. Company name and phone number are required."}
                    </p>
                  </div>
                </div>
                <Link
                  href={lang === "ja" ? "/profile/" : "/en/profile/"}
                  className="inline-flex items-center gap-2 self-start rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 sm:self-auto"
                >
                  {lang === "ja" ? "プロフィールを設定" : "Complete Profile"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5">
              {/* Welcome Section */}
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {lang === "ja" ? "採用ダッシュボード" : "Hiring Dashboard"}
                </p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                  {lang === "ja"
                    ? `ようこそ${user.name ? `、${user.name}さん` : ""}`
                    : `Welcome${user.name ? `, ${user.name}` : ""}`}
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  {lang === "ja"
                    ? "求人を管理し、掲載した求人に応募されたすべての応募を確認します。"
                    : "Manage vacancies and review all applications received for your posted jobs."}
                </p>
              </div>

              {/* Action Buttons - Restructured */}
              <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
                {/* Primary Actions Group */}
                <div className="flex flex-wrap gap-2">
                  {isProfileComplete && (
                    <Link
                      href={lang === "ja" ? "/profile/" : "/en/profile/"}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
                    >
                      <UserCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {lang === "ja" ? "プロフィール" : "Profile"}
                      </span>
                    </Link>
                  )}

                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center cursor-pointer justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{lang === "ja" ? "求人を投稿" : "Post Vacancy"}</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                {/* Secondary Actions Group */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowPlacementRequestModal(true)}
                    className="inline-flex items-center cursor-pointer justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    <FileText className="h-4 w-4" />
                    <span>
                      {lang === "ja" ? "採用依頼" : "Placement Request"}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      /* Add refresh functionality */
                    }}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {lang === "ja" ? "更新" : "Refresh"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards - Only show if profile is complete, otherwise show simplified stats */}
          <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <StatCard
              label={lang === "ja" ? "総求人数" : "Total Vacancies"}
              value={String(applicationCounts.vacancies || vacancies.length)}
              icon={<Briefcase className="h-5 w-5" />}
            />
            <StatCard
              label={lang === "ja" ? "応募数" : "Applications"}
              value={String(applicationCounts.total)}
              icon={<Inbox className="h-5 w-5" />}
            />
            <StatCard
              label={lang === "ja" ? "保留中" : "Pending"}
              value={String(applicationCounts.pending)}
              icon={<Clock3 className="h-5 w-5" />}
            />
            <StatCard
              label={lang === "ja" ? "審査中" : "Reviewed"}
              value={String(applicationCounts.reviewed)}
              icon={<Eye className="h-5 w-5" />}
            />
            <StatCard
              label={lang === "ja" ? "選考中" : "Shortlisted"}
              value={String(applicationCounts.shortlisted)}
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
          </div>

          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="inline-flex rounded-2xl bg-slate-100 p-1">
                <TabButton
                  active={activeTab === "vacancies"}
                  onClick={() => setActiveTab("vacancies")}
                  icon={<Briefcase className="h-4 w-4" />}
                  label={`${lang === "ja" ? "求人" : "Vacancies"} (${filteredVacancies.length})`}
                />
                <TabButton
                  active={activeTab === "applications"}
                  onClick={() => setActiveTab("applications")}
                  icon={<Users className="h-4 w-4" />}
                  label={`${lang === "ja" ? "応募" : "Applications"} (${filteredApplications.length})`}
                />
                <TabButton
                  active={activeTab === "placement-requests"}
                  onClick={() => setActiveTab("placement-requests")}
                  icon={<FileText className="h-4 w-4" />}
                  label={lang === "ja" ? "採用依頼" : "Placement Requests"}
                />
              </div>

              <div className="w-full lg:max-w-md">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={
                      activeTab === "vacancies"
                        ? lang === "ja"
                          ? "求人を検索..."
                          : "Search vacancies..."
                        : activeTab === "applications"
                          ? lang === "ja"
                            ? "応募者、メール、職種を検索..."
                            : "Search applicants, emails, job titles..."
                          : lang === "ja"
                            ? "職種、ステータスで検索..."
                            : "Search by job title, status..."
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {activeTab === "vacancies" && (
            <>
              {loadingVacancies ? (
                <LoadingPanel
                  text={
                    lang === "ja"
                      ? "求人情報を読み込み中..."
                      : "Loading vacancies..."
                  }
                />
              ) : vacancyError ? (
                <ErrorPanel
                  title={
                    lang === "ja"
                      ? "求人情報を読み込めません"
                      : "Unable to load vacancies"
                  }
                  message={vacancyError}
                />
              ) : filteredVacancies.length === 0 ? (
                <EmptyPanel
                  icon={<Briefcase className="h-10 w-10 text-slate-400" />}
                  title={
                    lang === "ja"
                      ? "求人が見つかりません"
                      : "No vacancies found"
                  }
                  description={
                    lang === "ja"
                      ? "新しい求人を投稿するか、別の検索をお試しください。"
                      : "Post a new vacancy or try a different search."
                  }
                />
              ) : (
                <Vacancies
                  filteredVacancies={filteredVacancies}
                  lang={lang}
                  handleViewDetails={handleViewDetails}
                  handleEditVacancy={handleEditVacancy}
                  handleDeleteDialog={handleDeleteDialog}
                />
              )}
            </>
          )}

          {activeTab === "applications" && (
            <>
              {loadingApplications ? (
                <LoadingPanel
                  text={
                    lang === "ja"
                      ? "応募情報を読み込み中..."
                      : "Loading applications..."
                  }
                />
              ) : applicationsError ? (
                <ErrorPanel
                  title={
                    lang === "ja"
                      ? "応募情報を読み込めません"
                      : "Unable to load applications"
                  }
                  message={applicationsError}
                />
              ) : filteredApplications.length === 0 ? (
                <EmptyPanel
                  icon={<Inbox className="h-10 w-10 text-slate-400" />}
                  title={
                    lang === "ja"
                      ? "まだ応募はありません"
                      : "No applications received yet"
                  }
                  description={
                    lang === "ja"
                      ? "求職者からの応募は、応募があったときにここに表示されます。"
                      : "Applications from job seekers will appear here once they apply."
                  }
                />
              ) : (
                <Applications
                  filteredApplications={filteredApplications}
                  lang={lang}
                  handleChangeStatus={handleChangeStatus}
                  handleViewApplication={handleViewApplication}
                />
              )}
            </>
          )}

          {activeTab === "placement-requests" && (
            <PlacementRequestsTab token={localStorage.getItem("token") || ""} />
          )}
        </div>
      </div>

      {/* Rest of modals remain the same */}
      {showDetailsModal && (
        <DetailsModal
          closeDetailsModal={closeDetailsModal}
          lang={lang}
          selectedVacancy={selectedVacancy}
          loadingDetails={loadingDetails}
          detailsError={detailsError}
          handleEditVacancy={handleEditVacancy}
        />
      )}

      {showApplicationModal && selectedApplication && (
        <ApplicationModal
          closeApplicationModal={closeApplicationModal}
          lang={lang}
          selectedApplication={selectedApplication}
          handleChangeStatus={handleChangeStatus}
        />
      )}

      {showAddModal && (
        <AddVacancyModal
          setShowAddModal={setShowAddModal}
          lang={lang}
          user={user}
          fetchVacancies={fetchVacancies}
        />
      )}

      {showEditModal && (
        <EditVacancyModal
          closeEditModal={closeEditModal}
          lang={lang}
          editingVacancy={editingVacancy}
          loadingEdit={loadingEdit}
          editError={editError}
          user={user}
          toFormInitialData={toFormInitialData}
          fetchVacancies={fetchVacancies}
        />
      )}

      {showDeleteModal && (
        <DeleteDialog
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          handleDelete={handleDeleteVacancy}
        />
      )}

      {showPlacementRequestModal && (
        <PlacementRequestModal
          isOpen={showPlacementRequestModal}
          onClose={() => setShowPlacementRequestModal(false)}
          companyId={user.id}
          onSuccess={() => {
            toast.success(
              lang === "ja"
                ? "採用依頼が正常に提出されました"
                : "Placement request submitted successfully",
            );
            setShowPlacementRequestModal(false);
          }}
        />
      )}
    </>
  );
}
