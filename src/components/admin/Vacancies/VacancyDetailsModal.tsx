"use client";

import { useEffect, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
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

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// ======================================================
// LAYOUT HELPERS
// ======================================================

function Section({
  title,
  hint,
  aside,
  children,
}: {
  title: string;
  hint?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 px-4 py-3 dark:border-white/10">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
            {title}
          </h3>

          {hint && (
            <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
              {hint}
            </p>
          )}
        </div>

        {aside}
      </div>

      <div className="p-4">{children}</div>
    </section>
  );
}

function FieldGrid({
  cols = 3,
  children,
}: {
  cols?: 2 | 3;
  children: ReactNode;
}) {
  return (
    <dl
      className={`grid gap-x-6 gap-y-4 sm:grid-cols-2 ${
        cols === 3 ? "lg:grid-cols-3" : ""
      }`}
    >
      {children}
    </dl>
  );
}

function Field({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string | number | null | undefined;
  wide?: boolean;
}) {
  const isEmpty = value === null || value === undefined || value === "";

  return (
    <div className={`min-w-0 ${wide ? "sm:col-span-full" : ""}`}>
      <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>

      <dd
        className={`mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed ${
          isEmpty
            ? "text-zinc-400 dark:text-zinc-500"
            : "font-medium text-zinc-900 dark:text-zinc-100"
        }`}
      >
        {isEmpty ? "-" : value}
      </dd>
    </div>
  );
}

function ChipGroup({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "emerald" | "zinc";
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
      : "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-300";

  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </p>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.length ? (
          items.map((item) => (
            <span
              key={item}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClass}`}
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-sm text-zinc-400 dark:text-zinc-500">-</span>
        )}
      </div>
    </div>
  );
}

// ======================================================
// STAFF SCREENING
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

function getStaffScreeningClass(status: VacancyStaffScreeningStatus) {
  switch (status) {
    case "SCREENED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";

    case "NEEDS_ATTENTION":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300";
  }
}

function getScreeningNotice(status: VacancyStaffScreeningStatus, lang: string) {
  const ja = lang === "ja";

  switch (status) {
    case "SCREENED":
      return {
        icon: CheckCircle2,
        title: ja ? "スタッフ確認済み" : "Staff screening completed",
        body: ja
          ? "この求人は管理者の最終審査の準備ができています。"
          : "This vacancy is ready for the Admin's final review.",
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
      };

    case "NEEDS_ATTENTION":
      return {
        icon: AlertTriangle,
        title: ja
          ? "スタッフがこの求人を要確認としています"
          : "Staff marked this vacancy as needing attention",
        body: ja
          ? "スタッフメモを確認してから最終判断を行ってください。"
          : "Review the Staff note before making the final decision.",
        className:
          "border-red-200 bg-red-50 text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200",
      };

    default:
      return {
        icon: CircleDashed,
        title: ja
          ? "この求人はまだスタッフによる確認が完了していません"
          : "This vacancy has not been screened by Staff yet",
        body: ja
          ? "管理者は最終判断を行うことができます。"
          : "Admin still controls the final vacancy decision.",
        className:
          "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200",
      };
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
  const ja = lang === "ja";

  const dialogRef = useRef<HTMLDivElement>(null);

  const isBusy = isApproving || isPublishing || isClosing;

  const staffScreening = vacancy.staffScreening;
  const notice = getScreeningNotice(staffScreening.status, lang);
  const NoticeIcon = notice.icon;

  // Lock background scroll, move focus into the dialog, restore it on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  // Escape closes (unless busy); Tab stays inside the dialog.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();

      if (!isBusy) {
        onClose();
      }

      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) {
      return;
    }

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    );

    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const primaryButton =
    "inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-zinc-950/50 backdrop-blur-sm sm:items-center sm:p-4">
      {/* Backdrop click closes the modal. Escape and the X button are the keyboard routes. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        onClick={() => {
          if (!isBusy) {
            onClose();
          }
        }}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vacancy-details-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="relative z-10 flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-xl border border-zinc-200 bg-white shadow-2xl outline-none dark:border-white/10 dark:bg-zinc-900 sm:rounded-xl"
      >
        {/* HEADER */}

        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-6">
          <div className="min-w-0">
            <h2
              id="vacancy-details-title"
              className="break-words text-lg font-semibold text-zinc-950 dark:text-white sm:text-xl"
            >
              {vacancy.title}
            </h2>

            {vacancy.titleKana && (
              <p className="mt-0.5 break-words text-xs text-zinc-400 dark:text-zinc-500">
                {vacancy.titleKana}
              </p>
            )}

            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              {vacancy.companyName}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${getVacancyStatusClass(
                vacancy.status,
              )}`}
            >
              {getVacancyStatusLabel(vacancy.status, lang)}
            </span>

            <button
              type="button"
              disabled={isBusy}
              onClick={onClose}
              aria-label={ja ? "閉じる" : "Close"}
              className={`grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white ${focusRing}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* CONTENT */}

        <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain bg-zinc-50 p-4 dark:bg-zinc-950 sm:p-6">
          {/* STAFF SCREENING (first: it decides how the admin reviews the rest) */}

          <Section
            title={ja ? "スタッフ確認" : "Staff Screening"}
            aside={
              <span
                className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStaffScreeningClass(
                  staffScreening.status,
                )}`}
              >
                {getStaffScreeningLabel(staffScreening.status, lang)}
              </span>
            }
          >
            <div className="space-y-3">
              <div
                className={`flex gap-3 rounded-md border px-3 py-2.5 ${notice.className}`}
              >
                <NoticeIcon className="mt-0.5 h-4 w-4 shrink-0" />

                <div className="min-w-0">
                  <p className="text-sm font-medium">{notice.title}</p>

                  <p className="mt-0.5 text-xs opacity-90">{notice.body}</p>
                </div>
              </div>

              {staffScreening.status !== "NOT_SCREENED" && (
                <FieldGrid cols={2}>
                  <Field
                    label={ja ? "確認担当スタッフ" : "Screened By"}
                    value={staffScreening.screenedByStaffId}
                  />

                  <Field
                    label={ja ? "確認日時" : "Screened At"}
                    value={formatVacancyDate(staffScreening.screenedAt, lang)}
                  />
                </FieldGrid>
              )}

              {staffScreening.note && (
                <div
                  className={`rounded-md border px-3 py-2.5 ${
                    staffScreening.status === "NEEDS_ATTENTION"
                      ? "border-red-200 bg-red-50 dark:border-red-400/20 dark:bg-red-400/10"
                      : "border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {ja ? "スタッフメモ" : "Staff Screening Note"}
                  </p>

                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-zinc-800 dark:text-zinc-200">
                    {staffScreening.note}
                  </p>
                </div>
              )}

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {ja
                  ? "スタッフ確認は参考情報です。求人の承認・却下・公開の最終判断は管理者が行います。"
                  : "Staff screening is advisory. Final approval, rejection and publishing authority remains with Admin."}
              </p>
            </div>
          </Section>

          {/* ADMIN REVIEW */}

          {(vacancy.reviewedAt || vacancy.rejectionReason) && (
            <Section title={ja ? "審査情報" : "Admin Review"}>
              <FieldGrid cols={2}>
                <Field
                  label={ja ? "審査日" : "Reviewed At"}
                  value={formatVacancyDate(vacancy.reviewedAt, lang)}
                />

                <Field
                  label={ja ? "却下理由" : "Rejection Reason"}
                  value={vacancy.rejectionReason}
                />
              </FieldGrid>
            </Section>
          )}

          {/* BASIC */}

          <Section title={ja ? "基本情報" : "Basic Information"}>
            <FieldGrid>
              <Field label={ja ? "求人ID" : "Vacancy ID"} value={vacancy.vacancyId} />

              <Field
                label={ja ? "企業名" : "Company"}
                value={vacancy.companyName}
              />

              <Field
                label={ja ? "雇用形態" : "Employment Type"}
                value={vacancy.employmentType}
              />

              <Field
                label={ja ? "募集人数" : "Openings"}
                value={vacancy.numberOfPeople}
              />

              <Field
                label={ja ? "日本語レベル" : "Japanese Level"}
                value={vacancy.japaneseLevel}
              />

              <Field
                label={ja ? "リモート" : "Remote Work"}
                value={vacancy.remoteWork}
              />
            </FieldGrid>
          </Section>

          {/* DESCRIPTION */}

          <Section title={ja ? "仕事内容" : "Job Description"}>
            <FieldGrid cols={2}>
              <Field
                wide
                label={ja ? "仕事内容" : "Description"}
                value={vacancy.jobDescription}
              />

              <Field
                wide
                label={ja ? "業務内容" : "Responsibilities"}
                value={vacancy.responsibilities}
              />
            </FieldGrid>
          </Section>

          {/* REQUIREMENTS */}

          <Section title={ja ? "応募条件" : "Requirements"}>
            <FieldGrid cols={2}>
              <Field
                label={ja ? "必須スキル" : "Required Skills"}
                value={vacancy.requiredSkills}
              />

              <Field
                label={ja ? "歓迎スキル" : "Preferred Skills"}
                value={vacancy.preferredSkills}
              />

              <Field
                label={ja ? "学歴" : "Required Education"}
                value={vacancy.requiredEducation}
              />

              <Field
                label={ja ? "経験" : "Required Experience"}
                value={vacancy.requiredExperience}
              />
            </FieldGrid>
          </Section>

          {/* LOCATION / SALARY */}

          <Section title={ja ? "勤務地・給与" : "Location & Salary"}>
            <FieldGrid cols={2}>
              <Field
                label={ja ? "勤務地" : "Work Location"}
                value={vacancy.workLocation}
              />

              <Field
                label={ja ? "詳細勤務地" : "Detailed Location"}
                value={vacancy.workLocationDetail}
              />

              <Field
                label={ja ? "給与" : "Salary"}
                value={formatVacancySalary(
                  vacancy.salaryMin,
                  vacancy.salaryMax,
                )}
              />

              <Field
                label={ja ? "給与備考" : "Salary Note"}
                value={vacancy.salaryNote}
              />
            </FieldGrid>
          </Section>

          {/* SCHEDULE */}

          <Section title={ja ? "勤務条件" : "Work Conditions"}>
            <FieldGrid cols={2}>
              <Field
                label={ja ? "勤務時間" : "Work Hours"}
                value={vacancy.workHours}
              />

              <Field
                label={ja ? "休憩" : "Break Time"}
                value={vacancy.breakTime}
              />

              <Field label={ja ? "残業" : "Overtime"} value={vacancy.overtime} />

              <Field label={ja ? "休日" : "Holidays"} value={vacancy.holidays} />

              <Field
                label={ja ? "試用期間" : "Trial Period"}
                value={vacancy.trialPeriod}
              />
            </FieldGrid>
          </Section>

          {/* BENEFITS */}

          <Section title={ja ? "福利厚生・保険" : "Benefits & Insurance"}>
            <div className="grid gap-4 sm:grid-cols-2">
              <ChipGroup
                label={ja ? "福利厚生" : "Benefits"}
                items={vacancy.benefits}
                tone="emerald"
              />

              <ChipGroup
                label={ja ? "保険" : "Insurance"}
                items={vacancy.insurance}
                tone="zinc"
              />
            </div>
          </Section>

          {/* APPLICATION */}

          <Section title={ja ? "応募情報" : "Application Information"}>
            <FieldGrid>
              <Field
                label={ja ? "応募期限" : "Deadline"}
                value={formatVacancyDate(vacancy.applicationDeadline, lang)}
              />

              <Field
                label={ja ? "開始日" : "Start Date"}
                value={vacancy.startDate}
              />

              <Field
                label={ja ? "選考プロセス" : "Selection Process"}
                value={vacancy.selectionProcess}
              />
            </FieldGrid>
          </Section>

          {/* PRIVATE CONTACT */}

          <Section
            title={ja ? "企業担当者" : "Provider Contact"}
            hint={
              ja
                ? "管理者専用情報です。求職者には表示されません。"
                : "Admin-only information. This is not exposed to Job Seekers."
            }
          >
            <FieldGrid>
              <Field
                label={ja ? "担当者" : "Contact Person"}
                value={vacancy.contactPerson}
              />

              <Field
                label={ja ? "担当者カナ" : "Contact Person Kana"}
                value={vacancy.contactPersonKana}
              />

              <Field
                label={ja ? "メール" : "Email"}
                value={vacancy.contactEmail}
              />
            </FieldGrid>
          </Section>
        </div>

        {/* ACTIONS */}

        <div className="border-t border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900">
          {vacancy.status === "pending_review" &&
            staffScreening.status === "NEEDS_ATTENTION" && (
              <div
                role="status"
                className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700 dark:border-red-400/10 dark:bg-red-400/10 dark:text-red-300 sm:px-6"
              >
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />

                {ja
                  ? "スタッフが「要確認」としています。最終判断前にスタッフメモを確認してください。"
                  : "Staff marked this as Needs Attention. Review the note before deciding."}
              </div>
            )}

          <div className="flex flex-wrap justify-end gap-2 px-4 py-3 sm:px-6">
            <button
              type="button"
              disabled={isBusy}
              onClick={onClose}
              className={`inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
            >
              {ja ? "閉じる" : "Close"}
            </button>

            {vacancy.status === "pending_review" && (
              <>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={onReject}
                  className={`inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-red-200 px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10 ${focusRing}`}
                >
                  <XCircle className="h-4 w-4" />

                  {ja ? "却下" : "Reject"}
                </button>

                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => onApprove(vacancy.vacancyId)}
                  className={`${primaryButton} bg-emerald-600 hover:bg-emerald-700 ${focusRing}`}
                >
                  {isApproving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}

                  {ja ? "承認" : "Approve"}
                </button>
              </>
            )}

            {vacancy.status === "approved" && (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => onPublish(vacancy.vacancyId)}
                className={`${primaryButton} bg-emerald-600 hover:bg-emerald-700 ${focusRing}`}
              >
                {isPublishing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}

                {ja ? "公開" : "Publish"}
              </button>
            )}

            {vacancy.status === "published" && (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => onCloseVacancy(vacancy.vacancyId)}
                className={`${primaryButton} bg-amber-600 hover:bg-amber-700 ${focusRing}`}
              >
                {isClosing && <Loader2 className="h-4 w-4 animate-spin" />}

                {ja ? "求人を終了" : "Close Vacancy"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}