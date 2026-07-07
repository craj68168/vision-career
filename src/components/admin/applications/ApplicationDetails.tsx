import {
  BadgeJapaneseYen,
  Briefcase,
  Building2,
  CalendarDays,
  FileText,
  Inbox,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  User,
  X,
} from "lucide-react";
import type { VacancyLite } from "./applications";

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {icon}
        <span>{label}</span>
      </div>
      <div className="break-words text-sm leading-6 text-slate-800 dark:text-slate-300">
        {value}
      </div>
    </div>
  );
}

export function statusBadge(status: string) {
  switch (status) {
    case "shortlisted":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
    case "reviewed":
      return "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
    case "rejected":
      return "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800";
    case "hired":
      return "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    default:
      return "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
  }
}

export function formatDate(dateString?: string, lang?: string) {
  if (!dateString || dateString === "-") return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatSalary(vacancy?: VacancyLite, lang?: string) {
  if (!vacancy) return "-";
  if (vacancy.salary_min || vacancy.salary_max) {
    return `${vacancy.salary_min ?? 0} - ${vacancy.salary_max ?? 0} ${lang === "ja" ? "万円" : "man yen"}`;
  }
  return "-";
}

export default function ApplicationDetails({
  lang,
  selectedApplication,
  setSelectedApplication,
  openEditModal,
  openDeleteModal,
}: any) {
  const statusLabels = {
    pending: lang === "ja" ? "保留中" : "pending",
    reviewed: lang === "ja" ? "審査中" : "reviewed",
    shortlisted: lang === "ja" ? "選考中" : "shortlisted",
    rejected: lang === "ja" ? "不合格" : "rejected",
    hired: lang === "ja" ? "採用" : "hired",
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={() => setSelectedApplication(null)}
        aria-hidden="true"
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {lang === "ja" ? "応募詳細" : "Application Details"}
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {selectedApplication.full_name}
            </h3>
          </div>
          <button
            onClick={() => setSelectedApplication(null)}
            className="rounded-full p-2 text-slate-500 transition cursor-pointer hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-6 py-6">
          <div className="space-y-8">
            <div className="rounded-3xl bg-slate-900 p-6 text-white dark:bg-indigo-900">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm text-slate-300 dark:text-indigo-200">
                    {lang === "ja" ? "応募先" : "Applied for"}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">
                    {selectedApplication.vacancy?.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-300 dark:text-indigo-200">
                    {selectedApplication.vacancy?.company_name || "-"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedApplication(null);
                      openEditModal(selectedApplication);
                    }}
                    className="rounded-xl bg-white/20 cursor-pointer px-4 py-2 text-sm font-medium text-white transition hover:bg-white/30"
                  >
                    <Pencil className="inline-block h-4 w-4 mr-2" />
                    {lang === "ja" ? "編集" : "Edit"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedApplication(null);
                      openDeleteModal(selectedApplication);
                    }}
                    className="rounded-xl bg-white/20 cursor-pointer px-4 py-2 text-sm font-medium text-white transition hover:bg-white/30"
                  >
                    <Trash2 className="inline-block h-4 w-4 mr-2" />
                    {lang === "ja" ? "削除" : "Delete"}
                  </button>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                      selectedApplication.status,
                    )}`}
                  >
                    {
                      statusLabels[
                        selectedApplication.status as keyof typeof statusLabels
                      ]
                    }
                  </span>
                </div>
              </div>
            </div>

            <section>
              <h4 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                {lang === "ja" ? "応募者情報" : "Applicant Information"}
              </h4>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <InfoCard
                  label={lang === "ja" ? "応募者名" : "Applicant Name"}
                  value={selectedApplication.full_name}
                  icon={<User className="h-4 w-4" />}
                />
                <InfoCard
                  label={lang === "ja" ? "応募者メール" : "Applicant Email"}
                  value={selectedApplication.email}
                  icon={<Mail className="h-4 w-4" />}
                />
                <InfoCard
                  label={lang === "ja" ? "電話番号" : "Phone"}
                  value={selectedApplication.phone}
                  icon={<Phone className="h-4 w-4" />}
                />
                <InfoCard
                  label={lang === "ja" ? "現在地" : "Current Location"}
                  value={selectedApplication.current_location || "-"}
                  icon={<MapPin className="h-4 w-4" />}
                />
                <InfoCard
                  label={lang === "ja" ? "応募日" : "Applied Date"}
                  value={formatDate(selectedApplication.applied_at, lang)}
                  icon={<CalendarDays className="h-4 w-4" />}
                />
                <InfoCard
                  label={lang === "ja" ? "応募ID" : "Application ID"}
                  value={String(selectedApplication.application_id)}
                  icon={<FileText className="h-4 w-4" />}
                />
              </div>
            </section>

            <section>
              <h4 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                {lang === "ja" ? "プロバイダー情報" : "Provider Information"}
              </h4>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <InfoCard
                  label={lang === "ja" ? "プロバイダー名" : "Provider Name"}
                  value={selectedApplication.provider?.name || "-"}
                  icon={<User className="h-4 w-4" />}
                />
                <InfoCard
                  label={
                    lang === "ja" ? "プロバイダーメール" : "Provider Email"
                  }
                  value={selectedApplication.provider?.email || "-"}
                  icon={<Mail className="h-4 w-4" />}
                />
                <InfoCard
                  label={lang === "ja" ? "企業名" : "Company"}
                  value={selectedApplication.vacancy?.company_name || "-"}
                  icon={<Building2 className="h-4 w-4" />}
                />
              </div>
            </section>

            <section>
              <h4 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                {lang === "ja" ? "求人情報" : "Vacancy Information"}
              </h4>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <InfoCard
                  label={lang === "ja" ? "求人タイトル" : "Vacancy Title"}
                  value={selectedApplication.vacancy?.title || "-"}
                  icon={<Briefcase className="h-4 w-4" />}
                />
                <InfoCard
                  label={lang === "ja" ? "雇用形態" : "Employment Type"}
                  value={selectedApplication.vacancy?.employment_type || "-"}
                  icon={<Briefcase className="h-4 w-4" />}
                />
                <InfoCard
                  label={lang === "ja" ? "勤務地" : "Location"}
                  value={selectedApplication.vacancy?.work_location || "-"}
                  icon={<MapPin className="h-4 w-4" />}
                />
                <InfoCard
                  label={lang === "ja" ? "日本語レベル" : "Japanese Level"}
                  value={"-"}
                  icon={<User className="h-4 w-4" />}
                />
                <InfoCard
                  label={lang === "ja" ? "給与" : "Salary"}
                  value={formatSalary(selectedApplication.vacancy, lang)}
                  icon={<BadgeJapaneseYen className="h-4 w-4" />}
                />
                <InfoCard
                  label={lang === "ja" ? "応募総数" : "Total Applications"}
                  value={String(
                    selectedApplication.vacancy?.total_applications ?? 0,
                  )}
                  icon={<Inbox className="h-4 w-4" />}
                />
              </div>
            </section>

            <section>
              <h4 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                {lang === "ja" ? "カバーレター" : "Cover Letter"}
              </h4>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {selectedApplication.cover_letter ||
                    (lang === "ja"
                      ? "カバーレターはありません。"
                      : "No cover letter submitted.")}
                </p>
              </div>
            </section>

            {selectedApplication.cv_file_path && (
              <div className="flex justify-end">
                <a
                  href={`https://vision-career.co.jp/view_resume.php?token=${localStorage.getItem("admin_token")}&resume=${selectedApplication.cv_file_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                >
                  {lang === "ja" ? "履歴書を開く" : "Open CV"}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
