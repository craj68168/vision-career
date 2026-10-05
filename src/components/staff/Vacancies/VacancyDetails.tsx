"use client";

import type { ReactNode } from "react";

import {
  AlertTriangle,
  BriefcaseBusiness,
  CheckCircle2,
  MapPin,
  X,
} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import {
  formatDate,
  formatDateTime,
  formatSalary,
  getScreeningClass,
  getVacancyStatusClass,
} from "./helper";

import type { StaffVacancy } from "./types";

type Props = {
  vacancy: StaffVacancy | null;

  canReview: boolean;

  canApprove: boolean;

  onClose: () => void;

  onScreen: (vacancy: StaffVacancy) => void;

  onDecision: (vacancy: StaffVacancy) => void;
};

export default function VacancyDetails({
  vacancy,
  canReview,
  canApprove,
  onClose,
  onScreen,
  onDecision,
}: Props) {
  const t = useTranslations("staffVacancies");

  const locale = useLocale();

  if (!vacancy) {
    return null;
  }

  const canScreen = canReview && vacancy.status === "pending_review";

  const canDecide = canApprove && vacancy.status === "pending_review";

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label={t("details.close")}
      />

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

          <button
            type="button"
            onClick={onClose}
            aria-label={t("details.close")}
            className="rounded-full p-2 hover:bg-slate-100"
          >
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
              {t(`statuses.${vacancy.status}`)}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getScreeningClass(
                vacancy.staffScreening.status,
              )}`}
            >
              {t(`screeningStatuses.${vacancy.staffScreening.status}`)}
            </span>
          </div>

          {/* BASIC */}

          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="h-5 w-5 text-indigo-600" />

              <h3 className="font-semibold">
                {t("details.vacancyInformation")}
              </h3>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Info label={t("details.company")} value={vacancy.companyName} />

              <Info
                label={t("details.employmentType")}
                value={vacancy.employmentType}
              />

              <Info
                label={t("details.positions")}
                value={vacancy.numberOfPeople}
              />

              <Info
                label={t("details.japaneseLevel")}
                value={vacancy.japaneseLevel}
              />

              <Info
                label={t("details.remoteWork")}
                value={vacancy.remoteWork}
              />

              <Info
                label={t("details.salary")}
                value={formatSalary(vacancy.salaryMin, vacancy.salaryMax)}
              />

              <Info
                label={t("details.applicationDeadline")}
                value={formatDate(vacancy.applicationDeadline, locale)}
              />

              <Info label={t("details.startDate")} value={vacancy.startDate} />

              <Info
                label={t("details.created")}
                value={formatDate(vacancy.createdAt, locale)}
              />
            </div>
          </section>

          {/* LOCATION */}

          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-600" />

              <h3 className="font-semibold">{t("details.workLocation")}</h3>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info
                label={t("details.location")}
                value={vacancy.workLocation}
              />

              <Info
                label={t("details.locationDetail")}
                value={vacancy.workLocationDetail}
              />
            </div>
          </section>

          <TextSection
            title={t("details.jobDescription")}
            value={vacancy.jobDescription}
          />

          <TextSection
            title={t("details.responsibilities")}
            value={vacancy.responsibilities}
          />

          <TextSection
            title={t("details.requiredSkills")}
            value={vacancy.requiredSkills}
          />

          <TextSection
            title={t("details.preferredSkills")}
            value={vacancy.preferredSkills}
          />

          <TextSection
            title={t("details.requiredEducation")}
            value={vacancy.requiredEducation}
          />

          <TextSection
            title={t("details.requiredExperience")}
            value={vacancy.requiredExperience}
          />

          {/* CONDITIONS */}

          <section className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold">{t("details.workConditions")}</h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Info label={t("details.workHours")} value={vacancy.workHours} />

              <Info label={t("details.breakTime")} value={vacancy.breakTime} />

              <Info label={t("details.overtime")} value={vacancy.overtime} />

              <Info label={t("details.holidays")} value={vacancy.holidays} />

              <Info
                label={t("details.trialPeriod")}
                value={vacancy.trialPeriod}
              />

              <Info
                label={t("details.salaryNote")}
                value={vacancy.salaryNote}
              />
            </div>
          </section>

          <TagSection title={t("details.benefits")} values={vacancy.benefits} />

          <TagSection
            title={t("details.insurance")}
            values={vacancy.insurance}
          />

          <TextSection
            title={t("details.selectionProcess")}
            value={vacancy.selectionProcess}
          />

          {/* STAFF SCREENING */}

          <section className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold">{t("details.staffScreening")}</h3>

            {vacancy.staffScreening.status === "NOT_SCREENED" && (
              <div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />

                <p className="text-sm text-amber-700">
                  {t("details.notScreenedNotice")}
                </p>
              </div>
            )}

            {vacancy.staffScreening.status === "SCREENED" && (
              <div className="mt-4 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                <p className="text-sm text-emerald-700">
                  {t("details.screenedNotice")}
                </p>
              </div>
            )}

            {vacancy.staffScreening.status === "NEEDS_ATTENTION" && (
              <div className="mt-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />

                <p className="text-sm text-red-700">
                  {t("details.needsAttentionNotice")}
                </p>
              </div>
            )}

            {vacancy.staffScreening.status !== "NOT_SCREENED" && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Info
                  label={t("details.screenedBy")}
                  value={vacancy.staffScreening.screenedByStaffId}
                />

                <Info
                  label={t("details.screenedAt")}
                  value={formatDateTime(
                    vacancy.staffScreening.screenedAt,
                    locale,
                  )}
                />
              </div>
            )}

            {vacancy.staffScreening.note && (
              <div className="mt-3 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {t("details.screeningNote")}
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm">
                  {vacancy.staffScreening.note}
                </p>
              </div>
            )}

            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
              {t("details.permissionNotice")}
            </div>
          </section>

          {/* REJECTION */}

          {vacancy.rejectionReason && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="font-semibold text-red-700">
                {t("details.rejectionReason")}
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">
                {vacancy.rejectionReason}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 p-6">
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
              onClick={() => onScreen(vacancy)}
              className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white"
            >
              {vacancy.staffScreening.status === "NOT_SCREENED"
                ? t("actions.screen")
                : t("actions.editScreening")}
            </button>
          )}

          {canDecide && (
            <button
              type="button"
              onClick={() => onDecision(vacancy)}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700"
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
