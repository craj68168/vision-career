"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  History,
  MapPin,
  Send,
  ShieldCheck,
  UserRound,
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

// ======================================================
// AUDIT TYPES
//
// Keep these optional so this component continues to work
// with older vacancy records that do not yet contain the
// new audit fields.
// ======================================================

type ReviewAudit = {
  reviewedAt?: string | null;
  reviewedByType?: "admin" | "staff" | null;
  reviewedById?: string | null;
  reviewedByName?: string | null;
  rejectionReason?: string | null;
};

type PublicationAudit = {
  publishedAt?: string | null;
  publishedByAdminId?: string | null;
  publishedByAdminName?: string | null;
};

type ClosingAudit = {
  closedAt?: string | null;
  closedByAdminId?: string | null;
  closedByAdminName?: string | null;
};

type WorkflowHistoryItem = {
  id?: string | null;
  action?:
    | "SCREENED"
    | "NEEDS_ATTENTION"
    | "APPROVED"
    | "REJECTED"
    | "PUBLISHED"
    | "CLOSED"
    | string;
  fromStatus?: string | null;
  toStatus?: string | null;
  actorType?: "admin" | "staff" | string | null;
  actorId?: string | null;
  actorName?: string | null;
  reason?: string | null;
  note?: string | null;
  createdAt?: string | null;
};

// ======================================================
// EXTENDED VACANCY
// ======================================================

type AuditableStaffVacancy = StaffVacancy & {
  review?: ReviewAudit | null;
  publication?: PublicationAudit | null;
  closing?: ClosingAudit | null;
  workflowHistory?: WorkflowHistoryItem[];

  // Legacy/current flat fields, kept so the UI works even if
  // an older Staff API response is still being returned.
  reviewedAt?: string | null;
  reviewedByType?: "admin" | "staff" | null;
  reviewedById?: string | null;
  reviewedByName?: string | null;
  rejectionReason?: string | null;
  publishedAt?: string | null;
  publishedByAdminId?: string | null;
  publishedByAdminName?: string | null;
  closedAt?: string | null;
  closedByAdminId?: string | null;
  closedByAdminName?: string | null;

  staffScreening: StaffVacancy["staffScreening"] & {
    screenedByStaffName?: string | null;
  };
};

// ======================================================
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so they
// keep their color even when a parent has a global
// border-color rule.
// ======================================================

const card = "rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5";

const cardTitle = "text-sm font-semibold text-slate-950 sm:text-base";

// ======================================================
// PROPS
// ======================================================

type Props = {
  vacancy: StaffVacancy | null;
  canReview: boolean;
  canApprove?: boolean;
  onClose: () => void;
  onScreen: (vacancy: StaffVacancy) => void;
  onDecision?: (vacancy: StaffVacancy) => void;
};

// ======================================================
// COMPONENT
// ======================================================

