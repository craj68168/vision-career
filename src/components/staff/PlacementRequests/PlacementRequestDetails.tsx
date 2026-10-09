"use client";

import type { ComponentType, ReactNode } from "react";

import { useLocale, useTranslations } from "next-intl";

import {
  AlertTriangle,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Gavel,
  History,
  ListChecks,
  Pencil,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";

import {
  formatDate,
  formatDateTime,
  formatSalary,
  getRequestStatusClass,
  getRequestStatusLabel,
  getScreeningClass,
  getScreeningLabel,
} from "./helper";

import type {
  PlacementRequestWorkflowHistoryEntry,
  StaffPlacementRequest,
} from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  request: StaffPlacementRequest | undefined;

  canReview: boolean;

  canApprove: boolean;

  onClose: () => void;

  onScreen: (request: StaffPlacementRequest) => void;

  onDecision: (request: StaffPlacementRequest) => void;
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

// ======================================================
// COMPONENT
// ======================================================

export default function PlacementRequestDetails({
  request,
  canReview,
  onClose,
  onScreen,
  canApprove,
  onDecision,
}: Props) {
  const t = useTranslations("staffPlacementRequests");

  const locale = useLocale();

  const isJapanese = locale.startsWith("ja");

  if (!request) {
    return null;
  }

  const canScreen = canReview && request.status === "pending_review";

  const canMakeDecision = canApprove && request.status === "pending_review";

  const notScreened = request.staffScreening.status === "NOT_SCREENED";

  const review = request.review ?? {
    decision:
      request.status === "approved" || request.status === "rejected"
        ? request.status
        : null,

    reviewedAt: request.reviewedAt,

    reviewedByRole: request.reviewedByRole,

    reviewedById: request.reviewedById,

    reviewedByName: request.reviewedByName,

    rejectionReason: request.rejectionReason,
  };

  const copy = isJapanese
    ? {
        workflowAudit: "ワークフロー・監査",

        internalOnly: "Vision Career 内部監査情報",

        staffScreening: "スタッフ確認",

        screenedBy: "確認者",

        staffId: "スタッフID",

        screenedAt: "確認日時",

        screeningNote: "確認メモ",

        decision: "採用依頼の最終判断",

        currentDecision: "現在の判断",

        reviewedBy: "判断者",

        role: "権限",

        actorId: "担当者ID",

        reviewedAt: "判断日時",

        approved: "承認",

        rejected: "却下",

        pending: "判断待ち",

        admin: "管理者",

        staff: "スタッフ",

        history: "履歴",

        noHistory: "監査履歴はまだありません。",

        resubmitted: "再申請",

        needsAttention: "要確認",

        screened: "確認済み",

        rejectionReason: "却下理由",
      }
    : {
        workflowAudit: "Workflow & Audit",

        internalOnly: "Internal Vision Career audit information",

        staffScreening: "Staff Screening",

        screenedBy: "Screened By",

        staffId: "Staff ID",

        screenedAt: "Screened At",

        screeningNote: "Screening Note",

        decision: "Placement Request Decision",

        currentDecision: "Current Decision",

        reviewedBy: "Reviewed By",

        role: "Role",

        actorId: "Actor ID",

        reviewedAt: "Reviewed At",

        approved: "Approved",

        rejected: "Rejected",

        pending: "Pending",

        admin: "Admin",

        staff: "Staff",

        history: "Complete History",

        noHistory: "No audit history has been recorded yet.",

        resubmitted: "Resubmitted",

        needsAttention: "Needs Attention",

        screened: "Screened",

        rejectionReason: "Rejection Reason",
      };

  const roleLabel = (value?: string | null) => {
    if (value === "admin") {
      return copy.admin;
    }

    if (value === "staff") {
      return copy.staff;
    }

    return "-";
  };

  const actionLabel = (action: string) => {
    switch (action) {
      case "SCREENED":
        return copy.screened;

      case "NEEDS_ATTENTION":
        return copy.needsAttention;

      case "APPROVED":
        return copy.approved;

      case "REJECTED":
        return copy.rejected;

      case "RESUBMITTED":
        return copy.resubmitted;

      default:
        return action;
    }
  };

  const historyTone = (action: string): TimelineTone => {
    if (action === "SCREENED" || action === "APPROVED") {
      return "emerald";
    }

    if (action === "NEEDS_ATTENTION" || action === "REJECTED") {
      return "rose";
    }

    return "indigo";
  };

  const history = request.workflowHistory ?? [];

  const decisionLabel =
    review.decision === "approved"
      ? copy.approved
      : review.decision === "rejected"
        ? copy.rejected
        : copy.pending;

  const decisionBadgeClass =
    review.decision === "approved"
      ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
      : review.decision === "rejected"
        ? "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200"
        : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={request.jobTitle}
      className="fixed inset-0 z-[130] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      {/* BACKDROP */}

      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close"
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
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-white shadow-md shadow-indigo-600/30"
            >
              <BriefcaseBusiness className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="break-all text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                {request.recruitId}
              </p>

              <h2 className="mt-0.5 break-words text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
                {request.jobTitle}
              </h2>

              <p className="mt-1 break-words text-xs text-slate-500">
                {request.companyName}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`${badgeClass} ${getRequestStatusClass(
                    request.status,
                  )}`}
                >
                  {getRequestStatusLabel(request.status)}
                </span>

                <span
                  className={`${badgeClass} ${getScreeningClass(
                    request.staffScreening.status,
                  )}`}
                >
                  {getScreeningLabel(request.staffScreening.status)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
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
            {/* WORKFLOW AUDIT BANNER */}

            <div className="flex items-start gap-3 rounded-xl bg-indigo-50/70 p-4 ring-1 ring-inset ring-indigo-200">
              <span
                aria-hidden="true"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-indigo-600 ring-1 ring-inset ring-indigo-200"
              >
                <History className="h-4 w-4" />
              </span>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-950">
                  {copy.workflowAudit}
                </h3>

                <p className="mt-0.5 text-xs text-indigo-700">
                  {copy.internalOnly}
                </p>
              </div>
            </div>

            {/* STAFF SCREENING */}

            <Section
              icon={ShieldCheck}
              title={copy.staffScreening}
              accent="teal"
              aside={
                <span
                  className={`${badgeClass} ${getScreeningClass(
                    request.staffScreening.status,
                  )}`}
                >
                  {getScreeningLabel(request.staffScreening.status)}
                </span>
              }
            >
              {notScreened && (
                <div className="flex gap-3 rounded-xl bg-amber-50 p-4 ring-1 ring-inset ring-amber-200">
                  <AlertTriangle
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
                  />

                  <p className="text-sm leading-6 text-amber-700">
                    This placement request has not been screened by Staff yet.
                  </p>
                </div>
              )}

              {!notScreened && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Info
                    label={copy.screenedBy}
                    value={
                      request.staffScreening.screenedByStaffName ||
                      request.staffScreening.screenedByStaffId
                    }
                  />

                  <Info
                    label={copy.staffId}
                    value={request.staffScreening.screenedByStaffId}
                  />

                  <Info
                    label={copy.screenedAt}
                    value={formatDateTime(request.staffScreening.screenedAt)}
                  />
                </div>
              )}

              {request.staffScreening.note && (
                <div className="mt-3 rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {copy.screeningNote}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">
                    {request.staffScreening.note}
                  </p>
                </div>
              )}
            </Section>

            {/* DECISION */}

            <Section
              icon={review.decision === "rejected" ? XCircle : CheckCircle2}
              title={copy.decision}
              accent={review.decision === "rejected" ? "rose" : "emerald"}
              aside={
                <span className={`${badgeClass} ${decisionBadgeClass}`}>
                  {decisionLabel}
                </span>
              }
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Info
                  label={copy.reviewedBy}
                  value={review.reviewedByName || review.reviewedById}
                />

                <Info
                  label={copy.role}
                  value={roleLabel(review.reviewedByRole)}
                />

                <Info label={copy.actorId} value={review.reviewedById} />

                <Info
                  label={copy.reviewedAt}
                  value={formatDateTime(review.reviewedAt)}
                />
              </div>

              {review.rejectionReason && (
                <div className="mt-3 rounded-xl bg-rose-50 p-4 ring-1 ring-inset ring-rose-200">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-600">
                    {copy.rejectionReason}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-rose-700">
                    {review.rejectionReason}
                  </p>
                </div>
              )}
            </Section>

            {/* HISTORY */}

            <Section icon={History} title={copy.history} accent="indigo">
              {history.length === 0 ? (
                <p className="text-sm text-slate-500">{copy.noHistory}</p>
              ) : (
                <Timeline>
                  {history.map(
                    (item: PlacementRequestWorkflowHistoryEntry, index) => (
                      <TimelineItem
                        key={`${item.action}-${item.createdAt ?? index}-${index}`}
                        tone={historyTone(item.action)}
                        title={actionLabel(item.action)}
                        subtitle={`${item.actorName || item.actorId || "-"}${
                          item.actorRole ? ` • ${roleLabel(item.actorRole)}` : ""
                        }${item.actorId ? ` • ${item.actorId}` : ""}`}
                        note={item.note}
                        period={formatDateTime(item.createdAt)}
                      />
                    ),
                  )}
                </Timeline>
              )}
            </Section>

            {/* AUDIT NOTICE */}

            <div className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-700 ring-1 ring-inset ring-blue-200">
              Staff screening and placement-request approval are separate
              actions. Staff must have the appropriate approval permission to
              approve or reject the request.
            </div>

            {/* PROVIDER */}

            <Section
              icon={Building2}
              title="Provider Information"
              accent="sky"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Info label="Company" value={request.companyName} />

                <Info label="Provider" value={request.providerName} />

                <Info label="Provider Email" value={request.providerEmail} />
              </div>
            </Section>

            {/* JOB */}

            <Section
              icon={BriefcaseBusiness}
              title="Job Information"
              accent="indigo"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Info label="Job Title" value={request.jobTitle} />

                <Info label="Category" value={request.jobCategory} />

                <Info label="Employment Type" value={request.employmentType} />

                <Info label="Positions" value={request.numberOfPositions} />

                <Info label="Work Location" value={request.workLocation} />

                <Info label="Start Date" value={request.startDate} />
              </div>
            </Section>

            {/* REQUIREMENTS */}

            <Section
              icon={ListChecks}
              title="Requirements"
              accent="violet"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Info
                  label="Japanese Level"
                  value={request.japaneseLevelRequired}
                />

                <Info
                  label="Visa Requirement"
                  value={request.visaTypeRequired}
                />
              </div>

              <div className="mt-3 grid gap-3">
                <Info label="Job Description" value={request.jobDescription} />

                <Info label="Requirements" value={request.requirements} />
              </div>
            </Section>

            {/* CONDITIONS */}

            <Section icon={Clock} title="Work Conditions" accent="amber">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Info
                  label="Salary"
                  value={formatSalary(request.salaryAmount, request.salaryType)}
                />

                <Info label="Working Hours" value={request.workingHours} />

                <Info label="Days Off" value={request.daysOff} />
              </div>
            </Section>

            {/* TIMELINE */}

            <Section
              icon={CalendarDays}
              title="Request Timeline"
              accent="emerald"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Info
                  label="Submitted At"
                  value={formatDateTime(request.submittedAt)}
                />

                <Info
                  label="Reviewed At"
                  value={formatDateTime(request.reviewedAt)}
                />

                <Info
                  label="Reviewed By"
                  value={request.reviewedByName || request.reviewedById}
                />

                <Info
                  label="Created At"
                  value={formatDate(request.createdAt)}
                />
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
            Close
          </button>

          {canScreen && (
            <button
              type="button"
              onClick={() => onScreen(request)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              {notScreened ? (
                <ClipboardCheck className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}

              {notScreened ? "Screen Request" : "Edit Screening"}
            </button>
          )}

          {canMakeDecision && (
            <button
              type="button"
              onClick={() => onDecision(request)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <Gavel className="h-4 w-4" />

              {t("reviewDecision")}
            </button>
          )}
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
//
// Full class names are written out so Tailwind can
// detect them.
// ======================================================

type TimelineTone = "indigo" | "emerald" | "rose";

const timelineDots: Record<TimelineTone, string> = {
  indigo: "bg-indigo-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
};

function Timeline({ children }: { children: ReactNode }) {
  return (
    <ol className="relative ml-1.5 space-y-4 pl-5 before:absolute before:bottom-1 before:left-0 before:top-1 before:w-px before:bg-slate-200 before:content-['']">
      {children}
    </ol>
  );
}

function TimelineItem({
  tone,
  title,
  subtitle,
  note,
  period,
}: {
  tone: TimelineTone;

  title: string;

  subtitle: string;

  note?: string | null;

  period: string;
}) {
  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className={`absolute -left-[24px] top-1.5 h-2 w-2 rounded-full ring-4 ring-white ${timelineDots[tone]}`}
      />

      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-0.5">
        <p className="break-words font-semibold text-slate-950">{title}</p>

        <p className="text-xs text-slate-400">{period}</p>
      </div>

      <p className="mt-0.5 break-all text-sm text-slate-600">{subtitle}</p>

      {note && (
        <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700 ring-1 ring-inset ring-slate-200">
          {note}
        </p>
      )}
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