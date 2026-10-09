"use client";

import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

import {
  AlertTriangle,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Download,
  ExternalLink,
  FileText,
  Gavel,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { useFormatter, useTranslations } from "next-intl";

import ApprovalHistorySection from "./ApprovalHistorySection";

import { getAccountClass, getApprovalClass, getScreeningClass } from "./helper";

import type { SeekerDocument, StaffSeeker } from "./types";

type Props = {
  seeker: StaffSeeker | null;

  canManage: boolean;

  canApprove: boolean;

  isDownloading: boolean;

  onClose: () => void;

  onScreen: (seeker: StaffSeeker) => void;

  onApprove: (seeker: StaffSeeker) => void;

  onDownloadResume: (seeker: StaffSeeker) => void;
};

// ======================================================
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const secondaryButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50";

const smallSecondaryButton =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-white px-3.5 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50";

// ======================================================
// BACKEND URL
// ======================================================

const configuredApiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const backendBaseUrl = configuredApiUrl.replace(/\/api\/?$/, "");

// ======================================================
// HELPERS
// ======================================================

const text = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
};

const getFileUrl = (value?: string | null) => {
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${backendBaseUrl}${value.startsWith("/") ? value : `/${value}`}`;
};

const getFileName = (value?: string | null) => {
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
};

const getDocumentTypeLabel = (value?: string | null) => {
  if (!value) {
    return "Other";
  }

  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

// ======================================================
// COMPONENT
// ======================================================

export default function JobSeekerDetails({
  seeker,
  canManage,
  canApprove,
  isDownloading,
  onClose,
  onScreen,
  onApprove,
  onDownloadResume,
}: Props) {
  const t = useTranslations("staffJobSeekers");

  const format = useFormatter();

  if (!seeker) {
    return null;
  }

  const canScreen = canManage && seeker.approval_status === "pending";

  const canDecide = canApprove && seeker.approval_status === "pending";

  const notScreened = seeker.staffScreening.status === "NOT_SCREENED";

  const profilePhotoUrl = getFileUrl(seeker.profile_photo);

  const resumeUrl = getFileUrl(
    seeker.resume_file || seeker.generated_resume_file,
  );

  const formatDate = (value?: string | null) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return format.dateTime(date, {
      timeZone: "Asia/Tokyo",

      year: "numeric",

      month: "2-digit",

      day: "2-digit",
    });
  };

  const approvalLabel =
    seeker.approval_status === "approved"
      ? t("statuses.approval.approved")
      : seeker.approval_status === "rejected"
        ? t("statuses.approval.rejected")
        : t("statuses.approval.pending");

  const accountLabel =
    seeker.account_status === "active"
      ? t("statuses.account.active")
      : seeker.account_status === "suspended"
        ? t("statuses.account.suspended")
        : t("statuses.account.inactive");

  const placementLabel =
    seeker.placement_status === "matching"
      ? t("statuses.placement.matching")
      : seeker.placement_status === "interview"
        ? t("statuses.placement.interview")
        : seeker.placement_status === "selected"
          ? t("statuses.placement.selected")
          : seeker.placement_status === "placed"
            ? t("statuses.placement.placed")
            : t("statuses.placement.unplaced");

  const screeningLabel =
    seeker.staffScreening.status === "SCREENED"
      ? t("statuses.screening.screened")
      : seeker.staffScreening.status === "NEEDS_ATTENTION"
        ? t("statuses.screening.needsAttention")
        : t("statuses.screening.notScreened");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={seeker.name}
      className="fixed inset-0 z-[130] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label={t("close")}
      />

      <div className="relative z-10 flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-slate-200 sm:rounded-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="relative shrink-0 overflow-hidden bg-[linear-gradient(120deg,#eef2ff_0%,#f5f3ff_45%,#ffffff_100%)] px-4 py-4 shadow-[inset_0_-1px_0_0_#e0e7ff] sm:px-6 sm:py-5">
          {/* decorative grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.07)_1px,transparent_1px)] bg-[length:44px_44px] [mask-image:linear-gradient(90deg,#000,transparent)]"
          />

          <div className="relative flex items-start gap-3 sm:gap-4">
            {profilePhotoUrl ? (
              <div
                className="h-14 w-14 shrink-0 rounded-xl bg-white bg-cover bg-center bg-no-repeat shadow-md ring-1 ring-slate-200 sm:h-16 sm:w-16"
                style={{
                  backgroundImage: `url("${profilePhotoUrl}")`,
                }}
                role="img"
                aria-label={seeker.name}
              />
            ) : (
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white text-slate-400 shadow-md ring-1 ring-slate-200 sm:h-16 sm:w-16">
                <UserRound className="h-7 w-7" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="break-all text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                {seeker.seeker_id}
              </p>

              <h2 className="mt-0.5 break-words text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
                {seeker.name}
              </h2>

              <p className="mt-1 break-words text-sm text-slate-500">
                {seeker.desired_job || t("details.jobSeeker")}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getApprovalClass(
                    seeker.approval_status,
                  )}`}
                >
                  {approvalLabel}
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getAccountClass(
                    seeker.account_status,
                  )}`}
                >
                  {accountLabel}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-slate-600 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/60">
          <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
            {/* PROFILE */}

            <Section
              title={t("details.profileInformation")}
              icon={UserRound}
              accent="indigo"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Info
                  icon={Mail}
                  label={t("details.email")}
                  value={seeker.email}
                />

                <Info
                  icon={Phone}
                  label={t("details.phone")}
                  value={text(seeker.phone)}
                />

                <Info
                  icon={MapPin}
                  label={t("details.address")}
                  value={text(seeker.address)}
                />

                <Info
                  icon={MapPin}
                  label={t("details.currentLocation")}
                  value={text(seeker.current_location)}
                />

                <Info
                  icon={UserRound}
                  label={t("details.nationality")}
                  value={text(seeker.nationality)}
                />

                <Info
                  icon={CalendarDays}
                  label={t("details.dateOfBirth")}
                  value={formatDate(seeker.date_of_birth)}
                />

                <Info
                  icon={ShieldCheck}
                  label={t("details.visaType")}
                  value={text(seeker.visa_type)}
                />

                <Info
                  icon={CalendarDays}
                  label={t("details.visaExpiry")}
                  value={formatDate(seeker.visa_expiry_date)}
                />

                <Info
                  icon={UserRound}
                  label={t("details.japaneseLevel")}
                  value={text(seeker.japanese_level)}
                />

                <Info
                  icon={Briefcase}
                  label={t("details.desiredJob")}
                  value={text(seeker.desired_job)}
                />

                <Info
                  icon={MapPin}
                  label={t("details.desiredLocation")}
                  value={text(seeker.desired_location)}
                />

                <Info
                  icon={FileText}
                  label={t("details.applications")}
                  value={seeker.applications_count}
                />
              </div>
            </Section>

            {/* EDUCATION / EMPLOYMENT */}

            <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
              <Section
                title={t("details.education")}
                icon={GraduationCap}
                accent="violet"
              >
                {seeker.education.length === 0 ? (
                  <Empty message={t("details.noInformation")} />
                ) : (
                  <Timeline>
                    {seeker.education.map((education, index) => (
                      <TimelineItem
                        key={education._id || index}
                        title={education.school}
                        subtitle={text(education.major)}
                        period={`${formatDate(
                          education.enrollment_date,
                        )} — ${formatDate(education.graduation_date)}`}
                      />
                    ))}
                  </Timeline>
                )}
              </Section>

              <Section
                title={t("details.employmentHistory")}
                icon={Briefcase}
                accent="emerald"
              >
                {seeker.employment_history.length === 0 ? (
                  <Empty message={t("details.noInformation")} />
                ) : (
                  <Timeline>
                    {seeker.employment_history.map((employment, index) => (
                      <TimelineItem
                        key={employment._id || index}
                        title={employment.company_name}
                        subtitle={text(employment.employment_type)}
                        period={`${formatDate(
                          employment.start_date,
                        )} — ${formatDate(employment.end_date)}`}
                      />
                    ))}
                  </Timeline>
                )}
              </Section>
            </div>

            {/* RESUME */}

            <Section
              title={t("details.resume")}
              icon={FileText}
              accent="amber"
            >
              <p className="-mt-1 mb-4 text-sm text-slate-500">
                {t("details.resumeDescription")}
              </p>

              {resumeUrl ? (
                <div className="flex flex-col gap-3 rounded-xl bg-[linear-gradient(120deg,#fffbeb_0%,#ffffff_70%)] p-4 ring-1 ring-inset ring-amber-200 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {getFileName(
                        seeker.resume_file || seeker.generated_resume_file,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {seeker.resume_file
                        ? t("details.uploadedResume")
                        : t("details.generatedResume")}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={smallSecondaryButton}
                    >
                      <ExternalLink className="h-4 w-4" />

                      {t("view")}
                    </a>

                    <button
                      type="button"
                      disabled={isDownloading}
                      onClick={() => onDownloadResume(seeker)}
                      className={smallSecondaryButton}
                    >
                      <Download className="h-4 w-4" />

                      {isDownloading ? t("downloading") : t("download")}
                    </button>
                  </div>
                </div>
              ) : (
                <Empty message={t("details.noResume")} />
              )}
            </Section>

            {/* DOCUMENTS */}

            <Section
              title={t("details.additionalDocuments")}
              icon={FileText}
              accent="sky"
            >
              <p className="-mt-1 mb-4 text-sm text-slate-500">
                {t("details.additionalDocumentsDescription")}
              </p>

              {seeker.other_documents.length === 0 ? (
                <Empty message={t("details.noAdditionalDocuments")} />
              ) : (
                <div className="space-y-3">
                  {seeker.other_documents.map((document, index) => (
                    <DocumentRow
                      key={document._id || `${document.name}-${index}`}
                      document={document}
                      viewLabel={t("view")}
                    />
                  ))}
                </div>
              )}
            </Section>

            {/* SKILLS */}

            <Section
              title={t("details.skills")}
              icon={Briefcase}
              accent="indigo"
            >
              <div className="flex flex-wrap gap-2">
                {seeker.skills.length > 0 ? (
                  seeker.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-100"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <Empty message={t("details.noInformation")} />
                )}
              </div>
            </Section>

            {/* CURRENT STATUS */}

            <Section
              title={t("details.currentStatus")}
              icon={ShieldCheck}
              accent="teal"
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <Status
                  label={t("details.approval")}
                  value={approvalLabel}
                  className={getApprovalClass(seeker.approval_status)}
                />

                <Status
                  label={t("details.account")}
                  value={accountLabel}
                  className={getAccountClass(seeker.account_status)}
                />

                <Status
                  label={t("details.placement")}
                  value={placementLabel}
                  className="border-slate-200 bg-slate-50 text-slate-700"
                />
              </div>
            </Section>

            {/* APPROVAL HISTORY */}

            <ApprovalHistorySection seeker={seeker} />

            {/* SCREENING */}

            <Section
              title={t("details.staffScreening")}
              icon={ClipboardCheck}
              accent="rose"
              aside={
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getScreeningClass(
                    seeker.staffScreening.status,
                  )}`}
                >
                  {screeningLabel}
                </span>
              }
            >
              {seeker.staffScreening.status === "NOT_SCREENED" && (
                <div className="flex gap-3 rounded-xl bg-amber-50 p-4 ring-1 ring-inset ring-amber-200">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />

                  <p className="text-sm text-amber-700">
                    {t("details.notScreenedMessage")}
                  </p>
                </div>
              )}

              {seeker.staffScreening.status === "SCREENED" && (
                <div className="flex gap-3 rounded-xl bg-emerald-50 p-4 ring-1 ring-inset ring-emerald-200">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                  <p className="text-sm text-emerald-700">
                    {t("details.screenedMessage")}
                  </p>
                </div>
              )}

              {seeker.staffScreening.status === "NEEDS_ATTENTION" && (
                <div className="flex gap-3 rounded-xl bg-rose-50 p-4 ring-1 ring-inset ring-rose-200">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />

                  <p className="text-sm text-rose-700">
                    {t("details.needsAttentionMessage")}
                  </p>
                </div>
              )}

              {seeker.staffScreening.status !== "NOT_SCREENED" && (
                <>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <Detail
                      label={t("details.screenedBy")}
                      value={seeker.staffScreening.screenedByStaffId}
                    />

                    <Detail
                      label={t("details.screenedAt")}
                      value={formatDate(seeker.staffScreening.screenedAt)}
                    />
                  </div>

                  {seeker.staffScreening.note && (
                    <div className="mt-3 rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {t("details.screeningNote")}
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">
                        {seeker.staffScreening.note}
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="mt-3 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-700 ring-1 ring-inset ring-blue-200">
                {t("details.screeningNotice")}
              </div>
            </Section>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex shrink-0 flex-col-reverse gap-2 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[inset_0_1px_0_0_#e2e8f0] sm:flex-row sm:flex-wrap sm:justify-end sm:px-6 sm:py-4">
          {(seeker.resume_file || seeker.generated_resume_file) && (
            <button
              type="button"
              disabled={isDownloading}
              onClick={() => onDownloadResume(seeker)}
              className={secondaryButton}
            >
              <Download className="h-4 w-4" />

              {isDownloading ? t("downloading") : t("details.downloadResume")}
            </button>
          )}

          {canScreen && (
            <button
              type="button"
              onClick={() => onScreen(seeker)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              {notScreened ? (
                <ClipboardCheck className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}

              {notScreened ? t("table.screen") : t("table.editScreening")}
            </button>
          )}

          {canDecide && (
            <button
              type="button"
              onClick={() => onApprove(seeker)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <Gavel className="h-4 w-4" />

              {t("table.approveReject")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// DOCUMENT ROW
// ======================================================

function DocumentRow({
  document,
  viewLabel,
}: {
  document: SeekerDocument;

  viewLabel: string;
}) {
  const url = getFileUrl(document.file_url);

  const fileName = getFileName(document.file_url);

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-3.5 ring-1 ring-inset ring-slate-200/70 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span
          aria-hidden="true"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-slate-500 ring-1 ring-inset ring-slate-200"
        >
          <FileText className="h-4 w-4" />
        </span>

        <div className="min-w-0">
          <p className="break-words text-sm font-semibold text-slate-950">
            {document.name || fileName}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {getDocumentTypeLabel(document.document_type)}
            {" · "}
            <span className="break-all">{fileName}</span>
          </p>
        </div>
      </div>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${smallSecondaryButton} shrink-0`}
        >
          <ExternalLink className="h-4 w-4" />

          {viewLabel}
        </a>
      )}
    </div>
  );
}

// ======================================================
// SECTION
//
// Full class names are written out so Tailwind can
// detect them.
// ======================================================

const sectionAccents = {
  indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  sky: "bg-sky-50 text-sky-600 ring-sky-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  rose: "bg-rose-50 text-rose-600 ring-rose-100",
  teal: "bg-teal-50 text-teal-600 ring-teal-100",
} as const;

function Section({
  title,
  icon: Icon,
  accent,
  aside,
  children,
}: {
  title: string;

  icon: LucideIcon;

  accent: keyof typeof sectionAccents;

  aside?: ReactNode;

  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset ${sectionAccents[accent]}`}
          >
            <Icon className="h-4 w-4" />
          </span>

          <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
        </div>

        {aside}
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}

// ======================================================
// TIMELINE
// ======================================================

function Timeline({ children }: { children: ReactNode }) {
  return (
    <ol className="relative ml-1.5 space-y-4 pl-5 before:absolute before:bottom-1 before:left-0 before:top-1 before:w-px before:bg-slate-200 before:content-['']">
      {children}
    </ol>
  );
}

function TimelineItem({
  title,
  subtitle,
  period,
}: {
  title: string;

  subtitle: string;

  period: string;
}) {
  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className="absolute -left-[24px] top-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-white"
      />

      <p className="break-words font-semibold text-slate-950">{title}</p>

      <p className="mt-0.5 break-words text-sm text-slate-600">{subtitle}</p>

      <p className="mt-1 text-xs text-slate-400">{period}</p>
    </li>
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
  icon: LucideIcon;

  label: string;

  value: string | number;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3.5 ring-1 ring-inset ring-slate-200/70">
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-slate-950">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// STATUS
// ======================================================

function Status({
  label,
  value,
  className,
}: {
  label: string;

  value: string;

  className: string;
}) {
  return (
    <div className={`rounded-xl border p-3.5 ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

// ======================================================
// DETAIL
// ======================================================

function Detail({
  label,
  value,
}: {
  label: string;

  value?: string | null;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3.5 ring-1 ring-inset ring-slate-200/70">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-950">
        {value || "-"}
      </p>
    </div>
  );
}

// ======================================================
// EMPTY
// ======================================================

function Empty({ message }: { message: string }) {
  return <p className="text-sm text-slate-400">{message}</p>;
}