export default function VacancyDetails({
  vacancy,
  canReview,
  canApprove = false,
  onClose,
  onScreen,
  onDecision,
}: Props) {
  const isOpen = Boolean(vacancy);

  // Close with Escape and lock page scroll while the modal is open.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!vacancy) {
    return null;
  }

  const auditVacancy = vacancy as AuditableStaffVacancy;

  const canScreen = canReview && vacancy.status === "pending_review";
  const canDecide =
    canApprove && Boolean(onDecision) && vacancy.status === "pending_review";

  // ====================================================
  // NORMALIZED REVIEW
  // ====================================================

  const review: ReviewAudit = {
    reviewedAt:
      auditVacancy.review?.reviewedAt ?? auditVacancy.reviewedAt ?? null,

    reviewedByType:
      auditVacancy.review?.reviewedByType ??
      auditVacancy.reviewedByType ??
      null,

    reviewedById:
      auditVacancy.review?.reviewedById ?? auditVacancy.reviewedById ?? null,

    reviewedByName:
      auditVacancy.review?.reviewedByName ??
      auditVacancy.reviewedByName ??
      null,

    rejectionReason:
      auditVacancy.review?.rejectionReason ??
      auditVacancy.rejectionReason ??
      null,
  };

  // ====================================================
  // NORMALIZED PUBLICATION
  // ====================================================

  const publication: PublicationAudit = {
    publishedAt:
      auditVacancy.publication?.publishedAt ?? auditVacancy.publishedAt ?? null,

    publishedByAdminId:
      auditVacancy.publication?.publishedByAdminId ??
      auditVacancy.publishedByAdminId ??
      null,

    publishedByAdminName:
      auditVacancy.publication?.publishedByAdminName ??
      auditVacancy.publishedByAdminName ??
      null,
  };

  // ====================================================
  // NORMALIZED CLOSING
  // ====================================================

  const closing: ClosingAudit = {
    closedAt: auditVacancy.closing?.closedAt ?? auditVacancy.closedAt ?? null,

    closedByAdminId:
      auditVacancy.closing?.closedByAdminId ??
      auditVacancy.closedByAdminId ??
      null,

    closedByAdminName:
      auditVacancy.closing?.closedByAdminName ??
      auditVacancy.closedByAdminName ??
      null,
  };

  const workflowHistory = Array.isArray(auditVacancy.workflowHistory)
    ? auditVacancy.workflowHistory
    : [];

  // ====================================================
  // DECISION LABEL
  // ====================================================

  const reviewDecision = getReviewDecision(
    vacancy.status,
    review,
    workflowHistory,
  );

  const hasReview =
    Boolean(review.reviewedAt) ||
    Boolean(review.reviewedById) ||
    reviewDecision !== "Not reviewed";

  const hasPublication =
    Boolean(publication.publishedAt) || Boolean(publication.publishedByAdminId);

  const hasClosing =
    Boolean(closing.closedAt) || Boolean(closing.closedByAdminId);

  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center bg-slate-950/50 backdrop-blur-sm sm:items-center sm:p-4">
      {/* BACKDROP */}

      <button
        type="button"
        tabIndex={-1}
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close"
      />

      {/* MODAL: bottom sheet on phones, centered dialog from sm up */}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vacancy-details-title"
        className="relative z-10 flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[92vh] sm:rounded-3xl"
      >
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-[linear-gradient(120deg,#eef2ff_0%,#ffffff_70%)] p-4 sm:p-6">
          <div className="min-w-0">
            <p className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-600 ring-1 ring-inset ring-indigo-200">
              {vacancy.vacancyId}
            </p>

            <h2
              id="vacancy-details-title"
              className="mt-2 break-words text-xl font-bold text-slate-950 sm:text-2xl"
            >
              {vacancy.title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">{vacancy.companyName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ================================================= */}
        {/* CONTENT (scrolls) */}
        {/* ================================================= */}

        <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain bg-slate-50/60 p-4 sm:space-y-6 sm:p-6">
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

          {/* ================================================= */}
          {/* WORKFLOW / AUDIT */}
          {/* ================================================= */}

          <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-slate-200">
            <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-indigo-600 ring-1 ring-inset ring-indigo-200">
                <History className="h-5 w-5" />
              </span>

              <div>
                <h3 className={cardTitle}>Workflow & Audit</h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Internal Vision Career review history for this vacancy.
                </p>
              </div>
            </div>

            <div className="space-y-6 p-4 sm:p-5">
              {/* STAFF SCREENING */}

              <AuditBlock
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Staff Screening"
                status={
                  vacancy.staffScreening.status === "NOT_SCREENED"
                    ? "Not Screened"
                    : getScreeningLabel(vacancy.staffScreening.status)
                }
                tone={
                  vacancy.staffScreening.status === "SCREENED"
                    ? "green"
                    : vacancy.staffScreening.status === "NEEDS_ATTENTION"
                      ? "red"
                      : "gray"
                }
              >
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Info
                    label="Screened By"
                    value={
                      auditVacancy.staffScreening.screenedByStaffName ||
                      vacancy.staffScreening.screenedByStaffId ||
                      "-"
                    }
                  />

                  <Info
                    label="Staff ID"
                    value={vacancy.staffScreening.screenedByStaffId || "-"}
                  />

                  <Info
                    label="Screened At"
                    value={formatDateTime(vacancy.staffScreening.screenedAt)}
                  />
                </div>

                {vacancy.staffScreening.note && (
                  <div className="mt-3 rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-100">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Screening Note
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                      {vacancy.staffScreening.note}
                    </p>
                  </div>
                )}
              </AuditBlock>

              {/* REVIEW / APPROVAL */}

              <AuditBlock
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="Vacancy Review Decision"
                status={reviewDecision}
                tone={
                  reviewDecision === "Approved"
                    ? "green"
                    : reviewDecision === "Rejected"
                      ? "red"
                      : "gray"
                }
              >
                {hasReview ? (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <Info
                        label="Reviewed By"
                        value={
                          review.reviewedByName || review.reviewedById || "-"
                        }
                      />

                      <Info
                        label="Role"
                        value={formatActorType(review.reviewedByType)}
                      />

                      <Info
                        label="Actor ID"
                        value={review.reviewedById || "-"}
                      />

                      <Info
                        label="Reviewed At"
                        value={formatDateTime(review.reviewedAt)}
                      />
                    </div>

                    {review.rejectionReason && (
                      <div className="mt-3 rounded-xl bg-red-50 p-4 ring-1 ring-inset ring-red-200">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-red-600">
                          Rejection Reason
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">
                          {review.rejectionReason}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-slate-500">
                    No approval or rejection decision has been recorded yet.
                  </p>
                )}
              </AuditBlock>

              {/* PUBLICATION */}

              <AuditBlock
                icon={<Send className="h-5 w-5" />}
                title="Publication"
                status={hasPublication ? "Published" : "Not Published"}
                tone={hasPublication ? "green" : "gray"}
              >
                {hasPublication ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <Info
                      label="Published By"
                      value={
                        publication.publishedByAdminName ||
                        publication.publishedByAdminId ||
                        "-"
                      }
                    />

                    <Info
                      label="Admin ID"
                      value={publication.publishedByAdminId || "-"}
                    />

                    <Info
                      label="Published At"
                      value={formatDateTime(publication.publishedAt)}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    This vacancy has not been published by an Administrator.
                  </p>
                )}
              </AuditBlock>

              {/* CLOSING */}

              <AuditBlock
                icon={<CalendarClock className="h-5 w-5" />}
                title="Closing"
                status={hasClosing ? "Closed" : "Not Closed"}
                tone="gray"
              >
                {hasClosing ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <Info
                      label="Closed By"
                      value={
                        closing.closedByAdminName ||
                        closing.closedByAdminId ||
                        "-"
                      }
                    />

                    <Info
                      label="Admin ID"
                      value={closing.closedByAdminId || "-"}
                    />

                    <Info
                      label="Closed At"
                      value={formatDateTime(closing.closedAt)}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No closing action has been recorded.
                  </p>
                )}
              </AuditBlock>

              {/* COMPLETE HISTORY */}

              {workflowHistory.length > 0 && (
                <div className="border-t border-slate-200 pt-5">
                  <div className="mb-4 flex items-center gap-2">
                    <History className="h-4 w-4 text-slate-500" />

                    <h4 className="text-sm font-semibold text-slate-950">
                      Complete History
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {workflowHistory.map((item, index) => (
                      <WorkflowRow
                        key={
                          item.id || `${item.action}-${item.createdAt}-${index}`
                        }
                        item={item}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ================================================= */}
          {/* BASIC */}
          {/* ================================================= */}

          <section className={card}>
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="h-5 w-5 text-indigo-600" />

              <h3 className={cardTitle}>Vacancy Information</h3>
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

          <section className={card}>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-600" />

              <h3 className={cardTitle}>Work Location</h3>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info label="Location" value={vacancy.workLocation} />

              <Info
                label="Location Detail"
                value={vacancy.workLocationDetail}
              />
            </div>
          </section>

          {/* JOB INFORMATION */}

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

          <section className={card}>
            <h3 className={cardTitle}>Work Conditions</h3>

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

          {/* ================================================= */}
          {/* STAFF SCREENING DETAILS */}
          {/* ================================================= */}

          <section className={card}>
            <h3 className={cardTitle}>Staff Screening</h3>

            {vacancy.staffScreening.status === "NOT_SCREENED" && (
              <div className="mt-4 flex gap-3 rounded-xl bg-amber-50 p-4 ring-1 ring-inset ring-amber-200">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />

                <p className="text-sm text-amber-700">
                  This vacancy has not been screened yet.
                </p>
              </div>
            )}

            {vacancy.staffScreening.status === "SCREENED" && (
              <div className="mt-4 flex gap-3 rounded-xl bg-emerald-50 p-4 ring-1 ring-inset ring-emerald-200">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                <p className="text-sm text-emerald-700">
                  Staff screening has been completed.
                </p>
              </div>
            )}

            {vacancy.staffScreening.status === "NEEDS_ATTENTION" && (
              <div className="mt-4 flex gap-3 rounded-xl bg-red-50 p-4 ring-1 ring-inset ring-red-200">
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />

                <p className="text-sm text-red-700">
                  This vacancy requires additional attention.
                </p>
              </div>
            )}

            {vacancy.staffScreening.status !== "NOT_SCREENED" && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Info
                  label="Screened By"
                  value={
                    auditVacancy.staffScreening.screenedByStaffName ||
                    vacancy.staffScreening.screenedByStaffId
                  }
                />

                <Info
                  label="Screened At"
                  value={formatDateTime(vacancy.staffScreening.screenedAt)}
                />
              </div>
            )}

            {vacancy.staffScreening.note && (
              <div className="mt-3 rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Screening Note
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {vacancy.staffScreening.note}
                </p>
              </div>
            )}

            <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-700 ring-1 ring-inset ring-blue-200">
              Staff screening and vacancy approval are separate actions. Staff
              members with <strong>Vacancies - Approve / Reject</strong>{" "}
              permission may approve or reject a vacancy. Publishing and closing
              remain Administrator-only actions.
            </div>
          </section>

          {/* REJECTION */}

          {review.rejectionReason && (
            <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-inset ring-red-200 sm:p-5">
              <p className="font-semibold text-red-700">Rejection Reason</p>

              <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">
                {review.rejectionReason}
              </p>
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:flex-row sm:justify-end sm:gap-3 sm:p-6">
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-xl bg-white px-5 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:w-auto"
          >
            Close
          </button>

          {canScreen && (
            <button
              type="button"
              onClick={() => onScreen(vacancy)}
              className="h-11 w-full rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:w-auto"
            >
              {vacancy.staffScreening.status === "NOT_SCREENED"
                ? "Screen Vacancy"
                : "Edit Screening"}
            </button>
          )}

          {canDecide && (
            <button
              type="button"
              onClick={() => onDecision?.(vacancy)}
              className="h-11 w-full rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:w-auto"
            >
              Approve / Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// REVIEW DECISION
// ======================================================

function getReviewDecision(
  status: string,
  review: ReviewAudit,
  history: WorkflowHistoryItem[],
) {
  const latestDecision = history.find(
    (item) => item.action === "APPROVED" || item.action === "REJECTED",
  );

  if (latestDecision?.action === "APPROVED") {
    return "Approved";
  }

  if (latestDecision?.action === "REJECTED") {
    return "Rejected";
  }

  if (status === "rejected") {
    return "Rejected";
  }

  if (status === "approved" || status === "published" || status === "closed") {
    return "Approved";
  }

  if (review.reviewedAt || review.reviewedById) {
    return status === "rejected" ? "Rejected" : "Approved";
  }

  return "Not reviewed";
}

// ======================================================
// ACTOR TYPE
// ======================================================

function formatActorType(value: string | null | undefined) {
  if (value === "staff") {
    return "Staff";
  }

  if (value === "admin") {
    return "Administrator";
  }

  return "-";
}

// ======================================================
// AUDIT BLOCK
// ======================================================

function AuditBlock({
  icon,
  title,
  status,
  tone,
  children,
}: {
  icon: ReactNode;
  title: string;
  status: string;
  tone: "green" | "red" | "gray";
  children: ReactNode;
}) {
  const toneClass =
    tone === "green"
      ? "ring-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "red"
        ? "ring-red-200 bg-red-50 text-red-700"
        : "ring-slate-200 bg-slate-50 text-slate-600";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">{icon}</span>

          <h4 className="text-sm font-semibold text-slate-950">{title}</h4>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${toneClass}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-3">{children}</div>
    </div>
  );
}

// ======================================================
// WORKFLOW ROW
// ======================================================

function WorkflowRow({ item }: { item: WorkflowHistoryItem }) {
  const action = item.action || "ACTION";

  const tone =
    action === "APPROVED" || action === "PUBLISHED" || action === "SCREENED"
      ? "bg-emerald-500"
      : action === "REJECTED" || action === "NEEDS_ATTENTION"
        ? "bg-red-500"
        : "bg-slate-400";

  return (
    <div className="flex gap-3 rounded-xl bg-white p-3 ring-1 ring-inset ring-slate-200 sm:p-4">
      <div className="pt-1.5">
        <div className={`h-2.5 w-2.5 rounded-full ${tone}`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-950">
            {formatWorkflowAction(action)}
          </p>

          <p className="text-xs text-slate-500">
            {formatDateTime(item.createdAt)}
          </p>
        </div>

        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1">
            <UserRound className="h-3.5 w-3.5" />

            {item.actorName || item.actorId || "Unknown"}
          </span>

          {item.actorType && (
            <span>Role: {formatActorType(item.actorType)}</span>
          )}

          {item.actorId && <span className="break-all">ID: {item.actorId}</span>}
        </div>

        {item.fromStatus && item.toStatus && (
          <p className="mt-2 text-xs text-slate-500">
            {item.fromStatus} → {item.toStatus}
          </p>
        )}

        {item.reason && (
          <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <strong>Reason:</strong> {item.reason}
          </div>
        )}

        {item.note && (
          <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            <strong>Note:</strong> {item.note}
          </div>
        )}
      </div>
    </div>
  );
}

// ======================================================
// WORKFLOW ACTION LABEL
// ======================================================

function formatWorkflowAction(action: string) {
  switch (action) {
    case "SCREENED":
      return "Staff Screening Completed";

    case "NEEDS_ATTENTION":
      return "Marked as Needs Attention";

    case "APPROVED":
      return "Vacancy Approved";

    case "REJECTED":
      return "Vacancy Rejected";

    case "PUBLISHED":
      return "Vacancy Published";

    case "CLOSED":
      return "Vacancy Closed";

    default:
      return action
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (character) => character.toUpperCase());
  }
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
    <div className="min-w-0 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-inset ring-slate-100">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-900">
        {value ?? "-"}
      </p>
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
    <section className={card}>
      <h3 className={cardTitle}>{title}</h3>

      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
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
    <section className={card}>
      <h3 className={cardTitle}>{title}</h3>

      <div className="mt-3 flex flex-wrap gap-2">
        {values.length > 0 ? (
          values.map((value) => (
            <span
              key={value}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-100"
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