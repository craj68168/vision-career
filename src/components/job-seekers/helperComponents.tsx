import {
  ArrowRight,
  BadgeJapaneseYen,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock3,
  Laptop2,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import type { Vacancy, Application } from "./body";

function formatSalary(vacancy: Vacancy, lang: string) {
  if (vacancy.salary_min || vacancy.salary_max) {
    const min = vacancy.salary_min ?? 0;
    const max = vacancy.salary_max ?? 0;
    return `${min} - ${max} ${lang === "ja" ? "万円" : "man yen"}`;
  }
  return vacancy.salary_note || (lang === "ja" ? "未指定" : "Not specified");
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

function statusClasses(status: string) {
  switch (status) {
    case "shortlisted":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "reviewed":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "rejected":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    case "hired":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    default:
      return "bg-slate-100 text-slate-700 border border-slate-200";
  }
}

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"
          : "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
      }
    >
      {icon}
      {label}
    </button>
  );
}

export function VacancyCard({
  vacancy,
  onApply,
  lang,
  statusLabels,
}: {
  vacancy: Vacancy;
  onApply: () => void;
  lang: string;
  statusLabels: any;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{vacancy.employment_type}</Badge>
          <Badge subtle>{vacancy.japanese_level}</Badge>
          {vacancy.remote_work && <Badge subtle>{vacancy.remote_work}</Badge>}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900">{vacancy.title}</h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400" />
              {vacancy.company_name}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              {vacancy.work_location}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-slate-400" />
              {lang === "ja" ? "掲載日" : "Posted"}{" "}
              {formatDate(vacancy.created_at, lang)}
            </span>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <QuickInfo
            icon={<Briefcase className="h-4 w-4" />}
            label={lang === "ja" ? "雇用形態" : "Employment"}
            value={vacancy.employment_type || "-"}
          />
          <QuickInfo
            icon={<Users className="h-4 w-4" />}
            label={lang === "ja" ? "募集人数" : "Openings"}
            value={String(vacancy.number_of_people || 0)}
          />
          <QuickInfo
            icon={<Laptop2 className="h-4 w-4" />}
            label={lang === "ja" ? "リモートワーク" : "Remote Work"}
            value={vacancy.remote_work || "-"}
          />
          <QuickInfo
            icon={<BadgeJapaneseYen className="h-4 w-4" />}
            label={lang === "ja" ? "給与" : "Salary"}
            value={formatSalary(vacancy, lang)}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900">
            {lang === "ja" ? "仕事内容" : "Job Description"}
          </h3>
          <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {vacancy.job_description || "-"}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={`mailto:${vacancy.contact_email}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <Mail className="h-4 w-4" />
            {lang === "ja" ? "採用担当者に連絡" : "Contact Recruiter"}
          </a>

          <button
            type="button"
            onClick={onApply}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {lang === "ja" ? "今すぐ応募" : "Apply Now"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function ApplicationCard({
  application,
  lang,
  statusLabels,
}: {
  application: Application;
  lang: string;
  statusLabels: any;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {application.vacancy?.title ||
                (lang === "ja" ? "無題の求人" : "Untitled Vacancy")}
            </h2>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" />
                {application.vacancy?.company_name || "-"}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                {application.vacancy?.work_location || "-"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-slate-400" />
                {lang === "ja" ? "応募日" : "Applied"}{" "}
                {formatDate(application.applied_at, lang)}
              </span>
            </div>
          </div>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
              application.status,
            )}`}
          >
            {statusLabels[application.status] || application.status}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <QuickInfo
            icon={<Briefcase className="h-4 w-4" />}
            label={lang === "ja" ? "雇用形態" : "Employment"}
            value={application.vacancy?.employment_type || "-"}
          />
          <QuickInfo
            icon={<BadgeJapaneseYen className="h-4 w-4" />}
            label={lang === "ja" ? "給与" : "Salary"}
            value={
              application.vacancy
                ? formatSalary(application.vacancy, lang)
                : "-"
            }
          />
          <QuickInfo
            icon={<Users className="h-4 w-4" />}
            label={lang === "ja" ? "ステータス" : "Status"}
            value={statusLabels[application.status] || application.status}
          />
          <QuickInfo
            icon={<CheckCircle2 className="h-4 w-4" />}
            label={lang === "ja" ? "応募ID" : "Application ID"}
            value={String(application.application_id)}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900">
            {lang === "ja" ? "あなたの応募" : "Your Application"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {application.cover_letter ||
              (lang === "ja"
                ? "カバーレターはありません。"
                : "No cover letter submitted.")}
          </p>
        </div>
      </div>
    </article>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  lang,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  lang: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
        placeholder={placeholder}
      />
    </div>
  );
}

export function Badge({
  children,
  subtle = false,
}: {
  children: React.ReactNode;
  subtle?: boolean;
}) {
  return (
    <span
      className={
        subtle
          ? "inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
          : "inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white"
      }
    >
      {children}
    </span>
  );
}

export function QuickInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-900">{value || "-"}</p>
    </div>
  );
}
