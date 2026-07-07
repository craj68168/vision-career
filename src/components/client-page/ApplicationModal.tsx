// components/ApplicationModal.tsx
import {
  CalendarDays,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
  X,
  Download,
  Eye,
  Briefcase,
  GraduationCap,
  Building2,
  Globe,
  Clock,
  Languages,
  FileCheck,
  UserCheck,
  AlertCircle,
  Award,
} from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

// Dynamically import PDF components to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false },
);

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false },
);

// Import the ResumePDF component
import ResumePDF from "./resume";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

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
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-sm leading-6 text-slate-800 break-words">
        {value || "-"}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
        <span className="text-slate-500">{icon}</span>
        <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function EducationItem({ edu }: { edu: any }) {
  return (
    <div className="border-b border-slate-100 last:border-0 py-3 first:pt-0 last:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-medium text-slate-800">{edu.school || "-"}</p>
          {edu.major && <p className="text-sm text-slate-600">{edu.major}</p>}
          {edu.school_type && (
            <p className="text-xs text-slate-500">{edu.school_type}</p>
          )}
        </div>
        <div className="mt-1 text-sm text-slate-500 sm:mt-0">
          {edu.enrollment_date && formatDate(edu.enrollment_date)}
          {edu.enrollment_date && edu.graduation_date && " - "}
          {edu.graduation_date && formatDate(edu.graduation_date)}
        </div>
      </div>
    </div>
  );
}

function EmploymentItem({ emp }: { emp: any }) {
  return (
    <div className="border-b border-slate-100 last:border-0 py-3 first:pt-0 last:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-medium text-slate-800">
            {emp.company_name || "-"}
          </p>
          {emp.employment_type && (
            <p className="text-sm text-slate-600">{emp.employment_type}</p>
          )}
        </div>
        <div className="mt-1 text-sm text-slate-500 sm:mt-0">
          {emp.start_date && formatDate(emp.start_date)}
          {emp.start_date && emp.end_date && " - "}
          {emp.end_date && formatDate(emp.end_date)}
        </div>
      </div>
    </div>
  );
}

