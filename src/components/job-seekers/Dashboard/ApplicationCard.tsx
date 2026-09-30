import { useState } from "react";
import { CalendarDays, FileText, RefreshCw, Video } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import { getMyApplicationResume } from "./api";
import type { Application } from "./types";
import {
  ApplicationStatusBadge,
  btnSecondary,
  card,
  formatDate,
  formatSalary,
  InfoGrid,
  JobInfo,
  wrap,
} from "./shared";

export default function ApplicationCard({
  application,
  lang,
}: {
  application: Application;
  lang: string;
}) {
  const t = useTranslations("jobSeeker.dashboard");
  const vacancy = application.vacancy;
  const [openingResume, setOpeningResume] = useState(false);

  const handleViewApplicationResume = async () => {
    try {
      setOpeningResume(true);

      const resumeBlob = await getMyApplicationResume(
        application.application_id,
      );
      const resumeUrl = URL.createObjectURL(resumeBlob);

      window.open(resumeUrl, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(resumeUrl), 60_000);
    } catch (error) {
      console.error("Failed to open application resume:", error);
      toast.error(t("applicationResumeUnavailable"));
    } finally {
      setOpeningResume(false);
    }
  };

  return (
    <article className={card}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p
            title={application.application_id}
            className="truncate text-xs text-slate-500"
          >
            {application.application_id}
          </p>
          <h3
            className={`mt-1 text-base font-semibold leading-snug sm:text-[17px] ${wrap}`}
          >
            {vacancy?.title || application.vacancy_id}
          </h3>
        </div>
        <ApplicationStatusBadge status={application.status} />
      </div>

      <InfoGrid cols={3}>
        <JobInfo
          label={t("applied")}
          value={formatDate(application.applied_at, lang)}
          icon={<CalendarDays />}
        />
        <JobInfo
          label={t("employment")}
          value={vacancy?.employmentType || "-"}
        />
        <JobInfo
          label={t("salary")}
          value={
            vacancy
              ? formatSalary(
                  vacancy.salaryMin,
                  vacancy.salaryMax,
                  t("salaryUnit"),
                )
              : "-"
          }
          highlight
        />
      </InfoGrid>

      {application.status === "INTERVIEW" && (
        <div className="mt-3 flex items-start gap-2.5 rounded-md border border-emerald-200 bg-emerald-50 p-3">
          <Video className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
          <div>
            <p className="text-[13px] font-semibold text-emerald-950">
              {t("interviewStage")}
            </p>
            <p className="mt-0.5 text-xs leading-5 text-emerald-900/80">
              {t("interviewStageDescription")}
            </p>
          </div>
        </div>
      )}

      {application.resume_available && (
        <div className="mt-3 flex flex-col gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-2.5">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-emerald-950">
                {t("applicationResumeTitle")}
              </p>
              <p
                className={`mt-0.5 text-xs leading-5 text-emerald-900/80 ${wrap}`}
              >
                {t("applicationResumeDescription")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleViewApplicationResume}
            disabled={openingResume}
            className={`${btnSecondary} shrink-0 border-emerald-200 text-emerald-800 hover:border-emerald-300 hover:bg-white`}
          >
            {openingResume ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            {t("viewApplicationResume")}
          </button>
        </div>
      )}

      {application.cover_letter && (
        <div className="mt-3 rounded-md bg-slate-50 p-3">
          <p className="text-[13px] font-semibold">{t("yourApplication")}</p>
          <p
            className={`mt-1 line-clamp-3 whitespace-pre-wrap text-[13px] leading-5 text-slate-600 ${wrap}`}
          >
            {application.cover_letter}
          </p>
        </div>
      )}

      {application.status === "ADMIN_REJECTED" &&
        application.admin_rejection_reason && (
          <div
            role="note"
            className="mt-3 rounded-md border border-red-200 bg-red-50 p-3"
          >
            <p className="text-[13px] font-semibold text-red-800">
              {t("adminRejectionReason")}
            </p>
            <p className={`mt-1 text-xs leading-5 text-red-700 ${wrap}`}>
              {application.admin_rejection_reason}
            </p>
          </div>
        )}
    </article>
  );
}
