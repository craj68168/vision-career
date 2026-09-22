"use client";

import {
  AlertTriangle,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import type { AdminSeeker, SeekerScreeningStatus } from "./types";

type Props = {
  lang: string;

  seeker: AdminSeeker;

  isDownloading: boolean;

  onClose: () => void;

  onDownloadResume: () => void;

  onReview: () => void;
};

// ======================================================
// HELPERS
// ======================================================

const text = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
};

const dateText = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString();
};

// ======================================================
// SCREENING LABEL
// ======================================================

const screeningLabel = (status: SeekerScreeningStatus, lang: string) => {
  if (lang === "ja") {
    switch (status) {
      case "SCREENED":
        return "確認済み";

      case "NEEDS_ATTENTION":
        return "要確認";

      default:
        return "未確認";
    }
  }

  switch (status) {
    case "SCREENED":
      return "Screened";

    case "NEEDS_ATTENTION":
      return "Needs Attention";

    default:
      return "Not Screened";
  }
};

// ======================================================
// SCREENING CLASS
// ======================================================

const screeningClass = (status: SeekerScreeningStatus) => {
  switch (status) {
    case "SCREENED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
};

// ======================================================
// VIEW MODAL
// ======================================================

export default function ViewModal({
  lang,
  seeker,
  isDownloading,
  onClose,
  onDownloadResume,
  onReview,
}: Props) {
  const screening = seeker.staffScreening;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {lang === "ja" ? "求職者詳細" : "Job Seeker Details"}
            </p>

            <h2 className="mt-1 text-2xl font-bold">{seeker.name}</h2>

            <p className="text-sm text-slate-500">{seeker.seeker_id}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="overflow-y-auto p-6">
          {/* PROFILE */}

          <div className="grid gap-4 md:grid-cols-3">
            <Info icon={Mail} label="Email" value={seeker.email} />

            <Info
              icon={Phone}
              label={lang === "ja" ? "電話番号" : "Phone"}
              value={text(seeker.phone)}
            />

            <Info
              icon={MapPin}
              label={lang === "ja" ? "現在地" : "Current Location"}
              value={text(seeker.current_location)}
            />

            <Info
              icon={UserRound}
              label={lang === "ja" ? "国籍" : "Nationality"}
              value={text(seeker.nationality)}
            />

            <Info
              icon={CalendarDays}
              label={lang === "ja" ? "生年月日" : "Date of Birth"}
              value={dateText(seeker.date_of_birth)}
            />

            <Info
              icon={ShieldCheck}
              label={lang === "ja" ? "在留資格" : "Visa Type"}
              value={text(seeker.visa_type)}
            />

            <Info
              icon={CalendarDays}
              label={lang === "ja" ? "在留期限" : "Visa Expiry"}
              value={dateText(seeker.visa_expiry_date)}
            />

            <Info
              icon={UserRound}
              label={lang === "ja" ? "日本語レベル" : "Japanese Level"}
              value={text(seeker.japanese_level)}
            />

            <Info
              icon={Briefcase}
              label={lang === "ja" ? "希望職種" : "Desired Job"}
              value={text(seeker.desired_job)}
            />

            <Info
              icon={MapPin}
              label={lang === "ja" ? "希望勤務地" : "Desired Location"}
              value={text(seeker.desired_location)}
            />

            <Info
              icon={CalendarDays}
              label={lang === "ja" ? "勤務可能日" : "Available From"}
              value={dateText(seeker.available_from)}
            />

            <Info
              icon={FileText}
              label={lang === "ja" ? "応募数" : "Applications"}
              value={seeker.applications_count}
            />
          </div>

          {/* EDUCATION + EMPLOYMENT */}

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <Section
              title={lang === "ja" ? "学歴" : "Education"}
              icon={GraduationCap}
            >
              {seeker.education.length === 0 ? (
                <Empty />
              ) : (
                seeker.education.map((education, index) => (
                  <div
                    key={education._id || index}
                    className="border-b border-slate-100 py-3 last:border-0"
                  >
                    <p className="font-semibold">{education.school}</p>

                    <p className="text-sm text-slate-500">
                      {text(education.major)}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {dateText(education.enrollment_date)}

                      {" — "}

                      {dateText(education.graduation_date)}
                    </p>
                  </div>
                ))
              )}
            </Section>

            <Section
              title={lang === "ja" ? "職歴" : "Employment History"}
              icon={Briefcase}
            >
              {seeker.employment_history.length === 0 ? (
                <Empty />
              ) : (
                seeker.employment_history.map((employment, index) => (
                  <div
                    key={employment._id || index}
                    className="border-b border-slate-100 py-3 last:border-0"
                  >
                    <p className="font-semibold">{employment.company_name}</p>

                    <p className="text-sm text-slate-500">
                      {text(employment.employment_type)}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {dateText(employment.start_date)}

                      {" — "}

                      {dateText(employment.end_date)}
                    </p>
                  </div>
                ))
              )}
            </Section>
          </div>

          {/* SKILLS */}

          <div className="mt-5 rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold">
              {lang === "ja" ? "スキル" : "Skills"}
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {seeker.skills.length > 0 ? (
                seeker.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <Empty />
              )}
            </div>
          </div>

          {/* =================================================
              STAFF SCREENING
          ================================================= */}

          <section className="mt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-950">
                {lang === "ja" ? "スタッフ確認" : "Staff Screening"}
              </h3>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${screeningClass(
                  screening.status,
                )}`}
              >
                {screeningLabel(screening.status, lang)}
              </span>
            </div>

            {/* NOT SCREENED */}

            {screening.status === "NOT_SCREENED" && (
              <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                <div>
                  <p className="font-semibold text-amber-800">
                    {lang === "ja"
                      ? "この求職者はまだスタッフによる確認が完了していません。"
                      : "This Job Seeker has not been screened by Staff yet."}
                  </p>

                  <p className="mt-1 text-sm text-amber-700">
                    {lang === "ja"
                      ? "管理者は最終判断を行うことができます。"
                      : "Admin retains final registration approval authority."}
                  </p>
                </div>
              </div>
            )}

            {/* SCREENED */}

            {screening.status === "SCREENED" && (
              <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="font-semibold text-emerald-800">
                    {lang === "ja"
                      ? "スタッフ確認済み"
                      : "Staff screening completed."}
                  </p>

                  <p className="mt-1 text-sm text-emerald-700">
                    {lang === "ja"
                      ? "この登録は管理者の最終判断の準備ができています。"
                      : "This registration is ready for the Admin's final decision."}
                  </p>
                </div>
              </div>
            )}

            {/* NEEDS ATTENTION */}

            {screening.status === "NEEDS_ATTENTION" && (
              <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                <div>
                  <p className="font-semibold text-red-800">
                    {lang === "ja"
                      ? "スタッフがこの登録を要確認としています。"
                      : "Staff marked this Job Seeker as needing attention."}
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    {lang === "ja"
                      ? "スタッフメモを確認してから承認・却下してください。"
                      : "Review the Staff note before making the final registration decision."}
                  </p>
                </div>
              </div>
            )}

            {/* SCREENING META */}

            {screening.status !== "NOT_SCREENED" && (
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <ScreeningDetail
                  label={lang === "ja" ? "確認担当スタッフ" : "Screened By"}
                  value={screening.screenedByStaffId}
                />

                <ScreeningDetail
                  label={lang === "ja" ? "確認日時" : "Screened At"}
                  value={dateText(screening.screenedAt)}
                />
              </div>
            )}

            {/* NOTE */}

            {screening.note && (
              <div
                className={`mt-3 rounded-2xl border p-4 ${
                  screening.status === "NEEDS_ATTENTION"
                    ? "border-red-200 bg-red-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {lang === "ja" ? "スタッフメモ" : "Staff Screening Note"}
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {screening.note}
                </p>
              </div>
            )}

            <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
              {lang === "ja"
                ? "スタッフ確認は参考情報です。最終的な登録承認・却下およびアカウント管理は管理者が行います。"
                : "Staff screening is advisory. Final registration approval, rejection and account control remain with Admin."}
            </div>
          </section>

          {/* =================================================
              CURRENT STATUS
          ================================================= */}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatusBox
              title={lang === "ja" ? "承認" : "Approval"}
              value={seeker.approval_status}
            />

            <StatusBox
              title={lang === "ja" ? "アカウント" : "Account"}
              value={seeker.account_status}
            />

            <StatusBox
              title={lang === "ja" ? "配置" : "Placement"}
              value={seeker.placement_status}
            />
          </div>

          {/* ADMIN REJECTION */}

          {seeker.rejection_reason && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-xs font-semibold uppercase text-red-700">
                {lang === "ja" ? "却下理由" : "Admin Rejection Reason"}
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">
                {seeker.rejection_reason}
              </p>
            </div>
          )}

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="mt-6">
            {seeker.approval_status === "pending" &&
              screening.status === "NEEDS_ATTENTION" && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {lang === "ja"
                    ? "スタッフがこの登録を「要確認」としています。最終判断前にスタッフメモを確認してください。"
                    : "Staff marked this registration as Needs Attention. Review the screening note before making the final decision."}
                </div>
              )}

            <div className="flex flex-wrap justify-end gap-3">
              {seeker.approval_status === "pending" && (
                <button
                  type="button"
                  onClick={onReview}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  {lang === "ja" ? "登録審査" : "Review Registration"}
                </button>
              )}

              {(seeker.resume_file || seeker.generated_resume_file) && (
                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={onDownloadResume}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />

                  {isDownloading
                    ? "Downloading..."
                    : lang === "ja"
                      ? "履歴書をダウンロード"
                      : "Download Resume"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// INFO
// ======================================================

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;

  label: string;

  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-4 w-4 text-slate-400" />

        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-medium text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// SECTION
// ======================================================

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;

  icon: typeof Briefcase;

  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-500" />

        <h3 className="font-semibold">{title}</h3>
      </div>

      <div className="mt-3">{children}</div>
    </div>
  );
}

// ======================================================
// STATUS
// ======================================================

function StatusBox({
  title,
  value,
}: {
  title: string;

  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-400">{title}</p>

      <p className="mt-1 font-semibold capitalize">{value}</p>
    </div>
  );
}

// ======================================================
// SCREENING DETAIL
// ======================================================

function ScreeningDetail({
  label,
  value,
}: {
  label: string;

  value?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}

// ======================================================
// EMPTY
// ======================================================

function Empty() {
  return <p className="text-sm text-slate-400">No information available.</p>;
}
