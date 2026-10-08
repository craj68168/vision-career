"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Download,
  History,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import {
  formatApplicationDate,
  formatSalary,
  getApplicationStatusClass,
  getApplicationStatusLabel,
} from "./helper";

import type {
  AdminApplicationDetails,
  ApplicationReviewActorType,
  StaffScreeningStatus,
} from "./types";

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
  const empty = value === null || value === undefined || value === "";

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-900">
        {empty ? "-" : value}
      </p>
    </div>
  );
}

// ======================================================
// DATE TIME
// ======================================================

function formatDateTime(value?: string | null, lang = "en") {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: lang === "ja" ? "numeric" : "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// ======================================================
// SCREENING
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
// REVIEW ACTOR
// ======================================================

function inferActorType(
  explicitType?: ApplicationReviewActorType | null,
  actorId?: string | null,
): ApplicationReviewActorType | null {
  if (explicitType) {
    return explicitType;
  }

  if (!actorId) {
    return null;
  }

  const normalized = actorId.toUpperCase();

  if (normalized.startsWith("STF-")) {
    return "staff";
  }

  if (normalized.startsWith("ADM-")) {
    return "admin";
  }

  return null;
}

function getActorTypeLabel(
  type: ApplicationReviewActorType | null,
  lang: string,
) {
  if (type === "staff") {
    return lang === "ja" ? "スタッフ" : "Staff";
  }

  if (type === "admin") {
    return lang === "ja" ? "管理者" : "Admin";
  }

  return "-";
}

// ======================================================
// REVIEW DECISION
// ======================================================

function getReviewDecision(application: AdminApplicationDetails) {
  if (
    application.status === "ADMIN_REJECTED" ||
    application.adminReview.rejectionReason
  ) {
    return "rejected" as const;
  }

  if (
    application.adminReview.reviewedAt ||
    application.adminReview.reviewedBy ||
    application.adminReview.reviewedById
  ) {
    return "approved" as const;
  }

  return "pending" as const;
}

function getDecisionLabel(
  decision: "approved" | "rejected" | "pending",
  lang: string,
) {
  if (decision === "approved") {
    return lang === "ja" ? "承認済み" : "Approved";
  }

  if (decision === "rejected") {
    return lang === "ja" ? "却下" : "Rejected";
  }

  return lang === "ja" ? "審査待ち" : "Pending Review";
}

function getDecisionClass(decision: "approved" | "rejected" | "pending") {
  if (decision === "approved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (decision === "rejected") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

// ======================================================
// COMPONENT
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

  const ja = lang === "ja";

  const pending = application.status === "PENDING_ADMIN_APPROVAL";

  const staffScreening = application.staffScreening;

  const review = application.adminReview;

  const reviewerId = review.reviewedById || review.reviewedBy || null;

  const reviewerType = inferActorType(review.reviewedByType, reviewerId);

  const reviewerName = review.reviewedByName || reviewerId || null;

  const reviewDecision = getReviewDecision(application);

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

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}

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
              aria-label={ja ? "閉じる" : "Close"}
              className="cursor-pointer rounded-full p-2 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* BODY */}

        <div className="overflow-y-auto p-6">
          <div className="space-y-8">
            {/* APPLICANT */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {ja ? "応募者情報" : "Applicant Information"}
              </h3>

              <div className="grid gap-3 md:grid-cols-3">
                <DetailItem
                  label={ja ? "氏名" : "Name"}
                  value={application.candidate.name}
                />

                <DetailItem label="Email" value={application.candidate.email} />

                <DetailItem
                  label={ja ? "電話番号" : "Phone"}
                  value={application.candidate.phone}
                />

                <DetailItem
                  label={ja ? "住所" : "Address"}
                  value={application.candidate.address}
                />

                <DetailItem
                  label={ja ? "現在地" : "Current Location"}
                  value={application.candidate.currentLocation}
                />

                <DetailItem
                  label={ja ? "生年月日" : "Date of Birth"}
                  value={formatApplicationDate(
                    application.candidate.dateOfBirth,
                    lang,
                  )}
                />

                <DetailItem
                  label={ja ? "性別" : "Gender"}
                  value={application.candidate.gender}
                />

                <DetailItem
                  label={ja ? "国籍" : "Nationality"}
                  value={application.candidate.nationality}
                />

                <DetailItem
                  label={ja ? "在留資格" : "Visa Type"}
                  value={application.candidate.visaType}
                />

                <DetailItem
                  label={ja ? "在留期限" : "Visa Expiry"}
                  value={formatApplicationDate(
                    application.candidate.visaExpiryDate,
                    lang,
                  )}
                />

                <DetailItem
                  label={ja ? "日本語レベル" : "Japanese Level"}
                  value={application.candidate.japaneseLevel}
                />

                <DetailItem
                  label={ja ? "希望職種" : "Desired Job"}
                  value={application.candidate.desiredJob}
                />

                <DetailItem
                  label={ja ? "希望勤務地" : "Desired Location"}
                  value={application.candidate.desiredLocation}
                />
              </div>
            </section>

            {/* SKILLS */}

            <section>
              <h3 className="mb-3 text-lg font-bold text-slate-950">
                {ja ? "スキル" : "Skills"}
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

            {/* EDUCATION */}

            <section>
              <h3 className="mb-3 text-lg font-bold text-slate-950">
                {ja ? "学歴" : "Education"}
              </h3>

              <div className="space-y-3">
                {application.candidate.education?.length ? (
                  application.candidate.education.map((education, index) => (
                    <div
                      key={`${education.school}-${index}`}
                      className="rounded-xl border border-slate-200 p-4"
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

            {/* EMPLOYMENT */}

            <section>
              <h3 className="mb-3 text-lg font-bold text-slate-950">
                {ja ? "職歴" : "Employment History"}
              </h3>

              <div className="space-y-3">
                {application.candidate.employmentHistory?.length ? (
                  application.candidate.employmentHistory.map(
                    (employment, index) => (
                      <div
                        key={`${employment.company_name}-${index}`}
                        className="rounded-xl border border-slate-200 p-4"
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

            {/* VACANCY */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {ja ? "求人情報" : "Vacancy Information"}
              </h3>

              <div className="grid gap-3 md:grid-cols-3">
                <DetailItem
                  label={ja ? "求人ID" : "Vacancy ID"}
                  value={application.vacancyId}
                />

                <DetailItem
                  label={ja ? "職種" : "Title"}
                  value={application.vacancy.title}
                />

                <DetailItem
                  label={ja ? "企業" : "Company"}
                  value={application.vacancy.companyName}
                />

                <DetailItem
                  label={ja ? "雇用形態" : "Employment"}
                  value={application.vacancy.employmentType}
                />

                <DetailItem
                  label={ja ? "募集人数" : "Openings"}
                  value={application.vacancy.numberOfPeople}
                />

                <DetailItem
                  label={ja ? "勤務地" : "Location"}
                  value={application.vacancy.workLocation}
                />

                <DetailItem
                  label={ja ? "リモート" : "Remote Work"}
                  value={application.vacancy.remoteWork}
                />

                <DetailItem
                  label={ja ? "必要日本語レベル" : "Required Japanese"}
                  value={application.vacancy.japaneseLevel}
                />

                <DetailItem
                  label={ja ? "給与" : "Salary"}
                  value={formatSalary(
                    application.vacancy.salaryMin,
                    application.vacancy.salaryMax,
                  )}
                />
              </div>
            </section>

            {/* APPLICATION */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {ja ? "応募情報" : "Application Information"}
              </h3>

              <div className="grid gap-3 md:grid-cols-2">
                <DetailItem
                  label={ja ? "応募日" : "Applied"}
                  value={formatApplicationDate(application.appliedAt, lang)}
                />

                <DetailItem
                  label={ja ? "企業" : "Provider"}
                  value={
                    application.provider.companyName ||
                    application.provider.name
                  }
                />
              </div>

              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {ja ? "カバーレター" : "Cover Letter"}
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {application.coverLetter ||
                    (ja
                      ? "提出されていません。"
                      : "No cover letter submitted.")}
                </p>
              </div>
            </section>

            {/* STAFF SCREENING */}

            <section className="rounded-xl border border-slate-200 p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-indigo-500" />

                  <h3 className="text-lg font-bold text-slate-950">
                    {ja ? "スタッフ確認" : "Staff Screening"}
                  </h3>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStaffScreeningClass(
                    staffScreening.status,
                  )}`}
                >
                  {getStaffScreeningLabel(staffScreening.status, lang)}
                </span>
              </div>

              {staffScreening.status === "NOT_SCREENED" && (
                <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                  <div>
                    <p className="font-semibold text-amber-800">
                      {ja
                        ? "この応募はまだスタッフによる確認が完了していません。"
                        : "This application has not been screened by Staff yet."}
                    </p>

                    <p className="mt-1 text-sm text-amber-700">
                      {ja
                        ? "スタッフ確認と応募承認は別の操作です。"
                        : "Staff screening and application approval are separate actions."}
                    </p>
                  </div>
                </div>
              )}

              {staffScreening.status === "SCREENED" && (
                <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                  <div>
                    <p className="font-semibold text-emerald-800">
                      {ja ? "スタッフ確認済み" : "Staff screening completed."}
                    </p>
                  </div>
                </div>
              )}

              {staffScreening.status === "NEEDS_ATTENTION" && (
                <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                  <div>
                    <p className="font-semibold text-red-800">
                      {ja
                        ? "追加確認が必要です。"
                        : "Staff marked this application as needing attention."}
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      {ja
                        ? "承認・却下の判断前にスタッフメモを確認してください。"
                        : "Review the Staff note before making the decision."}
                    </p>
                  </div>
                </div>
              )}

              {staffScreening.status !== "NOT_SCREENED" && (
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <DetailItem
                    label={ja ? "確認担当" : "Screened By"}
                    value={
                      staffScreening.screenedByStaffName ||
                      staffScreening.screenedByStaffId
                    }
                  />

                  <DetailItem
                    label={ja ? "スタッフID" : "Staff ID"}
                    value={staffScreening.screenedByStaffId}
                  />

                  <DetailItem
                    label={ja ? "確認日時" : "Screened At"}
                    value={formatDateTime(staffScreening.screenedAt, lang)}
                  />
                </div>
              )}

              {staffScreening.note && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {ja ? "スタッフメモ" : "Staff Screening Note"}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                    {staffScreening.note}
                  </p>
                </div>
              )}
            </section>

            {/* APPLICATION REVIEW & AUDIT */}

            <section className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-indigo-600" />

                  <h3 className="text-lg font-bold text-slate-950">
                    {ja ? "応募審査・監査" : "Application Review & Audit"}
                  </h3>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDecisionClass(
                    reviewDecision,
                  )}`}
                >
                  {getDecisionLabel(reviewDecision, lang)}
                </span>
              </div>

              {reviewDecision !== "pending" ? (
                <>
                  <div className="grid gap-3 md:grid-cols-4">
                    <DetailItem
                      label={ja ? "審査担当" : "Reviewed By"}
                      value={reviewerName}
                    />

                    <DetailItem
                      label={ja ? "権限" : "Role"}
                      value={getActorTypeLabel(reviewerType, lang)}
                    />

                    <DetailItem
                      label={ja ? "担当者ID" : "Actor ID"}
                      value={reviewerId}
                    />

                    <DetailItem
                      label={ja ? "審査日時" : "Reviewed At"}
                      value={formatDateTime(review.reviewedAt, lang)}
                    />
                  </div>

                  {review.rejectionReason && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                        {ja ? "却下理由" : "Rejection Reason"}
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">
                        {review.rejectionReason}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-500">
                  {ja
                    ? "この応募はまだ承認・却下されていません。"
                    : "No approval or rejection decision has been recorded yet."}
                </p>
              )}

              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
                {ja
                  ? "スタッフ確認と応募承認は別の操作です。管理者または応募承認権限を持つスタッフが承認・却下できます。"
                  : "Staff screening and application approval are separate actions. Admin or Staff with the Application approval permission may approve or reject the application."}
              </div>
            </section>

            {/* RESUME */}

            <section>
              <button
                type="button"
                disabled={!application.resumeAvailable}
                onClick={() => onResume(application.applicationId)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download className="h-4 w-4" />

                {ja ? "応募時履歴書を表示" : "View Application Resume"}
              </button>
            </section>
          </div>
        </div>

        {/* DECISION FOOTER */}

        {pending && (
          <div className="border-t border-slate-200 bg-white">
            {staffScreening.status === "NEEDS_ATTENTION" && (
              <div className="border-b border-red-100 bg-red-50 px-6 py-3 text-sm text-red-700">
                {ja
                  ? "スタッフがこの応募を「要確認」としています。判断前にスタッフメモを確認してください。"
                  : "Staff marked this application as Needs Attention. Review the screening note before making the decision."}
              </div>
            )}

            <div className="flex justify-end gap-3 px-6 py-4">
              <button
                type="button"
                disabled={isApproving}
                onClick={onReject}
                className="cursor-pointer rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {ja ? "却下" : "Reject"}
              </button>

              <button
                type="button"
                disabled={isApproving}
                onClick={() => onApprove(application.applicationId)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isApproving && <Loader2 className="h-4 w-4 animate-spin" />}

                {ja ? "承認して企業へ送る" : "Approve & Send to Provider"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
