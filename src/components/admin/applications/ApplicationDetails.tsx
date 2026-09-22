"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Loader2,
  X,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import {
  formatApplicationDate,
  formatSalary,
  getApplicationStatusClass,
  getApplicationStatusLabel,
} from "./helper";

import type { AdminApplicationDetails, StaffScreeningStatus } from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  application: AdminApplicationDetails;

  isApproving: boolean;

  onClose: () => void;

  onApprove: (applicationId: string) => void;

  onReject: () => void;

  onResume: (applicationId: string) => void;
};

// ======================================================
// DETAIL ITEM
// ======================================================

function DetailItem({
  label,
  value,
}: {
  label: string;

  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}

// ======================================================
// STAFF SCREENING LABEL
// ======================================================

function getStaffScreeningLabel(status: StaffScreeningStatus, lang: string) {
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
}

// ======================================================
// STAFF SCREENING CLASS
// ======================================================

function getStaffScreeningClass(status: StaffScreeningStatus) {
  switch (status) {
    case "SCREENED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

// ======================================================
// APPLICATION DETAILS
// ======================================================

export default function ApplicationDetails({
  application,
  isApproving,
  onClose,
  onApprove,
  onReject,
  onResume,
}: Props) {
  const { lang } = useLanguage();

  const pending = application.status === "PENDING_ADMIN_APPROVAL";

  const staffScreening = application.staffScreening;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      {/* BACKDROP */}

      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      {/* MODAL */}

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              {application.applicationId}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {application.candidate.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {application.vacancy.title}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getApplicationStatusClass(
                application.status,
              )}`}
            >
              {getApplicationStatusLabel(application.status, lang)}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full p-2 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}

        <div className="overflow-y-auto p-6">
          <div className="space-y-8">
            {/* ================================================= */}
            {/* APPLICANT */}
            {/* ================================================= */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {lang === "ja" ? "応募者情報" : "Applicant Information"}
              </h3>

              <div className="grid gap-3 md:grid-cols-3">
                <DetailItem
                  label={lang === "ja" ? "氏名" : "Name"}
                  value={application.candidate.name}
                />

                <DetailItem label="Email" value={application.candidate.email} />

                <DetailItem
                  label={lang === "ja" ? "電話番号" : "Phone"}
                  value={application.candidate.phone}
                />

                <DetailItem
                  label={lang === "ja" ? "現在地" : "Current Location"}
                  value={application.candidate.currentLocation}
                />

                <DetailItem
                  label={lang === "ja" ? "国籍" : "Nationality"}
                  value={application.candidate.nationality}
                />

                <DetailItem
                  label={lang === "ja" ? "在留資格" : "Visa Type"}
                  value={application.candidate.visaType}
                />

                <DetailItem
                  label={lang === "ja" ? "在留期限" : "Visa Expiry"}
                  value={formatApplicationDate(
                    application.candidate.visaExpiryDate,
                    lang,
                  )}
                />

                <DetailItem
                  label={lang === "ja" ? "日本語レベル" : "Japanese Level"}
                  value={application.candidate.japaneseLevel}
                />

                <DetailItem
                  label={lang === "ja" ? "希望勤務地" : "Desired Location"}
                  value={application.candidate.desiredLocation}
                />
              </div>
            </section>

            {/* ================================================= */}
            {/* SKILLS */}
            {/* ================================================= */}

            <section>
              <h3 className="mb-3 text-lg font-bold text-slate-950">
                {lang === "ja" ? "スキル" : "Skills"}
              </h3>

              <div className="flex flex-wrap gap-2">
                {application.candidate.skills?.length ? (
                  application.candidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">-</span>
                )}
              </div>
            </section>

            {/* ================================================= */}
            {/* EDUCATION */}
            {/* ================================================= */}

            <section>
              <h3 className="mb-3 text-lg font-bold text-slate-950">
                {lang === "ja" ? "学歴" : "Education"}
              </h3>

              <div className="space-y-3">
                {application.candidate.education?.length ? (
                  application.candidate.education.map((education, index) => (
                    <div
                      key={`${education.school}-${index}`}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <p className="font-semibold text-slate-900">
                        {education.school || "-"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {education.major || "-"}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {formatApplicationDate(education.enrollment_date, lang)}
                        {" - "}
                        {formatApplicationDate(education.graduation_date, lang)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">-</p>
                )}
              </div>
            </section>

            {/* ================================================= */}
            {/* EMPLOYMENT */}
            {/* ================================================= */}

            <section>
              <h3 className="mb-3 text-lg font-bold text-slate-950">
                {lang === "ja" ? "職歴" : "Employment History"}
              </h3>

              <div className="space-y-3">
                {application.candidate.employmentHistory?.length ? (
                  application.candidate.employmentHistory.map(
                    (employment, index) => (
                      <div
                        key={`${employment.company_name}-${index}`}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <p className="font-semibold text-slate-900">
                          {employment.company_name || "-"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {employment.employment_type || "-"}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {formatApplicationDate(employment.start_date, lang)}
                          {" - "}
                          {formatApplicationDate(employment.end_date, lang)}
                        </p>
                      </div>
                    ),
                  )
                ) : (
                  <p className="text-sm text-slate-500">-</p>
                )}
              </div>
            </section>

            {/* ================================================= */}
            {/* VACANCY */}
            {/* ================================================= */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {lang === "ja" ? "求人情報" : "Vacancy Information"}
              </h3>

              <div className="grid gap-3 md:grid-cols-3">
                <DetailItem
                  label={lang === "ja" ? "求人ID" : "Vacancy ID"}
                  value={application.vacancyId}
                />

                <DetailItem
                  label={lang === "ja" ? "職種" : "Title"}
                  value={application.vacancy.title}
                />

                <DetailItem
                  label={lang === "ja" ? "企業" : "Company"}
                  value={application.vacancy.companyName}
                />

                <DetailItem
                  label={lang === "ja" ? "雇用形態" : "Employment"}
                  value={application.vacancy.employmentType}
                />

                <DetailItem
                  label={lang === "ja" ? "勤務地" : "Location"}
                  value={application.vacancy.workLocation}
                />

                <DetailItem
                  label={lang === "ja" ? "給与" : "Salary"}
                  value={formatSalary(
                    application.vacancy.salaryMin,

                    application.vacancy.salaryMax,
                  )}
                />
              </div>
            </section>

            {/* ================================================= */}
            {/* APPLICATION */}
            {/* ================================================= */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {lang === "ja" ? "応募情報" : "Application Information"}
              </h3>

              <div className="grid gap-3 md:grid-cols-2">
                <DetailItem
                  label={lang === "ja" ? "応募日" : "Applied"}
                  value={formatApplicationDate(application.appliedAt, lang)}
                />

                <DetailItem
                  label={lang === "ja" ? "企業" : "Provider"}
                  value={
                    application.provider.companyName ||
                    application.provider.name
                  }
                />
              </div>

              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {lang === "ja" ? "カバーレター" : "Cover Letter"}
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {application.coverLetter ||
                    (lang === "ja"
                      ? "提出されていません。"
                      : "No cover letter submitted.")}
                </p>
              </div>
            </section>

            {/* ================================================= */}
            {/* STAFF SCREENING */}
            {/* ================================================= */}

            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-950">
                  {lang === "ja" ? "スタッフ確認" : "Staff Screening"}
                </h3>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStaffScreeningClass(
                    staffScreening.status,
                  )}`}
                >
                  {getStaffScreeningLabel(staffScreening.status, lang)}
                </span>
              </div>

              {/* NOT SCREENED */}

              {staffScreening.status === "NOT_SCREENED" && (
                <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                  <div>
                    <p className="font-semibold text-amber-800">
                      {lang === "ja"
                        ? "この応募はまだスタッフによる確認が完了していません。"
                        : "This application has not been screened by Staff yet."}
                    </p>

                    <p className="mt-1 text-sm text-amber-700">
                      {lang === "ja"
                        ? "管理者は最終判断を行うことができますが、必要に応じてスタッフ確認を待つことができます。"
                        : "Admin can still make the final decision, but may wait for Staff screening if required."}
                    </p>
                  </div>
                </div>
              )}

              {/* SCREENED */}

              {staffScreening.status === "SCREENED" && (
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
                        ? "この応募は管理者の最終判断の準備ができています。"
                        : "This application is ready for the Admin's final decision."}
                    </p>
                  </div>
                </div>
              )}

              {/* NEEDS ATTENTION */}

              {staffScreening.status === "NEEDS_ATTENTION" && (
                <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                  <div>
                    <p className="font-semibold text-red-800">
                      {lang === "ja"
                        ? "管理者による追加確認が必要です。"
                        : "Staff marked this application as needing attention."}
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      {lang === "ja"
                        ? "以下のスタッフメモを確認してから最終判断を行ってください。"
                        : "Review the Staff note below before making the final decision."}
                    </p>
                  </div>
                </div>
              )}

              {/* SCREENING DETAILS */}

              {staffScreening.status !== "NOT_SCREENED" && (
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <DetailItem
                    label={lang === "ja" ? "確認担当スタッフ" : "Screened By"}
                    value={staffScreening.screenedByStaffId}
                  />

                  <DetailItem
                    label={lang === "ja" ? "確認日時" : "Screened At"}
                    value={formatApplicationDate(
                      staffScreening.screenedAt,
                      lang,
                    )}
                  />
                </div>
              )}

              {/* STAFF NOTE */}

              {staffScreening.note && (
                <div
                  className={`mt-3 rounded-2xl border p-4 ${
                    staffScreening.status === "NEEDS_ATTENTION"
                      ? "border-red-200 bg-red-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {lang === "ja" ? "スタッフメモ" : "Staff Screening Note"}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                    {staffScreening.note}
                  </p>
                </div>
              )}

              <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                {lang === "ja"
                  ? "スタッフ確認は参考情報です。最終的な承認・却下は管理者が行います。"
                  : "Staff screening is advisory. Final approval or rejection remains with Admin."}
              </div>
            </section>

            {/* ================================================= */}
            {/* RESUME */}
            {/* ================================================= */}

            <section>
              <button
                type="button"
                disabled={!application.resumeAvailable}
                onClick={() => onResume(application.applicationId)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download className="h-4 w-4" />

                {lang === "ja"
                  ? "応募時履歴書を表示"
                  : "View Application Resume"}
              </button>
            </section>

            {/* ================================================= */}
            {/* ADMIN REVIEW */}
            {/* ================================================= */}

            {application.adminReview.reviewedAt && (
              <section>
                <h3 className="mb-4 text-lg font-bold text-slate-950">
                  {lang === "ja" ? "管理者審査" : "Admin Review"}
                </h3>

                <div className="grid gap-3 md:grid-cols-3">
                  <DetailItem
                    label={lang === "ja" ? "審査日" : "Reviewed At"}
                    value={formatApplicationDate(
                      application.adminReview.reviewedAt,
                      lang,
                    )}
                  />

                  <DetailItem
                    label={lang === "ja" ? "審査担当" : "Reviewed By"}
                    value={application.adminReview.reviewedBy}
                  />

                  <DetailItem
                    label={lang === "ja" ? "却下理由" : "Rejection Reason"}
                    value={application.adminReview.rejectionReason}
                  />
                </div>
              </section>
            )}
          </div>
        </div>

        {/* ================================================= */}
        {/* ADMIN DECISION */}
        {/* ================================================= */}

        {pending && (
          <div className="border-t border-slate-200 bg-white">
            {staffScreening.status === "NEEDS_ATTENTION" && (
              <div className="border-b border-red-100 bg-red-50 px-6 py-3 text-sm text-red-700">
                {lang === "ja"
                  ? "スタッフがこの応募を「要確認」としています。最終判断前にスタッフメモを確認してください。"
                  : "Staff marked this application as Needs Attention. Review the screening note before making the final decision."}
              </div>
            )}

            <div className="flex justify-end gap-3 px-6 py-4">
              <button
                type="button"
                disabled={isApproving}
                onClick={onReject}
                className="cursor-pointer rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {lang === "ja" ? "却下" : "Reject"}
              </button>

              <button
                type="button"
                disabled={isApproving}
                onClick={() => onApprove(application.applicationId)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isApproving && <Loader2 className="h-4 w-4 animate-spin" />}

                {lang === "ja"
                  ? "承認して企業へ送る"
                  : "Approve & Send to Provider"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
