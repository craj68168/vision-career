import { CalendarDays, Clock3, Link2, Video } from "lucide-react";
import { useTranslations } from "next-intl";

import type { SeekerInterview } from "./types";
import {
  btnPrimary,
  card,
  focusRing,
  formatDate,
  formatInterviewMethod,
  InfoGrid,
  InterviewStatusBadge,
  isInterviewDatePast,
  JobInfo,
  wrap,
} from "./shared";

export default function InterviewCard({
  interview,
  lang,
}: {
  interview: SeekerInterview;
  lang: string;
}) {
  const t = useTranslations("jobSeeker.dashboard");
  const vacancy = interview.vacancy;
  const isPastInterview = isInterviewDatePast(
    interview.interviewDate,
    interview.timezone,
  );
  const canJoin =
    interview.status === "CONFIRMED" &&
    Boolean(interview.meetingLink) &&
    !isPastInterview;

  return (
    <article
      className={`${card} ${
        interview.status === "CONFIRMED" && !isPastInterview
          ? "border-t-2 border-t-emerald-700"
          : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-emerald-700">
            {t("interview")}
          </p>
          <h3
            className={`mt-1 text-base font-semibold leading-snug sm:text-[17px] ${wrap}`}
          >
            {vacancy?.title || interview.vacancyId}
          </h3>
        </div>
        <InterviewStatusBadge status={interview.status} />
      </div>

      <InfoGrid cols={3}>
        <JobInfo
          label={t("interviewDate")}
          value={formatDate(interview.interviewDate, lang)}
          icon={<CalendarDays />}
        />
        <JobInfo
          label={t("interviewTime")}
          value={`${interview.interviewTime} (${interview.timezone})`}
          icon={<Clock3 />}
        />
        <JobInfo
          label={t("interviewMethod")}
          value={formatInterviewMethod(interview.interviewMethod, t)}
          icon={<Video />}
        />
      </InfoGrid>

      {interview.notes && (
        <div className="mt-3 rounded-md bg-slate-50 p-3">
          <p className="text-[13px] font-semibold">{t("importantNotes")}</p>
          <p
            className={`mt-1 whitespace-pre-wrap text-[13px] leading-5 text-slate-700 ${wrap}`}
          >
            {interview.notes}
          </p>
        </div>
      )}

      {interview.status === "CANCELLED" && interview.cancellationReason && (
        <div
          role="note"
          className="mt-3 rounded-md border border-red-200 bg-red-50 p-3"
        >
          <p className="text-[13px] font-semibold text-red-800">
            {t("interviewCancelled")}
          </p>
          <p className={`mt-1 text-xs leading-5 text-red-700 ${wrap}`}>
            {interview.cancellationReason}
          </p>
        </div>
      )}

      {canJoin && (
        <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-3">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-950">
            <Link2 className="h-3.5 w-3.5" />
            {t("onlineInterviewLink")}
          </div>
          <a
            href={interview.meetingLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-1 block break-all text-xs font-medium text-emerald-800 underline underline-offset-2 hover:text-emerald-950 ${focusRing}`}
          >
            {interview.meetingLink}
          </a>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2.5 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 text-xs leading-5 text-slate-500">
          <p className="truncate" title={interview.interviewId}>
            {t("interviewId")}: {interview.interviewId}
          </p>
          <p className="truncate" title={interview.applicationId}>
            {t("applicationId")}: {interview.applicationId}
          </p>
        </div>

        {canJoin && (
          <a
            href={interview.meetingLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnPrimary} w-full sm:w-auto`}
          >
            <Video className="h-4 w-4" />
            {t("joinInterview")}
          </a>
        )}
      </div>
    </article>
  );
}
