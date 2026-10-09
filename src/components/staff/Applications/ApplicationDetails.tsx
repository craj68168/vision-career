"use client";

import { useState } from "react";
import type { ComponentType, ReactNode } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useLocale, useTranslations } from "next-intl";

import {
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  Eye,
  FileText,
  Gavel,
  GraduationCap,
  Loader2,
  MessageSquareText,
  Pencil,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { getStaffApplicationResume } from "./api";

import {
  formatDate,
  formatDateTime,
  getApplicationStatusClass,
  getScreeningClass,
} from "./helper";

import type { ApiErrorResponse, StaffApplication } from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  application: StaffApplication | null;

  canReview: boolean;

  canApprove: boolean;

  onClose: () => void;

  onScreen: (application: StaffApplication) => void;

  onDecision: (application: StaffApplication) => void;
};

// ======================================================
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const badgeClass = "rounded-full px-3 py-1 text-xs font-semibold";

const secondaryButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "A"
  );
}

// ======================================================
// COMPONENT
// ======================================================

export default function ApplicationDetails({
  application,
  canReview,
  canApprove,
  onClose,
  onScreen,
  onDecision,
}: Props) {
  const t = useTranslations("staffApplications");

  const locale = useLocale();

  const [isOpeningResume, setIsOpeningResume] = useState(false);

  if (!application) {
    return null;
  }

  const pending = application.status === "PENDING_ADMIN_APPROVAL";

  const canScreen = canReview && pending;

  const canDecide = canApprove && pending;

  const applicantName =
    application.applicant.name || t("details.applicantFallback");

  const notScreened = application.screening.status === "NOT_SCREENED";

  // ====================================================
  // ERROR
  // ====================================================

  const getResumeErrorMessage = (error: unknown) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      if (!error.response) {
        return t("messages.network");
      }

      switch (error.response.status) {
        case 401:
          return t("messages.unauthorized");

        case 403:
          return t("messages.forbidden");

        case 404:
          return t("messages.resumeUnavailable");

        default:
          return error.response.data?.message || t("messages.resumeOpenFailed");
      }
    }

    return t("messages.resumeOpenFailed");
  };

  // ====================================================
  // VIEW FROZEN APPLICATION RESUME
  // ====================================================

  const handleViewResume = async () => {
    if (!application.applicant.resumeAvailable) {
      toast.error(t("messages.resumeUnavailable"));

      return;
    }

    const previewWindow = window.open("", "_blank");

    if (!previewWindow) {
      toast.error(t("messages.popupBlocked"));

      return;
    }

    previewWindow.opener = null;

    try {
      setIsOpeningResume(true);

      const resumeBlob = await getStaffApplicationResume(
        application.applicationId,
      );

      const objectUrl = URL.createObjectURL(resumeBlob);

      previewWindow.location.href = objectUrl;

      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 60_000);
    } catch (error) {
      previewWindow.close();

      toast.error(getResumeErrorMessage(error));
    } finally {
      setIsOpeningResume(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={applicantName}
      className="fixed inset-0 z-[130] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      {/* BACKDROP */}

      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label={t("details.close")}
      />

      {/* MODAL */}

      <div className="relative z-10 flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-slate-200 sm:max-h-[92dvh] sm:rounded-2xl">
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
            <span
              aria-hidden="true"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-base font-bold text-white shadow-md shadow-indigo-600/30"
            >
              {getInitials(applicantName)}
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                {t("details.eyebrow")}
              </p>

              <h2 className="mt-0.5 break-words text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
                {applicantName}
              </h2>

              <p className="mt-1 break-all text-xs text-slate-500">
                {application.applicationId}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`${badgeClass} ${getApplicationStatusClass(
                    application.status,
                  )}`}
                >
                  {t(`statuses.${application.status}`)}
                </span>

                <span
                  className={`${badgeClass} ${getScreeningClass(
                    application.screening.status,
                  )}`}
                >
                  {t(`screeningStatuses.${application.screening.status}`)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t("details.close")}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-slate-600 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* SCROLLABLE CONTENT */}
        {/* ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/60">
          <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
            {/* VACANCY */}

            <Section
              icon={BriefcaseBusiness}
              title={t("details.vacancy")}
              accent="indigo"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Info
                  label={t("details.position")}
                  value={application.vacancy?.title || "-"}
                />

                <Info
                  label={t("details.company")}
                  value={application.vacancy?.companyName || "-"}
                />

                <Info
                  label={t("details.employment")}
                  value={application.vacancy?.employmentType || "-"}
                />

                <Info
                  label={t("details.location")}
                  value={application.vacancy?.workLocation || "-"}
                />

                <Info
                  label={t("details.requiredJapanese")}
                  value={application.vacancy?.japaneseLevel || "-"}
                />

                <Info
                  label={t("details.applied")}
                  value={formatDate(application.appliedAt, locale)}
                />
              </div>
            </Section>

            {/* CANDIDATE */}

            <Section
              icon={UserRound}
              title={t("details.candidateProfile")}
              accent="sky"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Info
                  label={t("details.nationality")}
                  value={application.applicant.nationality || "-"}
                />

                <Info
                  label={t("details.visa")}
                  value={application.applicant.visaType || "-"}
                />

                <Info
                  label={t("details.visaExpiry")}
                  value={formatDate(
                    application.applicant.visaExpiryDate,
                    locale,
                  )}
                />

                <Info
                  label={t("details.japanese")}
                  value={application.applicant.japaneseLevel || "-"}
                />

                <Info
                  label={t("details.desiredJob")}
                  value={application.applicant.desiredJob || "-"}
                />

                <Info
                  label={t("details.desiredLocation")}
                  value={application.applicant.desiredLocation || "-"}
                />
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {t("details.skills")}
                </p>

                {application.applicant.skills.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {application.applicant.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    {t("details.noSkills")}
                  </p>
                )}
              </div>
            </Section>

            {/* EDUCATION + EMPLOYMENT */}

            <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
              <Section
                icon={GraduationCap}
                title={t("details.education")}
                accent="violet"
              >
                {application.applicant.education.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    {t("details.noEducation")}
                  </p>
                ) : (
                  <Timeline>
                    {application.applicant.education.map(
                      (education, index) => (
                        <TimelineItem
                          key={`${education.school || "education"}-${index}`}
                          title={education.school || "-"}
                          subtitle={
                            education.major || education.school_type || "-"
                          }
                          period={`${formatDate(
                            education.enrollment_date,
                            locale,
                          )} - ${formatDate(education.graduation_date, locale)}`}
                        />
                      ),
                    )}
                  </Timeline>
                )}
              </Section>

              <Section
                icon={Building2}
                title={t("details.employmentHistory")}
                accent="emerald"
              >
                {application.applicant.employmentHistory.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    {t("details.noEmployment")}
                  </p>
                ) : (
                  <Timeline>
                    {application.applicant.employmentHistory.map(
                      (employment, index) => (
                        <TimelineItem
                          key={`${
                            employment.company_name || "employment"
                          }-${index}`}
                          title={employment.company_name || "-"}
                          subtitle={employment.employment_type || "-"}
                          period={`${formatDate(
                            employment.start_date,
                            locale,
                          )} - ${
                            employment.end_date
                              ? formatDate(employment.end_date, locale)
                              : t("details.present")
                          }`}
                        />
                      ),
                    )}
                  </Timeline>
                )}
              </Section>
            </div>

            {/* RESUME */}

            <Section
              icon={FileText}
              title={t("details.professionalResume")}
              accent="amber"
            >
              <div className="flex flex-col gap-4 rounded-xl bg-[linear-gradient(120deg,#fffbeb_0%,#ffffff_70%)] p-4 ring-1 ring-inset ring-amber-200 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-950">
                    {t("details.frozenResume")}
                  </p>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
                    {t("details.frozenResumeDescription")}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={
                    !application.applicant.resumeAvailable || isOpeningResume
                  }
                  onClick={() => void handleViewResume()}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isOpeningResume ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}

                  {isOpeningResume
                    ? t("details.opening")
                    : application.applicant.resumeAvailable
                      ? t("details.viewResume")
                      : t("details.resumeUnavailable")}
                </button>
              </div>
            </Section>

            {/* COVER LETTER */}

            {application.coverLetter && (
              <Section
                icon={MessageSquareText}
                title={t("details.coverLetter")}
                accent="rose"
              >
                <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 ring-1 ring-inset ring-slate-200">
                  {application.coverLetter}
                </p>
              </Section>
            )}

            {/* STAFF SCREENING */}

            <Section
              icon={ShieldCheck}
              title={t("details.staffScreening")}
              accent="teal"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Info
                  label={t("details.screenedBy")}
                  value={application.screening.screenedByStaffId || "-"}
                />

                <Info
                  label={t("details.screenedAt")}
                  value={formatDateTime(
                    application.screening.screenedAt,
                    locale,
                  )}
                />
              </div>

              {application.screening.note && (
                <div className="mt-3 rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {t("details.screeningNote")}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">
                    {application.screening.note}
                  </p>
                </div>
              )}

              <div className="mt-3 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-700 ring-1 ring-inset ring-blue-200">
                {t("details.permissionNotice")}
              </div>
            </Section>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex shrink-0 flex-col-reverse gap-2 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[inset_0_1px_0_0_#e2e8f0] sm:flex-row sm:justify-end sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            className={secondaryButton}
          >
            {t("details.close")}
          </button>

          {canScreen && (
            <button
              type="button"
              onClick={() => onScreen(application)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              {notScreened ? (
                <ClipboardCheck className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}

              {notScreened ? t("actions.screen") : t("actions.editScreening")}
            </button>
          )}

          {canDecide && (
            <button
              type="button"
              onClick={() => onDecision(application)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <Gavel className="h-4 w-4" />

              {t("actions.decide")}
            </button>
          )}
        </div>
      </div>
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
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: ComponentType<{ className?: string }>;

  title: string;

  accent: keyof typeof sectionAccents;

  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset ${sectionAccents[accent]}`}
        >
          <Icon className="h-4 w-4" />
        </span>

        <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
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
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3.5 ring-1 ring-inset ring-slate-200/70">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}