export default function ApplicationModal({
  closeApplicationModal,
  lang,
  selectedApplication,
  handleChangeStatus,
}: any) {
  const [showResumeViewer, setShowResumeViewer] = useState(false);

  const application = selectedApplication?.application || {};
  const vacancy = selectedApplication?.vacancy || {};
  const applicant = application.applicant || {};

  const statusLabels: Record<string, string> = {
    pending: lang === "ja" ? "保留中" : "Pending",
    reviewed: lang === "ja" ? "審査中" : "Reviewed",
    shortlisted: lang === "ja" ? "選考中" : "Shortlisted",
    rejected: lang === "ja" ? "不合格" : "Rejected",
    accepted: lang === "ja" ? "採用" : "Accepted",
    hired: lang === "ja" ? "採用" : "Hired",
  };

  function statusBadge(status: string) {
    switch (status?.toLowerCase()) {
      case "shortlisted":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "reviewed":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "rejected":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      case "accepted":
      case "hired":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  }

  // Build applicant data for ResumePDF
  const buildApplicantData = () => {
    return {
      id: applicant.id || application.jobseeker_id,
      name: applicant.name || application.full_name,
      email: applicant.email || application.email,
      phone: applicant.phone || application.phone,
      address: applicant.address || application.current_location,
      date_of_birth: applicant.date_of_birth,
      gender: applicant.gender,
      nationality: applicant.nationality,
      visa_type: applicant.visa_type,
      visa_expiry_date: applicant.visa_expiry_date,
      japanese_level: applicant.japanese_level,
      desired_job: applicant.desired_job,
      desired_location: applicant.desired_location,
      available_from: applicant.available_from,
      resume_file: applicant.resume_file || application.cv_file_path,
      notes: applicant.notes,
      status: applicant.status,
      placement_status: applicant.placement_status,
      created_at: applicant.created_at,
      updated_at: applicant.updated_at,
      education: applicant.education || [],
      employment_history: applicant.employment_history || [],
    };
  };

  const applicantData = buildApplicantData();
  const hasResumeFile = applicant.resume_file || application.cv_file_path;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={closeApplicationModal}
        aria-hidden="true"
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {lang === "ja" ? "応募詳細" : "Application Details"}
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              {applicant.name || application.full_name || "Unknown Applicant"}
            </h3>
          </div>
          <button
            onClick={closeApplicationModal}
            className="rounded-full p-2 text-slate-500 cursor-pointer transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Header Card */}
            <div className="rounded-3xl bg-slate-900 p-6 text-white">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm text-slate-300">
                    {lang === "ja" ? "応募先" : "Applied for"}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">
                    {vacancy.title || "Unknown Position"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">
                    {vacancy.company_name || "-"}
                  </p>
                  {vacancy.work_location && (
                    <p className="mt-1 text-xs text-slate-400">
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {vacancy.work_location}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                      application.status,
                    )}`}
                  >
                    {statusLabels[application.status?.toLowerCase()] ||
                      application.status ||
                      "Unknown"}
                  </span>

                  <select
                    value={application.status || "pending"}
                    onChange={(e) =>
                      handleChangeStatus(
                        application.application_id,
                        e.target.value,
                      )
                    }
                    className="rounded-lg border border-white/30 bg-white/10 px-2 py-1 text-xs text-white backdrop-blur cursor-pointer"
                  >
                    <option value="pending" className="text-slate-900">
                      {lang === "ja" ? "保留中" : "Pending"}
                    </option>
                    <option value="reviewed" className="text-slate-900">
                      {lang === "ja" ? "審査中" : "Reviewed"}
                    </option>
                    <option value="shortlisted" className="text-slate-900">
                      {lang === "ja" ? "選考中" : "Shortlisted"}
                    </option>
                    <option value="rejected" className="text-slate-900">
                      {lang === "ja" ? "不合格" : "Rejected"}
                    </option>
                    <option value="accepted" className="text-slate-900">
                      {lang === "ja" ? "採用" : "Accepted"}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Resume Actions */}
            <div className="flex flex-wrap gap-3">
              {hasResumeFile && (
                <a
                  href={`https://vision-career.co.jp${hasResumeFile}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  <FileText className="h-4 w-4" />
                  {lang === "ja" ? "履歴書を開く" : "View CV"}
                </a>
              )}

              <button
                onClick={() => setShowResumeViewer(!showResumeViewer)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Eye className="h-4 w-4" />
                {showResumeViewer
                  ? lang === "ja"
                    ? "プレビューを閉じる"
                    : "Close Preview"
                  : lang === "ja"
                    ? "履歴書をプレビュー"
                    : "Preview Resume"}
              </button>

              <PDFDownloadLink
                document={
                  <ResumePDF
                    applicant={applicantData}
                    applicationStatus={application.status}
                    coverLetter={application.cover_letter}
                  />
                }
                fileName={`${applicant.name || "applicant"}_resume.pdf`}
              >
                {({ loading }) => (
                  <button
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    <Download className="h-4 w-4" />
                    {loading
                      ? lang === "ja"
                        ? "生成中..."
                        : "Generating..."
                      : lang === "ja"
                        ? "履歴書をダウンロード"
                        : "Download Resume"}
                  </button>
                )}
              </PDFDownloadLink>
            </div>

            {/* PDF Viewer */}
            {showResumeViewer && (
              <div className="h-[500px] w-full rounded-xl border border-slate-200 overflow-hidden">
                <PDFViewer width="100%" height="100%">
                  <ResumePDF
                    applicant={applicantData}
                    applicationStatus={application.status}
                    coverLetter={application.cover_letter}
                  />
                </PDFViewer>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-2">
                <User className="h-4 w-4" />
                {lang === "ja" ? "連絡先情報" : "Contact Information"}
              </h4>

              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard
                  label={lang === "ja" ? "氏名" : "Full Name"}
                  value={applicant.name || application.full_name}
                  icon={<User className="h-4 w-4" />}
                />
                <InfoCard
                  label={lang === "ja" ? "メールアドレス" : "Email"}
                  value={applicant.email || application.email}
                  icon={<Mail className="h-4 w-4" />}
                />
                <InfoCard
                  label={lang === "ja" ? "電話番号" : "Phone"}
                  value={applicant.phone || application.phone}
                  icon={<Phone className="h-4 w-4" />}
                />
                <InfoCard
                  label={lang === "ja" ? "住所" : "Address"}
                  value={applicant.address || application.current_location}
                  icon={<MapPin className="h-4 w-4" />}
                />
              </div>
            </div>

            {/* Personal Details */}
            {(applicant.date_of_birth ||
              applicant.gender ||
              applicant.nationality ||
              applicant.visa_type ||
              applicant.japanese_level) && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  {lang === "ja" ? "個人詳細" : "Personal Details"}
                </h4>

                <div className="grid gap-4 md:grid-cols-2">
                  {applicant.date_of_birth && (
                    <InfoCard
                      label={lang === "ja" ? "生年月日" : "Date of Birth"}
                      value={formatDate(applicant.date_of_birth)}
                      icon={<CalendarDays className="h-4 w-4" />}
                    />
                  )}
                  {applicant.gender && (
                    <InfoCard
                      label={lang === "ja" ? "性別" : "Gender"}
                      value={applicant.gender}
                      icon={<User className="h-4 w-4" />}
                    />
                  )}
                  {applicant.nationality && (
                    <InfoCard
                      label={lang === "ja" ? "国籍" : "Nationality"}
                      value={applicant.nationality}
                      icon={<Globe className="h-4 w-4" />}
                    />
                  )}
                  {applicant.visa_type && (
                    <InfoCard
                      label={lang === "ja" ? "ビザ種別" : "Visa Type"}
                      value={applicant.visa_type}
                      icon={<FileCheck className="h-4 w-4" />}
                    />
                  )}
                  {applicant.visa_expiry_date && (
                    <InfoCard
                      label={lang === "ja" ? "ビザ有効期限" : "Visa Expiry"}
                      value={formatDate(applicant.visa_expiry_date)}
                      icon={<Clock className="h-4 w-4" />}
                    />
                  )}
                  {applicant.japanese_level && (
                    <InfoCard
                      label={lang === "ja" ? "日本語レベル" : "Japanese Level"}
                      value={applicant.japanese_level}
                      icon={<Languages className="h-4 w-4" />}
                    />
                  )}
                  {applicant.available_from && (
                    <InfoCard
                      label={lang === "ja" ? "就業可能日" : "Available From"}
                      value={formatDate(applicant.available_from)}
                      icon={<CalendarDays className="h-4 w-4" />}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Career Preferences */}
            {(applicant.desired_job ||
              applicant.desired_location ||
              applicant.placement_status) && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {lang === "ja" ? "キャリア希望" : "Career Preferences"}
                </h4>

                <div className="grid gap-4 md:grid-cols-2">
                  {applicant.desired_job && (
                    <InfoCard
                      label={lang === "ja" ? "希望職種" : "Desired Job"}
                      value={applicant.desired_job}
                      icon={<Briefcase className="h-4 w-4" />}
                    />
                  )}
                  {applicant.desired_location && (
                    <InfoCard
                      label={lang === "ja" ? "希望勤務地" : "Desired Location"}
                      value={applicant.desired_location}
                      icon={<MapPin className="h-4 w-4" />}
                    />
                  )}
                  {applicant.placement_status && (
                    <InfoCard
                      label={
                        lang === "ja" ? "就職ステータス" : "Placement Status"
                      }
                      value={applicant.placement_status}
                      icon={<Award className="h-4 w-4" />}
                    />
                  )}
                  {applicant.status && (
                    <InfoCard
                      label={
                        lang === "ja" ? "応募者ステータス" : "Applicant Status"
                      }
                      value={applicant.status}
                      icon={<UserCheck className="h-4 w-4" />}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Education Section */}
            {applicant.education && applicant.education.length > 0 && (
              <SectionCard
                title={lang === "ja" ? "学歴" : "Education"}
                icon={<GraduationCap className="h-4 w-4" />}
              >
                {applicant.education.map((edu: any) => (
                  <EducationItem key={edu.id} edu={edu} />
                ))}
              </SectionCard>
            )}

            {/* Employment History Section */}
            {applicant.employment_history &&
              applicant.employment_history.length > 0 && (
                <SectionCard
                  title={lang === "ja" ? "職歴" : "Employment History"}
                  icon={<Building2 className="h-4 w-4" />}
                >
                  {applicant.employment_history.map((emp: any) => (
                    <EmploymentItem key={emp.id} emp={emp} />
                  ))}
                </SectionCard>
              )}

            {/* Cover Letter */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {lang === "ja" ? "カバーレター" : "Cover Letter"}
              </p>
              <div className="mt-3 max-h-60 overflow-y-auto">
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {application.cover_letter ||
                    (lang === "ja"
                      ? "カバーレターはありません。"
                      : "No cover letter submitted.")}
                </p>
              </div>
            </div>

            {/* Application Metadata */}
            <div className="grid gap-4 md:grid-cols-3">
              <InfoCard
                label={lang === "ja" ? "応募日" : "Applied Date"}
                value={formatDate(application.applied_at)}
                icon={<CalendarDays className="h-4 w-4" />}
              />
              {application.reviewed_at && (
                <InfoCard
                  label={lang === "ja" ? "審査日" : "Reviewed Date"}
                  value={formatDate(application.reviewed_at)}
                  icon={<Clock className="h-4 w-4" />}
                />
              )}
              <InfoCard
                label={lang === "ja" ? "応募ID" : "Application ID"}
                value={String(application.application_id || "-")}
                icon={<FileText className="h-4 w-4" />}
              />
            </div>

            {/* Notes if available */}
            {applicant.notes && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {lang === "ja" ? "メモ" : "Notes"}
                </p>
                <p className="mt-2 text-sm text-amber-800">{applicant.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
