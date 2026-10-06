"use client";

import { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useLocale, useTranslations } from "next-intl";

import {
  BriefcaseBusiness,
  Eye,
  FileText,
  GraduationCap,
  Loader2,
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
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      {/* BACKDROP */}

      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label={t("details.close")}
      />

      {/* MODAL */}

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              {t("details.eyebrow")}
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {application.applicant.name || t("details.applicantFallback")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {application.applicationId}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("details.close")}
            className="rounded-full p-2 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ================================================= */}
        {/* SCROLLABLE CONTENT */}
        {/* ================================================= */}

        <div className="overflow-y-auto">
          <div className="space-y-6 p-6">
            {/* STATUS */}

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getApplicationStatusClass(
                  application.status,
                )}`}
              >
                {t(`statuses.${application.status}`)}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getScreeningClass(
                  application.screening.status,
                )}`}
              >
                {t(`screeningStatuses.${application.screening.status}`)}
              </span>
            </div>

            {/* VACANCY */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="h-5 w-5 text-indigo-600" />

                <h3 className="font-semibold">{t("details.vacancy")}</h3>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            </section>

            {/* CANDIDATE */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold">{t("details.candidateProfile")}</h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                <p className="text-sm font-semibold">{t("details.skills")}</p>

                {application.applicant.skills.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {application.applicant.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs"
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
            </section>

            {/* EDUCATION */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-600" />

                <h3 className="font-semibold">{t("details.education")}</h3>
              </div>

              {application.applicant.education.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  {t("details.noEducation")}
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {application.applicant.education.map((education, index) => (
                    <div
                      key={`${education.school || "education"}-${index}`}
                      className="rounded-xl bg-slate-50 p-4"
                    >
                      <p className="font-semibold">{education.school || "-"}</p>

                      <p className="mt-1 text-sm text-slate-500">
                        {education.major || education.school_type || "-"}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {formatDate(education.enrollment_date, locale)}

                        {" - "}

                        {formatDate(education.graduation_date, locale)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* EMPLOYMENT */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold">
                {t("details.employmentHistory")}
              </h3>

              {application.applicant.employmentHistory.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  {t("details.noEmployment")}
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {application.applicant.employmentHistory.map(
                    (employment, index) => (
                      <div
                        key={`${
                          employment.company_name || "employment"
                        }-${index}`}
                        className="rounded-xl bg-slate-50 p-4"
                      >
                        <p className="font-semibold">
                          {employment.company_name || "-"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {employment.employment_type || "-"}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {formatDate(employment.start_date, locale)}

                          {" - "}

                          {employment.end_date
                            ? formatDate(employment.end_date, locale)
                            : t("details.present")}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              )}
            </section>

            {/* RESUME */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />

                <h3 className="font-semibold">
                  {t("details.professionalResume")}
                </h3>
              </div>

              <div className="mt-4 flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {t("details.frozenResume")}
                  </p>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                    {t("details.frozenResumeDescription")}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={
                    !application.applicant.resumeAvailable || isOpeningResume
                  }
                  onClick={() => void handleViewResume()}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
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
            </section>

            {/* COVER LETTER */}

            {application.coverLetter && (
              <section className="rounded-2xl border border-slate-200 p-5">
                <h3 className="font-semibold">{t("details.coverLetter")}</h3>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {application.coverLetter}
                </p>
              </section>
            )}

            {/* STAFF SCREENING */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold">{t("details.staffScreening")}</h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    {t("details.screeningNote")}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    {application.screening.note}
                  </p>
                </div>
              )}

              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-700">
                {t("details.permissionNotice")}
              </div>
            </section>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-slate-200 bg-white p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5"
          >
            {t("details.close")}
          </button>

          {canScreen && (
            <button
              type="button"
              onClick={() => onScreen(application)}
              className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white"
            >
              {application.screening.status === "NOT_SCREENED"
                ? t("actions.screen")
                : t("actions.editScreening")}
            </button>
          )}

          {canDecide && (
            <button
              type="button"
              onClick={() => onDecision(application)}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
            >
              {t("actions.decide")}
            </button>
          )}
        </div>
      </div>
    </div>
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
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 break-words font-semibold">{value}</p>
    </div>
  );
}
