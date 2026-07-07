"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  X,
  FileText,
  Search,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import {
  StatCard,
  TabButton,
  VacancyCard,
  ApplicationCard,
  EmptyState,
  FormField,
  Badge,
  QuickInfo,
} from "./helperComponents";
import ApplyModal from "./applyModal";

export type Vacancy = {
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

export type Application = {
  application_id: number;
  vacancy_id: number;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
  applied_at: string;
  cv_file_path?: string;
  cover_letter?: string;
  vacancy: Vacancy;
};

type MissingField = {
  field: string;
  label: string;
};

type TabKey = "available" | "applied";

export default function JobSeekersPage() {
  const { lang } = useLanguage();
  const router = useRouter();

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("available");

  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [missingFields, setMissingFields] = useState<MissingField[]>([]);

  // Simplified form - only cover letter is needed
  const [applyForm, setApplyForm] = useState({
    coverLetter: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("seeker-token");

        if (!token) {
          router.replace("/job-seekers-auth");
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
      } catch (error) {
        console.error("Error while checking auth:", error);
        localStorage.removeItem("token");
        router.replace("/job-seekers-auth");
      } finally {
        setCheckingAuth(false);
      }
    };

    const checkProfile = async () => {
      try {
        const token = localStorage.getItem("seeker-token");

        if (!token) {
          router.replace("/job-seekers-auth");
          return;
        }
        const res = await fetch(
          "https://vision-career.co.jp/check-jobseeker-profile-complete.php",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          },
        );

        const data = await res.json();

        if (!res.ok || data.status !== "success") {
          localStorage.removeItem("token");
          return;
        }

        setIsProfileComplete(data.is_complete);
      } catch (error) {
        console.error("Error while checking profile:", error);
        localStorage.removeItem("token");
        router.replace("/auth");
      }
    };

    checkAuth();
    checkProfile();
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("seeker-token");

    if (!token) {
      router.replace("/job-seekers-auth");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [vacanciesRes, applicationsRes] = await Promise.all([
          fetch("https://vision-career.co.jp/get_vacancies.php", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("https://vision-career.co.jp/get_my_applications.php", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (
          vacanciesRes.status === 401 ||
          vacanciesRes.status === 403 ||
          applicationsRes.status === 401 ||
          applicationsRes.status === 403
        ) {
          localStorage.removeItem("seeker-token");
          router.replace("/job-seekers-auth");
          return;
        }

        const vacanciesData = await safeJson(vacanciesRes);
        const applicationsData = await safeJson(applicationsRes);

        if (!vacanciesRes.ok) {
          throw new Error(
            vacanciesData?.message ||
              (lang === "ja"
                ? "求人情報の取得に失敗しました"
                : "Failed to fetch vacancies"),
          );
        }

        if (!applicationsRes.ok) {
          throw new Error(
            applicationsData?.message ||
              (lang === "ja"
                ? "応募情報の取得に失敗しました"
                : "Failed to fetch applications"),
          );
        }

        setVacancies(
          Array.isArray(vacanciesData?.data) ? vacanciesData.data : [],
        );
        setApplications(
          Array.isArray(applicationsData?.data) ? applicationsData.data : [],
        );
      } catch (err: any) {
        console.error(err);
        setError(
          err?.message ||
            (lang === "ja"
              ? "ダッシュボードの読み込みに失敗しました"
              : "Failed to load dashboard"),
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router, lang]);

  const appliedVacancyMap = useMemo(() => {
    const map = new Map<number, Application>();
    for (const app of applications) {
      map.set(app.vacancy_id, app);
    }
    return map;
  }, [applications]);

  const filteredVacancies = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const available = vacancies.filter(
      (vacancy) => !appliedVacancyMap.has(vacancy.id),
    );

    if (!keyword) return available;

    return available.filter((vacancy) => {
      const haystack = [
        vacancy.title,
        vacancy.company_name,
        vacancy.employment_type,
        vacancy.work_location,
        vacancy.job_description,
        vacancy.required_skills,
        vacancy.preferred_skills,
        vacancy.japanese_level,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [vacancies, search, appliedVacancyMap]);

  const filteredApplications = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return applications;

    return applications.filter((app) => {
      const haystack = [
        app.vacancy?.title,
        app.vacancy?.company_name,
        app.vacancy?.employment_type,
        app.vacancy?.work_location,
        app.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [applications, search]);

  const openApplyModal = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
    setIsApplyOpen(true);
    setMissingFields([]);
  };

  const closeApplyModal = () => {
    setSelectedVacancy(null);
    setIsApplyOpen(false);
    setApplyForm({
      coverLetter: "",
    });
    setMissingFields([]);
  };

  const handleApplyInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setApplyForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVacancy) return;

    try {
      setSubmitting(true);
      setMissingFields([]);

      const token = localStorage.getItem("seeker-token");
      if (!token) {
        router.replace("/job-seekers-auth");
        return;
      }

      // Send as JSON since it's simpler for this payload
      const payload = {
        vacancy_id: selectedVacancy.id,
        cover_letter: applyForm.coverLetter.trim() || null,
      };

      const res = await fetch("https://vision-career.co.jp/apply_job.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await safeJson(res);

      // Handle 422 - Profile incomplete
      if (res.status === 422) {
        setMissingFields(data?.missing_fields || []);
        toast.error(
          data?.message ||
            (lang === "ja"
              ? "応募する前にプロフィールを完了してください。"
              : "Please complete your profile before applying."),
        );
        setSubmitting(false);
        return;
      }

      // Handle 409 - Duplicate application
      if (res.status === 409) {
        toast.error(
          data?.message ||
            (lang === "ja"
              ? "この求人には既に応募済みです。"
              : "You have already applied for this job."),
        );
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        throw new Error(
          data?.message ||
            (lang === "ja"
              ? "応募の送信に失敗しました"
              : "Failed to submit application"),
        );
      }

      // Refresh applications list
      const refreshed = await fetch(
        "https://vision-career.co.jp/get_my_applications.php",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const refreshedData = await safeJson(refreshed);
      if (refreshed.ok) {
        setApplications(
          Array.isArray(refreshedData?.data) ? refreshedData.data : [],
        );
      }

      toast.success(
        lang === "ja"
          ? "応募が正常に送信されました。"
          : "Application submitted successfully.",
      );
      closeApplyModal();
      setActiveTab("applied");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.message ||
          (lang === "ja"
            ? "応募の送信に失敗しました"
            : "Failed to submit application"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-blue-100" />
          <h2 className="text-xl font-semibold text-slate-900">
            {lang === "ja"
              ? "ダッシュボードを読み込み中..."
              : "Loading your dashboard..."}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {lang === "ja"
              ? "求人情報と応募状況を取得しています。"
              : "Please wait while we fetch your jobs and applications."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
          <div className="mb-4 inline-flex rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
            {lang === "ja" ? "エラーが発生しました" : "Something went wrong"}
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {lang === "ja"
              ? "ダッシュボードを読み込めません"
              : "Unable to load dashboard"}
          </h2>
          <p className="mt-3 text-sm text-slate-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            {lang === "ja" ? "再試行" : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  const availableCount = filteredVacancies.length;
  const appliedCount = filteredApplications.length;

  const statusLabels = {
    pending: lang === "ja" ? "保留中" : "pending",
    reviewed: lang === "ja" ? "審査中" : "reviewed",
    shortlisted: lang === "ja" ? "選考中" : "shortlisted",
    rejected: lang === "ja" ? "不合格" : "rejected",
    hired: lang === "ja" ? "採用" : "hired",
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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {lang === "ja" ? "求人ダッシュボード" : "Job Dashboard"}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
            {lang === "ja"
              ? "新しい機会を探し、すべての応募を追跡し、求職活動を一元管理します。"
              : "Explore new opportunities, track every application, and manage your job search from one place."}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {!isProfileComplete && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-amber-800">
                    {lang === "ja"
                      ? "プロフィール不完全"
                      : "Profile incomplete"}
                  </h3>
                  <p className="mt-1 text-sm text-amber-700">
                    {lang === "ja"
                      ? "プロフィールを完了して、求人を探してみましょう。"
                      : "Please complete your profile to get placements."}
                  </p>
                </div>
              </div>
              <Link
                href={
                  lang === "ja"
                    ? "/job-seekers/profile/"
                    : "/en/job-seekers/profile/"
                }
                className="inline-flex items-center gap-2 self-start rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 sm:self-auto"
              >
                {lang === "ja" ? "プロフィールを設定" : "Complete Profile"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <StatCard
            label={lang === "ja" ? "利用可能な求人" : "Available Jobs"}
            value={String(filteredVacancies.length)}
          />
          <StatCard
            label={lang === "ja" ? "応募済み" : "Applied Jobs"}
            value={String(applications.length)}
          />
          <StatCard
            label={lang === "ja" ? "進行中" : "In Progress"}
            value={String(
              applications.filter((a) =>
                ["pending", "reviewed", "shortlisted"].includes(a.status),
              ).length,
            )}
          />
        </section>

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex rounded-2xl bg-slate-100 p-1">
              <TabButton
                active={activeTab === "available"}
                onClick={() => setActiveTab("available")}
                icon={<Search className="h-4 w-4" />}
                label={`${lang === "ja" ? "利用可能な求人" : "Available Jobs"} (${availableCount})`}
              />
              <TabButton
                active={activeTab === "applied"}
                onClick={() => setActiveTab("applied")}
                icon={<FileText className="h-4 w-4" />}
                label={`${lang === "ja" ? "応募状況" : "My Applications"} (${appliedCount})`}
              />
            </div>

            <div className="w-full lg:max-w-md">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    activeTab === "available"
                      ? lang === "ja"
                        ? "求人を検索..."
                        : "Search available jobs..."
                      : lang === "ja"
                        ? "応募を検索..."
                        : "Search your applications..."
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </section>

        {activeTab === "available" ? (
          filteredVacancies.length === 0 ? (
            <EmptyState
              title={
                lang === "ja"
                  ? "利用可能な求人はありません"
                  : "No available jobs found"
              }
              description={
                lang === "ja"
                  ? "別の検索をお試しいただくか、後でもう一度ご確認ください。"
                  : "Try another search or check back later for new openings."
              }
            />
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredVacancies.map((vacancy) => (
                <VacancyCard
                  key={vacancy.id}
                  vacancy={vacancy}
                  onApply={() => openApplyModal(vacancy)}
                  lang={lang}
                  statusLabels={statusLabels}
                />
              ))}
            </div>
          )
        ) : filteredApplications.length === 0 ? (
          <EmptyState
            title={
              lang === "ja" ? "応募はまだありません" : "No applications yet"
            }
            description={
              lang === "ja"
                ? "求人に応募すると、ここに状況が表示されます。"
                : "Once you apply for jobs, they will appear here with their current status."
            }
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.application_id}
                application={application}
                lang={lang}
                statusLabels={statusLabels}
              />
            ))}
          </div>
        )}
      </main>

      {isApplyOpen && selectedVacancy && (
        <ApplyModal
          closeApplyModal={closeApplyModal}
          lang={lang}
          selectedVacancy={selectedVacancy}
          handleApplySubmit={handleApplySubmit}
          applyForm={applyForm}
          handleApplyInputChange={handleApplyInputChange}
          submitting={submitting}
          missingFields={missingFields}
        />
      )}
    </div>
  );
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
