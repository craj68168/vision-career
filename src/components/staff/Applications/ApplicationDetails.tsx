"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  MapPin,
  X,
} from "lucide-react";

import {
  formatDate,
  formatDateTime,
  getApplicationStatusClass,
  getApplicationStatusLabel,
  getScreeningClass,
  getScreeningLabel,
} from "./helper";

import type { StaffApplication } from "./types";

type Props = {
  application: StaffApplication | null;

  canReview: boolean;

  onClose: () => void;

  onScreen: (application: StaffApplication) => void;
};

export default function ApplicationDetails({
  application,
  canReview,
  onClose,
  onScreen,
}: Props) {
  if (!application) {
    return null;
  }

  const canScreen =
    canReview && application.status === "PENDING_ADMIN_APPROVAL";

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-4">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
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

          <button type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
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

          {/* JOB */}

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

              <Info label="Applied" value={formatDate(application.appliedAt)} />
            </div>
          </section>

          {/* CANDIDATE */}

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

            {application.applicant.skills.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-semibold">Skills</p>

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
              </div>
            )}
          </section>

          {/* EDUCATION */}

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
                  <div key={index} className="rounded-xl bg-slate-50 p-4">
                    <p className="font-semibold">{education.school || "-"}</p>

                    <p className="mt-1 text-sm text-slate-500">
                      {education.major || "-"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* EMPLOYMENT */}

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
                    <div key={index} className="rounded-xl bg-slate-50 p-4">
                      <p className="font-semibold">
                        {employment.company_name || "-"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {employment.employment_type || "-"}
                      </p>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          {/* COVER LETTER */}

          {application.coverLetter && (
            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold">Cover Letter</h3>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {application.coverLetter}
              </p>
            </section>
          )}

          {/* SCREENING */}

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

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
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
