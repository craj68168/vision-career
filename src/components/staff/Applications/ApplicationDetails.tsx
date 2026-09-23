"use client";

import { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

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
  getApplicationStatusLabel,
  getScreeningClass,
  getScreeningLabel,
} from "./helper";

import type { ApiErrorResponse, StaffApplication } from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  application: StaffApplication | null;

  canReview: boolean;

  onClose: () => void;

  onScreen: (application: StaffApplication) => void;
};

// ======================================================
// ERROR MESSAGE
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
// COMPONENT
// ======================================================

export default function ApplicationDetails({
  application,
  canReview,
  onClose,
  onScreen,
}: Props) {
  const [isOpeningResume, setIsOpeningResume] = useState(false);

  if (!application) {
    return null;
  }

  const canScreen =
    canReview && application.status === "PENDING_ADMIN_APPROVAL";

  // ====================================================
  // VIEW FROZEN APPLICATION RESUME
  // ====================================================

  const handleViewResume = async () => {
    if (!application.applicant.resumeAvailable) {
      toast.error("No frozen resume is available for this application.");

      return;
    }

    // Open blank window immediately.
    //
    // This prevents the browser from blocking the PDF
    // because window.open() happens directly from the
    // user's click.
    const previewWindow = window.open("", "_blank");

    if (!previewWindow) {
      toast.error("Please allow pop-ups to open the application resume.");

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

      // Keep URL alive long enough for Chrome PDF viewer
      // to load the document.
      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 60_000);
    } catch (error) {
      previewWindow.close();

      toast.error(
        getErrorMessage(error, "Failed to open the frozen application resume."),
      );
    } finally {
      setIsOpeningResume(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-4">
      {/* BACKDROP */}

      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close application details"
      />

      {/* MODAL */}

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              Application
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {application.applicant.name || "Applicant"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {application.applicationId}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
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
            {/* ============================================= */}
            {/* STATUS */}
            {/* ============================================= */}

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getApplicationStatusClass(
                  application.status,
                )}`}
              >
                {getApplicationStatusLabel(application.status)}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getScreeningClass(
                  application.screening.status,
                )}`}
              >
                {getScreeningLabel(application.screening.status)}
              </span>
            </div>

            {/* ============================================= */}
            {/* VACANCY */}
            {/* ============================================= */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="h-5 w-5 text-indigo-600" />

                <h3 className="font-semibold">Vacancy</h3>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Info
                  label="Position"
                  value={application.vacancy?.title || "-"}
                />

                <Info
                  label="Company"
                  value={application.vacancy?.companyName || "-"}
                />

                <Info
                  label="Employment"
                  value={application.vacancy?.employmentType || "-"}
                />

                <Info
                  label="Location"
                  value={application.vacancy?.workLocation || "-"}
                />

                <Info
                  label="Required Japanese"
                  value={application.vacancy?.japaneseLevel || "-"}
                />

                <Info
                  label="Applied"
                  value={formatDate(application.appliedAt)}
                />
              </div>
            </section>

            {/* ============================================= */}
            {/* CANDIDATE */}
            {/* ============================================= */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold">Candidate Profile</h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Info
                  label="Nationality"
                  value={application.applicant.nationality || "-"}
                />

                <Info
                  label="Visa"
                  value={application.applicant.visaType || "-"}
                />

                <Info
                  label="Visa Expiry"
                  value={formatDate(application.applicant.visaExpiryDate)}
                />

                <Info
                  label="Japanese"
                  value={application.applicant.japaneseLevel || "-"}
                />

                <Info
                  label="Desired Job"
                  value={application.applicant.desiredJob || "-"}
                />

                <Info
                  label="Desired Location"
                  value={application.applicant.desiredLocation || "-"}
                />
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold">Skills</p>

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
                    No skills added.
                  </p>
                )}
              </div>
            </section>

            {/* ============================================= */}
            {/* EDUCATION */}
            {/* ============================================= */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-600" />

                <h3 className="font-semibold">Education</h3>
              </div>

              {application.applicant.education.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  No education records.
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
                        {formatDate(education.enrollment_date)}
                        {" - "}
                        {formatDate(education.graduation_date)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ============================================= */}
            {/* EMPLOYMENT */}
            {/* ============================================= */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold">Employment History</h3>

              {application.applicant.employmentHistory.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  No employment records.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {application.applicant.employmentHistory.map(
                    (employment, index) => (
                      <div
                        key={`${employment.company_name || "employment"}-${index}`}
                        className="rounded-xl bg-slate-50 p-4"
                      >
                        <p className="font-semibold">
                          {employment.company_name || "-"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {employment.employment_type || "-"}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {formatDate(employment.start_date)}
                          {" - "}
                          {employment.end_date
                            ? formatDate(employment.end_date)
                            : "Present"}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              )}
            </section>

            {/* ============================================= */}
            {/* FROZEN APPLICATION RESUME */}
            {/* ============================================= */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />

                <h3 className="font-semibold">Professional Resume</h3>
              </div>

              <div className="mt-4 flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    Frozen Application Resume
                  </p>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                    This resume preserves the candidate information from the
                    time this application was submitted.
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
                    ? "Opening..."
                    : application.applicant.resumeAvailable
                      ? "View Resume"
                      : "Resume Unavailable"}
                </button>
              </div>
            </section>

            {/* ============================================= */}
            {/* COVER LETTER */}
            {/* ============================================= */}

            {application.coverLetter && (
              <section className="rounded-2xl border border-slate-200 p-5">
                <h3 className="font-semibold">Cover Letter</h3>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {application.coverLetter}
                </p>
              </section>
            )}

            {/* ============================================= */}
            {/* SCREENING */}
            {/* ============================================= */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold">Staff Screening</h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Info
                  label="Screened By"
                  value={application.screening.screenedByStaffId || "-"}
                />

                <Info
                  label="Screened At"
                  value={formatDateTime(application.screening.screenedAt)}
                />
              </div>

              {application.screening.note && (
                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Screening Note</p>

                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    {application.screening.note}
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-white p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5"
          >
            Close
          </button>

          {canScreen && (
            <button
              type="button"
              onClick={() => onScreen(application)}
              className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white"
            >
              Screen Application
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
