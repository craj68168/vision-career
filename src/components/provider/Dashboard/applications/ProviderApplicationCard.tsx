"use client";

import { type ReactNode, useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import {
  Briefcase,
  CalendarDays,
  Clock3,
  Eye,
  FileText,
  GraduationCap,
  Languages,
  Link2,
  Loader2,
  Pencil,
  UserRound,
  Video,
  X,
} from "lucide-react";

import {
  getProviderApplicationById,
  getProviderApplicationResume,
  getProviderInterviews,
  updateProviderApplicationStatus,
} from "./api";

import ScheduleInterviewModal from "./ScheduleInterviewModal";

import type {
  ProviderApplication,
  ProviderApplicationDecisionStatus,
  ProviderApplicationStatus,
  ProviderInterview,
  ProviderInterviewMethod,
  ProviderInterviewStatus,
} from "./types";
import type { ProviderDashboardApiError } from "../types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  application: ProviderApplication;

  lang: string;
};

// ======================================================
// ERROR
// ======================================================

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ProviderDashboardApiError>(error)) {
    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

// ======================================================
// DATE
// ======================================================

const formatDate = (value?: string | null) => {
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
// SALARY
// ======================================================

const formatSalary = (value?: number | null) => {
  if (value === null || value === undefined) {
    return "-";
  }

  return new Intl.NumberFormat("en-US").format(value);
};

// ======================================================
// APPLICATION STATUS LABEL
// ======================================================

const APPLICATION_STATUS_KEYS: Record<ProviderApplicationStatus, string> = {
  SENT_TO_PROVIDER: "statuses.sentToProvider",
  UNDER_REVIEW: "statuses.underReview",
  INTERVIEW: "statuses.interview",
  SELECTED: "statuses.selected",
  HIRED: "statuses.hired",
  REJECTED: "statuses.rejected",
};

// ======================================================
// DECISION LABEL
// ======================================================

const DECISION_KEYS: Record<ProviderApplicationDecisionStatus, string> = {
  UNDER_REVIEW: "actions.startReview",
  INTERVIEW: "actions.moveToInterview",
  SELECTED: "actions.markSelected",
  HIRED: "actions.markHired",
  REJECTED: "actions.reject",
};

// ======================================================
// NEXT STATUS
// ======================================================
//
// IMPORTANT:
//
// UNDER_REVIEW → INTERVIEW is intentionally NOT returned.
//
// Interview must be created through:
// POST /providers/interviews
//
// That API creates the schedule and moves the application
// to INTERVIEW.
//
// ======================================================

const getNextStatuses = (
  status: ProviderApplicationStatus,
): ProviderApplicationDecisionStatus[] => {
  switch (status) {
    case "SENT_TO_PROVIDER":
      return ["UNDER_REVIEW", "REJECTED"];

    case "UNDER_REVIEW":
      return ["REJECTED"];

    case "INTERVIEW":
      return ["SELECTED", "REJECTED"];

    case "SELECTED":
      return ["HIRED", "REJECTED"];

    default:
      return [];
  }
};

// ======================================================
// INTERVIEW METHOD LABEL
// ======================================================

const INTERVIEW_METHOD_KEYS: Record<ProviderInterviewMethod, string> = {
  ZOOM: "methods.zoom",
  GOOGLE_MEET: "methods.googleMeet",
  PHONE: "methods.phone",
  FACE_TO_FACE: "methods.faceToFace",
  OTHER: "methods.other",
};

// ======================================================
// INTERVIEW STATUS LABEL
// ======================================================

const INTERVIEW_STATUS_KEYS: Record<ProviderInterviewStatus, string> = {
  AWAITING_LINK: "interviewStatuses.awaitingLink",
  CONFIRMED: "interviewStatuses.confirmed",
  COMPLETED: "interviewStatuses.completed",
  CANCELLED: "interviewStatuses.cancelled",
};

// ======================================================
// COMPONENT
// ======================================================

export default function ProviderApplicationCard({ application, lang }: Props) {
  const t = useTranslations("provider.applications.card");
  const [cardApplication, setCardApplication] =
    useState<ProviderApplication>(application);

  const [details, setDetails] = useState<ProviderApplication | null>(null);

  const [interview, setInterview] = useState<ProviderInterview | null>(null);

  const [open, setOpen] = useState(false);

  const [scheduleOpen, setScheduleOpen] = useState(false);

  const [loadingDetails, setLoadingDetails] = useState(false);

  const [loadingInterview, setLoadingInterview] = useState(false);

  const [loadingResume, setLoadingResume] = useState(false);

  const [updatingStatus, setUpdatingStatus] =
    useState<ProviderApplicationDecisionStatus | null>(null);

  // ====================================================
  // SYNC
  // ====================================================

  useEffect(() => {
    setCardApplication(application);

    if (details?.application_id === application.application_id) {
      setDetails((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,

          ...application,
        };
      });
    }
  }, [application, details?.application_id]);

  // ====================================================
  // LOAD INTERVIEW
  // ====================================================

  const loadInterview = async (applicationId: string) => {
    try {
      setLoadingInterview(true);

      const response = await getProviderInterviews();

      const found =
        response.data.find((item) => item.applicationId === applicationId) ||
        null;

      setInterview(found);

      return found;
    } catch (error) {
      console.error("Load interview error:", error);

      setInterview(null);

      return null;
    } finally {
      setLoadingInterview(false);
    }
  };

  // ====================================================
  // OPEN DETAILS
  // ====================================================

  const openDetails = async () => {
    setOpen(true);

    setLoadingDetails(true);

    try {
      const response = await getProviderApplicationById(
        cardApplication.application_id,
      );

      setDetails(response.data);

      if (response.data.status === "INTERVIEW") {
        await loadInterview(response.data.application_id);
      } else {
        setInterview(null);
      }
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          t("toast.loadDetailsFailed"),
        ),
      );

      setOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  // ====================================================
  // CLOSE DETAILS
  // ====================================================

  const closeDetails = () => {
    if (updatingStatus || loadingResume || scheduleOpen) {
      return;
    }

    setOpen(false);

    setDetails(null);

    setInterview(null);
  };

  // ====================================================
  // VIEW FROZEN RESUME
  // ====================================================

  const viewResume = async () => {
    const current = details || cardApplication;

    if (!current.resume_available) {
      toast.error(t("toast.resumeUnavailable"));

      return;
    }

    const previewWindow = window.open("", "_blank");

    if (!previewWindow) {
      toast.error(t("toast.allowPopups"));

      return;
    }

    previewWindow.opener = null;

    try {
      setLoadingResume(true);

      const blob = await getProviderApplicationResume(current.application_id);

      const objectUrl = URL.createObjectURL(blob);

      previewWindow.location.href = objectUrl;

      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 60_000);
    } catch (error) {
      previewWindow.close();

      toast.error(
        getErrorMessage(
          error,
          t("toast.openResumeFailed"),
        ),
      );
    } finally {
      setLoadingResume(false);
    }
  };

  // ====================================================
  // UPDATE APPLICATION STATUS
  // ====================================================

  const updateStatus = async (status: ProviderApplicationDecisionStatus) => {
    const current = details || cardApplication;

    // INTERVIEW must use scheduling.
    if (status === "INTERVIEW") {
      setScheduleOpen(true);

      return;
    }

    if (status === "REJECTED") {
      const confirmed = window.confirm(t("confirmReject"));

      if (!confirmed) {
        return;
      }
    }

    try {
      setUpdatingStatus(status);

      const response = await updateProviderApplicationStatus(
        current.application_id,
        {
          status,
        },
      );

      setDetails(response.data);

      setCardApplication(response.data);

      toast.success(t("toast.statusUpdated"));
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          t("toast.statusUpdateFailed"),
        ),
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  // ====================================================
  // INTERVIEW SUCCESS
  // ====================================================

  const handleInterviewSuccess = async (savedInterview: ProviderInterview) => {
    setInterview(savedInterview);

    setScheduleOpen(false);

    try {
      const response = await getProviderApplicationById(
        cardApplication.application_id,
      );

      setDetails(response.data);

      setCardApplication(response.data);
    } catch (error) {
      console.error("Refresh application after interview error:", error);

      setCardApplication((current) => ({
        ...current,

        status: "INTERVIEW",
      }));

      setDetails((current) =>
        current
          ? {
              ...current,

              status: "INTERVIEW",
            }
          : current,
      );
    }
  };

  const current = details || cardApplication;

  // ====================================================
  // UI
  // ====================================================

  return (
    <>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-400">
              {cardApplication.application_id}
            </p>

            <h3 className="mt-1 text-xl font-semibold text-slate-900">
              {cardApplication.vacancy?.title || cardApplication.vacancy_id}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {cardApplication.vacancy?.companyName || "-"}
            </p>
          </div>

          <ApplicationStatusBadge status={cardApplication.status} t={t} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryField
            label={t("fields.candidate")}
            value={cardApplication.applicant?.name}
          />

          <SummaryField
            label={t("fields.nationality")}
            value={cardApplication.applicant?.nationality}
          />

          <SummaryField
            label={t("fields.japanese")}
            value={cardApplication.applicant?.japanese_level}
          />

          <SummaryField
            label={t("fields.applied")}
            value={formatDate(cardApplication.applied_at)}
          />
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={() => void openDetails()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Eye className="h-4 w-4" />

            {t("viewDetails")}
          </button>
        </div>
      </article>

      {/* ================================================= */}
      {/* DETAILS MODAL */}
      {/* ================================================= */}

      {open && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <button
            type="button"
            className="absolute inset-0"
            aria-label={t("closeDetails")}
            onClick={closeDetails}
          />

          <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* HEADER */}

            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 md:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  {t("title")}
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-950">
                  {current.applicant?.name || "-"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {current.application_id}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ApplicationStatusBadge status={current.status} t={t} />

                <button
                  type="button"
                  onClick={closeDetails}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* BODY */}

            <div className="overflow-y-auto px-6 py-6 md:px-8">
              {loadingDetails ? (
                <div className="flex min-h-[380px] items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />

                    <p className="mt-3 text-sm text-slate-500">
                      {t("loadingDetails")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* VACANCY */}

                  <DetailsSection
                    icon={<Briefcase className="h-5 w-5" />}
                    title={t("sections.vacancy")}
                  >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <InfoField
                        label={t("fields.position")}
                        value={current.vacancy?.title}
                      />

                      <InfoField
                        label={t("fields.company")}
                        value={current.vacancy?.companyName}
                      />

                      <InfoField
                        label={t("fields.employment")}
                        value={current.vacancy?.employmentType}
                      />

                      <InfoField
                        label={t("fields.location")}
                        value={current.vacancy?.workLocation}
                      />

                      <InfoField
                        label={t("fields.requiredJapanese")}
                        value={current.vacancy?.japaneseLevel}
                      />

                      <InfoField
                        label={t("fields.openings")}
                        value={
                          current.vacancy?.numberOfPeople !== undefined
                            ? String(current.vacancy.numberOfPeople)
                            : "-"
                        }
                      />

                      <InfoField
                        label={t("fields.salaryMin")}
                        value={
                          current.vacancy?.salaryMin !== null &&
                          current.vacancy?.salaryMin !== undefined
                            ? formatSalary(current.vacancy.salaryMin)
                            : "-"
                        }
                      />

                      <InfoField
                        label={t("fields.salaryMax")}
                        value={
                          current.vacancy?.salaryMax !== null &&
                          current.vacancy?.salaryMax !== undefined
                            ? formatSalary(current.vacancy.salaryMax)
                            : "-"
                        }
                      />

                      <InfoField
                        label={t("fields.applied")}
                        value={formatDate(current.applied_at)}
                      />
                    </div>
                  </DetailsSection>

                  {/* CANDIDATE */}

                  <DetailsSection
                    icon={<UserRound className="h-5 w-5" />}
                    title={t("sections.candidateProfile")}
                  >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <InfoField
                        label={t("fields.name")}
                        value={current.applicant?.name}
                      />

                      <InfoField
                        label={t("fields.nationality")}
                        value={current.applicant?.nationality}
                      />

                      <InfoField
                        label={t("fields.visa")}
                        value={current.applicant?.visa_type}
                      />

                      <InfoField
                        label={t("fields.visaExpiry")}
                        value={formatDate(current.applicant?.visa_expiry_date)}
                      />

                      <InfoField
                        label={t("fields.japanese")}
                        value={current.applicant?.japanese_level}
                      />

                      <InfoField
                        label={t("fields.desiredJob")}
                        value={current.applicant?.desired_job}
                      />

                      <InfoField
                        label={t("fields.desiredLocation")}
                        value={current.applicant?.desired_location}
                      />
                    </div>

                    <div className="mt-5">
                      <p className="text-sm font-semibold text-slate-900">
                        {t("sections.skills")}
                      </p>

                      {current.applicant?.skills?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {current.applicant.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-slate-500">-</p>
                      )}
                    </div>
                  </DetailsSection>

                  {/* EDUCATION / EMPLOYMENT */}

                  <div className="grid gap-6 lg:grid-cols-2">
                    <DetailsSection
                      icon={<GraduationCap className="h-5 w-5" />}
                      title={t("sections.education")}
                    >
                      {current.applicant?.education?.length ? (
                        <div className="space-y-3">
                          {current.applicant.education.map(
                            (education, index) => (
                              <div
                                key={`${education.school || "education"}-${index}`}
                                className="rounded-2xl bg-slate-50 p-4"
                              >
                                <p className="font-semibold text-slate-900">
                                  {education.school || "-"}
                                </p>

                                <p className="mt-1 text-sm text-slate-600">
                                  {education.major ||
                                    education.school_type ||
                                    "-"}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {formatDate(education.enrollment_date)}

                                  {" - "}

                                  {formatDate(education.graduation_date)}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">-</p>
                      )}
                    </DetailsSection>

                    <DetailsSection
                      icon={<Briefcase className="h-5 w-5" />}
                      title={t("sections.employmentHistory")}
                    >
                      {current.applicant?.employment_history?.length ? (
                        <div className="space-y-3">
                          {current.applicant.employment_history.map(
                            (employment, index) => (
                              <div
                                key={`${employment.company_name || "employment"}-${index}`}
                                className="rounded-2xl bg-slate-50 p-4"
                              >
                                <p className="font-semibold text-slate-900">
                                  {employment.company_name || "-"}
                                </p>

                                <p className="mt-1 text-sm text-slate-600">
                                  {employment.employment_type || "-"}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {formatDate(employment.start_date)}

                                  {" - "}

                                  {employment.end_date
                                    ? formatDate(employment.end_date)
                                    : t("present")}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">-</p>
                      )}
                    </DetailsSection>
                  </div>

                  {/* FROZEN RESUME */}

                  <DetailsSection
                    icon={<FileText className="h-5 w-5" />}
                    title={t("sections.resume")}
                  >
                    <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {t("resume.title")}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {t("resume.description")}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={!current.resume_available || loadingResume}
                        onClick={() => void viewResume()}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {loadingResume ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}

                        {loadingResume ? t("opening") : t("viewResume")}
                      </button>
                    </div>
                  </DetailsSection>

                  {/* INTERVIEW */}

                  {current.status === "INTERVIEW" && (
                    <DetailsSection
                      icon={<CalendarDays className="h-5 w-5" />}
                      title={t("sections.interview")}
                    >
                      {loadingInterview ? (
                        <div className="flex min-h-28 items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                        </div>
                      ) : interview ? (
                        <div className="space-y-5">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <InterviewStatusBadge
                                status={interview.status}
                                t={t}
                              />

                              <p className="mt-3 text-sm text-slate-500">
                                {interview.interviewId}
                              </p>
                            </div>

                            {interview.status !== "COMPLETED" &&
                              interview.status !== "CANCELLED" && (
                                <button
                                  type="button"
                                  onClick={() => setScheduleOpen(true)}
                                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                                >
                                  <Pencil className="h-4 w-4" />

                                  {t("editSchedule")}
                                </button>
                              )}
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <InfoField
                              label={t("interview.date")}
                              value={formatDate(interview.interviewDate)}
                            />

                            <InfoField
                              label={t("interview.time")}
                              value={interview.interviewTime}
                            />

                            <InfoField
                              label={t("interview.timezone")}
                              value={interview.timezone}
                            />

                            <InfoField
                              label={t("interview.method")}
                              value={t(INTERVIEW_METHOD_KEYS[interview.interviewMethod])}
                            />
                          </div>

                          {interview.meetingLink && (
                            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900">
                                <Link2 className="h-4 w-4" />

                                {t("interview.meetingLink")}
                              </div>

                              <a
                                href={interview.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 block break-all text-sm font-medium text-indigo-600 underline"
                              >
                                {interview.meetingLink}
                              </a>
                            </div>
                          )}

                          {interview.status === "AWAITING_LINK" && (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-700">
                              {t("interview.awaitingLinkNotice")}
                            </div>
                          )}

                          {interview.notes && (
                            <div className="rounded-2xl bg-slate-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {t("interview.notes")}
                              </p>

                              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                {interview.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                          {t("interview.notFound")}
                        </div>
                      )}
                    </DetailsSection>
                  )}

                  {/* APPLICATION STATUS */}

                  <DetailsSection
                    icon={<Languages className="h-5 w-5" />}
                    title={t("sections.applicationStatus")}
                  >
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            {t("currentStatus")}
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            {t(APPLICATION_STATUS_KEYS[current.status])}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {/* Schedule Interview */}

                          {current.status === "UNDER_REVIEW" && (
                            <button
                              type="button"
                              disabled={Boolean(updatingStatus)}
                              onClick={() => setScheduleOpen(true)}
                              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
                            >
                              <Video className="h-4 w-4" />

                              {t("scheduleInterview")}
                            </button>
                          )}

                          {getNextStatuses(current.status).map((nextStatus) => (
                            <button
                              key={nextStatus}
                              type="button"
                              disabled={Boolean(updatingStatus)}
                              onClick={() => void updateStatus(nextStatus)}
                              className={
                                nextStatus === "REJECTED"
                                  ? "rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                  : "rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                              }
                            >
                              {updatingStatus === nextStatus ? t("updating") : t(DECISION_KEYS[nextStatus])}
                            </button>
                          ))}
                        </div>
                      </div>

                      {current.status === "UNDER_REVIEW" && (
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                          {t("interviewRequiredNotice")}
                        </p>
                      )}

                      {getNextStatuses(current.status).length === 0 &&
                        current.status !== "UNDER_REVIEW" &&
                        current.status !== "INTERVIEW" && (
                          <p className="mt-3 text-sm text-slate-500">
                            {t("finalStatusNotice")}
                          </p>
                        )}
                    </div>
                  </DetailsSection>
                </div>
              )}
            </div>

            {/* FOOTER */}

            <div className="flex justify-end border-t border-slate-200 px-6 py-4 md:px-8">
              <button
                type="button"
                onClick={closeDetails}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* SCHEDULE / EDIT INTERVIEW */}
      {/* ================================================= */}

      <ScheduleInterviewModal
        open={scheduleOpen}
        application={current}
        interview={current.status === "INTERVIEW" ? interview : null}
        lang={lang}
        onClose={() => setScheduleOpen(false)}
        onSuccess={handleInterviewSuccess}
      />
    </>
  );
}

// ======================================================
// SUMMARY FIELD
// ======================================================

function SummaryField({
  label,
  value,
}: {
  label: string;

  value?: string | null;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}

// ======================================================
// INFO FIELD
// ======================================================

function InfoField({
  label,
  value,
}: {
  label: string;

  value?: string | null;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}

// ======================================================
// SECTION
// ======================================================

function DetailsSection({
  icon,
  title,
  children,
}: {
  icon: ReactNode;

  title: string;

  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 p-5">
      <div className="mb-4 flex items-center gap-2 text-slate-900">
        <span className="text-indigo-600">{icon}</span>

        <h3 className="font-semibold">{title}</h3>
      </div>

      {children}
    </section>
  );
}

// ======================================================
// APPLICATION STATUS BADGE
// ======================================================

function ApplicationStatusBadge({
  status,
  t,
}: {
  status: ProviderApplicationStatus;

  t: ReturnType<typeof useTranslations>;
}) {
  let classes = "bg-slate-100 text-slate-700";

  if (status === "SENT_TO_PROVIDER") {
    classes = "bg-blue-50 text-blue-700";
  }

  if (status === "UNDER_REVIEW") {
    classes = "bg-amber-50 text-amber-700";
  }

  if (status === "INTERVIEW") {
    classes = "bg-violet-50 text-violet-700";
  }

  if (status === "SELECTED") {
    classes = "bg-indigo-50 text-indigo-700";
  }

  if (status === "HIRED") {
    classes = "bg-emerald-50 text-emerald-700";
  }

  if (status === "REJECTED") {
    classes = "bg-red-50 text-red-700";
  }

  return (
    <span
      className={`h-fit rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {t(APPLICATION_STATUS_KEYS[status])}
    </span>
  );
}

// ======================================================
// INTERVIEW STATUS BADGE
// ======================================================

function InterviewStatusBadge({
  status,
  t,
}: {
  status: ProviderInterviewStatus;

  t: ReturnType<typeof useTranslations>;
}) {
  let classes = "bg-slate-100 text-slate-700";

  if (status === "AWAITING_LINK") {
    classes = "bg-amber-50 text-amber-700";
  }

  if (status === "CONFIRMED") {
    classes = "bg-emerald-50 text-emerald-700";
  }

  if (status === "COMPLETED") {
    classes = "bg-blue-50 text-blue-700";
  }

  if (status === "CANCELLED") {
    classes = "bg-red-50 text-red-700";
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {t(INTERVIEW_STATUS_KEYS[status])}
    </span>
  );
}
