import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { formatDate } from "./DetailsModal";
export function statusBadge(status: string) {
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

export function InfoChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-2 text-sm text-slate-800 break-words">{value}</div>
    </div>
  );
}

export default function Applications({
  filteredApplications,
  lang,
  handleChangeStatus,
  handleViewApplication,
}: any) {
  const statusLabels = {
    pending: lang === "ja" ? "保留中" : "pending",
    reviewed: lang === "ja" ? "審査中" : "reviewed",
    shortlisted: lang === "ja" ? "選考中" : "shortlisted",
    rejected: lang === "ja" ? "不合格" : "rejected",
    hired: lang === "ja" ? "採用" : "hired",
  };
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {filteredApplications.map(({ vacancy, application }: any) => (
        <article
          key={application.application_id}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {lang === "ja"
                    ? `応募 #${application.application_id}`
                    : `Application #${application.application_id}`}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">
                  {application.full_name}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {lang === "ja" ? "応募先" : "Applied for"}{" "}
                  <span className="font-medium text-slate-900">
                    {vacancy.title}
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                    application.status,
                  )}`}
                >
                  {
                    statusLabels[
                      application.status as keyof typeof statusLabels
                    ]
                  }
                </span>

                <select
                  value={application.status}
                  onChange={(e) =>
                    handleChangeStatus(
                      application.application_id,
                      e.target.value,
                    )
                  }
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
                >
                  <option value="pending">
                    {lang === "ja" ? "保留中" : "Pending"}
                  </option>
                  <option value="reviewed">
                    {lang === "ja" ? "審査中" : "Reviewed"}
                  </option>
                  <option value="shortlisted">
                    {lang === "ja" ? "選考中" : "Shortlisted"}
                  </option>
                  <option value="rejected">
                    {lang === "ja" ? "不合格" : "Rejected"}
                  </option>
                  <option value="hired">
                    {lang === "ja" ? "採用" : "Hired"}
                  </option>
                </select>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <InfoChip
                icon={<Mail className="h-4 w-4" />}
                label={lang === "ja" ? "メール" : "Email"}
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
                value={formatDate(application.applied_at)}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {lang === "ja" ? "カバーレター" : "Cover Letter"}
              </p>
              <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {application.cover_letter ||
                  (lang === "ja"
                    ? "カバーレターはありません。"
                    : "No cover letter submitted.")}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <div className="text-sm text-slate-500">
                {vacancy.company_name ||
                  (lang === "ja" ? "企業未指定" : "Company not specified")}
              </div>

              <div className="flex items-center gap-2">
                {application.cv_file_path && (
                  <a
                    href={`https://vision-career.co.jp${application.cv_file_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    {lang === "ja" ? "履歴書を見る" : "View CV"}
                  </a>
                )}
                <button
                  onClick={() =>
                    handleViewApplication({
                      vacancy,
                      application,
                    })
                  }
                  className="rounded-xl bg-slate-900 cursor-pointer px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  {lang === "ja" ? "詳細を見る" : "View Details"}
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
