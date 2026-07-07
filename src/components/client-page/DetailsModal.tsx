import {
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Languages,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  User,
  Wallet,
  X,
} from "lucide-react";

export function ErrorPanel({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm">{message}</p>
    </div>
  );
}

export function formatDate(lang: string, date?: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const formatSalary = (lang: string, min?: number, max?: number) => {
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

export default function DetailsModal({
  closeDetailsModal,
  lang,
  selectedVacancy,
  loadingDetails,
  detailsError,
  handleEditVacancy,
}: any) {
  const DetailItem = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value?: string | number | null;
    icon?: React.ReactNode;
  }) => {
    if (value === undefined || value === null || value === "") return null;
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {icon}
          <span>{label}</span>
        </div>
        <div className="whitespace-pre-wrap text-sm leading-6 text-slate-800">
          {value}
        </div>
      </div>
    );
  };

  const toList = (value?: string[] | string) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    return [value].filter(Boolean);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={closeDetailsModal}
        aria-hidden="true"
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {lang === "ja" ? "求人詳細" : "Vacancy Details"}
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              {selectedVacancy?.title ||
                (lang === "ja" ? "詳細を読み込み中..." : "Loading details...")}
            </h3>
          </div>
          <button
            onClick={closeDetailsModal}
            className="rounded-full p-2 cursor-pointer text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-6 py-6">
          {loadingDetails ? (
            <div className="py-16 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />
              <p className="mt-4 text-sm text-slate-600">
                {lang === "ja"
                  ? "求人詳細を読み込み中..."
                  : "Loading vacancy details..."}
              </p>
            </div>
          ) : detailsError ? (
            <ErrorPanel
              title={
                lang === "ja"
                  ? "詳細を読み込めません"
                  : "Unable to load details"
              }
              message={detailsError}
            />
          ) : selectedVacancy ? (
            <div className="space-y-8">
              <div className="rounded-3xl bg-slate-900 p-6 text-white">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm text-slate-300">
                      {selectedVacancy.company_name ||
                        (lang === "ja" ? "不明な企業" : "Unknown company")}
                    </p>
                    <h2 className="mt-1 text-3xl font-bold">
                      {selectedVacancy.title || "-"}
                    </h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
                        {selectedVacancy.employment_type || "N/A"}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
                        {selectedVacancy.work_location ||
                          (lang === "ja" ? "場所未設定" : "Location not set")}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
                        {formatSalary(
                          lang,
                          selectedVacancy.salary_min,
                          selectedVacancy.salary_max,
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">
                    <div className="text-slate-300">
                      {lang === "ja" ? "掲載日" : "Posted"}
                    </div>
                    <div className="mt-1 font-medium text-white">
                      {formatDate(lang, selectedVacancy.created_at)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleEditVacancy(selectedVacancy.id)}
                  className="inline-flex items-center cursor-pointer gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  <Pencil className="h-4 w-4" />
                  {lang === "ja" ? "この求人を編集" : "Edit This Vacancy"}
                </button>
              </div>

              <section>
                <h4 className="mb-4 text-lg font-semibold text-slate-900">
                  {lang === "ja" ? "概要" : "Overview"}
                </h4>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <DetailItem
                    label={lang === "ja" ? "会社名" : "Company Name"}
                    value={selectedVacancy.company_name}
                    icon={<Building2 className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={
                      lang === "ja" ? "会社名（カナ）" : "Company Name Kana"
                    }
                    value={selectedVacancy.company_name_kana}
                    icon={<Building2 className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "職種" : "Job Title"}
                    value={selectedVacancy.title}
                    icon={<Briefcase className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "職種（カナ）" : "Job Title Kana"}
                    value={selectedVacancy.title_kana}
                    icon={<Briefcase className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "雇用形態" : "Employment Type"}
                    value={selectedVacancy.employment_type}
                    icon={<FileText className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "募集人数" : "Number of People"}
                    value={selectedVacancy.number_of_people}
                    icon={<User className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "日本語レベル" : "Japanese Level"}
                    value={selectedVacancy.japanese_level}
                    icon={<Languages className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "勤務地" : "Work Location"}
                    value={selectedVacancy.work_location}
                    icon={<MapPin className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "詳細住所" : "Detailed Location"}
                    value={selectedVacancy.work_location_detail}
                    icon={<MapPin className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "リモートワーク" : "Remote Work"}
                    value={selectedVacancy.remote_work}
                    icon={<CheckCircle2 className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "給与" : "Salary"}
                    value={formatSalary(
                      lang,
                      selectedVacancy.salary_min,
                      selectedVacancy.salary_max,
                    )}
                    icon={<Wallet className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "給与備考" : "Salary Note"}
                    value={selectedVacancy.salary_note}
                    icon={<Wallet className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "勤務時間" : "Work Hours"}
                    value={selectedVacancy.work_hours}
                    icon={<Clock3 className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "休憩時間" : "Break Time"}
                    value={selectedVacancy.break_time}
                    icon={<Clock3 className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "残業" : "Overtime"}
                    value={selectedVacancy.overtime}
                    icon={<Clock3 className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "休日" : "Holidays"}
                    value={selectedVacancy.holidays}
                    icon={<CalendarDays className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "試用期間" : "Trial Period"}
                    value={selectedVacancy.trial_period}
                    icon={<CalendarDays className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "応募期限" : "Application Deadline"}
                    value={formatDate(selectedVacancy.application_deadline)}
                    icon={<CalendarDays className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "開始日" : "Start Date"}
                    value={selectedVacancy.start_date}
                    icon={<CalendarDays className="h-4 w-4" />}
                  />
                </div>
              </section>

              <section>
                <h4 className="mb-4 text-lg font-semibold text-slate-900">
                  {lang === "ja" ? "職務詳細" : "Job Details"}
                </h4>
                <div className="grid gap-4">
                  <DetailItem
                    label={lang === "ja" ? "仕事内容" : "Job Description"}
                    value={selectedVacancy.job_description}
                    icon={<FileText className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "責任" : "Responsibilities"}
                    value={selectedVacancy.responsibilities}
                    icon={<FileText className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "必須スキル" : "Required Skills"}
                    value={selectedVacancy.required_skills}
                    icon={<CheckCircle2 className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "歓迎スキル" : "Preferred Skills"}
                    value={selectedVacancy.preferred_skills}
                    icon={<CheckCircle2 className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "必要学歴" : "Required Education"}
                    value={selectedVacancy.required_education}
                    icon={<GraduationCap className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "必要経験" : "Required Experience"}
                    value={selectedVacancy.required_experience}
                    icon={<Briefcase className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "選考プロセス" : "Selection Process"}
                    value={selectedVacancy.selection_process}
                    icon={<FileText className="h-4 w-4" />}
                  />
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h4 className="mb-4 text-lg font-semibold text-slate-900">
                    {lang === "ja" ? "福利厚生" : "Benefits"}
                  </h4>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    {toList(selectedVacancy.benefits).length > 0 ? (
                      <ul className="space-y-2 text-sm text-slate-800">
                        {toList(selectedVacancy.benefits).map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-slate-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">
                        {lang === "ja"
                          ? "福利厚生の記載はありません。"
                          : "No benefits specified."}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-4 text-lg font-semibold text-slate-900">
                    {lang === "ja" ? "保険" : "Insurance"}
                  </h4>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    {toList(selectedVacancy.insurance).length > 0 ? (
                      <ul className="space-y-2 text-sm text-slate-800">
                        {toList(selectedVacancy.insurance).map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-slate-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">
                        {lang === "ja"
                          ? "保険の記載はありません。"
                          : "No insurance specified."}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <h4 className="mb-4 text-lg font-semibold text-slate-900">
                  {lang === "ja" ? "連絡先情報" : "Contact Information"}
                </h4>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <DetailItem
                    label={lang === "ja" ? "担当者" : "Contact Person"}
                    value={selectedVacancy.contact_person}
                    icon={<User className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={
                      lang === "ja" ? "担当者（カナ）" : "Contact Person Kana"
                    }
                    value={selectedVacancy.contact_person_kana}
                    icon={<User className="h-4 w-4" />}
                  />
                  <DetailItem
                    label={lang === "ja" ? "連絡先メール" : "Contact Email"}
                    value={selectedVacancy.contact_email}
                    icon={<Mail className="h-4 w-4" />}
                  />
                </div>
              </section>
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-slate-500">
              {lang === "ja"
                ? "求人詳細はありません。"
                : "No vacancy details available."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
