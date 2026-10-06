"use client";

import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  X,
} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import {
  formatDate,
  formatDateTime,
  getCandidateStatusClass,
  getReviewClass,
} from "./helper";

import type { StaffPlacementCandidate } from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  candidate: StaffPlacementCandidate | undefined;

  onClose: () => void;

  onReview: (candidate: StaffPlacementCandidate) => void;
};

// ======================================================
// COMPONENT
// ======================================================

export default function CandidateDetails({
  candidate,
  onClose,
  onReview,
}: Props) {
  const t = useTranslations("staffPlacementCandidates");

  const locale = useLocale();

  if (!candidate) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label={t("details.close")}
      />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              {candidate.placementCandidateId}
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {candidate.candidate.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t("details.seekerId", {
                id: candidate.seekerId,
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getCandidateStatusClass(
                candidate.status,
              )}`}
            >
              {t(`candidateStatuses.${candidate.status}`)}
            </span>

            <button
              type="button"
              onClick={onClose}
              aria-label={t("details.close")}
              className="rounded-full p-2 transition hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}

        <div className="overflow-y-auto p-6">
          <div className="space-y-7">
            {/* ============================================= */}
            {/* PLACEMENT REQUEST */}
            {/* ============================================= */}

            <section>
              <h3 className="mb-4 text-lg font-bold">
                {t("details.placementRequest")}
              </h3>

              <div className="grid gap-3 md:grid-cols-3">
                <Field
                  label={t("details.company")}
                  value={candidate.provider?.companyName}
                />

                <Field
                  label={t("details.job")}
                  value={candidate.request?.jobTitle}
                />

                <Field
                  label={t("details.location")}
                  value={candidate.request?.workLocation}
                />

                <Field
                  label={t("details.recruitId")}
                  value={candidate.recruitId}
                />

                <Field
                  label={t("details.positions")}
                  value={candidate.request?.numberOfPositions}
                />

                <Field
                  label={t("details.matchedByAdmin")}
                  value={candidate.matchedByAdminId}
                />
              </div>
            </section>

            {/* ============================================= */}
            {/* PROFILE */}
            {/* ============================================= */}

            <section>
              <h3 className="mb-4 text-lg font-bold">
                {t("details.candidateProfile")}
              </h3>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Field
                  label={t("details.nationality")}
                  value={candidate.candidate.nationality}
                />

                <Field
                  label={t("details.currentLocation")}
                  value={candidate.candidate.current_location}
                />

                <Field
                  label={t("details.visaType")}
                  value={candidate.candidate.visa_type}
                />

                <Field
                  label={t("details.visaExpiry")}
                  value={formatDate(
                    candidate.candidate.visa_expiry_date,
                    locale,
                  )}
                />

                <Field
                  label={t("details.japaneseLevel")}
                  value={candidate.candidate.japanese_level}
                />

                <Field
                  label={t("details.desiredJob")}
                  value={candidate.candidate.desired_job}
                />

                <Field
                  label={t("details.desiredLocation")}
                  value={candidate.candidate.desired_location}
                />

                <Field
                  label={t("details.matchedAt")}
                  value={formatDateTime(candidate.matchedAt, locale)}
                />
              </div>
            </section>

            {/* ============================================= */}
            {/* SKILLS */}
            {/* ============================================= */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold">{t("details.skills")}</h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {candidate.candidate.skills.length > 0 ? (
                  candidate.candidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <Empty label={t("details.noInformation")} />
                )}
              </div>
            </section>

            {/* ============================================= */}
            {/* EDUCATION */}
            {/* ============================================= */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-slate-500" />

                <h3 className="font-bold">{t("details.education")}</h3>
              </div>

              <div className="mt-4 space-y-3">
                {candidate.candidate.education.length === 0 ? (
                  <Empty label={t("details.noInformation")} />
                ) : (
                  candidate.candidate.education.map((education, index) => (
                    <div
                      key={`${education.school ?? "school"}-${index}`}
                      className="rounded-xl bg-slate-50 p-4"
                    >
                      <p className="font-semibold">{education.school || "-"}</p>

                      <p className="mt-1 text-sm text-slate-500">
                        {[education.school_type, education.major]
                          .filter(Boolean)
                          .join(" • ") || "-"}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {formatDate(education.enrollment_date, locale)}

                        {" — "}

                        {formatDate(education.graduation_date, locale)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* ============================================= */}
            {/* EMPLOYMENT HISTORY */}
            {/* ============================================= */}

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-slate-500" />

                <h3 className="font-bold">{t("details.employmentHistory")}</h3>
              </div>

              <div className="mt-4 space-y-3">
                {candidate.candidate.employment_history.length === 0 ? (
                  <Empty label={t("details.noInformation")} />
                ) : (
                  candidate.candidate.employment_history.map(
                    (employment, index) => (
                      <div
                        key={`${employment.company_name ?? "company"}-${index}`}
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

                          {" — "}

                          {employment.end_date
                            ? formatDate(employment.end_date, locale)
                            : t("details.present")}
                        </p>
                      </div>
                    ),
                  )
                )}
              </div>
            </section>

            {/* ============================================= */}
            {/* PROVIDER PIPELINE */}
            {/* ============================================= */}

            <section>
              <h3 className="mb-4 text-lg font-bold">
                {t("details.providerPipeline")}
              </h3>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Field
                  label={t("details.providerReview")}
                  value={formatDateTime(candidate.providerReviewedAt, locale)}
                />

                <Field
                  label={t("details.interview")}
                  value={formatDateTime(candidate.interviewAt, locale)}
                />

                <Field
                  label={t("details.selected")}
                  value={formatDateTime(candidate.selectedAt, locale)}
                />

                <Field
                  label={t("details.placed")}
                  value={formatDateTime(candidate.placedAt, locale)}
                />
              </div>

              {candidate.status === "REJECTED" && candidate.rejectionReason && (
                <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-xs font-semibold uppercase text-red-600">
                    {t("details.providerRejectionReason")}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">
                    {candidate.rejectionReason}
                  </p>
                </div>
              )}
            </section>

            {/* ============================================= */}
            {/* STAFF REVIEW */}
            {/* ============================================= */}

            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">
                  {t("details.staffReview")}
                </h3>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getReviewClass(
                    candidate.staffReview.status,
                  )}`}
                >
                  {t(`reviewStatuses.${candidate.staffReview.status}`)}
                </span>
              </div>

              {candidate.staffReview.status === "NOT_REVIEWED" && (
                <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                  <p className="text-sm text-amber-700">
                    {t("details.notReviewedMessage")}
                  </p>
                </div>
              )}

              {candidate.staffReview.status === "REVIEWED" && (
                <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                  <p className="text-sm text-emerald-700">
                    {t("details.reviewedMessage")}
                  </p>
                </div>
              )}

              {candidate.staffReview.status === "NEEDS_ATTENTION" && (
                <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                  <p className="text-sm text-red-700">
                    {t("details.needsAttentionMessage")}
                  </p>
                </div>
              )}

              {candidate.staffReview.status !== "NOT_REVIEWED" && (
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <Field
                    label={t("details.reviewedBy")}
                    value={candidate.staffReview.reviewedByStaffId}
                  />

                  <Field
                    label={t("details.reviewedAt")}
                    value={formatDateTime(
                      candidate.staffReview.reviewedAt,
                      locale,
                    )}
                  />
                </div>
              )}

              {candidate.staffReview.note && (
                <div
                  className={`mt-3 rounded-2xl border p-4 ${
                    candidate.staffReview.status === "NEEDS_ATTENTION"
                      ? "border-red-200 bg-red-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    {t("details.staffReviewNote")}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    {candidate.staffReview.note}
                  </p>
                </div>
              )}

              <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-700">
                {t("details.operationalNotice")}
              </div>
            </section>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5"
          >
            {t("details.close")}
          </button>

          <button
            type="button"
            onClick={() => onReview(candidate)}
            className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white transition hover:bg-slate-800"
          >
            {candidate.staffReview.status === "NOT_REVIEWED"
              ? t("actions.reviewCandidate")
              : t("actions.editReview")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// FIELD
// ======================================================

function Field({
  label,
  value,
}: {
  label: string;

  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 whitespace-pre-wrap break-words text-sm font-medium text-slate-900">
        {value === null || value === undefined || value === ""
          ? "-"
          : String(value)}
      </p>
    </div>
  );
}

// ======================================================
// EMPTY
// ======================================================

function Empty({ label }: { label: string }) {
  return <p className="text-sm text-slate-400">{label}</p>;
}
