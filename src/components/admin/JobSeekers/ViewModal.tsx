"use client";

import type { ComponentType, ReactNode } from "react";

import {
  AlertTriangle,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  History,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import type {
  AccountStatus,
  AdminSeeker,
  ApprovalStatus,
  PlacementStatus,
  SeekerApprovalActorType,
} from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

const fileButton = `inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`;

// ======================================================
// PROPS
// ======================================================

type Props = {
  lang: string;

  seeker: AdminSeeker;

  isDownloading: boolean;

  onClose: () => void;

  onDownloadResume: () => void;

  onReview: () => void;
};

// ======================================================
// BACKEND BASE URL
// ======================================================

const backendBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:5000";

// ======================================================
// COMPONENT
// ======================================================

export default function ViewModal({
  lang,
  seeker,
  isDownloading,
  onClose,
  onDownloadResume,
  onReview,
}: Props) {
  const ja = lang === "ja";

  const screening = seeker.staffScreening;

  const profilePhotoUrl = getFileUrl(seeker.profile_photo);

  const resumeSource = seeker.resume_file || seeker.generated_resume_file;

  const resumeUrl = getFileUrl(resumeSource);

  const documents = seeker.other_documents || [];

  const resumeType = seeker.resume_file
    ? ja
      ? "アップロード済み履歴書"
      : "Uploaded Resume"
    : ja
      ? "生成履歴書"
      : "Generated Resume";

  const downloadLabel = isDownloading
    ? ja
      ? "ダウンロード中..."
      : "Downloading..."
    : ja
      ? "ダウンロード"
      : "Download";

  // ==================================================
  // APPROVAL AUDIT
  // ==================================================

  const approvalReview = {
    reviewedAt:
      seeker.approvalReview?.reviewedAt ?? seeker.approval_reviewed_at ?? null,

    reviewedByType:
      seeker.approvalReview?.reviewedByType ??
      seeker.approval_reviewed_by_type ??
      null,

    reviewedById:
      seeker.approvalReview?.reviewedById ??
      seeker.approval_reviewed_by_id ??
      null,

    reviewedByName:
      seeker.approvalReview?.reviewedByName ??
      seeker.approval_reviewed_by_name ??
      null,
  };

  const approvalHistory = Array.isArray(seeker.approvalHistory)
    ? seeker.approvalHistory
    : [];

  // ==================================================
  // STAFF SCREENING STATE
  // ==================================================

  let screeningBadgeClass =
    "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  let screeningBadgeLabel = ja ? "未確認" : "Not Screened";

  let bannerClass =
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200";

  let BannerIcon = AlertTriangle;

  let bannerTitle = ja
    ? "この求職者はまだスタッフによる確認が完了していません。"
    : "This Job Seeker has not been screened by Staff yet.";

  let bannerText = ja
    ? "スタッフ確認と登録承認は別の操作です。"
    : "Staff screening and registration approval are separate actions.";

  switch (screening.status) {
    case "SCREENED":
      screeningBadgeClass =
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";

      screeningBadgeLabel = ja ? "確認済み" : "Screened";

      bannerClass =
        "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200";

      BannerIcon = CheckCircle2;

      bannerTitle = ja ? "スタッフ確認済み" : "Staff screening completed.";

      bannerText = ja
        ? "スタッフによる登録内容の確認が完了しています。"
        : "Staff screening for this registration has been completed.";

      break;

    case "NEEDS_ATTENTION":
      screeningBadgeClass =
        "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300";

      screeningBadgeLabel = ja ? "要確認" : "Needs Attention";

      bannerClass =
        "border-red-200 bg-red-50 text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200";

      bannerTitle = ja
        ? "スタッフがこの登録を要確認としています。"
        : "Staff marked this Job Seeker as needing attention.";

      bannerText = ja
        ? "承認・却下の判断前にスタッフメモを確認してください。"
        : "Review the Staff note before making the registration decision.";

      break;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-seeker-title"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label={ja ? "閉じる" : "Close"}
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            {profilePhotoUrl ? (
              <div
                className="h-12 w-12 shrink-0 rounded-lg border border-zinc-200 bg-cover bg-center bg-no-repeat dark:border-white/10"
                style={{
                  backgroundImage: `url("${profilePhotoUrl}")`,
                }}
                role="img"
                aria-label={`${seeker.name} profile`}
              />
            ) : (
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-white/5">
                <UserRound className="h-5 w-5 text-zinc-400" />
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-emerald-600">
                {seeker.seeker_id}
              </p>

              <h2
                id="view-seeker-title"
                className="mt-0.5 break-words text-lg font-semibold text-zinc-950 dark:text-white sm:text-xl"
              >
                {seeker.name}
              </h2>

              <p className="text-xs text-zinc-500">
                {ja ? "求職者詳細" : "Job Seeker Details"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={ja ? "閉じる" : "Close"}
            className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-white/10 ${focusRing}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
          {/* PROFILE */}

          <dl className="grid gap-x-4 gap-y-3 rounded-lg border border-zinc-200 p-4 dark:border-white/10 sm:grid-cols-2 lg:grid-cols-3">
            <Info icon={Mail} label={ja ? "メール" : "Email"}>
              {seeker.email}
            </Info>

            <Info icon={Phone} label={ja ? "電話番号" : "Phone"}>
              {text(seeker.phone)}
            </Info>

            <Info icon={MapPin} label={ja ? "住所" : "Address"}>
              {text(seeker.address)}
            </Info>

            <Info icon={MapPin} label={ja ? "現在地" : "Current Location"}>
              {text(seeker.current_location)}
            </Info>

            <Info icon={UserRound} label={ja ? "国籍" : "Nationality"}>
              {text(seeker.nationality)}
            </Info>

            <Info icon={CalendarDays} label={ja ? "生年月日" : "Date of Birth"}>
              {dateText(seeker.date_of_birth, lang)}
            </Info>

            <Info icon={UserRound} label={ja ? "性別" : "Gender"}>
              {text(seeker.gender)}
            </Info>

            <Info icon={ShieldCheck} label={ja ? "在留資格" : "Visa Type"}>
              {text(seeker.visa_type)}
            </Info>

            <Info icon={CalendarDays} label={ja ? "在留期限" : "Visa Expiry"}>
              {dateText(seeker.visa_expiry_date, lang)}
            </Info>

            <Info
              icon={UserRound}
              label={ja ? "日本語レベル" : "Japanese Level"}
            >
              {text(seeker.japanese_level)}
            </Info>

            <Info icon={Briefcase} label={ja ? "希望職種" : "Desired Job"}>
              {text(seeker.desired_job)}
            </Info>

            <Info icon={MapPin} label={ja ? "希望勤務地" : "Desired Location"}>
              {text(seeker.desired_location)}
            </Info>

            <Info
              icon={CalendarDays}
              label={ja ? "勤務可能日" : "Available From"}
            >
              {dateText(seeker.available_from, lang)}
            </Info>

            <Info icon={FileText} label={ja ? "応募数" : "Applications"}>
              {text(seeker.applications_count)}
            </Info>
          </dl>

          {/* EDUCATION / EMPLOYMENT */}

          <div className="grid gap-3 lg:grid-cols-2">
            <Section title={ja ? "学歴" : "Education"} icon={GraduationCap}>
              {(seeker.education || []).length === 0 ? (
                <Empty lang={lang} />
              ) : (
                seeker.education.map((education, index) => (
                  <div
                    key={education._id || index}
                    className="py-2 first:pt-0 last:pb-0"
                  >
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {education.school}
                    </p>

                    <p className="text-xs text-zinc-600 dark:text-zinc-300">
                      {text(education.major)}
                    </p>

                    <p className="mt-0.5 text-xs text-zinc-400">
                      {dateText(education.enrollment_date, lang)} —{" "}
                      {dateText(education.graduation_date, lang)}
                    </p>
                  </div>
                ))
              )}
            </Section>

            <Section
              title={ja ? "職歴" : "Employment History"}
              icon={Briefcase}
            >
              {(seeker.employment_history || []).length === 0 ? (
                <Empty lang={lang} />
              ) : (
                seeker.employment_history.map((employment, index) => (
                  <div
                    key={employment._id || index}
                    className="py-2 first:pt-0 last:pb-0"
                  >
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {employment.company_name}
                    </p>

                    <p className="text-xs text-zinc-600 dark:text-zinc-300">
                      {text(employment.employment_type)}
                    </p>

                    <p className="mt-0.5 text-xs text-zinc-400">
                      {dateText(employment.start_date, lang)} —{" "}
                      {dateText(employment.end_date, lang)}
                    </p>
                  </div>
                ))
              )}
            </Section>
          </div>

          {/* RESUME */}

          <Section title={ja ? "履歴書 / CV" : "Resume / CV"} icon={FileText}>
            {resumeUrl ? (
              <div className="flex flex-col gap-2 rounded-md bg-zinc-50 p-3 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {getFileName(resumeSource)}
                  </p>

                  <p className="text-xs text-zinc-500">{resumeType}</p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={fileButton}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />

                    {ja ? "表示" : "View"}
                  </a>

                  <button
                    type="button"
                    disabled={isDownloading}
                    onClick={onDownloadResume}
                    className={fileButton}
                  >
                    <Download className="h-3.5 w-3.5" />

                    {downloadLabel}
                  </button>
                </div>
              </div>
            ) : (
              <Empty
                lang={lang}
                message={
                  ja
                    ? "履歴書はアップロードされていません。"
                    : "No resume uploaded."
                }
              />
            )}
          </Section>

          {/* ADDITIONAL DOCUMENTS */}

          <Section
            title={ja ? "追加書類" : "Additional Documents"}
            icon={FileText}
          >
            {documents.length === 0 ? (
              <Empty
                lang={lang}
                message={
                  ja
                    ? "追加書類はありません。"
                    : "No additional documents uploaded."
                }
              />
            ) : (
              <div className="space-y-2">
                {documents.map((document, index) => {
                  const url = getFileUrl(document.file_url);

                  const fileName = getFileName(document.file_url);

                  return (
                    <div
                      key={document._id || `${document.name}-${index}`}
                      className="flex flex-col gap-2 rounded-md bg-zinc-50 p-3 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="break-words text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {document.name || fileName}
                        </p>

                        <p className="text-xs text-zinc-500">
                          {getDocumentTypeLabel(document.document_type)} ·{" "}
                          <span className="break-all">{fileName}</span>
                        </p>
                      </div>

                      {url && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={fileButton}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />

                          {ja ? "表示" : "View"}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          {/* SKILLS */}

          <Section title={ja ? "スキル" : "Skills"} icon={ShieldCheck}>
            {(seeker.skills || []).length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {seeker.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-white/10 dark:text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <Empty lang={lang} />
            )}
          </Section>

          {/* CURRENT STATUS */}

          <dl className="grid gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-white/5 sm:grid-cols-3">
            <StatusField label={ja ? "承認" : "Approval"}>
              {getApprovalLabel(seeker.approval_status, lang)}
            </StatusField>

            <StatusField label={ja ? "アカウント" : "Account"}>
              {getAccountLabel(seeker.account_status, lang)}
            </StatusField>

            <StatusField label={ja ? "配置" : "Placement"}>
              {getPlacementLabel(seeker.placement_status, lang)}
            </StatusField>
          </dl>

          {/* STAFF SCREENING */}

          <section className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                {ja ? "スタッフ確認" : "Staff Screening"}
              </h3>

              <span
                className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${screeningBadgeClass}`}
              >
                {screeningBadgeLabel}
              </span>
            </div>

            <div className={`flex gap-3 rounded-lg border p-3 ${bannerClass}`}>
              <BannerIcon className="mt-0.5 h-4 w-4 shrink-0" />

              <div>
                <p className="text-sm font-medium">{bannerTitle}</p>

                <p className="mt-0.5 text-xs opacity-90">{bannerText}</p>
              </div>
            </div>

            {screening.status !== "NOT_SCREENED" && (
              <dl className="grid gap-3 rounded-md bg-zinc-50 p-3 dark:bg-white/5 sm:grid-cols-3">
                <StatusField label={ja ? "確認担当" : "Screened By"}>
                  {screening.screenedByStaffName ||
                    screening.screenedByStaffId ||
                    "-"}
                </StatusField>

                <StatusField label={ja ? "スタッフID" : "Staff ID"}>
                  {screening.screenedByStaffId || "-"}
                </StatusField>

                <StatusField label={ja ? "確認日時" : "Screened At"}>
                  {dateTimeText(screening.screenedAt, lang)}
                </StatusField>
              </dl>
            )}

            {screening.note && (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-[11px] font-medium text-zinc-500">
                  {ja ? "スタッフメモ" : "Staff Screening Note"}
                </p>

                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-zinc-700 dark:text-zinc-200">
                  {screening.note}
                </p>
              </div>
            )}
          </section>

          {/* REGISTRATION DECISION & AUDIT */}

          <section className="space-y-4 rounded-lg border border-indigo-200 bg-indigo-50/40 p-4 dark:border-indigo-400/20 dark:bg-indigo-400/5">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-indigo-600" />

              <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                {ja ? "登録審査・監査履歴" : "Registration Decision & Audit"}
              </h3>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-white/10 dark:bg-zinc-900">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {ja ? "現在の審査結果" : "Current Decision"}
                </p>

                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getApprovalBadgeClass(
                    seeker.approval_status,
                  )}`}
                >
                  {getApprovalLabel(seeker.approval_status, lang)}
                </span>
              </div>

              {seeker.approval_status !== "pending" ? (
                <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <StatusField label={ja ? "審査担当" : "Reviewed By"}>
                    {approvalReview.reviewedByName ||
                      approvalReview.reviewedById ||
                      "-"}
                  </StatusField>

                  <StatusField label={ja ? "権限" : "Reviewer Type"}>
                    {getActorTypeLabel(approvalReview.reviewedByType, lang)}
                  </StatusField>

                  <StatusField label={ja ? "担当者ID" : "Reviewer ID"}>
                    {approvalReview.reviewedById || "-"}
                  </StatusField>

                  <StatusField label={ja ? "審査日時" : "Reviewed At"}>
                    {dateTimeText(approvalReview.reviewedAt, lang)}
                  </StatusField>
                </dl>
              ) : (
                <p className="mt-3 text-sm text-zinc-500">
                  {ja
                    ? "この登録はまだ承認待ちです。"
                    : "This registration is still waiting for an approval decision."}
                </p>
              )}

              {seeker.rejection_reason && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-xs font-medium text-red-600">
                    {ja ? "却下理由" : "Rejection Reason"}
                  </p>

                  <p className="mt-1 whitespace-pre-wrap text-sm text-red-700">
                    {seeker.rejection_reason}
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {ja ? "判断履歴" : "Decision History"}
              </p>

              {approvalHistory.length ? (
                <div className="space-y-2">
                  {approvalHistory.map((entry, index) => (
                    <div
                      key={
                        entry.id ||
                        `${entry.decision}-${entry.reviewedAt}-${index}`
                      }
                      className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-white/10 dark:bg-zinc-900"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            {getApprovalLabel(entry.decision, lang)}
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            {entry.actorName || entry.actorId || "-"} ·{" "}
                            {getActorTypeLabel(entry.actorType, lang)}
                            {entry.actorId ? ` · ${entry.actorId}` : ""}
                          </p>
                        </div>

                        <p className="text-xs text-zinc-400">
                          {dateTimeText(entry.reviewedAt, lang)}
                        </p>
                      </div>

                      {entry.reason && (
                        <div className="mt-2 rounded-md bg-red-50 px-2.5 py-2 text-xs text-red-700">
                          {ja ? "理由" : "Reason"}: {entry.reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">
                  {ja
                    ? "登録判断の履歴はありません。"
                    : "No registration decision history has been recorded."}
                </p>
              )}
            </div>

            <p className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
              {ja
                ? "スタッフ確認と登録承認は別の操作です。管理者または求職者承認権限を持つスタッフが承認・却下できます。"
                : "Staff screening and registration approval are separate actions. Admin or Staff with the Job Seeker approval permission may approve or reject the registration."}
            </p>
          </section>
        </div>

        {/* FOOTER */}

        {(seeker.approval_status === "pending" || resumeUrl) && (
          <div className="space-y-2.5 border-t border-zinc-200 px-4 py-3 dark:border-white/10 sm:px-5">
            {seeker.approval_status === "pending" &&
              screening.status === "NEEDS_ATTENTION" && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {ja
                    ? "スタッフがこの登録を「要確認」としています。判断前にスタッフメモを確認してください。"
                    : "Staff marked this registration as Needs Attention. Review the screening note before making the decision."}
                </p>
              )}

            <div className="flex flex-wrap justify-end gap-2">
              {resumeUrl && (
                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={onDownloadResume}
                  className={`inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 sm:flex-none ${focusRing}`}
                >
                  <Download className="h-4 w-4" />

                  {downloadLabel}
                </button>
              )}

              {seeker.approval_status === "pending" && (
                <button
                  type="button"
                  onClick={onReview}
                  className={`inline-flex h-9 flex-1 cursor-pointer items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 sm:flex-none ${focusRing}`}
                >
                  {ja ? "登録審査" : "Review Registration"}
                </button>
              )}
            </div>
          </div>
        )}
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
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

      <div className="min-w-0">
        <dt className="text-[11px] font-medium text-zinc-500">{label}</dt>

        <dd className="mt-0.5 break-words text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {children}
        </dd>
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
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-lg border border-zinc-200 p-4 dark:border-white/10">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
        <Icon className="h-4 w-4 text-emerald-600" />

        {title}
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-white/10">
        {children}
      </div>
    </section>
  );
}

// ======================================================
// STATUS FIELD
// ======================================================

function StatusField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium text-zinc-500">{label}</dt>

      <dd className="mt-0.5 break-words text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {children}
      </dd>
    </div>
  );
}

// ======================================================
// EMPTY
// ======================================================

function Empty({ lang, message }: { lang: string; message?: string }) {
  return (
    <p className="py-1 text-sm text-zinc-400">
      {message ||
        (lang === "ja" ? "情報がありません。" : "No information available.")}
    </p>
  );
}

// ======================================================
// APPROVAL
// ======================================================

function getApprovalLabel(status: ApprovalStatus, lang: string) {
  switch (status) {
    case "approved":
      return lang === "ja" ? "承認済み" : "Approved";

    case "rejected":
      return lang === "ja" ? "却下" : "Rejected";

    default:
      return lang === "ja" ? "承認待ち" : "Pending";
  }
}

function getApprovalBadgeClass(status: ApprovalStatus) {
  switch (status) {
    case "approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

// ======================================================
// ACTOR TYPE
// ======================================================

function getActorTypeLabel(
  type: SeekerApprovalActorType | string | null | undefined,
  lang: string,
) {
  if (type === "admin") {
    return lang === "ja" ? "管理者" : "Admin";
  }

  if (type === "staff") {
    return lang === "ja" ? "スタッフ" : "Staff";
  }

  return "-";
}

// ======================================================
// ACCOUNT
// ======================================================

function getAccountLabel(status: AccountStatus, lang: string) {
  switch (status) {
    case "active":
      return lang === "ja" ? "有効" : "Active";

    case "suspended":
      return lang === "ja" ? "停止中" : "Suspended";

    default:
      return lang === "ja" ? "無効" : "Inactive";
  }
}

// ======================================================
// PLACEMENT
// ======================================================

function getPlacementLabel(status: PlacementStatus, lang: string) {
  switch (status) {
    case "matching":
      return lang === "ja" ? "マッチング中" : "Matching";

    case "interview":
      return lang === "ja" ? "面接" : "Interview";

    case "selected":
      return lang === "ja" ? "選考済み" : "Selected";

    case "placed":
      return lang === "ja" ? "配置済み" : "Placed";

    default:
      return lang === "ja" ? "未配置" : "Unplaced";
  }
}

// ======================================================
// TEXT
// ======================================================

function text(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
}

// ======================================================
// DATE
// ======================================================

function dateText(value?: string | null, lang = "en") {
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
  }).format(date);
}

function dateTimeText(value?: string | null, lang = "en") {
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
// FILE URL
// ======================================================

function getFileUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${backendBaseUrl}${value.startsWith("/") ? value : `/${value}`}`;
}

// ======================================================
// FILE NAME
// ======================================================

function getFileName(value?: string | null) {
  if (!value) {
    return "File";
  }

  try {
    const url = /^https?:\/\//i.test(value) ? new URL(value) : null;

    const pathname = url?.pathname || value;

    const rawName = pathname.split("/").filter(Boolean).pop();

    if (!rawName) {
      return "File";
    }

    const decoded = decodeURIComponent(rawName);

    return decoded.replace(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i,
      "",
    );
  } catch {
    return "File";
  }
}

// ======================================================
// DOCUMENT TYPE
// ======================================================

function getDocumentTypeLabel(value?: string | null) {
  if (!value) {
    return "Other";
  }

  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
