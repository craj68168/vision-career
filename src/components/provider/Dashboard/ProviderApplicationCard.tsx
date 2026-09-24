"use client";

import { type ReactNode, useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

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
  ApiErrorResponse,
  ProviderApplication,
  ProviderApplicationDecisionStatus,
  ProviderApplicationStatus,
  ProviderInterview,
  ProviderInterviewMethod,
  ProviderInterviewStatus,
} from "./types";

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
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
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

const statusLabel = (status: ProviderApplicationStatus, lang: string) => {
  const labels: Record<
    ProviderApplicationStatus,
    {
      en: string;

      ja: string;
    }
  > = {
    SENT_TO_PROVIDER: {
      en: "Sent To Provider",

      ja: "企業へ送信済み",
    },

    UNDER_REVIEW: {
      en: "Under Review",

      ja: "選考中",
    },

    INTERVIEW: {
      en: "Interview",

      ja: "面接",
    },

    SELECTED: {
      en: "Selected",

      ja: "選考通過",
    },

    HIRED: {
      en: "Hired",

      ja: "採用",
    },

    REJECTED: {
      en: "Rejected",

      ja: "不採用",
    },
  };

  return lang === "ja" ? labels[status].ja : labels[status].en;
};

// ======================================================
// DECISION LABEL
// ======================================================

