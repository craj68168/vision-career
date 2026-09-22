"use client";

import {
  AlertTriangle,
  BriefcaseBusiness,
  CheckCircle2,
  MapPin,
  X,
} from "lucide-react";

import {
  formatDate,
  formatDateTime,
  formatSalary,
  getScreeningClass,
  getScreeningLabel,
  getVacancyStatusClass,
  getVacancyStatusLabel,
} from "./helper";

import type { StaffVacancy } from "./types";

type Props = {
  vacancy: StaffVacancy | null;

  canReview: boolean;

  onClose: () => void;

  onScreen: (vacancy: StaffVacancy) => void;
};

export default function VacancyDetails({
  vacancy,
  canReview,
  onClose,
  onScreen,
}: Props) {
  if (!vacancy) {
    return null;
  }

  const canScreen = canReview && vacancy.status === "pending_review";

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-4">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              {vacancy.vacancyId}
            </p>

            <h2 className="mt-1 text-2xl font-bold">{vacancy.title}</h2>

            <p className="mt-1 text-sm text-slate-500">{vacancy.companyName}</p>
          </div>

          <button type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* BADGES */}

          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getVacancyStatusClass(
                vacancy.status,
              )}`}
            >
              {getVacancyStatusLabel(vacancy.status)}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getScreeningClass(
                vacancy.staffScreening.status,
              )}`}
            >
              {getScreeningLabel(vacancy.staffScreening.status)}
            </span>
          </div>

          {/* BASIC */}

          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="h-5 w-5 text-indigo-600" />

              <h3 className="font-semibold">Vacancy Information</h3>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Info label="Company" value={vacancy.companyName} />

              <Info label="Employment Type" value={vacancy.employmentType} />

              <Info label="Positions" value={vacancy.numberOfPeople} />

              <Info label="Japanese Level" value={vacancy.japaneseLevel} />

              <Info label="Remote Work" value={vacancy.remoteWork} />

              <Info
                label="Salary"
                value={formatSalary(vacancy.salaryMin, vacancy.salaryMax)}
              />

              <Info
                label="Application Deadline"
                value={formatDate(vacancy.applicationDeadline)}
              />

              <Info label="Start Date" value={vacancy.startDate} />

              <Info label="Created" value={formatDate(vacancy.createdAt)} />
            </div>
          </section>

          {/* LOCATION */}

          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-600" />

              <h3 className="font-semibold">Work Location</h3>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info label="Location" value={vacancy.workLocation} />

              <Info
                label="Location Detail"
                value={vacancy.workLocationDetail}
              />
            </div>
          </section>

          {/* JOB DESCRIPTION */}

          <TextSection title="Job Description" value={vacancy.jobDescription} />

          <TextSection
            title="Responsibilities"
            value={vacancy.responsibilities}
          />

          <TextSection title="Required Skills" value={vacancy.requiredSkills} />

          <TextSection
            title="Preferred Skills"
            value={vacancy.preferredSkills}
          />

          <TextSection
            title="Required Education"
            value={vacancy.requiredEducation}
          />

          <TextSection
            title="Required Experience"
            value={vacancy.requiredExperience}
          />

          {/* CONDITIONS */}

          <section className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold">Work Conditions</h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Info label="Work Hours" value={vacancy.workHours} />

              <Info label="Break Time" value={vacancy.breakTime} />

              <Info label="Overtime" value={vacancy.overtime} />

              <Info label="Holidays" value={vacancy.holidays} />

              <Info label="Trial Period" value={vacancy.trialPeriod} />

              <Info label="Salary Note" value={vacancy.salaryNote} />
            </div>
          </section>

          {/* BENEFITS */}

          <TagSection title="Benefits" values={vacancy.benefits} />

          <TagSection title="Insurance" values={vacancy.insurance} />

          <TextSection
            title="Selection Process"
            value={vacancy.selectionProcess}
          />

          {/* STAFF SCREENING */}

          <section className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold">Staff Screening</h3>

            {vacancy.staffScreening.status === "NOT_SCREENED" && (
              <div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />

                <p className="text-sm text-amber-700">
                  This vacancy has not been screened yet.
                </p>
              </div>
            )}

            {vacancy.staffScreening.status === "SCREENED" && (
              <div className="mt-4 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                <p className="text-sm text-emerald-700">
                  Staff screening has been completed.
                </p>
              </div>
            )}

            {vacancy.staffScreening.status === "NEEDS_ATTENTION" && (
              <div className="mt-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />

                <p className="text-sm text-red-700">
                  This vacancy requires additional Admin attention.
                </p>
              </div>
            )}

            {vacancy.staffScreening.status !== "NOT_SCREENED" && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Info
                  label="Screened By"
                  value={vacancy.staffScreening.screenedByStaffId}
                />

                <Info
                  label="Screened At"
                  value={formatDateTime(vacancy.staffScreening.screenedAt)}
                />
              </div>
            )}

            {vacancy.staffScreening.note && (
              <div className="mt-3 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Screening Note
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm">
                  {vacancy.staffScreening.note}
                </p>
              </div>
            )}
          </section>

          {/* OLD ADMIN REJECTION */}

          {vacancy.rejectionReason && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="font-semibold text-red-700">
                Admin Rejection Reason
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">
                {vacancy.rejectionReason}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}

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
              onClick={() => onScreen(vacancy)}
              className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white"
            >
              {vacancy.staffScreening.status === "NOT_SCREENED"
                ? "Screen Vacancy"
                : "Edit Screening"}
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

  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 break-words font-semibold">{value ?? "-"}</p>
    </div>
  );
}

// ======================================================
// TEXT SECTION
// ======================================================

function TextSection({
  title,
  value,
}: {
  title: string;

  value?: string | null;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 p-5">
      <h3 className="font-semibold">{title}</h3>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {value || "-"}
      </p>
    </section>
  );
}

// ======================================================
// TAGS
// ======================================================

function TagSection({
  title,
  values,
}: {
  title: string;

  values: string[];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 p-5">
      <h3 className="font-semibold">{title}</h3>

      <div className="mt-3 flex flex-wrap gap-2">
        {values.length > 0 ? (
          values.map((value) => (
            <span
              key={value}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
            >
              {value}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-500">-</span>
        )}
      </div>
    </section>
  );
}
