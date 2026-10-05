"use client";

import type { LucideIcon } from "lucide-react";

import {
  AlertTriangle,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
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
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-4">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label={t("close")}
      />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-4">
            {profilePhotoUrl ? (
              <div
                className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url("${profilePhotoUrl}")`,
                }}
                role="img"
                aria-label={seeker.name}
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                <UserRound className="h-7 w-7 text-slate-400" />
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                {seeker.seeker_id}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                {seeker.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {seeker.desired_job || t("details.jobSeeker")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-slate-100"
            aria-label={t("close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}

        <div className="overflow-y-auto p-6">
          <div className="space-y-7">
            {/* PROFILE */}

            <section>
              <h3 className="mb-4 text-lg font-bold">
                {t("details.profileInformation")}
              </h3>

              <div className="grid gap-3 md:grid-cols-3">
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
            </section>

            {/* EDUCATION / EMPLOYMENT */}

            <div className="grid gap-5 lg:grid-cols-2">
              <Section title={t("details.education")} icon={GraduationCap}>
                {seeker.education.length === 0 ? (
                  <Empty message={t("details.noInformation")} />
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
                        {formatDate(education.enrollment_date)}
                        {" — "}
                        {formatDate(education.graduation_date)}
                      </p>
                    </div>
                  ))
                )}
              </Section>

              <Section title={t("details.employmentHistory")} icon={Briefcase}>
                {seeker.employment_history.length === 0 ? (
                  <Empty message={t("details.noInformation")} />
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
                        {formatDate(employment.start_date)}
                        {" — "}
                        {formatDate(employment.end_date)}
                      </p>
                    </div>
                  ))
                )}
              </Section>
            </div>

            {/* RESUME */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />

                <h3 className="font-semibold">{t("details.resume")}</h3>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {t("details.resumeDescription")}
              </p>

              {resumeUrl ? (
                <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
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
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      <ExternalLink className="h-4 w-4" />

                      {t("view")}
                    </a>

                    <button
                      type="button"
                      disabled={isDownloading}
                      onClick={() => onDownloadResume(seeker)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                    >
                      <Download className="h-4 w-4" />

                      {isDownloading ? t("downloading") : t("download")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <Empty message={t("details.noResume")} />
                </div>
              )}
            </section>

            {/* DOCUMENTS */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />

                <h3 className="font-semibold">
                  {t("details.additionalDocuments")}
                </h3>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {t("details.additionalDocumentsDescription")}
              </p>

              {seeker.other_documents.length === 0 ? (
                <div className="mt-4">
                  <Empty message={t("details.noAdditionalDocuments")} />
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {seeker.other_documents.map((document, index) => (
                    <DocumentRow
                      key={document._id || `${document.name}-${index}`}
                      document={document}
                      viewLabel={t("view")}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* SKILLS */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold">{t("details.skills")}</h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {seeker.skills.length > 0 ? (
                  seeker.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <Empty message={t("details.noInformation")} />
                )}
              </div>
            </section>

            {/* CURRENT STATUS */}

            <section>
              <h3 className="mb-4 text-lg font-bold">
                {t("details.currentStatus")}
              </h3>

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
            </section>

            {/* APPROVAL HISTORY */}

            <ApprovalHistorySection seeker={seeker} />

            {/* SCREENING */}

            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">
                  {t("details.staffScreening")}
                </h3>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getScreeningClass(
                    seeker.staffScreening.status,
                  )}`}
                >
                  {screeningLabel}
                </span>
              </div>

              {seeker.staffScreening.status === "NOT_SCREENED" && (
                <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />

                  <p className="text-sm text-amber-700">
                    {t("details.notScreenedMessage")}
                  </p>
                </div>
              )}

              {seeker.staffScreening.status === "SCREENED" && (
                <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                  <p className="text-sm text-emerald-700">
                    {t("details.screenedMessage")}
                  </p>
                </div>
              )}

              {seeker.staffScreening.status === "NEEDS_ATTENTION" && (
                <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />

                  <p className="text-sm text-red-700">
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
                    <div className="mt-3 rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        {t("details.screeningNote")}
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm">
                        {seeker.staffScreening.note}
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                {t("details.screeningNotice")}
              </div>
            </section>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-6 py-4">
          {(seeker.resume_file || seeker.generated_resume_file) && (
            <button
              type="button"
              disabled={isDownloading}
              onClick={() => onDownloadResume(seeker)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              <Download className="h-4 w-4" />

              {isDownloading ? t("downloading") : t("details.downloadResume")}
            </button>
          )}

          {canScreen && (
            <button
              type="button"
              onClick={() => onScreen(seeker)}
              className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white"
            >
              {seeker.staffScreening.status === "NOT_SCREENED"
                ? t("table.screen")
                : t("table.editScreening")}
            </button>
          )}

          {canDecide && (
            <button
              type="button"
              onClick={() => onApprove(seeker)}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
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
    <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500">
          <FileText className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-slate-800">
            {document.name || fileName}
          </p>

          <p className="mt-1 text-xs text-slate-500">
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
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          <ExternalLink className="h-4 w-4" />

          {viewLabel}
        </a>
      )}
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
  icon: LucideIcon;

  label: string;

  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-4 w-4 text-slate-400" />

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-medium">{value}</p>
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

  icon: LucideIcon;

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
    <div className={`rounded-2xl border p-4 ${className}`}>
      <p className="text-xs font-semibold uppercase opacity-70">{label}</p>

      <p className="mt-1 font-semibold">{value}</p>
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
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>

      <p className="mt-1 text-sm font-semibold">{value || "-"}</p>
    </div>
  );
}

// ======================================================
// EMPTY
// ======================================================

function Empty({ message }: { message: string }) {
  return <p className="text-sm text-slate-400">{message}</p>;
}