const decisionLabel = (
  status: ProviderApplicationDecisionStatus,
  lang: string,
) => {
  const labels: Record<
    ProviderApplicationDecisionStatus,
    {
      en: string;

      ja: string;
    }
  > = {
    UNDER_REVIEW: {
      en: "Start Review",

      ja: "選考開始",
    },

    INTERVIEW: {
      en: "Move to Interview",

      ja: "面接へ進む",
    },

    SELECTED: {
      en: "Mark Selected",

      ja: "選考通過",
    },

    HIRED: {
      en: "Mark Hired",

      ja: "採用にする",
    },

    REJECTED: {
      en: "Reject",

      ja: "不採用",
    },
  };

  return lang === "ja" ? labels[status].ja : labels[status].en;
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

const interviewMethodLabel = (
  method: ProviderInterviewMethod,
  lang: string,
) => {
  const labels: Record<
    ProviderInterviewMethod,
    {
      en: string;

      ja: string;
    }
  > = {
    ZOOM: {
      en: "Zoom",

      ja: "Zoom",
    },

    GOOGLE_MEET: {
      en: "Google Meet",

      ja: "Google Meet",
    },

    PHONE: {
      en: "Phone",

      ja: "電話",
    },

    FACE_TO_FACE: {
      en: "Face-to-Face",

      ja: "対面",
    },

    OTHER: {
      en: "Other",

      ja: "その他",
    },
  };

  return lang === "ja" ? labels[method].ja : labels[method].en;
};

// ======================================================
// INTERVIEW STATUS LABEL
// ======================================================

const interviewStatusLabel = (
  status: ProviderInterviewStatus,
  lang: string,
) => {
  const labels: Record<
    ProviderInterviewStatus,
    {
      en: string;

      ja: string;
    }
  > = {
    AWAITING_LINK: {
      en: "Awaiting Meeting Link",

      ja: "リンク待ち",
    },

    CONFIRMED: {
      en: "Confirmed",

      ja: "確定",
    },

    COMPLETED: {
      en: "Completed",

      ja: "完了",
    },

    CANCELLED: {
      en: "Cancelled",

      ja: "キャンセル",
    },
  };

  return lang === "ja" ? labels[status].ja : labels[status].en;
};

// ======================================================
// COMPONENT
// ======================================================

export default function ProviderApplicationCard({ application, lang }: Props) {
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
          lang === "ja"
            ? "応募詳細の読み込みに失敗しました。"
            : "Failed to load application details.",
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
      toast.error(
        lang === "ja"
          ? "この応募には履歴書がありません。"
          : "No resume is available for this application.",
      );

      return;
    }

    const previewWindow = window.open("", "_blank");

    if (!previewWindow) {
      toast.error(
        lang === "ja"
          ? "履歴書を開くにはポップアップを許可してください。"
          : "Please allow pop-ups to open the resume.",
      );

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
          lang === "ja"
            ? "履歴書を開けませんでした。"
            : "Failed to open application resume.",
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
      const confirmed = window.confirm(
        lang === "ja"
          ? "この応募を不採用にしますか？"
          : "Reject this application? This will complete the application as rejected.",
      );

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

      toast.success(
        lang === "ja"
          ? "応募ステータスを更新しました。"
          : "Application status updated.",
      );
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          lang === "ja"
            ? "応募ステータスの更新に失敗しました。"
            : "Failed to update application status.",
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

          <ApplicationStatusBadge status={cardApplication.status} lang={lang} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryField
            label={lang === "ja" ? "候補者" : "Candidate"}
            value={cardApplication.applicant?.name}
          />

          <SummaryField
            label={lang === "ja" ? "国籍" : "Nationality"}
            value={cardApplication.applicant?.nationality}
          />

          <SummaryField
            label={lang === "ja" ? "日本語" : "Japanese"}
            value={cardApplication.applicant?.japanese_level}
          />

          <SummaryField
            label={lang === "ja" ? "応募日" : "Applied"}
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

            {lang === "ja" ? "詳細を見る" : "View Details"}
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
            aria-label="Close application details"
            onClick={closeDetails}
          />

          <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* HEADER */}

            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 md:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  {lang === "ja" ? "応募詳細" : "Application Details"}
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-950">
                  {current.applicant?.name || "-"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {current.application_id}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ApplicationStatusBadge status={current.status} lang={lang} />

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
                      {lang === "ja"
                        ? "応募詳細を読み込み中..."
                        : "Loading application details..."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* VACANCY */}

                  <DetailsSection
                    icon={<Briefcase className="h-5 w-5" />}
                    title={lang === "ja" ? "求人情報" : "Vacancy"}
                  >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <InfoField
                        label={lang === "ja" ? "職種" : "Position"}
                        value={current.vacancy?.title}
                      />

                      <InfoField
                        label={lang === "ja" ? "会社" : "Company"}
                        value={current.vacancy?.companyName}
                      />

                      <InfoField
                        label={lang === "ja" ? "雇用形態" : "Employment"}
                        value={current.vacancy?.employmentType}
                      />

                      <InfoField
                        label={lang === "ja" ? "勤務地" : "Location"}
                        value={current.vacancy?.workLocation}
                      />

                      <InfoField
                        label={
                          lang === "ja" ? "日本語要件" : "Required Japanese"
                        }
                        value={current.vacancy?.japaneseLevel}
                      />

                      <InfoField
                        label={lang === "ja" ? "募集人数" : "Openings"}
                        value={
                          current.vacancy?.numberOfPeople !== undefined
                            ? String(current.vacancy.numberOfPeople)
                            : "-"
                        }
                      />

                      <InfoField
                        label={lang === "ja" ? "最低給与" : "Salary Min"}
                        value={
                          current.vacancy?.salaryMin !== null &&
                          current.vacancy?.salaryMin !== undefined
                            ? formatSalary(current.vacancy.salaryMin)
                            : "-"
                        }
                      />

                      <InfoField
                        label={lang === "ja" ? "最高給与" : "Salary Max"}
                        value={
                          current.vacancy?.salaryMax !== null &&
                          current.vacancy?.salaryMax !== undefined
                            ? formatSalary(current.vacancy.salaryMax)
                            : "-"
                        }
                      />

                      <InfoField
                        label={lang === "ja" ? "応募日" : "Applied"}
                        value={formatDate(current.applied_at)}
                      />
                    </div>
                  </DetailsSection>

                  {/* CANDIDATE */}

                  <DetailsSection
                    icon={<UserRound className="h-5 w-5" />}
                    title={
                      lang === "ja" ? "候補者プロフィール" : "Candidate Profile"
                    }
                  >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <InfoField
                        label={lang === "ja" ? "氏名" : "Name"}
                        value={current.applicant?.name}
                      />

                      <InfoField
                        label={lang === "ja" ? "国籍" : "Nationality"}
                        value={current.applicant?.nationality}
                      />

                      <InfoField
                        label={lang === "ja" ? "在留資格" : "Visa"}
                        value={current.applicant?.visa_type}
                      />

                      <InfoField
                        label={lang === "ja" ? "在留期限" : "Visa Expiry"}
                        value={formatDate(current.applicant?.visa_expiry_date)}
                      />

                      <InfoField
                        label={lang === "ja" ? "日本語" : "Japanese"}
                        value={current.applicant?.japanese_level}
                      />

                      <InfoField
                        label={lang === "ja" ? "希望職種" : "Desired Job"}
                        value={current.applicant?.desired_job}
                      />

                      <InfoField
                        label={
                          lang === "ja" ? "希望勤務地" : "Desired Location"
                        }
                        value={current.applicant?.desired_location}
                      />
                    </div>

                    <div className="mt-5">
                      <p className="text-sm font-semibold text-slate-900">
                        {lang === "ja" ? "スキル" : "Skills"}
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
                      title={lang === "ja" ? "学歴" : "Education"}
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
                      title={lang === "ja" ? "職歴" : "Employment History"}
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
                                    : lang === "ja"
                                      ? "現在"
                                      : "Present"}
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
                    title={
                      lang === "ja" ? "応募時の履歴書" : "Professional Resume"
                    }
                  >
                    <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {lang === "ja"
                            ? "応募時に保存された履歴書"
                            : "Frozen application resume"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {lang === "ja"
                            ? "応募時点の候補者情報を保存した履歴書です。"
                            : "This resume preserves the candidate information from the time of application."}
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

                        {loadingResume
                          ? lang === "ja"
                            ? "開いています..."
                            : "Opening..."
                          : lang === "ja"
                            ? "履歴書を見る"
                            : "View Resume"}
                      </button>
                    </div>
                  </DetailsSection>

                  {/* INTERVIEW */}

                  {current.status === "INTERVIEW" && (
                    <DetailsSection
                      icon={<CalendarDays className="h-5 w-5" />}
                      title={lang === "ja" ? "面接情報" : "Interview Schedule"}
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
                                lang={lang}
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

                                  {lang === "ja"
                                    ? "面接情報を編集"
                                    : "Edit Schedule"}
                                </button>
                              )}
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <InfoField
                              label={lang === "ja" ? "面接日" : "Date"}
                              value={formatDate(interview.interviewDate)}
                            />

                            <InfoField
                              label={lang === "ja" ? "時間" : "Time"}
                              value={interview.interviewTime}
                            />

                            <InfoField
                              label={
                                lang === "ja" ? "タイムゾーン" : "Timezone"
                              }
                              value={interview.timezone}
                            />

                            <InfoField
                              label={lang === "ja" ? "面接方法" : "Method"}
                              value={interviewMethodLabel(
                                interview.interviewMethod,
                                lang,
                              )}
                            />
                          </div>

                          {interview.meetingLink && (
                            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900">
                                <Link2 className="h-4 w-4" />

                                {lang === "ja"
                                  ? "ミーティングリンク"
                                  : "Meeting Link"}
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
                              {lang === "ja"
                                ? "オンライン面接のリンクがまだ登録されていません。リンクを追加すると面接が確定し、候補者へ通知されます。"
                                : "The online meeting link has not been added yet. Add the link to confirm the interview and notify the candidate."}
                            </div>
                          )}

                          {interview.notes && (
                            <div className="rounded-2xl bg-slate-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {lang === "ja" ? "重要事項" : "Important Notes"}
                              </p>

                              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                {interview.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                          {lang === "ja"
                            ? "面接ステータスですが、面接情報が見つかりませんでした。"
                            : "The application is in Interview status, but no interview schedule was found."}
                        </div>
                      )}
                    </DetailsSection>
                  )}

                  {/* APPLICATION STATUS */}

                  <DetailsSection
                    icon={<Languages className="h-5 w-5" />}
                    title={
                      lang === "ja" ? "応募ステータス" : "Application Status"
                    }
                  >
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            {lang === "ja" ? "現在の状態" : "Current Status"}
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            {statusLabel(current.status, lang)}
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

                              {lang === "ja"
                                ? "面接を設定"
                                : "Schedule Interview"}
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
                              {updatingStatus === nextStatus
                                ? lang === "ja"
                                  ? "更新中..."
                                  : "Updating..."
                                : decisionLabel(nextStatus, lang)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {current.status === "UNDER_REVIEW" && (
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                          {lang === "ja"
                            ? "面接へ進む場合は、面接日時と方法を設定してください。"
                            : "To move this candidate to Interview, schedule the interview date, time, and method first."}
                        </p>
                      )}

                      {getNextStatuses(current.status).length === 0 &&
                        current.status !== "UNDER_REVIEW" &&
                        current.status !== "INTERVIEW" && (
                          <p className="mt-3 text-sm text-slate-500">
                            {lang === "ja"
                              ? "この応募は完了しています。"
                              : "This application has reached a final status."}
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
                {lang === "ja" ? "閉じる" : "Close"}
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
  lang,
}: {
  status: ProviderApplicationStatus;

  lang: string;
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
      {statusLabel(status, lang)}
    </span>
  );
}

// ======================================================
// INTERVIEW STATUS BADGE
// ======================================================

function InterviewStatusBadge({
  status,
  lang,
}: {
  status: ProviderInterviewStatus;

  lang: string;
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
      {interviewStatusLabel(status, lang)}
    </span>
  );
}
