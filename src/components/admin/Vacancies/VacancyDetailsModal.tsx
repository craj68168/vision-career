"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Send,
  X,
  XCircle,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import {
  formatVacancyDate,
  formatVacancySalary,
  getVacancyStatusClass,
  getVacancyStatusLabel,
} from "./helper";

import type { AdminVacancyDetails, VacancyStaffScreeningStatus } from "./types";

type Props = {
  vacancy: AdminVacancyDetails;

  isApproving: boolean;

  isPublishing: boolean;

  isClosing: boolean;

  onClose: () => void;

  onApprove: (vacancyId: string) => void;

  onReject: () => void;

  onPublish: (vacancyId: string) => void;

  onCloseVacancy: (vacancyId: string) => void;
};

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

      <p className="mt-1 whitespace-pre-wrap break-words text-sm font-medium text-slate-900">
        {value ?? "-"}
      </p>
    </div>
  );
}

// ======================================================
// STAFF SCREENING LABEL
// ======================================================

function getStaffScreeningLabel(
  status: VacancyStaffScreeningStatus,
  lang: string,
) {
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

function getStaffScreeningClass(status: VacancyStaffScreeningStatus) {
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
// VACANCY DETAILS
// ======================================================

export default function VacancyDetailsModal({
  vacancy,
  isApproving,
  isPublishing,
  isClosing,
  onClose,
  onApprove,
  onReject,
  onPublish,
  onCloseVacancy,
}: Props) {
  const { lang } = useLanguage();

  const isBusy = isApproving || isPublishing || isClosing;

  const staffScreening = vacancy.staffScreening;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={() => {
          if (!isBusy) {
            onClose();
          }
        }}
      />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              {vacancy.vacancyId}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {vacancy.title}
            </h2>

            {vacancy.titleKana && (
              <p className="mt-1 text-sm text-slate-400">{vacancy.titleKana}</p>
            )}

            <p className="mt-2 text-sm font-medium text-slate-600">
              {vacancy.companyName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getVacancyStatusClass(
                vacancy.status,
              )}`}
            >
              {getVacancyStatusLabel(vacancy.status, lang)}
            </span>

            <button
              type="button"
              disabled={isBusy}
              onClick={onClose}
              className="cursor-pointer rounded-full p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* CONTENT */}

        <div className="overflow-y-auto p-6">
          <div className="space-y-8">
            {/* BASIC */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {lang === "ja" ? "基本情報" : "Basic Information"}
              </h3>

              <div className="grid gap-3 md:grid-cols-3">
                <DetailItem label="Vacancy ID" value={vacancy.vacancyId} />

                <DetailItem
                  label={lang === "ja" ? "企業名" : "Company"}
                  value={vacancy.companyName}
                />

                <DetailItem
                  label={lang === "ja" ? "雇用形態" : "Employment Type"}
                  value={vacancy.employmentType}
                />

                <DetailItem
                  label={lang === "ja" ? "募集人数" : "Openings"}
                  value={vacancy.numberOfPeople}
                />

                <DetailItem
                  label={lang === "ja" ? "日本語レベル" : "Japanese Level"}
                  value={vacancy.japaneseLevel}
                />

                <DetailItem
                  label={lang === "ja" ? "リモート" : "Remote Work"}
                  value={vacancy.remoteWork}
                />
              </div>
            </section>

            {/* DESCRIPTION */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {lang === "ja" ? "仕事内容" : "Job Description"}
              </h3>

              <div className="space-y-3">
                <DetailItem
                  label={lang === "ja" ? "仕事内容" : "Description"}
                  value={vacancy.jobDescription}
                />

                <DetailItem
                  label={lang === "ja" ? "業務内容" : "Responsibilities"}
                  value={vacancy.responsibilities}
                />
              </div>
            </section>

            {/* REQUIREMENTS */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {lang === "ja" ? "応募条件" : "Requirements"}
              </h3>

              <div className="grid gap-3 md:grid-cols-2">
                <DetailItem
                  label={lang === "ja" ? "必須スキル" : "Required Skills"}
                  value={vacancy.requiredSkills}
                />

                <DetailItem
                  label={lang === "ja" ? "歓迎スキル" : "Preferred Skills"}
                  value={vacancy.preferredSkills}
                />

                <DetailItem
                  label={lang === "ja" ? "学歴" : "Required Education"}
                  value={vacancy.requiredEducation}
                />

                <DetailItem
                  label={lang === "ja" ? "経験" : "Required Experience"}
                  value={vacancy.requiredExperience}
                />
              </div>
            </section>

            {/* LOCATION / SALARY */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {lang === "ja" ? "勤務地・給与" : "Location & Salary"}
              </h3>

              <div className="grid gap-3 md:grid-cols-2">
                <DetailItem
                  label={lang === "ja" ? "勤務地" : "Work Location"}
                  value={vacancy.workLocation}
                />

                <DetailItem
                  label={lang === "ja" ? "詳細勤務地" : "Detailed Location"}
                  value={vacancy.workLocationDetail}
                />

                <DetailItem
                  label={lang === "ja" ? "給与" : "Salary"}
                  value={formatVacancySalary(
                    vacancy.salaryMin,
                    vacancy.salaryMax,
                  )}
                />

                <DetailItem
                  label={lang === "ja" ? "給与備考" : "Salary Note"}
                  value={vacancy.salaryNote}
                />
              </div>
            </section>

            {/* SCHEDULE */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {lang === "ja" ? "勤務条件" : "Work Conditions"}
              </h3>

              <div className="grid gap-3 md:grid-cols-2">
                <DetailItem
                  label={lang === "ja" ? "勤務時間" : "Work Hours"}
                  value={vacancy.workHours}
                />

                <DetailItem
                  label={lang === "ja" ? "休憩" : "Break Time"}
                  value={vacancy.breakTime}
                />

                <DetailItem
                  label={lang === "ja" ? "残業" : "Overtime"}
                  value={vacancy.overtime}
                />

                <DetailItem
                  label={lang === "ja" ? "休日" : "Holidays"}
                  value={vacancy.holidays}
                />

                <DetailItem
                  label={lang === "ja" ? "試用期間" : "Trial Period"}
                  value={vacancy.trialPeriod}
                />
              </div>
            </section>

            {/* BENEFITS */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {lang === "ja" ? "福利厚生" : "Benefits & Insurance"}
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Benefits
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {vacancy.benefits.length ? (
                      vacancy.benefits.map((benefit) => (
                        <span
                          key={benefit}
                          className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                        >
                          {benefit}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">-</span>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Insurance
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {vacancy.insurance.length ? (
                      vacancy.insurance.map((insurance) => (
                        <span
                          key={insurance}
                          className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                        >
                          {insurance}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">-</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* APPLICATION */}

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-950">
                {lang === "ja" ? "応募情報" : "Application Information"}
              </h3>

              <div className="grid gap-3 md:grid-cols-3">
                <DetailItem
                  label={lang === "ja" ? "応募期限" : "Deadline"}
                  value={formatVacancyDate(vacancy.applicationDeadline, lang)}
                />

                <DetailItem
                  label={lang === "ja" ? "開始日" : "Start Date"}
                  value={vacancy.startDate}
                />

                <DetailItem
                  label={lang === "ja" ? "選考プロセス" : "Selection Process"}
                  value={vacancy.selectionProcess}
                />
              </div>
            </section>

            {/* PRIVATE CONTACT */}

            <section>
              <h3 className="mb-1 text-lg font-bold text-slate-950">
                {lang === "ja" ? "企業担当者" : "Provider Contact"}
              </h3>

              <p className="mb-4 text-xs text-amber-600">
                {lang === "ja"
                  ? "管理者専用情報です。求職者には表示されません。"
                  : "Admin-only information. This is not exposed to Job Seekers."}
              </p>

              <div className="grid gap-3 md:grid-cols-3">
                <DetailItem
                  label={lang === "ja" ? "担当者" : "Contact Person"}
                  value={vacancy.contactPerson}
                />

                <DetailItem
                  label={lang === "ja" ? "担当者カナ" : "Contact Person Kana"}
                  value={vacancy.contactPersonKana}
                />

                <DetailItem label="Email" value={vacancy.contactEmail} />
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
                        ? "この求人はまだスタッフによる確認が完了していません。"
                        : "This vacancy has not been screened by Staff yet."}
                    </p>

                    <p className="mt-1 text-sm text-amber-700">
                      {lang === "ja"
                        ? "管理者は最終判断を行うことができます。"
                        : "Admin still controls the final vacancy decision."}
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
                        ? "この求人は管理者の最終審査の準備ができています。"
                        : "This vacancy is ready for the Admin's final review."}
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
                        ? "スタッフがこの求人を要確認としています。"
                        : "Staff marked this vacancy as needing attention."}
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      {lang === "ja"
                        ? "スタッフメモを確認してから最終判断を行ってください。"
                        : "Review the Staff note before making the final decision."}
                    </p>
                  </div>
                </div>
              )}

              {/* DETAILS */}

              {staffScreening.status !== "NOT_SCREENED" && (
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <DetailItem
                    label={lang === "ja" ? "確認担当スタッフ" : "Screened By"}
                    value={staffScreening.screenedByStaffId}
                  />

                  <DetailItem
                    label={lang === "ja" ? "確認日時" : "Screened At"}
                    value={formatVacancyDate(staffScreening.screenedAt, lang)}
                  />
                </div>
              )}

              {/* NOTE */}

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
                  ? "スタッフ確認は参考情報です。求人の承認・却下・公開の最終判断は管理者が行います。"
                  : "Staff screening is advisory. Final approval, rejection and publishing authority remains with Admin."}
              </div>
            </section>

            {/* ================================================= */}
            {/* ADMIN REVIEW */}
            {/* ================================================= */}

            {(vacancy.reviewedAt || vacancy.rejectionReason) && (
              <section>
                <h3 className="mb-4 text-lg font-bold text-slate-950">
                  {lang === "ja" ? "審査情報" : "Admin Review Information"}
                </h3>

                <div className="grid gap-3 md:grid-cols-2">
                  <DetailItem
                    label={lang === "ja" ? "審査日" : "Reviewed At"}
                    value={formatVacancyDate(vacancy.reviewedAt, lang)}
                  />

                  <DetailItem
                    label={lang === "ja" ? "却下理由" : "Rejection Reason"}
                    value={vacancy.rejectionReason}
                  />
                </div>
              </section>
            )}
          </div>
        </div>

        {/* ACTIONS */}

        <div className="border-t border-slate-200 bg-white">
          {/* ATTENTION WARNING */}

          {vacancy.status === "pending_review" &&
            staffScreening.status === "NEEDS_ATTENTION" && (
              <div className="border-b border-red-100 bg-red-50 px-6 py-3 text-sm text-red-700">
                {lang === "ja"
                  ? "スタッフがこの求人を「要確認」としています。最終判断前にスタッフメモを確認してください。"
                  : "Staff marked this vacancy as Needs Attention. Review the screening note before making the final decision."}
              </div>
            )}

          <div className="flex flex-wrap justify-end gap-3 px-6 py-4">
            {vacancy.status === "pending_review" && (
              <>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={onReject}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />

                  {lang === "ja" ? "却下" : "Reject"}
                </button>

                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => onApprove(vacancy.vacancyId)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isApproving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}

                  {lang === "ja" ? "承認" : "Approve"}
                </button>
              </>
            )}

            {vacancy.status === "approved" && (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => onPublish(vacancy.vacancyId)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {isPublishing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}

                {lang === "ja" ? "公開" : "Publish"}
              </button>
            )}

            {vacancy.status === "published" && (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => onCloseVacancy(vacancy.vacancyId)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {isClosing && <Loader2 className="h-4 w-4 animate-spin" />}

                {lang === "ja" ? "求人を終了" : "Close Vacancy"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
