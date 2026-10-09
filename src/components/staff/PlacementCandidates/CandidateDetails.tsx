"use client";

import type { ComponentType, ReactNode } from "react";

import { useLocale, useTranslations } from "next-intl";

import {
  AlertTriangle,
  Building2,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Pencil,
  Route,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

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
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const badgeClass = "rounded-full px-3 py-1 text-xs font-semibold";

const secondaryButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "C"
  );
}

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

  const candidateName = candidate.candidate.name || "-";

  const notReviewed = candidate.staffReview.status === "NOT_REVIEWED";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={candidateName}
      className="fixed inset-0 z-[150] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      {/* BACKDROP */}

      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label={t("details.close")}
      />

      {/* MODAL */}

      <div className="relative z-10 flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-slate-200 sm:max-h-[92dvh] sm:rounded-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="relative shrink-0 overflow-hidden bg-[linear-gradient(120deg,#eef2ff_0%,#f5f3ff_45%,#ffffff_100%)] px-4 py-4 shadow-[inset_0_-1px_0_0_#e0e7ff] sm:px-6 sm:py-5">
          {/* decorative grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.07)_1px,transparent_1px)] bg-[length:44px_44px] [mask-image:linear-gradient(90deg,#000,transparent)]"
          />

          <div className="relative flex items-start gap-3 sm:gap-4">
            <span
              aria-hidden="true"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-base font-bold text-white shadow-md shadow-indigo-600/30"
            >
              {getInitials(candidateName)}
            </span>

            <div className="min-w-0 flex-1">
              <p className="break-all text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                {candidate.placementCandidateId}
              </p>

              <h2 className="mt-0.5 break-words text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
                {candidateName}
              </h2>

              <p className="mt-1 break-all text-xs text-slate-500">
                {t("details.seekerId", {
                  id: candidate.seekerId,
                })}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`${badgeClass} ${getCandidateStatusClass(
                    candidate.status,
                  )}`}
                >
                  {t(`candidateStatuses.${candidate.status}`)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t("details.close")}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-slate-600 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* SCROLLABLE CONTENT */}
        {/* ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/60">
          <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
            {/* PLACEMENT REQUEST */}

            <Section
              icon={BriefcaseBusiness}
              title={t("details.placementRequest")}
              accent="indigo"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Info
                  label={t("details.company")}
                  value={candidate.provider?.companyName}
                />

                <Info
                  label={t("details.job")}
                  value={candidate.request?.jobTitle}
                />

                <Info
                  label={t("details.location")}
                  value={candidate.request?.workLocation}
                />

                <Info
                  label={t("details.recruitId")}
                  value={candidate.recruitId}
                />

                <Info
                  label={t("details.positions")}
                  value={candidate.request?.numberOfPositions}
                />

                <Info
                  label={t("details.matchedByAdmin")}
                  value={candidate.matchedByAdminId}
                />
              </div>
            </Section>

            {/* CANDIDATE PROFILE */}

            <Section
              icon={UserRound}
              title={t("details.candidateProfile")}
              accent="sky"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Info
                  label={t("details.nationality")}
                  value={candidate.candidate.nationality}
                />

                <Info
                  label={t("details.currentLocation")}
                  value={candidate.candidate.current_location}
                />

                <Info
                  label={t("details.visaType")}
                  value={candidate.candidate.visa_type}
                />

                <Info
                  label={t("details.visaExpiry")}
                  value={formatDate(
                    candidate.candidate.visa_expiry_date,
                    locale,
                  )}
                />

                <Info
                  label={t("details.japaneseLevel")}
                  value={candidate.candidate.japanese_level}
                />

                <Info
                  label={t("details.desiredJob")}
                  value={candidate.candidate.desired_job}
                />

                <Info
                  label={t("details.desiredLocation")}
                  value={candidate.candidate.desired_location}
                />

                <Info
                  label={t("details.matchedAt")}
                  value={formatDateTime(candidate.matchedAt, locale)}
                />
              </div>
            </Section>

            {/* SKILLS */}

            <Section
              icon={Sparkles}
              title={t("details.skills")}
              accent="amber"
            >
              {candidate.candidate.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {candidate.candidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <Empty label={t("details.noInformation")} />
              )}
            </Section>

            {/* EDUCATION + EMPLOYMENT */}

            <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
              <Section
                icon={GraduationCap}
                title={t("details.education")}
                accent="violet"
              >
                {candidate.candidate.education.length === 0 ? (
                  <Empty label={t("details.noInformation")} />
                ) : (
                  <Timeline>
                    {candidate.candidate.education.map((education, index) => (
                      <TimelineItem
                        key={`${education.school ?? "school"}-${index}`}
                        title={education.school || "-"}
                        subtitle={
                          [education.school_type, education.major]
                            .filter(Boolean)
                            .join(" • ") || "-"
                        }
                        period={`${formatDate(
                          education.enrollment_date,
                          locale,
                        )} - ${formatDate(education.graduation_date, locale)}`}
                      />
                    ))}
                  </Timeline>
                )}
              </Section>

              <Section
                icon={Building2}
                title={t("details.employmentHistory")}
                accent="emerald"
              >
                {candidate.candidate.employment_history.length === 0 ? (
                  <Empty label={t("details.noInformation")} />
                ) : (
                  <Timeline>
                    {candidate.candidate.employment_history.map(
                      (employment, index) => (
                        <TimelineItem
                          key={`${employment.company_name ?? "company"}-${index}`}
                          title={employment.company_name || "-"}
                          subtitle={employment.employment_type || "-"}
                          period={`${formatDate(
                            employment.start_date,
                            locale,
                          )} - ${
                            employment.end_date
                              ? formatDate(employment.end_date, locale)
                              : t("details.present")
                          }`}
                        />
                      ),
                    )}
                  </Timeline>
                )}
              </Section>
            </div>

            {/* PROVIDER PIPELINE */}

            <Section
              icon={Route}
              title={t("details.providerPipeline")}
              accent="indigo"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Info
                  label={t("details.providerReview")}
                  value={formatDateTime(candidate.providerReviewedAt, locale)}
                />

                <Info
                  label={t("details.interview")}
                  value={formatDateTime(candidate.interviewAt, locale)}
                />

                <Info
                  label={t("details.selected")}
                  value={formatDateTime(candidate.selectedAt, locale)}
                />

                <Info
                  label={t("details.placed")}
                  value={formatDateTime(candidate.placedAt, locale)}
                />
              </div>

              {candidate.status === "REJECTED" && candidate.rejectionReason && (
                <div className="mt-3 rounded-xl bg-rose-50 p-4 ring-1 ring-inset ring-rose-200">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-600">
                    {t("details.providerRejectionReason")}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-rose-700">
                    {candidate.rejectionReason}
                  </p>
                </div>
              )}
            </Section>

            {/* STAFF REVIEW */}

            <Section
              icon={ShieldCheck}
              title={t("details.staffReview")}
              accent="teal"
              aside={
                <span
                  className={`${badgeClass} ${getReviewClass(
                    candidate.staffReview.status,
                  )}`}
                >
                  {t(`reviewStatuses.${candidate.staffReview.status}`)}
                </span>
              }
            >
              {candidate.staffReview.status === "NOT_REVIEWED" && (
                <div className="flex gap-3 rounded-xl bg-amber-50 p-4 ring-1 ring-inset ring-amber-200">
                  <AlertTriangle
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
                  />

                  <p className="text-sm leading-6 text-amber-700">
                    {t("details.notReviewedMessage")}
                  </p>
                </div>
              )}

              {candidate.staffReview.status === "REVIEWED" && (
                <div className="flex gap-3 rounded-xl bg-emerald-50 p-4 ring-1 ring-inset ring-emerald-200">
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                  />

                  <p className="text-sm leading-6 text-emerald-700">
                    {t("details.reviewedMessage")}
                  </p>
                </div>
              )}

              {candidate.staffReview.status === "NEEDS_ATTENTION" && (
                <div className="flex gap-3 rounded-xl bg-rose-50 p-4 ring-1 ring-inset ring-rose-200">
                  <AlertTriangle
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-rose-600"
                  />

                  <p className="text-sm leading-6 text-rose-700">
                    {t("details.needsAttentionMessage")}
                  </p>
                </div>
              )}

              {candidate.staffReview.status !== "NOT_REVIEWED" && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Info
                    label={t("details.reviewedBy")}
                    value={candidate.staffReview.reviewedByStaffId}
                  />

                  <Info
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
                  className={`mt-3 rounded-xl p-4 ring-1 ring-inset ${
                    candidate.staffReview.status === "NEEDS_ATTENTION"
                      ? "bg-rose-50 ring-rose-200"
                      : "bg-slate-50 ring-slate-200"
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {t("details.staffReviewNote")}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">
                    {candidate.staffReview.note}
                  </p>
                </div>
              )}

              <div className="mt-3 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-700 ring-1 ring-inset ring-blue-200">
                {t("details.operationalNotice")}
              </div>
            </Section>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex shrink-0 flex-col-reverse gap-2 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[inset_0_1px_0_0_#e2e8f0] sm:flex-row sm:justify-end sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            className={secondaryButton}
          >
            {t("details.close")}
          </button>

          <button
            type="button"
            onClick={() => onReview(candidate)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            {notReviewed ? (
              <ClipboardCheck className="h-4 w-4" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}

            {notReviewed
              ? t("actions.reviewCandidate")
              : t("actions.editReview")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// SECTION
//
// Full class names are written out so Tailwind can
// detect them.
// ======================================================

const sectionAccents = {
  indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  sky: "bg-sky-50 text-sky-600 ring-sky-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  rose: "bg-rose-50 text-rose-600 ring-rose-100",
  teal: "bg-teal-50 text-teal-600 ring-teal-100",
} as const;

function Section({
  icon: Icon,
  title,
  accent,
  aside,
  children,
}: {
  icon: ComponentType<{ className?: string }>;

  title: string;

  accent: keyof typeof sectionAccents;

  aside?: ReactNode;

  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset ${sectionAccents[accent]}`}
          >
            <Icon className="h-4 w-4" />
          </span>

          <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
        </div>

        {aside}
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}

// ======================================================
// TIMELINE
// ======================================================

function Timeline({ children }: { children: ReactNode }) {
  return (
    <ol className="relative ml-1.5 space-y-4 pl-5 before:absolute before:bottom-1 before:left-0 before:top-1 before:w-px before:bg-slate-200 before:content-['']">
      {children}
    </ol>
  );
}

function TimelineItem({
  title,
  subtitle,
  period,
}: {
  title: string;

  subtitle: string;

  period: string;
}) {
  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className="absolute -left-[24px] top-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-white"
      />

      <p className="break-words font-semibold text-slate-950">{title}</p>

      <p className="mt-0.5 break-words text-sm text-slate-600">{subtitle}</p>

      <p className="mt-1 text-xs text-slate-400">{period}</p>
    </li>
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
    <div className="min-w-0 rounded-xl bg-slate-50 p-3.5 ring-1 ring-inset ring-slate-200/70">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 whitespace-pre-wrap break-words text-sm font-semibold text-slate-950">
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
  return <p className="text-sm text-slate-500">{label}</p>;
}